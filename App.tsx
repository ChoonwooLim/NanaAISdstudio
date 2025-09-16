
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
    
    // Media Art Mode State
    const initialMediaArtState: MediaArtState = {
        sourceImage: null,
        style: MediaArtStyle.DATA_COMPOSITION,
        styleParams: MEDIA_ART_STYLE_OPTIONS.find(opt => opt.value === MediaArtStyle.DATA_COMPOSITION)!.defaultParams,
        panels: [],
    };
    const [mediaArtState, setMediaArtState] = useState<MediaArtState>(initialMediaArtState);
    const [isGeneratingMediaArtScenes, setIsGeneratingMediaArtScenes] = useState(false);
    const [mediaArtError, setMediaArtError] = useState<string | null>(null);

    // Visual Art Mode State
    const initialVisualArtState: VisualArtState = {
        inputText: '',
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
    
    // Media Art Handlers
    const handleGenerateMediaArtScenes = async () => {
        if (!mediaArtState.sourceImage) return;
        setIsGeneratingMediaArtScenes(true);
        setMediaArtError(null);
        setMediaArtState(s => ({ ...s, panels: [] }));

        try {
            const { sourceImage, style, styleParams } = mediaArtState;
            const panels = await geminiService.generateMediaArtStoryboard(sourceImage, style, styleParams, language);
            const initialPanels: StoryboardPanel[] = panels.map(p => ({ ...p, isLoadingImage: true, sceneDuration: 4 }));
            setMediaArtState(s => ({ ...s, panels: initialPanels }));
            
            let currentPanels = [...initialPanels];
            for (let i = 0; i < panels.length; i++) {
                try {
                    const imageBase64 = await geminiService.generateImageForPanel(panels[i].description, {
                        imageModel: 'imagen-4.0-generate-001',
                        aspectRatio: AspectRatio.LANDSCAPE,
                        visualStyle: VisualStyle.CINEMATIC // Default for art
                    });
                    currentPanels[i] = { ...currentPanels[i], imageUrl: `data:image/jpeg;base64,${imageBase64}`, isLoadingImage: false };
                } catch (imgErr) {
                    currentPanels[i] = { ...currentPanels[i], imageUrl: 'error', isLoadingImage: false };
                }
                setMediaArtState(s => ({ ...s, panels: [...currentPanels] }));
            }
        } catch (e: any) {
            setMediaArtError(e.message || t('errors.mediaArtGeneration'));
        } finally {
            setIsGeneratingMediaArtScenes(false);
        }
    };
    
    const handleRegenerateMediaArtImage = async (index: number) => {
        const panels = [...mediaArtState.panels];
        if (!panels[index]) return;
    
        const updatedPanels = [...panels];
        updatedPanels[index] = { ...updatedPanels[index], imageUrl: undefined, isLoadingImage: true };
        setMediaArtState(s => ({ ...s, panels: updatedPanels }));
    
        try {
            const imageBase64 = await geminiService.generateImageForPanel(updatedPanels[index].description, {
                imageModel: 'imagen-4.0-generate-001',
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.CINEMATIC
            });
            updatedPanels[index] = { ...updatedPanels[index], imageUrl: `data:image/jpeg;base64,${imageBase64}`, isLoadingImage: false };
        } catch (e) {
            updatedPanels[index] = { ...updatedPanels[index], imageUrl: 'error', isLoadingImage: false };
        } finally {
            setMediaArtState(s => ({ ...s, panels: [...updatedPanels] }));
        }
    };

    // Visual Art Handlers
    const handleGenerateVisualArt = async () => {
        setVisualArtState(s => ({ ...s, isLoading: true, error: null, resultVideoUrl: null }));
        try {
            const resultUrl = await geminiService.generateVisualArtVideo(visualArtState.inputText, visualArtState.effect);
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
                    <Header onOpenGallery={handleOpenGallery} onNewProject={handleNewProject} onImport={() => {}} />
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
                                    />
                                )}
                                <VideoDisplay panels={storyboardPanels} />
                            </div>
                        )}
                        {mode === AppMode.MEDIA_ART && (
                            <div className="max-w-5xl mx-auto">
                                {/* FIX: Removed unused props (`onGenerateClip`, `onGenerateAllClips`, `onSave`, `onExport`, `canSave`) to align with the component's defined interface and fix the type error. */}
                                <MediaArtGenerator 
                                    state={mediaArtState}
                                    setState={setMediaArtState}
                                    onOpenImageSelector={() => setIsImageSelectorOpen(true)}
                                    onGenerateScenes={handleGenerateMediaArtScenes}
                                    onRegenerateImage={handleRegenerateMediaArtImage}
                                    onDeletePanel={(index) => setMediaArtState(s => ({ ...s, panels: s.panels.filter((_, i) => i !== index)}))}
                                    isLoading={isGeneratingMediaArtScenes}
                                    error={mediaArtError}
                                />
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
