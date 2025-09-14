import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import DescriptionDisplay from './components/DescriptionDisplay';
import ApiKeyInstructions from './components/ApiKeyInstructions';
import ModeSwitcher from './components/ModeSwitcher';
import StoryboardInputForm from './components/StoryboardInputForm';
import StoryboardDisplay from './components/StoryboardDisplay';
import VideoDisplay from './components/VideoDisplay';
import DetailedStoryboardModal from './components/DetailedStoryboardModal';
import GalleryModal from './components/GalleryModal';
import SampleGalleryModal from './components/SampleGalleryModal';
import MediaArtGenerator from './components/MediaArtGenerator';
import ImageSelectionModal from './components/ImageSelectionModal';

import { 
    generateDescription, 
    generateStoryboard, 
    generateImageForPanel,
    expandSceneToDetailedPanels,
    generateVideoForPanel,
    imageUrlToBase64,
    deconstructPaintingIntoScenes,
    generateMediaArtImage,
    generateMediaArtClip,
} from './services/geminiService';

import * as db from './services/db';

import { 
    Tone, 
    AppMode,
    StoryboardConfig,
    StoryboardPanel,
    DetailedStoryboardPanel,
    AspectRatio,
    VisualStyle,
    VideoLength,
    Mood,
    SampleProduct,
    SampleStory,
    Project,
    MediaArtStyle,
    MediaArtState,
    MediaArtPanel,
    MediaArtSourceImage,
} from './types';

import { sampleProductsData, sampleStoryIdeasData } from './sampleData';
import { useTranslation } from './i18n/LanguageContext';

const containsKorean = (text: string) => /[\u3131-\uD79D]/.test(text);

