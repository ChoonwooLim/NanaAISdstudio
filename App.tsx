import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Header from './components/Header';
import ModeSwitcher from './components/ModeSwitcher';
import InputForm from './components/InputForm';
import DescriptionDisplay from './components/DescriptionDisplay';
import StoryboardInputForm from './components/StoryboardInputForm';
import StoryboardDisplay from './components/StoryboardDisplay';
import DetailedStoryboardModal from './components/DetailedStoryboardModal';
import VideoDisplay from './components/VideoDisplay';
import ApiKeyInstructions from './components/ApiKeyInstructions';
import SampleGalleryModal from './components/SampleGalleryModal';
import GalleryModal from './components/GalleryModal';
import MediaArtGenerator from './components/MediaArtGenerator';
import ImageSelectionModal from './components/ImageSelectionModal';
import VisualArtGenerator from './components/VisualArtGenerator';

import { 
    AppMode, 
    DescriptionConfig, 
    Tone, 
    StoryboardConfig, 
    AspectRatio, 
    VisualStyle,
    VideoLength,
    Mood,
    StoryboardPanel,
    DetailedStoryboardPanel,
    SampleProduct,
    SampleStory,
    Project,
    MediaArtState,
    MediaArtStyle,
    MediaArtSourceImage,
    VisualArtState,
    VisualArtEffect,
} from './types';
import * as geminiService from './services/geminiService';
import * as db from './services/db';
import { useTranslation } from './i18n/LanguageContext';
import { sampleProductsData, sampleStoryIdeasData } from './sampleData';
import { MEDIA_ART_STYLE_OPTIONS } from './constants';

declare var jspdf: any;
declare var html2canvas: any;

const API_KEY = process.env.API_KEY;

