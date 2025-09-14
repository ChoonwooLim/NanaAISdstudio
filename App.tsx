// FIX: Created this file to serve as the main application component, resolving module resolution errors.

import React, { useState, useEffect, useCallback } from 'react';
import { AppMode, Tone, StoryboardConfig, StoryboardPanel, Project, DetailedStoryboardPanel, SampleProduct, SampleStory } from './types';
import * as geminiService from './services/geminiService';
import * as db from './services/db';
import { useTranslation } from './i18n/LanguageContext';
import { TEXT_MODEL_OPTIONS } from './constants';
import { sampleProductsData, sampleStoryIdeasData } from './sampleData';
import { AspectRatio, VisualStyle, VideoLength, Mood } from './types';

import ApiKeyInstructions from './components/ApiKeyInstructions';
import Header from './components/Header';
import ModeSwitcher from './components/ModeSwitcher';
import InputForm from './components/InputForm';
import DescriptionDisplay from './components/DescriptionDisplay';
import StoryboardInputForm from './components/StoryboardInputForm';
import StoryboardDisplay from './components/StoryboardDisplay';
import DetailedStoryboardModal from './components/DetailedStoryboardModal';
import VideoDisplay from './components/VideoDisplay';
import GalleryModal from './components/GalleryModal';
import SampleGalleryModal from './components/SampleGalleryModal';
import MediaArtGenerator from './components/MediaArtGenerator';