const App: React.FC = () => {
    const { language, t } = useTranslation();
    const hasApiKey = !!process.env.API_KEY;

    const [mode, setMode] = useState<AppMode>(AppMode.DESCRIPTION);
    const [error, setError] = useState<string | null>(null);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

    const [productName, setProductName] = useState('');
    const [keyFeatures, setKeyFeatures] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [tone, setTone] = useState<Tone>(Tone.FRIENDLY);
    const [descriptionLanguage, setDescriptionLanguage] = useState('English');
    const [descriptionModel, setDescriptionModel] = useState('gemini-2.5-flash');
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
    
    const [storyIdea, setStoryIdea] = useState('');
    const [storyboardConfig, setStoryboardConfig] = useState<StoryboardConfig>({
        sceneCount: 4,
        aspectRatio: AspectRatio.LANDSCAPE,
        visualStyle: VisualStyle.CINEMATIC,
        videoLength: VideoLength.SHORT,
        mood: Mood.EPIC,
        descriptionLanguage: 'English',
        textModel: 'gemini-2.5-flash',
        imageModel: 'imagen-4.0-generate-001',
        videoModel: 'veo-2.0-generate-001',
    });
    const [panels, setPanels] = useState<StoryboardPanel[]>([]);
    const [isStoryboardLoading, setIsStoryboardLoading] = useState(false);
    const [isGeneratingImages, setIsGeneratingImages] = useState(false);
    
    const [mediaArtState, setMediaArtState] = useState<MediaArtState>({
        sourceImage: null,
        style: MediaArtStyle.SUBTLE_MOTION,
        panels: [],
    });
    const [isMediaArtLoading, setIsLoadingMediaArt] = useState(false);
    const [mediaArtError, setMediaArtError] = useState<string | null>(null);

    const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
    const [detailedPanels, setDetailedPanels] = useState<DetailedStoryboardPanel[]>([]);
    const [isDetailedLoading, setIsDetailedLoading] = useState(false);
    const [detailedError, setDetailedError] = useState<string | null>(null);
    const [originalSceneDescription, setOriginalSceneDescription] = useState('');
    const [originalPanelIndex, setOriginalPanelIndex] = useState(-1);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isSampleGalleryOpen, setIsSampleGalleryOpen] = useState(false);
    const [isImageSelectionModalOpen, setIsImageSelectionModalOpen] = useState(false);
    
    const productNameIsKorean = containsKorean(productName);
    const keyFeaturesIsKorean = containsKorean(keyFeatures);
    const targetAudienceIsKorean = containsKorean(targetAudience);
    const storyIdeaIsKorean = containsKorean(storyIdea);
    
    const canSaveProject = (): boolean => {
        switch (mode) {
            case AppMode.DESCRIPTION: return !!productName;
            case AppMode.STORYBOARD: return !!storyIdea;
            case AppMode.MEDIA_ART: return !!mediaArtState.sourceImage;
            default: return false;
        }
    };
    
    useEffect(() => {
        if (isGalleryOpen) {
            loadProjectsFromDb();
        }
    }, [isGalleryOpen]);
    
    const resetState = () => {
        setProductName('');
        setKeyFeatures('');
        setTargetAudience('');
        setTone(Tone.FRIENDLY);
        setDescriptionLanguage('English');
        setGeneratedDescription('');
        
        setStoryIdea('');
        setPanels([]);

        setMediaArtState({
            sourceImage: null,
            style: MediaArtStyle.SUBTLE_MOTION,
            panels: [],
        });
        
        setError(null);
        setMediaArtError(null);
    }

    const handleNewProject = (resetId = true) => {
        if (resetId) setCurrentProjectId(null);
        resetState();
    };

    const applyState = (project: Project) => {
        resetState();
        setMode(project.mode);
        setCurrentProjectId(project.id);
        
        if (project.descriptionState) {
            const { productName, keyFeatures, targetAudience, tone, descriptionLanguage, descriptionModel, generatedDescription } = project.descriptionState;
            setProductName(productName);
            setKeyFeatures(keyFeatures);
            setTargetAudience(targetAudience);
            setTone(tone);
            setDescriptionLanguage(descriptionLanguage);
            setDescriptionModel(descriptionModel);
            setGeneratedDescription(generatedDescription);
        }
        if (project.storyboardState) {
            const { storyIdea, config, panels } = project.storyboardState;
            setStoryIdea(storyIdea);
            setStoryboardConfig(config);
            setPanels(panels);
        }
        if (project.mediaArtState) {
            setMediaArtState(project.mediaArtState);
        }
    }

    const getAppState = (): Project => {
        const timestamp = Date.now();
        const id = currentProjectId || `proj_${timestamp}`;
        let title = "Untitled Project";
        let thumbnailUrl: string | undefined;

        switch(mode) {
            case AppMode.DESCRIPTION:
                title = productName || t('galleryModal.untitledDescription');
                break;
            case AppMode.STORYBOARD:
                title = storyIdea || t('galleryModal.untitledStoryboard');
                thumbnailUrl = panels.find(p => p.imageUrl && !p.imageUrl.startsWith('error'))?.imageUrl;
                break;
            case AppMode.MEDIA_ART:
                title = mediaArtState.sourceImage?.title || t('galleryModal.untitledMediaArt');
                thumbnailUrl = mediaArtState.sourceImage?.url;
                break;
        }

        return {
            id,
            timestamp,
            title,
            thumbnailUrl,
            mode,
            descriptionState: mode === AppMode.DESCRIPTION ? {
                productName, keyFeatures, targetAudience, tone, descriptionLanguage, descriptionModel, generatedDescription
            } : undefined,
            storyboardState: mode === AppMode.STORYBOARD ? {
                storyIdea, config: storyboardConfig, panels
            } : undefined,
            mediaArtState: mode === AppMode.MEDIA_ART ? mediaArtState : undefined,
        };
    };

    const handleSaveProject = async () => {
        const project = getAppState();
        await db.saveProject(project);
        setCurrentProjectId(project.id);
    };

    const handleExportCurrentProject = () => {
        const project = getAppState();
        const safeTitle = project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `artifex-project-${safeTitle}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleExportAllProjects = async () => {
        const allProjects = await db.getProjects();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allProjects, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `artifex-ai-studio-pro-projects.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImportProjects = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    try {
                        const projectsToImport = JSON.parse(event.target?.result as string) as Project[] | Project;
                        const projectsArray = Array.isArray(projectsToImport) ? projectsToImport : [projectsToImport];
                        
                        for (const project of projectsArray) {
                            if (project.id && project.timestamp && project.title && project.mode) {
                                await db.saveProject(project);
                            }
                        }
                        await loadProjectsFromDb();
                        alert(t('common.importSuccess', { count: projectsArray.length }));

                    } catch (error) {
                        console.error("Error parsing imported file:", error);
                        alert(t('common.importFailure'));
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const loadProjectsFromDb = async () => {
        const savedProjects = await db.getProjects();
        setProjects(savedProjects);
    };

    const loadProject = async (id: string) => {
        const project = await db.getProject(id);
        if (project) {
           applyState(project);
        }
        setIsGalleryOpen(false);
    };

    const handleDeleteProject = async (id: string) => {
        if (currentProjectId === id) {
            handleNewProject();
        }
        await db.deleteProject(id);
        loadProjectsFromDb();
    };
    
    // == Handlers ==
    const handleGenerateDescription = async () => {
        setIsDescriptionLoading(true);
        setGeneratedDescription('');
        setError(null);
        try {
            const description = await generateDescription(
                productName, keyFeatures, targetAudience, tone, descriptionLanguage, descriptionModel
            );
            setGeneratedDescription(description);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsDescriptionLoading(false);
        }
    };

    const handleGenerateStoryboard = async () => {
        setIsStoryboardLoading(true);
        setPanels([]);
        setError(null);
        try {
            const initialPanels = await generateStoryboard(storyIdea, storyboardConfig);
            setPanels(initialPanels);
            generateAllImages(initialPanels);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsStoryboardLoading(false);
        }
    };

    const generateAllImages = async (currentPanels: StoryboardPanel[]) => {
        setIsGeneratingImages(true);
        let updatedPanels = [...currentPanels];
        for (let i = 0; i < updatedPanels.length; i++) {
            try {
                const imageUrl = await generateImageForPanel(updatedPanels[i].description, storyboardConfig);
                updatedPanels = updatedPanels.map((p, idx) => idx === i ? { ...p, imageUrl, isLoadingImage: false } : p);
            } catch(err: any) {
                 const imageUrl = err.message === 'quota_error' ? 'quota_error' : 'error';
                 updatedPanels = updatedPanels.map((p, idx) => idx === i ? { ...p, imageUrl, isLoadingImage: false } : p);
            }
            setPanels(updatedPanels);
        }
        setIsGeneratingImages(false);
    };
    
    const handleRegenerateImage = async (index: number) => {
        setPanels(panels => panels.map((p, i) => i === index ? { ...p, isLoadingImage: true, imageUrl: undefined } : p));
        try {
            const imageUrl = await generateImageForPanel(panels[index].description, storyboardConfig);
            setPanels(panels => panels.map((p, i) => i === index ? { ...p, imageUrl, isLoadingImage: false } : p));
        } catch (err: any) {
            const imageUrl = err.message === 'quota_error' ? 'quota_error' : 'error';
            setPanels(panels => panels.map((p, i) => i === index ? { ...p, imageUrl, isLoadingImage: false } : p));
        }
    };

    const handleRegenerateVideo = async (index: number) => {
        const panel = panels[index];
        if (!panel.imageUrl || panel.imageUrl.startsWith('error')) return;

        setPanels(panels => panels.map((p, i) => i === index ? { ...p, isLoadingVideo: true, videoUrl: undefined, videoError: undefined } : p));
        try {
            const videoUrl = await generateVideoForPanel(panel.imageUrl, panel.description, panel.sceneDuration || 4, storyboardConfig.videoModel);
            setPanels(panels => panels.map((p, i) => i === index ? { ...p, videoUrl, isLoadingVideo: false } : p));
        } catch (err: any) {
            console.error(`Error generating video for storyboard panel ${index}:`, err);
            setPanels(panels => panels.map((p, i) => i === index ? { ...p, videoUrl: 'error', isLoadingVideo: false, videoError: err.message } : p));
        }
    };
    
    const handleDeletePanel = (index: number) => {
        setPanels(panels => panels.filter((_, i) => i !== index));
    };

    const handleSceneDurationChange = (index: number, duration: number) => {
        setPanels(panels => panels.map((p, i) => i === index ? { ...p, sceneDuration: duration } : p));
    };

    const handleOpenExpandScene = async (sceneDescription: string, index: number) => {
        setOriginalSceneDescription(sceneDescription);
        setOriginalPanelIndex(index);
        setIsDetailedModalOpen(true);
        setIsDetailedLoading(true);
        setDetailedError(null);
        setDetailedPanels([]);

        try {
            const expanded = await expandSceneToDetailedPanels(sceneDescription, storyboardConfig.descriptionLanguage, storyboardConfig.textModel);
            setDetailedPanels(expanded);
            setIsDetailedLoading(false);

            let updatedDetailedPanels = [...expanded];
            for (let i = 0; i < updatedDetailedPanels.length; i++) {
                const imageUrl = await generateImageForPanel(updatedDetailedPanels[i].description, storyboardConfig);
                updatedDetailedPanels = updatedDetailedPanels.map((p, idx) => idx === i ? { ...p, imageUrl, isLoadingImage: false } : p);
                setDetailedPanels(updatedDetailedPanels);
            }
        } catch (err: any) {
            setDetailedError(err.message);
            setIsDetailedLoading(false);
        }
    };
    
    const handleSaveChangesFromDetailed = (editedPanels: DetailedStoryboardPanel[]) => {
        const newStoryboardPanels: StoryboardPanel[] = editedPanels.map(dp => ({
            description: dp.description,
            imageUrl: dp.imageUrl,
            isLoadingImage: false,
            isLoadingVideo: false,
            sceneDuration: 4,
        }));

        setPanels(currentPanels => {
            const newPanels = [...currentPanels];
            newPanels.splice(originalPanelIndex, 1, ...newStoryboardPanels);
            return newPanels;
        });
        
        setIsDetailedModalOpen(false);
    };

    const handleSelectSourceImage = (source: MediaArtSourceImage) => {
        setMediaArtState({
            sourceImage: source,
            style: MediaArtStyle.SUBTLE_MOTION,
            panels: [],
        });
        setIsImageSelectionModalOpen(false);
    };

    const handleDeconstructPainting = async () => {
        if (!mediaArtState.sourceImage) return;
        setIsLoadingMediaArt(true);
        setMediaArtError(null);
        setMediaArtState(s => ({ ...s, panels: [] }));

        try {
            const descriptions = await deconstructPaintingIntoScenes(
                { title: mediaArtState.sourceImage.title, artist: mediaArtState.sourceImage.artist },
                mediaArtState.style
            );

            const initialPanels: MediaArtPanel[] = descriptions.map(desc => ({
                description: desc,
                isLoadingImage: true,
                isLoadingVideo: false,
            }));
            setMediaArtState(s => ({ ...s, panels: initialPanels }));
            
            const { dataUrl, mimeType } = await imageUrlToBase64(mediaArtState.sourceImage.url);
            const [, base64Data] = dataUrl.split(',');

            let updatedPanels = [...initialPanels];
            for (let i = 0; i < descriptions.length; i++) {
                try {
                    const imageUrl = await generateMediaArtImage(descriptions[i], {
                        title: mediaArtState.sourceImage.title,
                        artist: mediaArtState.sourceImage.artist,
                        base64Data: base64Data,
                        mimeType: mimeType,
                    });
                    updatedPanels = updatedPanels.map((p, idx) => idx === i ? { ...p, imageUrl, isLoadingImage: false } : p);
                    setMediaArtState(s => ({ ...s, panels: updatedPanels }));
                } catch (err: any) {
                    console.error(`Error generating image for panel ${i}:`, err);
                    updatedPanels = updatedPanels.map((p, idx) => idx === i ? { ...p, imageUrl: 'error', isLoadingImage: false } : p);
                    setMediaArtState(s => ({ ...s, panels: updatedPanels }));
                }
            }
        } catch (err: any) {
            setMediaArtError(err.message);
        } finally {
            setIsLoadingMediaArt(false);
        }
    };

    const handleGenerateMediaArtClip = async (index: number) => {
        const panel = mediaArtState.panels[index];
        if (!panel || !panel.imageUrl || panel.imageUrl === 'error') return;

        setMediaArtState(s => ({
            ...s,
            panels: s.panels.map((p, i) => i === index ? { ...p, isLoadingVideo: true, videoUrl: undefined, videoError: undefined } : p)
        }));
        try {
            const videoUrl = await generateMediaArtClip(panel.imageUrl, panel.description);
            setMediaArtState(s => ({
                ...s,
                panels: s.panels.map((p, i) => i === index ? { ...p, videoUrl, isLoadingVideo: false } : p)
            }));
        } catch (err: any) {
            console.error(`Error generating video clip for panel ${index}:`, err);
            setMediaArtState(s => ({
                ...s,
                panels: s.panels.map((p, i) => i === index ? { ...p, videoUrl: 'error', isLoadingVideo: false, videoError: err.message } : p)
            }));
        }
    };
    
    const handleGenerateAllMediaArtClips = async () => {
        for (let i = 0; i < mediaArtState.panels.length; i++) {
            const panel = mediaArtState.panels[i];
            if (panel.imageUrl && panel.imageUrl !== 'error' && !panel.videoUrl) {
                await handleGenerateMediaArtClip(i);
            }
        }
    };
    
    const handleRegenerateMediaArtImage = async (index: number) => {
        if (!mediaArtState.sourceImage) return;

        setMediaArtState(s => ({ ...s, panels: s.panels.map((p, i) => i === index ? {...p, isLoadingImage: true, imageUrl: undefined} : p) }));
        
        try {
             const { dataUrl, mimeType } = await imageUrlToBase64(mediaArtState.sourceImage.url);
             const [, base64Data] = dataUrl.split(',');
             const panel = mediaArtState.panels[index];
             const imageUrl = await generateMediaArtImage(panel.description, {
                title: mediaArtState.sourceImage.title,
                artist: mediaArtState.sourceImage.artist,
                base64Data: base64Data,
                mimeType: mimeType,
            });
            setMediaArtState(s => ({...s, panels: s.panels.map((p, i) => i === index ? {...p, imageUrl, isLoadingImage: false} : p)}));
        } catch(err) {
             setMediaArtState(s => ({...s, panels: s.panels.map((p, i) => i === index ? {...p, imageUrl: 'error', isLoadingImage: false} : p)}));
        }
    };

    const handleDeleteMediaArtPanel = (index: number) => {
        if (window.confirm(t('mediaArt.deleteConfirm'))) {
            setMediaArtState(s => ({...s, panels: s.panels.filter((_, i) => i !== index)}));
        }
    };


    const handleSelectSampleProduct = (product: SampleProduct) => {
        handleNewProject(false);
        setProductName(product.productName);
        setKeyFeatures(product.keyFeatures);
        setTargetAudience(product.targetAudience);
        setTone(product.tone);
        setIsSampleGalleryOpen(false);
    };
    
    const handleSelectSampleStory = (story: SampleStory) => {
        handleNewProject(false);
        setStoryIdea(story.idea);
        setStoryboardConfig(story.config);
        setIsSampleGalleryOpen(false);
    };

    if (!hasApiKey) {
        return <ApiKeyInstructions />;
    }

    const currentSampleProducts = (language === 'Korean' ? 
        Object.values(sampleProductsData).map(p => p.ko) :
        Object.values(sampleProductsData).map(p => p.en)
    );
    const currentSampleStories = (language === 'Korean' ? 
        Object.values(sampleStoryIdeasData).map(p => p.ko) :
        Object.values(sampleStoryIdeasData).map(p => p.en)
    );

    return (
        <div className="bg-slate-900 min-h-screen text-white font-sans">
            <div className="container mx-auto px-4 py-8">
                <Header 
                    onOpenGallery={() => setIsGalleryOpen(true)}
                    onNewProject={handleNewProject}
                    onImport={handleImportProjects}
                />
                
                <main className="mt-12 max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <ModeSwitcher mode={mode} setMode={setMode} />
                       {mode !== AppMode.MEDIA_ART &&  <button 
                            onClick={() => setIsSampleGalleryOpen(true)} 
                            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {mode === AppMode.DESCRIPTION ? t('sampleModal.loadSampleProduct') : t('sampleModal.loadSampleStory')}
                        </button>}
                    </div>

                    {error && mode !== AppMode.MEDIA_ART && (
                        <div className="p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg mb-6">
                            <p><span className="font-bold">Error:</span> {error}</p>
                        </div>
                    )}
                    
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
                        {mode === AppMode.DESCRIPTION && (
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
                                isLoading={isDescriptionLoading}
                                productNameIsKorean={productNameIsKorean}
                                keyFeaturesIsKorean={keyFeaturesIsKorean}
                                targetAudienceIsKorean={targetAudienceIsKorean}
                                onSave={handleSaveProject}
                                onExport={handleExportCurrentProject}
                                canSave={canSaveProject()}
                            />
                        )}
                        {mode === AppMode.STORYBOARD && (
                            <StoryboardInputForm
                                storyIdea={storyIdea}
                                setStoryIdea={setStoryIdea}
                                config={storyboardConfig}
                                setConfig={setStoryboardConfig}
                                onSubmit={handleGenerateStoryboard}
                                isLoading={isStoryboardLoading}
                                storyIdeaIsKorean={storyIdeaIsKorean}
                                onSave={handleSaveProject}
                                onExport={handleExportCurrentProject}
                                canSave={canSaveProject()}
                            />
                        )}
                        {mode === AppMode.MEDIA_ART && (
                           <MediaArtGenerator
                                state={mediaArtState}
                                setState={setMediaArtState}
                                onOpenImageSelector={() => setIsImageSelectionModalOpen(true)}
                                onGenerateScenes={handleDeconstructPainting}
                                onGenerateClip={handleGenerateMediaArtClip}
                                onGenerateAllClips={handleGenerateAllMediaArtClips}
                                onRegenerateImage={handleRegenerateMediaArtImage}
                                onDeletePanel={handleDeleteMediaArtPanel}
                                isLoading={isMediaArtLoading}
                                error={mediaArtError}
                                onSave={handleSaveProject}
                                onExport={handleExportCurrentProject}
                                canSave={canSaveProject()}
                           />
                        )}
                    </div>
                    
                    {mode === AppMode.DESCRIPTION && generatedDescription && <DescriptionDisplay description={generatedDescription} />}
                    
                    {mode === AppMode.STORYBOARD && panels.length > 0 && (
                        <>
                            <StoryboardDisplay 
                                panels={panels} 
                                onExpandScene={handleOpenExpandScene}
                                onSceneDurationChange={handleSceneDurationChange}
                                onRegenerateVideo={handleRegenerateVideo}
                                onRegenerateImage={handleRegenerateImage}
                                onDeletePanel={handleDeletePanel}
                                isGeneratingImages={isGeneratingImages}
                            />
                            <VideoDisplay panels={panels} />
                        </>
                    )}
                </main>
            </div>
            
            <DetailedStoryboardModal
                isOpen={isDetailedModalOpen}
                onClose={() => setIsDetailedModalOpen(false)}
                panels={detailedPanels}
                isLoading={isDetailedLoading}
                error={detailedError}
                originalSceneDescription={originalSceneDescription}
                onSaveChanges={handleSaveChangesFromDetailed}
            />
            <GalleryModal 
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                projects={projects}
                onLoad={loadProject}
                onDelete={handleDeleteProject}
                onExport={handleExportAllProjects}
            />
            <SampleGalleryModal
                isOpen={isSampleGalleryOpen}
                onClose={() => setIsSampleGalleryOpen(false)}
                type={mode === AppMode.DESCRIPTION ? 'product' : 'story'}
                products={currentSampleProducts}
                stories={currentSampleStories}
                onSelectProduct={handleSelectSampleProduct}
                onSelectStory={handleSelectSampleStory}
            />
            <ImageSelectionModal
                isOpen={isImageSelectionModalOpen}
                onClose={() => setIsImageSelectionModalOpen(false)}
                onSelect={handleSelectSourceImage}
            />
        </div>
    );
};

export default App;