const App: React.FC = () => {
    const { t, language } = useTranslation();

    // Global State
    const [mode, setMode] = useState<AppMode>(AppMode.DESCRIPTION);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

    // Description Mode State
    const initialDescriptionConfig: DescriptionConfig = {
        productName: '',
        keyFeatures: '',
        targetAudience: '',
        tone: Tone.FRIENDLY,
        language: 'English',
    };
    const [descriptionConfig, setDescriptionConfig] = useState<DescriptionConfig>(initialDescriptionConfig);
    const [description, setDescription] = useState('');
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

    // Storyboard Mode State
    const initialStoryboardConfig: StoryboardConfig = {
        sceneCount: 4,
        aspectRatio: AspectRatio.LANDSCAPE,
        visualStyle: VisualStyle.CINEMATIC,
        videoLength: VideoLength.SHORT,
        mood: Mood.EPIC,
        descriptionLanguage: 'English',
        textModel: 'gemini-2.5-flash',
        imageModel: 'imagen-4.0-generate-001',
        videoModel: 'veo-2.0-generate-001',
    };
    const [storyboardConfig, setStoryboardConfig] = useState<StoryboardConfig>(initialStoryboardConfig);
    const [storyIdea, setStoryIdea] = useState('');
    const [storyboardPanels, setStoryboardPanels] = useState<StoryboardPanel[]>([]);
    const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
    const [isGeneratingImages, setIsGeneratingImages] = useState(false);
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    
    // Media Art Mode State
    const initialMediaArtState: MediaArtState = {
        sourceImage: null,
        style: MediaArtStyle.DATA_COMPOSITION,
        styleParams: MEDIA_ART_STYLE_OPTIONS.find(opt => opt.value === MediaArtStyle.DATA_COMPOSITION)!.defaultParams,
        panels: [],
        config: initialStoryboardConfig,
    };
    const [mediaArtState, setMediaArtState] = useState<MediaArtState>(initialMediaArtState);
    const [isGeneratingMediaArtScenes, setIsGeneratingMediaArtScenes] = useState(false);
    const [mediaArtError, setMediaArtError] = useState<string | null>(null);

    // Visual Art Mode State
    const initialVisualArtState: VisualArtState = {
        inputText: '',
        sourceImage: null,
        effect: VisualArtEffect.GLITCH,
        resultVideoUrl: null,
        isLoading: false,
        error: null,
    };
    const [visualArtState, setVisualArtState] = useState<VisualArtState>(initialVisualArtState);

    // Modal State
    const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
    const [detailedModalPanels, setDetailedModalPanels] = useState<DetailedStoryboardPanel[]>([]);
    const [isDetailedModalLoading, setIsDetailedModalLoading] = useState(false);
    const [detailedModalError, setDetailedModalError] = useState<string | null>(null);
    const [originalSceneContext, setOriginalSceneContext] = useState<{ description: string, index: number } | null>(null);
    const [isSampleGalleryOpen, setIsSampleGalleryOpen] = useState(false);
    const [sampleGalleryType, setSampleGalleryType] = useState<'product' | 'story'>('product');
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
    
    // Generic loading/error for now
    const [error, setError] = useState<string | null>(null);
    
    const getSampleProducts = useCallback(() => {
        const langCode = language === 'Korean' ? 'ko' : 'en';
        return Object.values(sampleProductsData).map(p => p[langCode]);
    }, [language]);

    const getSampleStories = useCallback(() => {
        const langCode = language === 'Korean' ? 'ko' : 'en';
        return Object.values(sampleStoryIdeasData).map(s => s[langCode]);
    }, [language]);

    // Handlers for Description Mode
    const handleGenerateDescription = async () => {
        setIsGeneratingDescription(true);
        setError(null);
        setDescription('');
        try {
            const result = await geminiService.generateDescription(descriptionConfig);
            setDescription(result);
        } catch (e: any) {
            setError(e.message || t('errors.descriptionGeneration'));
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    // Handlers for Storyboard Mode
    const handleGenerateStoryboard = async (idea: string, config: StoryboardConfig) => {
        setStoryIdea(idea);
        setStoryboardConfig(config);
        setIsGeneratingStoryboard(true);
        setIsGeneratingImages(true);
        setError(null);
        setStoryboardPanels([]);

        try {
            const panels = await geminiService.generateStoryboard(idea, config);
            const initialPanels: StoryboardPanel[] = panels.map(p => ({ ...p, isLoadingImage: true }));
            setStoryboardPanels(initialPanels);
            setIsGeneratingStoryboard(false);

            // Generate images sequentially
            let currentPanels = [...initialPanels];
            for (let i = 0; i < panels.length; i++) {
                try {
                    const imageBase64 = await geminiService.generateImageForPanel(panels[i].description, config);
                    currentPanels[i] = { ...currentPanels[i], imageUrl: `data:image/jpeg;base64,${imageBase64}`, isLoadingImage: false };
                } catch (imgErr: any) {
                    console.error(`Image generation failed for panel ${i}:`, imgErr);
                    const isQuotaError = imgErr.message?.includes('429');
                    currentPanels[i] = { ...currentPanels[i], imageUrl: isQuotaError ? 'quota_error' : 'error', isLoadingImage: false };
                }
                setStoryboardPanels([...currentPanels]);
            }
        } catch (e: any) {
            setError(e.message || t('errors.storyboardGeneration'));
            setIsGeneratingStoryboard(false);
        } finally {
            setIsGeneratingImages(false);
        }
    };
    
    const handleExpandScene = async (sceneDescription: string, index: number) => {
        setOriginalSceneContext({ description: sceneDescription, index });
        setIsDetailedModalOpen(true);
        setIsDetailedModalLoading(true);
        setDetailedModalError(null);
        setDetailedModalPanels([]);
        try {
            const newPanelsData = await geminiService.generateDetailedStoryboard(sceneDescription, storyboardConfig.descriptionLanguage);
            const newPanels: DetailedStoryboardPanel[] = newPanelsData.map(p => ({ ...p, isLoadingImage: true }));
            setDetailedModalPanels(newPanels);
            setIsDetailedModalLoading(false);

            let currentDetailedPanels = [...newPanels];
            for (let i = 0; i < newPanels.length; i++) {
                try {
                    const imageBase64 = await geminiService.generateImageForPanel(newPanels[i].description, storyboardConfig);
                    currentDetailedPanels[i] = { ...currentDetailedPanels[i], imageUrl: `data:image/jpeg;base64,${imageBase64}`, isLoadingImage: false };
                } catch (imgErr) {
                    currentDetailedPanels[i] = { ...currentDetailedPanels[i], imageUrl: 'error', isLoadingImage: false };
                }
                setDetailedModalPanels([...currentDetailedPanels]);
            }
        } catch (e: any) {
            setDetailedModalError(e.message || t('errors.sceneExpansion'));
            setIsDetailedModalLoading(false);
        }
    };

    const handleSaveChangesFromModal = (editedPanels: DetailedStoryboardPanel[]) => {
        if (originalSceneContext) {
            const { index } = originalSceneContext;
            const newStoryboardPanels = [...storyboardPanels];
            const panelsToInsert = editedPanels.map(p => ({
                description: p.description,
                imageUrl: p.imageUrl,
                isLoadingImage: false,
                sceneDuration: 4,
            }));
            newStoryboardPanels.splice(index, 1, ...panelsToInsert);
            setStoryboardPanels(newStoryboardPanels);
        }
        setIsDetailedModalOpen(false);
    };

    const handleRegenerateImage = async (index: number) => {
        const panels = [...storyboardPanels];
        panels[index] = { ...panels[index], imageUrl: undefined, isLoadingImage: true };
        setStoryboardPanels(panels);

        try {
            const imageBase64 = await geminiService.generateImageForPanel(panels[index].description, storyboardConfig);
            panels[index].imageUrl = `data:image/jpeg;base64,${imageBase64}`;
        } catch (e) {
            panels[index].imageUrl = 'error';
        } finally {
            panels[index].isLoadingImage = false;
            setStoryboardPanels([...panels]);
        }
    };
    
    const handleRegenerateVideo = async (index: number) => {
        const panel = storyboardPanels[index];
        if (!panel.imageUrl || !panel.imageUrl.startsWith('data:image')) return;

        const panels = [...storyboardPanels];
        panels[index] = { ...panels[index], videoUrl: undefined, isLoadingVideo: true, videoError: null };
        setStoryboardPanels(panels);

        try {
            const imageBase64 = panel.imageUrl.split(',')[1];
            const videoUrl = await geminiService.generateVideoForPanel(panel.description, imageBase64, storyboardConfig.videoModel);
            panels[index].videoUrl = videoUrl;
        } catch (e: any) {
            panels[index].videoUrl = 'error';
            panels[index].videoError = e.message || t('errors.videoGeneration');
        } finally {
            panels[index].isLoadingVideo = false;
            setStoryboardPanels([...panels]);
        }
    };

    // Sample Gallery Handlers
    const handleShowSampleGallery = (type: 'product' | 'story') => {
        setSampleGalleryType(type);
        setIsSampleGalleryOpen(true);
    };

    const handleSelectSampleProduct = (product: SampleProduct) => {
        setDescriptionConfig({ ...descriptionConfig, ...product });
        setIsSampleGalleryOpen(false);
    };
    
    const handleSelectSampleStory = (story: SampleStory) => {
        setStoryIdea(story.idea);
        setStoryboardConfig(story.config);
        setIsSampleGalleryOpen(false);
        handleGenerateStoryboard(story.idea, story.config);
    };

    // Project Management (DB)
    const loadProjects = async () => {
        const savedProjects = await db.getProjects();
        setProjects(savedProjects);
    };

    const handleOpenGallery = () => {
        loadProjects();
        setIsGalleryOpen(true);
    };

    const handleNewProject = () => {
        setCurrentProjectId(null);
        setDescriptionConfig(initialDescriptionConfig);
        setDescription('');
        setStoryboardConfig(initialStoryboardConfig);
        setStoryIdea('');
        setStoryboardPanels([]);
        setMediaArtState(initialMediaArtState);
        setVisualArtState(initialVisualArtState);
        setError(null);
    };

    const handleExportPdf = async () => {
        if (storyboardPanels.length === 0) return;
        setIsExportingPdf(true);
        const pdfContainer = document.createElement('div');
        try {
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pdfWidthMm = 210;
            const pdfHeightMm = 297;
            const marginMm = 15;
            const contentWidthMm = pdfWidthMm - (marginMm * 2);

            // Setup off-screen container for rendering
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            pdfContainer.style.top = '0px';
            const pageWidthPx = 794; // A4 width in pixels at 96 DPI
            const pageHeightPx = 1123; // A4 height in pixels at 96 DPI
            pdfContainer.style.width = `${pageWidthPx}px`;
            pdfContainer.style.height = `${pageHeightPx}px`;
            pdfContainer.style.fontFamily = "'Noto Sans KR', 'Inter', sans-serif";
            document.body.appendChild(pdfContainer);

            // --- Cover Page ---
            pdfContainer.innerHTML = `
                <div style="background-color: #0f172a; color: white; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; box-sizing: border-box; text-align: center;">
                    <h1 style="font-size: 36px; font-weight: bold; line-height: 1.3;">${storyIdea}</h1>
                    <p style="font-size: 16px; color: #94a3b8; margin-top: 16px;">Storyboard - ${new Date().toLocaleDateString()}</p>
                </div>
            `;
            const coverCanvas = await html2canvas(pdfContainer.firstElementChild as HTMLElement, { scale: 2 });
            pdf.addImage(coverCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidthMm, pdfHeightMm);

            // --- Storyboard Pages ---
            if (storyboardPanels.length > 0) pdf.addPage();
            
            const pageWrapper = document.createElement('div');
            pageWrapper.style.backgroundColor = '#0f172a';
            pageWrapper.style.color = 'white';
            pageWrapper.style.width = '100%';
            pageWrapper.style.minHeight = '100%';
            pageWrapper.style.padding = `${(marginMm / pdfWidthMm) * pageWidthPx}px`;
            pageWrapper.style.boxSizing = 'border-box';
            pdfContainer.innerHTML = '';
            pdfContainer.appendChild(pageWrapper);

            for (let i = 0; i < storyboardPanels.length; i++) {
                const panel = storyboardPanels[i];
                if (!panel.imageUrl || panel.imageUrl.startsWith('error')) continue;

                const panelEl = document.createElement('div');
                panelEl.innerHTML = `
                    <div style="border: 1px solid #334155; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                        <div style="padding: 8px 12px; background-color: #1e293b;">
                            <h3 style="font-size: 16px; font-weight: bold;">Scene #${i + 1}</h3>
                        </div>
                        <img src="${panel.imageUrl}" style="width: 100%; height: auto; display: block; aspect-ratio: 16/9; object-fit: cover;" />
                        <div style="padding: 16px; background-color: #1e293b;">
                            <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; word-wrap: break-word;">${panel.description}</p>
                        </div>
                    </div>`;
                
                pageWrapper.appendChild(panelEl);

                if (pageWrapper.offsetHeight > pageHeightPx && pageWrapper.children.length > 1) {
                    pageWrapper.removeChild(panelEl);
                    const pageCanvas = await html2canvas(pageWrapper, { scale: 2 });
                    pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidthMm, pdfHeightMm);

                    pdf.addPage();
                    pageWrapper.innerHTML = '';
                    pageWrapper.appendChild(panelEl);
                }
            }

            if (pageWrapper.children.length > 0) {
                const lastPageCanvas = await html2canvas(pageWrapper, { scale: 2 });
                pdf.addImage(lastPageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidthMm, pdfHeightMm);
            }

            const safeTitle = storyIdea.substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            pdf.save(`storyboard_${safeTitle}.pdf`);

        } catch (err) {
            console.error("Failed to export PDF:", err);
            setError("Failed to export storyboard as PDF.");
        } finally {
            if (pdfContainer) document.body.removeChild(pdfContainer);
            setIsExportingPdf(false);
        }
    };

    const handleExportProject = async () => {
        try {
            const serializablePanels = await Promise.all(
                storyboardPanels.map(async (panel) => {
                    if (panel.videoUrl && panel.videoUrl.startsWith('blob:')) {
                        const response = await fetch(panel.videoUrl);
                        const blob = await response.blob();
                        const videoDataUrl = await new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        });
                        return { ...panel, videoUrl: videoDataUrl };
                    }
                    return panel;
                })
            );

            const projectData = {
                version: '1.0.0',
                mode,
                descriptionConfig,
                description,
                storyboardConfig,
                storyIdea,
                storyboardPanels: serializablePanels,
                mediaArtState,
                visualArtState,
            };
            
            const jsonString = JSON.stringify(projectData);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `artifex_project_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error("Failed to export project:", err);
            setError(err.message || t('errors.projectExport'));
        }
    };

    const handleImportProject = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const projectData = JSON.parse(event.target?.result as string);
                    
                    if (!projectData.version || !projectData.mode) throw new Error('Invalid project file.');

                    handleNewProject();
                    await new Promise(resolve => setTimeout(resolve, 50));

                    setMode(projectData.mode);
                    setDescriptionConfig(projectData.descriptionConfig || initialDescriptionConfig);
                    setDescription(projectData.description || '');
                    setStoryboardConfig(projectData.storyboardConfig || initialStoryboardConfig);
                    setStoryIdea(projectData.storyIdea || '');
                    
                    const loadedMediaArtState = projectData.mediaArtState ? 
                        { ...initialMediaArtState, ...projectData.mediaArtState } : 
                        initialMediaArtState;
                    if (!loadedMediaArtState.config) {
                        loadedMediaArtState.config = initialStoryboardConfig;
                    }
                    setMediaArtState(loadedMediaArtState);

                    setVisualArtState(projectData.visualArtState || initialVisualArtState);

                    const panelsToLoad = projectData.storyboardPanels || [];
                    const panelsWithBlobUrls = await Promise.all(
                        panelsToLoad.map(async (panel: StoryboardPanel) => {
                            if (panel.videoUrl && panel.videoUrl.startsWith('data:')) {
                                try {
                                    const response = await fetch(panel.videoUrl);
                                    const blob = await response.blob();
                                    const blobUrl = URL.createObjectURL(blob);
                                    return { ...panel, videoUrl: blobUrl };
                                } catch (e) {
                                    return { ...panel, videoUrl: 'error', videoError: 'Failed to load video from project file.' };
                                }
                            }
                            return panel;
                        })
                    );
                    setStoryboardPanels(panelsWithBlobUrls);
                } catch (err: any) {
                    console.error("Failed to import project:", err);
                    setError(err.message || t('errors.projectImport'));
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };
    
    // Media Art Handlers
    const handleGenerateMediaArtScenes = async () => {
        if (!mediaArtState.sourceImage) return;
        setIsGeneratingMediaArtScenes(true);
        setMediaArtError(null);
        setMediaArtState(s => ({ ...s, panels: [] }));

        try {
            const { sourceImage, style, styleParams, config } = mediaArtState;
            // Step 1: Generate keyframe prompts
            const keyframePrompts = await geminiService.generateMediaArtKeyframePrompts(sourceImage, style, styleParams, config);
            if (keyframePrompts.length < 2) {
                throw new Error("Not enough keyframe prompts were generated to create transitions.");
            }

            // Step 2: Generate keyframe images sequentially to avoid rate limiting.
            let previousImage: string;
            try {
                const img0 = await geminiService.generateImageForPanel(keyframePrompts[0], { ...config });
                previousImage = `data:image/jpeg;base64,${img0}`;
            } catch (e: any) {
                const isQuota = e.message?.includes('429') || e.toString().includes('429');
                previousImage = isQuota ? 'quota_error' : 'error';
            }

            // Generate subsequent images and create panels progressively
            for (let i = 1; i < keyframePrompts.length; i++) {
                let currentImage: string;
                 try {
                    const img = await geminiService.generateImageForPanel(keyframePrompts[i], { ...config });
                    currentImage = `data:image/jpeg;base64,${img}`;
                } catch (e: any) {
                    const isQuota = e.message?.includes('429') || e.toString().includes('429');
                    currentImage = isQuota ? 'quota_error' : 'error';
                }

                const newPanel: StoryboardPanel = {
                    description: keyframePrompts[i],
                    imageUrl: previousImage,
                    endImageUrl: currentImage,
                    isLoadingImage: false,
                    sceneDuration: 5,
                };

                setMediaArtState(s => ({ ...s, panels: [...s.panels, newPanel] }));
                previousImage = currentImage;
            }

        } catch (e: any) {
            setMediaArtError(e.message || t('errors.mediaArtGeneration'));
        } finally {
            setIsGeneratingMediaArtScenes(false);
        }
    };
    
    const handleRegenerateMediaArtVideo = async (index: number) => {
        const panel = mediaArtState.panels[index];
        if (!panel.imageUrl || !panel.imageUrl.startsWith('data:image')) return;

        const panels = [...mediaArtState.panels];
        panels[index] = { ...panels[index], videoUrl: undefined, isLoadingVideo: true, videoError: null };
        setMediaArtState(s => ({ ...s, panels }));

        try {
            const imageBase64 = panel.imageUrl.split(',')[1];
            // The panel description is now the prompt for the *end* frame, which is what the video model needs.
            const videoUrl = await geminiService.generateVideoForPanel(panel.description, imageBase64, mediaArtState.config.videoModel, true);
            panels[index].videoUrl = videoUrl;
        } catch (e: any) {
            panels[index].videoUrl = 'error';
            panels[index].videoError = e.message || t('errors.videoGeneration');
        } finally {
            panels[index].isLoadingVideo = false;
            setMediaArtState(s => ({ ...s, panels: [...panels] }));
        }
    };

    // Visual Art Handlers
    const handleGenerateVisualArt = async () => {
        setVisualArtState(s => ({ ...s, isLoading: true, error: null, resultVideoUrl: null }));
        try {
            const { inputText, effect, sourceImage } = visualArtState;
            const resultUrl = await geminiService.generateVisualArtVideo(inputText, effect, sourceImage);
            setVisualArtState(s => ({ ...s, resultVideoUrl: resultUrl }));
        } catch (e: any) {
            setVisualArtState(s => ({ ...s, error: e.message || t('errors.visualArtGeneration') }));
        } finally {
            setVisualArtState(s => ({ ...s, isLoading: false }));
        }
    };

    if (!API_KEY) {
        return <ApiKeyInstructions />;
    }

    return (
        <>
            <div className="bg-slate-900 text-white min-h-screen font-sans">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Header 
                        onOpenGallery={handleOpenGallery} 
                        onNewProject={handleNewProject} 
                        onImport={handleImportProject} 
                        onExportProject={handleExportProject}
                    />
                    <div className="mt-12">
                        <ModeSwitcher mode={mode} setMode={setMode} />
                    </div>
                    <div className="mt-8">
                        {mode === AppMode.DESCRIPTION && (
                            <div className="max-w-3xl mx-auto">
                                <InputForm 
                                    config={descriptionConfig} 
                                    setConfig={setDescriptionConfig}
                                    onGenerate={handleGenerateDescription}
                                    isLoading={isGeneratingDescription}
                                    onShowSampleGallery={() => handleShowSampleGallery('product')}
                                />
                                {error && <p className="text-red-400 mt-4">{error}</p>}
                                {description && !isGeneratingDescription && <DescriptionDisplay description={description} />}
                            </div>
                        )}
                        {mode === AppMode.STORYBOARD && (
                            <div className="max-w-5xl mx-auto">
                                {!storyboardPanels.length && !isGeneratingStoryboard && (
                                    <StoryboardInputForm
                                        onGenerate={handleGenerateStoryboard}
                                        isLoading={isGeneratingStoryboard}
                                        config={storyboardConfig}
                                        setConfig={setStoryboardConfig}
                                        onShowSampleGallery={() => handleShowSampleGallery('story')}
                                    />
                                )}
                                {error && <p className="text-red-400 mt-4">{error}</p>}
                                {(isGeneratingStoryboard || storyboardPanels.length > 0) && (
                                    <StoryboardDisplay 
                                        panels={storyboardPanels} 
                                        storyIdea={storyIdea}
                                        onExpandScene={handleExpandScene}
                                        onSceneDurationChange={(index, duration) => {
                                            const newPanels = [...storyboardPanels];
                                            newPanels[index].sceneDuration = duration;
                                            setStoryboardPanels(newPanels);
                                        }}
                                        onRegenerateVideo={handleRegenerateVideo}
                                        onRegenerateImage={handleRegenerateImage}
                                        onDeletePanel={(index) => setStoryboardPanels(storyboardPanels.filter((_, i) => i !== index))}
                                        isGeneratingImages={isGeneratingImages}
                                        onExportPdf={handleExportPdf}
                                        isExportingPdf={isExportingPdf}
                                    />
                                )}
                                <VideoDisplay panels={storyboardPanels} />
                            </div>
                        )}
                        {mode === AppMode.MEDIA_ART && (
                            <div className="max-w-5xl mx-auto">
                                <MediaArtGenerator 
                                    state={mediaArtState}
                                    setState={setMediaArtState}
                                    onOpenImageSelector={() => setIsImageSelectorOpen(true)}
                                    onGenerateScenes={handleGenerateMediaArtScenes}
                                    onRegenerateVideo={handleRegenerateMediaArtVideo}
                                    isLoading={isGeneratingMediaArtScenes}
                                    error={mediaArtError}
                                />
                                <VideoDisplay panels={mediaArtState.panels} />
                            </div>
                        )}
                         {mode === AppMode.VISUAL_ART && (
                            <div className="max-w-5xl mx-auto">
                                <VisualArtGenerator
                                    state={visualArtState}
                                    setState={setVisualArtState}
                                    onGenerate={handleGenerateVisualArt}
                                />
                            </div>
                         )}
                    </div>
                </main>
            </div>
            {/* Modals */}
            <DetailedStoryboardModal 
                isOpen={isDetailedModalOpen}
                onClose={() => setIsDetailedModalOpen(false)}
                panels={detailedModalPanels}
                isLoading={isDetailedModalLoading}
                error={detailedModalError}
                originalSceneDescription={originalSceneContext?.description}
                onSaveChanges={handleSaveChangesFromModal}
            />
            <SampleGalleryModal
                isOpen={isSampleGalleryOpen}
                onClose={() => setIsSampleGalleryOpen(false)}
                type={sampleGalleryType}
                products={getSampleProducts()}
                stories={getSampleStories()}
                onSelectProduct={handleSelectSampleProduct}
                onSelectStory={handleSelectSampleStory}
            />
            <GalleryModal 
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                projects={projects}
                onLoad={() => {}} // Simplified for now
                onDelete={() => {}} // Simplified for now
                onExport={() => {}} // Simplified for now
            />
            <ImageSelectionModal
                isOpen={isImageSelectorOpen}
                onClose={() => setIsImageSelectorOpen(false)}
                onSelect={(source: MediaArtSourceImage) => {
                    setMediaArtState(s => ({...s, sourceImage: source, panels: []}));
                    setIsImageSelectorOpen(false);
                }}
            />
        </>
    );
};

export default App;