const App: React.FC = () => {
    const { t, language } = useTranslation();
    const apiKeyExists = !!process.env.API_KEY;

    // App State
    const [mode, setMode] = useState<AppMode>(AppMode.DESCRIPTION);
    const [error, setError] = useState<string | null>(null);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);


    // Description Mode State
    const [productName, setProductName] = useState('');
    const [keyFeatures, setKeyFeatures] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [tone, setTone] = useState<Tone>(Tone.FRIENDLY);
    const [descriptionLanguage, setDescriptionLanguage] = useState('English');
    const [descriptionModel, setDescriptionModel] = useState(TEXT_MODEL_OPTIONS[0].value);
    const [description, setDescription] = useState('');
    const [isLoadingDescription, setIsLoadingDescription] = useState(false);

    // Language Detection State
    const [productNameIsKorean, setProductNameIsKorean] = useState(false);
    const [keyFeaturesIsKorean, setKeyFeaturesIsKorean] = useState(false);
    const [targetAudienceIsKorean, setTargetAudienceIsKorean] = useState(false);
    const [storyIdeaIsKorean, setStoryIdeaIsKorean] = useState(false);

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
    const [storyIdea, setStoryIdea] = useState('');
    const [storyboardConfig, setStoryboardConfig] = useState<StoryboardConfig>(initialStoryboardConfig);
    const [panels, setPanels] = useState<StoryboardPanel[]>([]);
    const [isLoadingStoryboard, setIsLoadingStoryboard] = useState(false);
    const [isGeneratingImages, setIsGeneratingImages] = useState(false);
    
    // Detailed Storyboard Modal State
    const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
    const [detailedPanels, setDetailedPanels] = useState<DetailedStoryboardPanel[]>([]);
    const [isLoadingDetailed, setIsLoadingDetailed] = useState(false);
    const [detailedError, setDetailedError] = useState<string | null>(null);
    const [modalContext, setModalContext] = useState<{ sceneDescription: string; index: number } | null>(null);

    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);

    // Sample Modal State
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const [sampleType, setSampleType] = useState<'product' | 'story'>('product');

    // Language Detection Logic
    useEffect(() => {
        const checkLang = async (text: string, setter: (isKorean: boolean) => void) => {
            if (language === 'Korean' || language === 'English') {
                setter(await geminiService.detectLanguage(text));
            } else {
                setter(false);
            }
        };
        const debounce = setTimeout(() => {
            checkLang(productName, setProductNameIsKorean);
            checkLang(keyFeatures, setKeyFeaturesIsKorean);
            checkLang(targetAudience, setTargetAudienceIsKorean);
            checkLang(storyIdea, setStoryIdeaIsKorean);
        }, 500);
        return () => clearTimeout(debounce);
    }, [productName, keyFeatures, targetAudience, storyIdea, language]);
    
    const handleGenerateDescription = async () => {
        setIsLoadingDescription(true);
        setError(null);
        setDescription('');
        try {
            const result = await geminiService.generateDescription(
                productName,
                keyFeatures,
                targetAudience,
                tone,
                descriptionLanguage,
                descriptionModel
            );
            setDescription(result);
        } catch (err: any) {
            setError(err.message || t('errors.descriptionGeneration'));
        } finally {
            setIsLoadingDescription(false);
        }
    };
    
    const handleGenerateStoryboard = async () => {
        setIsLoadingStoryboard(true);
        setIsGeneratingImages(true);
        setError(null);
        setPanels([]);
        try {
            const sceneDescriptions = await geminiService.generateStoryboard(storyIdea, storyboardConfig);
            const initialPanels: StoryboardPanel[] = sceneDescriptions.map(desc => ({
                description: desc,
                imageUrl: null,
                isLoadingImage: true,
                videoUrl: null,
                isLoadingVideo: false,
                sceneDuration: 4,
            }));
            setPanels(initialPanels);

            const generatedPanels = await Promise.all(
                initialPanels.map(async (panel, index) => {
                    try {
                        const base64Image = await geminiService.generateImage(panel.description, storyboardConfig.visualStyle, storyboardConfig.aspectRatio, storyboardConfig.imageModel);
                        setPanels(prev => prev.map((p, i) => i === index ? { ...p, imageUrl: `data:image/png;base64,${base64Image}`, isLoadingImage: false } : p));
                        return { ...panel, imageUrl: `data:image/png;base64,${base64Image}`, isLoadingImage: false };
                    } catch (err: any) {
                        console.error(`Error generating image for panel ${index}:`, err);
                        const isQuotaError = err.message?.includes('429');
                        const errorType = isQuotaError ? 'quota_error' : 'error';
                        setPanels(prev => prev.map((p, i) => i === index ? { ...p, imageUrl: errorType, isLoadingImage: false } : p));
                        return { ...panel, imageUrl: errorType, isLoadingImage: false };
                    }
                })
            );
            setPanels(generatedPanels);
        } catch (err: any) {
            setError(err.message || t('errors.storyboardGeneration'));
            setPanels([]);
        } finally {
            setIsLoadingStoryboard(false);
            setIsGeneratingImages(false);
        }
    };

    const handleExpandScene = async (sceneDescription: string, index: number) => {
        setModalContext({ sceneDescription, index });
        setIsDetailedModalOpen(true);
        setIsLoadingDetailed(true);
        setDetailedError(null);
        setDetailedPanels([]);
        try {
            const newDetailedPanels = await geminiService.generateDetailedStoryboard(sceneDescription, storyboardConfig);
            setDetailedPanels(newDetailedPanels.map(p => ({ ...p, isLoadingImage: true })));

            // Generate images for detailed panels
            await Promise.all(
                newDetailedPanels.map(async (panel, i) => {
                    try {
                        const base64Image = await geminiService.generateImage(panel.description, storyboardConfig.visualStyle, storyboardConfig.aspectRatio, storyboardConfig.imageModel);
                        setDetailedPanels(prev => prev.map((dp, idx) => idx === i ? { ...dp, imageUrl: `data:image/png;base64,${base64Image}`, isLoadingImage: false } : dp));
                    } catch (err) {
                        console.error(`Error generating detailed image ${i}:`, err);
                        const isQuotaError = (err as any).message?.includes('429');
                        setDetailedPanels(prev => prev.map((dp, idx) => idx === i ? { ...dp, imageUrl: isQuotaError ? 'quota_error' : 'error', isLoadingImage: false } : dp));
                    }
                })
            );
        } catch (err: any) {
            setDetailedError(err.message || t('errors.detailedStoryboardGeneration'));
        } finally {
            setIsLoadingDetailed(false);
        }
    };
    
    const handleSaveDetailedChanges = (editedPanels: DetailedStoryboardPanel[]) => {
        if (modalContext) {
            const newPanels = editedPanels.map(dp => ({
                description: dp.description,
                imageUrl: dp.imageUrl || null,
                isLoadingImage: false,
                videoUrl: null,
                isLoadingVideo: false,
                sceneDuration: 4
            }));
            setPanels(prev => {
                const updated = [...prev];
                updated.splice(modalContext.index, 1, ...newPanels);
                return updated;
            });
        }
        setIsDetailedModalOpen(false);
        setModalContext(null);
    };

    const handleRegenerateImage = async (index: number) => {
        setPanels(prev => prev.map((p, i) => i === index ? { ...p, isLoadingImage: true, imageUrl: null } : p));
        const panel = panels[index];
        try {
            const base64Image = await geminiService.generateImage(panel.description, storyboardConfig.visualStyle, storyboardConfig.aspectRatio, storyboardConfig.imageModel);
            setPanels(prev => prev.map((p, i) => i === index ? { ...p, imageUrl: `data:image/png;base64,${base64Image}`, isLoadingImage: false } : p));
        } catch (err) {
             console.error(`Error regenerating image for panel ${index}:`, err);
             const isQuotaError = (err as any).message?.includes('429');
             setPanels(prev => prev.map((p, i) => i === index ? { ...p, imageUrl: isQuotaError ? 'quota_error' : 'error', isLoadingImage: false } : p));
        }
    };

    const handleRegenerateVideo = async (index: number) => {
        const panel = panels[index];
        if (!panel.imageUrl || !panel.imageUrl.startsWith('data:image')) return;

        setPanels(prev => prev.map((p, i) => i === index ? { ...p, isLoadingVideo: true, videoUrl: null } : p));

        try {
            const base64Data = panel.imageUrl.split(',')[1];
            const videoUrl = await geminiService.generateVideo(storyboardConfig.videoModel, panel.description, base64Data, panel.sceneDuration);
            setPanels(prev => prev.map((p, i) => i === index ? { ...p, videoUrl, isLoadingVideo: false } : p));
        } catch (err) {
            console.error(`Error generating video for panel ${index}:`, err);
            setPanels(prev => prev.map((p, i) => i === index ? { ...p, videoUrl: 'error', isLoadingVideo: false } : p));
        }
    };
    
    // Gallery and Project Management
    const loadProjects = useCallback(async () => {
        const loadedProjects = await db.getProjects();
        setProjects(loadedProjects);
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const getAppState = (): Omit<Project, 'id' | 'timestamp' | 'title' | 'thumbnailUrl'> => ({
        mode,
        productName: mode === AppMode.DESCRIPTION ? productName : undefined,
        keyFeatures: mode === AppMode.DESCRIPTION ? keyFeatures : undefined,
        targetAudience: mode === AppMode.DESCRIPTION ? targetAudience : undefined,
        tone: mode === AppMode.DESCRIPTION ? tone : undefined,
        descriptionLanguage: mode === AppMode.DESCRIPTION ? descriptionLanguage : undefined,
        descriptionModel: mode === AppMode.DESCRIPTION ? descriptionModel : undefined,
        description: mode === AppMode.DESCRIPTION ? description : undefined,
        storyIdea: mode === AppMode.STORYBOARD ? storyIdea : undefined,
        storyboardConfig: mode === AppMode.STORYBOARD ? storyboardConfig : undefined,
        panels: mode === AppMode.STORYBOARD ? panels : undefined,
    });
    
    const applyState = (state: Partial<Project>) => {
        if (state.mode) setMode(state.mode);
        if (state.mode === AppMode.DESCRIPTION) {
            setProductName(state.productName || '');
            setKeyFeatures(state.keyFeatures || '');
            setTargetAudience(state.targetAudience || '');
            setTone(state.tone || Tone.FRIENDLY);
            setDescriptionLanguage(state.descriptionLanguage || 'English');
            setDescriptionModel(state.descriptionModel || TEXT_MODEL_OPTIONS[0].value);
            setDescription(state.description || '');
        } else if (state.mode === AppMode.STORYBOARD) {
            setStoryIdea(state.storyIdea || '');
            setStoryboardConfig(state.storyboardConfig || initialStoryboardConfig);
            setPanels(state.panels || []);
        }
    };

    const handleSaveProject = async () => {
        const currentState = getAppState();
        const project: Project = {
            id: currentProjectId || crypto.randomUUID(),
            timestamp: Date.now(),
            title: mode === AppMode.DESCRIPTION ? productName : storyIdea,
            thumbnailUrl: panels.find(p => p.imageUrl && p.imageUrl.startsWith('data:image'))?.imageUrl || null,
            ...currentState
        };
        await db.saveProject(project);
        if (!currentProjectId) {
            setCurrentProjectId(project.id);
        }
        loadProjects();
    };

    const handleExportCurrentProject = () => {
        const state = getAppState();
        const title = mode === AppMode.DESCRIPTION ? productName : storyIdea;
        const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `artifex-project-${safeTitle || 'untitled'}.json`;

        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(state, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = fileName;
        link.click();
    };
    
    const handleImportProjects = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.multiple = true;
        input.onchange = async (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) {
                let importedCount = 0;
                for (const file of Array.from(files)) {
                    try {
                        const projectData = JSON.parse(await file.text());
                        const project: Project = {
                            id: crypto.randomUUID(),
                            timestamp: Date.now(),
                            title: projectData.productName || projectData.storyIdea || 'Imported Project',
                            thumbnailUrl: projectData.panels?.find((p: StoryboardPanel) => p.imageUrl && p.imageUrl.startsWith('data:image'))?.imageUrl || null,
                            ...projectData,
                        };
                        await db.saveProject(project);
                        importedCount++;
                    } catch (err) {
                         console.error("Failed to import file:", file.name, err);
                    }
                }
                alert(t('galleryModal.importSuccess', { count: importedCount }));
                loadProjects();
            }
        };
        input.click();
    };
    
    const handleLoadProject = async (id: string) => {
        const project = await db.getProject(id);
        if (project) {
            resetState();
            setCurrentProjectId(project.id);
            applyState(project);
            setIsGalleryOpen(false);
        }
    };
    
    const handleDeleteProject = async (id: string) => {
        if(window.confirm(t('galleryModal.confirmDelete'))) {
            await db.deleteProject(id);
            if(id === currentProjectId){
                handleNewProject();
            }
            loadProjects();
        }
    };
    
    const resetState = () => {
         setError(null);
        setProductName('');
        setKeyFeatures('');
        setTargetAudience('');
        setTone(Tone.FRIENDLY);
        setDescriptionLanguage('English');
        setDescriptionModel(TEXT_MODEL_OPTIONS[0].value);
        setDescription('');
        setStoryIdea('');
        setStoryboardConfig(initialStoryboardConfig);
        setPanels([]);
    };

    const handleNewProject = () => {
        resetState();
        setCurrentProjectId(null);
    };

    // Sample Modal Logic
    const handleSelectSampleProduct = (product: SampleProduct) => {
        setProductName(product.productName);
        setKeyFeatures(product.keyFeatures);
        setTargetAudience(product.targetAudience);
        setTone(product.tone);
        setIsSampleModalOpen(false);
    };

    const handleSelectSampleStory = (story: SampleStory) => {
        setStoryIdea(story.idea);
        setStoryboardConfig(story.config);
        setIsSampleModalOpen(false);
    };

    const getLocalizedSamples = (data: { [key: string]: { en: any; ko: any } }) => {
        const langCode = language === 'Korean' ? 'ko' : 'en';
        return Object.values(data).map(item => item[langCode] || item['en']);
    };

    if (!apiKeyExists) {
        return <ApiKeyInstructions />;
    }

    const canSaveProject = mode === AppMode.DESCRIPTION ? !!productName : !!storyIdea;

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <Header 
                    onOpenGallery={() => setIsGalleryOpen(true)} 
                    onNewProject={handleNewProject} 
                    onImport={handleImportProjects}
                />
                
                <div className="mt-12 space-y-8">
                    <ModeSwitcher mode={mode} setMode={setMode} />
                    
                    <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg">
                        {error && (
                            <div className="p-4 mb-6 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">
                                <p><span className="font-bold">{t('common.errorPrefix')}</span> {error}</p>
                            </div>
                        )}
                        
                        {mode === AppMode.DESCRIPTION && (
                           <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-slate-200">{t('main.descriptionTitle')}</h2>
                                    <button onClick={() => { setSampleType('product'); setIsSampleModalOpen(true); }} className="text-sm font-semibold text-blue-400 hover:text-blue-300">{t('main.loadSample')}</button>
                                </div>
                                <InputForm
                                    productName={productName}
                                    setProductName={setProductName}
                                    keyFeatures={keyFeatures}
                                    setKeyFeatures={setKeyFeatures}
                                    targetAudience={targetAudience}
                                    setTargetAudience={setTargetAudience}
                                    tone={tone}
                                    setTone={setTone}
                                    descriptionLanguage={descriptionLanguage}
                                    setDescriptionLanguage={setDescriptionLanguage}
                                    descriptionModel={descriptionModel}
                                    setDescriptionModel={setDescriptionModel}
                                    onSubmit={handleGenerateDescription}
                                    isLoading={isLoadingDescription}
                                    productNameIsKorean={productNameIsKorean}
                                    keyFeaturesIsKorean={keyFeaturesIsKorean}
                                    targetAudienceIsKorean={targetAudienceIsKorean}
                                    onSave={handleSaveProject}
                                    onExport={handleExportCurrentProject}
                                    canSave={canSaveProject}
                                />
                            </>
                        )}
                        {mode === AppMode.STORYBOARD && (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-slate-200">{t('main.storyboardTitle')}</h2>
                                    <button onClick={() => { setSampleType('story'); setIsSampleModalOpen(true); }} className="text-sm font-semibold text-blue-400 hover:text-blue-300">{t('main.loadSample')}</button>
                                </div>
                                <StoryboardInputForm
                                    storyIdea={storyIdea}
                                    setStoryIdea={setStoryIdea}
                                    config={storyboardConfig}
                                    setConfig={setStoryboardConfig}
                                    onSubmit={handleGenerateStoryboard}
                                    isLoading={isLoadingStoryboard}
                                    storyIdeaIsKorean={storyIdeaIsKorean}
                                    onSave={handleSaveProject}
                                    onExport={handleExportCurrentProject}
                                    canSave={canSaveProject}
                                />
                            </>
                        )}

                        {mode === AppMode.MEDIA_ART && (
                            <>
                                 <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-slate-200">{t('main.mediaArtTitle')}</h2>
                                </div>
                                <MediaArtGenerator />
                            </>
                        )}
                    </div>

                    {mode === AppMode.DESCRIPTION && description && <DescriptionDisplay description={description} />}
                    {mode === AppMode.STORYBOARD && panels.length > 0 && 
                        <StoryboardDisplay 
                            panels={panels} 
                            onExpandScene={handleExpandScene} 
                            onSceneDurationChange={(index, duration) => setPanels(p => p.map((panel, i) => i === index ? { ...panel, sceneDuration: duration } : panel))}
                            onRegenerateVideo={handleRegenerateVideo}
                            onRegenerateImage={handleRegenerateImage}
                            onDeletePanel={(index) => setPanels(p => p.filter((_, i) => i !== index))}
                            isGeneratingImages={isGeneratingImages}
                        />
                    }
                    {mode === AppMode.STORYBOARD && panels.some(p => p.videoUrl && p.videoUrl !== 'error') && <VideoDisplay panels={panels} />}

                </div>
            </main>

            <DetailedStoryboardModal
                isOpen={isDetailedModalOpen}
                onClose={() => setIsDetailedModalOpen(false)}
                panels={detailedPanels}
                isLoading={isLoadingDetailed}
                error={detailedError}
                originalSceneDescription={modalContext?.sceneDescription}
                onSaveChanges={handleSaveDetailedChanges}
            />

            <GalleryModal 
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                projects={projects}
                onLoad={handleLoadProject}
                onDelete={handleDeleteProject}
                onExport={() => { /* TODO: Export all projects */ }}
            />

            <SampleGalleryModal
                isOpen={isSampleModalOpen}
                onClose={() => setIsSampleModalOpen(false)}
                type={sampleType}
                products={getLocalizedSamples(sampleProductsData)}
                stories={getLocalizedSamples(sampleStoryIdeasData)}
                onSelectProduct={handleSelectSampleProduct}
                onSelectStory={handleSelectSampleStory}
            />
        </div>
    );
};

export default App;