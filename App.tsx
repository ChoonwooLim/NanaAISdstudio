import React, { useState, useEffect, useMemo } from 'react';
import {
    AppMode,
    Tone,
    StoryboardConfig,
    StoryboardPanel,
    AspectRatio,
    VisualStyle,
    VideoLength,
    Mood,
    DetailedStoryboardPanel,
    Project,
    AppState,
    SampleProduct,
    SampleStory
} from './types';
import {
    generateDescription,
    generateStoryboardFromIdea,
    generateImageForPanel,
    expandSceneToDetailedPanels,
    generateVideoForPanel,
    translateText,
} from './services/geminiService';
import { getProjects, saveProject, deleteProject, getProject } from './services/db';

import Header from './components/Header';
import InputForm from './components/InputForm';
import DescriptionDisplay from './components/DescriptionDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ApiKeyInstructions from './components/ApiKeyInstructions';
import ModeSwitcher from './components/ModeSwitcher';
import StoryboardInputForm from './components/StoryboardInputForm';
import StoryboardDisplay from './components/StoryboardDisplay';
import DetailedStoryboardModal from './components/DetailedStoryboardModal';
import VideoDisplay from './components/VideoDisplay';
import GalleryModal from './components/GalleryModal';
import SampleGalleryModal from './components/SampleGalleryModal';


import { sampleProductsData, sampleStoryIdeasData } from './sampleData';
import { useTranslation } from './i18n/LanguageContext';

const isKorean = (text: string): boolean => /[\u3131-\uD79D]/.test(text);

const initialStoryboardConfig: StoryboardConfig = {
    sceneCount: 4,
    aspectRatio: AspectRatio.LANDSCAPE,
    visualStyle: VisualStyle.CINEMATIC,
    videoLength: VideoLength.MEDIUM,
    mood: Mood.EPIC,
    descriptionLanguage: 'English',
    // FIX: Updated textModel to 'gemini-2.5-flash' to comply with coding guidelines.
    textModel: 'gemini-2.5-flash',
    imageModel: 'imagen-4.0-generate-001',
    // FIX: Updated videoModel to 'veo-2.0-generate-001' to comply with coding guidelines.
    videoModel: 'veo-2.0-generate-001',
};

const App: React.FC = () => {
    const { language, t } = useTranslation();

    // App State
    const [mode, setMode] = useState<AppMode>(AppMode.DESCRIPTION);
    const [productName, setProductName] = useState('');
    const [keyFeatures, setKeyFeatures] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
    const [descriptionLanguage, setDescriptionLanguage] = useState(language);
    // FIX: Updated default descriptionModel to 'gemini-2.5-flash' to comply with coding guidelines.
    const [descriptionModel, setDescriptionModel] = useState('gemini-2.5-flash');
    const [description, setDescription] = useState('');
    const [storyIdea, setStoryIdea] = useState('');
    const [storyboardConfig, setStoryboardConfig] = useState<StoryboardConfig>({
        ...initialStoryboardConfig,
        descriptionLanguage: language
    });
    const [storyboardPanels, setStoryboardPanels] = useState<StoryboardPanel[]>([]);
    
    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isGeneratingImages, setIsGeneratingImages] = useState(false);


    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPanels, setModalPanels] = useState<DetailedStoryboardPanel[]>([]);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [expandingSceneIndex, setExpandingSceneIndex] = useState<number | null>(null);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const [sampleModalType, setSampleModalType] = useState<'product' | 'story'>('product');
    
    // Gallery and Project State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);


    const apiKey = process.env.API_KEY;
    
    const resetState = () => {
        setMode(AppMode.DESCRIPTION);
        setProductName('');
        setKeyFeatures('');
        setTargetAudience('');
        setTone(Tone.PROFESSIONAL);
        setDescriptionLanguage(language);
        setDescriptionModel('gemini-2.5-flash');
        setDescription('');
        setStoryIdea('');
        setStoryboardConfig({
            ...initialStoryboardConfig,
            descriptionLanguage: language,
        });
        setStoryboardPanels([]);
        setError(null);
        setCurrentProjectId(null);
    };

    const handleNewProject = () => {
        // Optional: Could add a confirmation if there are unsaved changes.
        resetState();
    };

    // Sync local language settings with global language
    useEffect(() => {
        setDescriptionLanguage(language);
        setStoryboardConfig(prev => ({ ...prev, descriptionLanguage: language }));
    }, [language]);


    // Load projects on mount
    useEffect(() => {
        if (apiKey) {
            loadProjects();
        }
    }, [apiKey]);
    
    const loadProjects = async () => {
        try {
            const savedProjects = await getProjects();
            setProjects(savedProjects);
        } catch (err) {
            console.error("Failed to load projects:", err);
            setError(t('errors.loadProjects'));
        }
    };

    const applyState = (loadedState: AppState) => {
        setMode(loadedState.mode);
        setProductName(loadedState.productName);
        setKeyFeatures(loadedState.keyFeatures);
        setTargetAudience(loadedState.targetAudience);
        setTone(loadedState.tone);
        setDescriptionLanguage(loadedState.descriptionLanguage || language); // Fallback to global language
        // FIX: Updated fallback descriptionModel to 'gemini-2.5-flash' to comply with coding guidelines.
        setDescriptionModel(loadedState.descriptionModel || 'gemini-2.5-flash');
        setStoryIdea(loadedState.storyIdea);
        setStoryboardConfig(loadedState.storyboardConfig);
        setDescription(loadedState.description);
        setStoryboardPanels(loadedState.storyboardPanels);
        setError(null);
    };
    
    const handleLoadProject = async (id: string) => {
        const project = await getProject(id);
        if (project) {
            applyState(project.appState);
            setCurrentProjectId(project.id);
            setIsGalleryOpen(false);
        } else {
            setError(t('errors.loadProjectFailed'));
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (window.confirm(t('prompts.deleteProjectConfirm'))) {
            await deleteProject(id);
            if (id === currentProjectId) {
                // If we deleted the currently active project, reset the editor.
                handleNewProject();
            }
            await loadProjects(); // Refresh the list
        }
    };

    const getAppState = (): AppState => ({
        mode,
        productName,
        keyFeatures,
        targetAudience,
        tone,
        descriptionLanguage,
        descriptionModel,
        storyIdea,
        storyboardConfig,
        description,
        storyboardPanels,
    });

    const handleSaveProject = async () => {
        const isUpdate = !!currentProjectId;
        const id = isUpdate ? currentProjectId! : Date.now().toString();
        const title = productName || storyIdea || t('common.untitledProject');
        const thumbnailUrl = storyboardPanels.find(p => p.imageUrl && p.imageUrl !== 'error' && p.imageUrl !== 'quota_error')?.imageUrl || '';

        const project: Project = {
            id,
            title,
            timestamp: Date.now(),
            thumbnailUrl,
            appState: getAppState(),
        };

        try {
            await saveProject(project);
            if (!isUpdate) {
                setCurrentProjectId(id); // Set the new ID for future saves
            }
            await loadProjects(); // Refresh gallery list
            alert(t('prompts.projectSaved', { title }));
        } catch (err) {
            console.error("Failed to save project:", err);
            setError(t('errors.saveProjectFailed'));
        }
    };

    const handleGenerateDescription = async () => {
        if (!productName || !keyFeatures) {
            setError(t('errors.productNameAndFeaturesRequired'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setDescription('');

        try {
            let finalProductName = productName;
            let finalKeyFeatures = keyFeatures;
            let finalTargetAudience = targetAudience;

            if (isKorean(productName)) {
                finalProductName = await translateText(productName, 'English');
            }
            if (isKorean(keyFeatures)) {
                finalKeyFeatures = await translateText(keyFeatures, 'English');
            }
            if (targetAudience && isKorean(targetAudience)) {
                finalTargetAudience = await translateText(targetAudience, 'English');
            }

            const result = await generateDescription({ 
                productName: finalProductName, 
                keyFeatures: finalKeyFeatures, 
                targetAudience: finalTargetAudience, 
                tone,
                language: descriptionLanguage,
            }, descriptionModel);
            setDescription(result);
        } catch (err: any) {
            setError(err.message || t('errors.unknown'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleProceedToStoryboard = () => {
        setMode(AppMode.STORYBOARD);
        setStoryIdea(t('prompts.storyboardIdeaFromDescription', { productName, keyFeatures, tone: t(`tones.${tone}`), description }));
        setStoryboardPanels([]); // Clear previous storyboard
    };

    const handleGenerateStoryboard = async () => {
        if (!storyIdea) {
            setError(t('errors.storyIdeaRequired'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setStoryboardPanels([]);

        try {
            let finalStoryIdea = storyIdea;
            if (isKorean(storyIdea)) {
                finalStoryIdea = await translateText(storyIdea, 'English');
            }
            const scenes = await generateStoryboardFromIdea(finalStoryIdea, storyboardConfig);
            const panels: StoryboardPanel[] = scenes.map(scene => ({
                description: scene.description,
                imageUrl: '',
                isLoadingImage: true,
                sceneDuration: 4,
            }));
            setStoryboardPanels(panels);
        } catch (err: any) {
            setError(err.message || t('errors.storyboardGenerationFailed'));
            setIsLoading(false); // Stop loading if scene generation fails
        } finally {
            // The main loading spinner stops, but panel spinners will continue
            setIsLoading(false);
        }
    };

    // Effect to generate images when panels are created/updated
    useEffect(() => {
        const processImageQueue = async () => {
            const panelToProcessIndex = storyboardPanels.findIndex(
                (p) => p.isLoadingImage && !p.imageUrl
            );

            if (panelToProcessIndex === -1 || isGeneratingImages) {
                if(panelToProcessIndex === -1) {
                    setIsGeneratingImages(false); 
                }
                return;
            }

            setIsGeneratingImages(true);
            
            const panel = storyboardPanels[panelToProcessIndex];

            try {
                const imageUrl = await generateImageForPanel(
                    panel.description,
                    storyboardConfig.visualStyle,
                    storyboardConfig.aspectRatio,
                    storyboardConfig.imageModel,
                );
                setStoryboardPanels((prevPanels) =>
                    prevPanels.map((p, i) =>
                        i === panelToProcessIndex
                            ? { ...p, imageUrl, isLoadingImage: false }
                            : p
                    )
                );
            } catch (error: any) {
                console.error(`Failed to generate image for panel ${panelToProcessIndex}:`, error);
                const errorMessage = (error.message || '').includes('quota') ? 'quota_error' : 'error';
                setStoryboardPanels((prevPanels) =>
                    prevPanels.map((p, i) =>
                        i === panelToProcessIndex
                            ? { ...p, imageUrl: errorMessage, isLoadingImage: false }
                            : p
                    )
                );
            } finally {
                setIsGeneratingImages(false);
            }
        };

        processImageQueue();

    }, [storyboardPanels, isGeneratingImages, storyboardConfig.visualStyle, storyboardConfig.aspectRatio, storyboardConfig.imageModel]);

    const handleRegenerateImage = (indexToRegenerate: number) => {
        setStoryboardPanels(prevPanels =>
            prevPanels.map((panel, index) => {
                if (index === indexToRegenerate) {
                    return {
                        ...panel,
                        imageUrl: '', // Reset image URL
                        isLoadingImage: true, // Set loading state to true
                    };
                }
                return panel;
            })
        );
    };

    const handleDeletePanel = (indexToDelete: number) => {
        if (window.confirm(t('prompts.deletePanelConfirm', { index: indexToDelete + 1 }))) {
            setStoryboardPanels(prevPanels =>
                prevPanels.filter((_, index) => index !== indexToDelete)
            );
        }
    };

    const handleExpandScene = async (sceneDescription: string, index: number) => {
        setExpandingSceneIndex(index);
        setIsModalOpen(true);
        setIsModalLoading(true);
        setModalError(null);
        setModalPanels([]);

        try {
            const detailedScenes = await expandSceneToDetailedPanels(sceneDescription, storyboardConfig.descriptionLanguage, storyboardConfig.textModel);
            const initialModalPanels: DetailedStoryboardPanel[] = detailedScenes.map(scene => ({
                description: scene.description,
                imageUrl: '',
                isLoadingImage: true,
            }));
            setModalPanels(initialModalPanels);
            
            const generatedPanels = await Promise.all(initialModalPanels.map(async (panel) => {
                try {
                    const imageUrl = await generateImageForPanel(panel.description, storyboardConfig.visualStyle, storyboardConfig.aspectRatio, storyboardConfig.imageModel);
                    return { ...panel, imageUrl, isLoadingImage: false };
                } catch (err: any) {
                    console.error(`Failed to generate modal image for "${panel.description}":`, err);
                    const errorMessage = (err.message || '').includes('quota') ? 'quota_error' : 'error';
                    return { ...panel, imageUrl: errorMessage, isLoadingImage: false };
                }
            }));
            setModalPanels(generatedPanels);

        } catch (err: any) {
            setModalError(err.message || t('errors.expandSceneFailed'));
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleSaveChangesFromModal = (editedPanels: DetailedStoryboardPanel[]) => {
        if (expandingSceneIndex !== null) {
            const newPanels = [...storyboardPanels];
            const panelsToInsert = editedPanels.map(p => ({
                description: p.description,
                imageUrl: p.imageUrl,
                isLoadingImage: false,
                sceneDuration: 4, 
            }));
            newPanels.splice(expandingSceneIndex, 1, ...panelsToInsert);
            setStoryboardPanels(newPanels);
        }
        setIsModalOpen(false);
    };

    const handleSceneDurationChange = (index: number, duration: number) => {
        setStoryboardPanels(prev => prev.map((p, i) => i === index ? { ...p, sceneDuration: duration } : p));
    };

    const generateVideoForSinglePanel = (index: number) => {
        const panel = storyboardPanels[index];
        if (panel && panel.imageUrl && panel.imageUrl.startsWith('data:image')) {
            setStoryboardPanels(prev => prev.map((p, i) => i === index ? { ...p, isLoadingVideo: true, videoUrl: undefined } : p));
            
            const imageBase64 = panel.imageUrl.split(',')[1];
            generateVideoForPanel(panel.description, imageBase64, storyboardConfig.visualStyle, panel.sceneDuration || 4, storyboardConfig.videoModel)
                .then(videoUrl => {
                    setStoryboardPanels(prev => prev.map((p, i) => i === index ? { ...p, videoUrl, isLoadingVideo: false } : p));
                })
                .catch(err => {
                    console.error(`Failed to generate video for panel ${index}:`, err);
                    setStoryboardPanels(prev => prev.map((p, i) => i === index ? { ...p, videoUrl: 'error', isLoadingVideo: false } : p));
                });
        }
    }
    
    const handleGenerateAllVideos = () => {
        storyboardPanels.forEach((panel, index) => {
            if (panel.imageUrl && panel.imageUrl.startsWith('data:image') && !panel.videoUrl) {
                generateVideoForSinglePanel(index);
            }
        });
    };
    
    const handleRegenerateVideo = (index: number) => {
        generateVideoForSinglePanel(index);
    };

    const openSampleProductModal = () => {
        setSampleModalType('product');
        setIsSampleModalOpen(true);
    };

    const openSampleStoryModal = () => {
        setSampleModalType('story');
        setIsSampleModalOpen(true);
    };

    const handleSelectSampleProduct = (sample: SampleProduct) => {
        handleNewProject(); // Reset state before loading a sample
        setProductName(sample.productName);
        setKeyFeatures(sample.keyFeatures);
        setTargetAudience(sample.targetAudience);
        setTone(sample.tone);
        setIsSampleModalOpen(false);
    };

    const handleSelectSampleStory = (sample: SampleStory) => {
        handleNewProject(); // Reset state before loading a sample
        setMode(AppMode.STORYBOARD);
        setStoryIdea(sample.idea);
        setStoryboardConfig(sample.config);
        setIsSampleModalOpen(false);
    };

    const handleExportProjects = async () => {
        try {
            const allProjects = await getProjects();
            if (allProjects.length === 0) {
                alert(t('prompts.noProjectsToExport'));
                return;
            }
            const jsonString = JSON.stringify(allProjects, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `artifex-ai-studio-pro-projects-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to export projects:", err);
            setError(t('errors.exportFailed'));
        }
    };
    
    const handleExportCurrentProject = () => {
        const currentAppState = getAppState();

        const id = currentProjectId || Date.now().toString();
        const title = productName || storyIdea || t('common.untitledProject');
        const thumbnailUrl = storyboardPanels.find(p => p.imageUrl && p.imageUrl !== 'error' && p.imageUrl !== 'quota_error')?.imageUrl || '';

        const project: Project = {
            id,
            title,
            timestamp: Date.now(),
            thumbnailUrl,
            appState: currentAppState,
        };
        
        const projectsToExport = [project];
        const jsonString = JSON.stringify(projectsToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50);
        a.download = `artifex-project-${sanitizedTitle}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportProjects = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text !== 'string') {
                        throw new Error(t('errors.fileReadError'));
                    }
                    const importedProjects = JSON.parse(text) as Project[];
                    
                    if (!Array.isArray(importedProjects) || importedProjects.some(p => !p.id || !p.title || !p.appState)) {
                         throw new Error(t('errors.invalidProjectFile'));
                    }

                    if (window.confirm(t('prompts.importConfirm', { count: importedProjects.length }))) {
                        // Use a Set to avoid duplicates if importing the same file twice
                        const existingIds = new Set(projects.map(p => p.id));
                        const projectsToSave = importedProjects.filter(p => !existingIds.has(p.id));
                        
                        await Promise.all(projectsToSave.map(project => saveProject(project)));
                        await loadProjects();
                        alert(t('prompts.importSuccess', { count: projectsToSave.length }));
                    }
                } catch (err: any) {
                    console.error("Failed to import projects:", err);
                    setError(`${t('errors.importFailed')}: ${err.message}`);
                }
            };
            reader.onerror = () => {
                setError(t('errors.fileReadError'));
            };
            reader.readAsText(file);
        };
        input.click();
    };

    // Prepare localized sample data
    const sampleProducts = useMemo(() => {
        const langCode = language === 'Korean' ? 'ko' : 'en';
        return Object.values(sampleProductsData).map(p => p[langCode] || p.en);
    }, [language]);

    const sampleStoryIdeas = useMemo(() => {
        const langCode = language === 'Korean' ? 'ko' : 'en';
        return Object.values(sampleStoryIdeasData).map(s => s[langCode] || s.en);
    }, [language]);


    if (!apiKey) {
        return <ApiKeyInstructions />;
    }

    const canGenerateVideos = storyboardPanels.length > 0 && storyboardPanels.every(p => p.imageUrl && p.imageUrl !== 'error' && p.imageUrl !== 'quota_error');
    const hasVideos = storyboardPanels.some(p => p.videoUrl && p.videoUrl !== 'error');

    const productNameIsKorean = isKorean(productName);
    const keyFeaturesIsKorean = isKorean(keyFeatures);
    const targetAudienceIsKorean = isKorean(targetAudience);
    const storyIdeaIsKorean = isKorean(storyIdea);

    const canSave = (mode === AppMode.DESCRIPTION && !!productName) || (mode === AppMode.STORYBOARD && !!storyIdea);


    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Header 
                    onOpenGallery={() => setIsGalleryOpen(true)} 
                    onNewProject={handleNewProject}
                    onImport={handleImportProjects}
                />

                <div className="mt-8 max-w-lg mx-auto">
                    <ModeSwitcher mode={mode} setMode={setMode} />
                </div>

                <div className="mt-8 max-w-4xl mx-auto p-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-xl">
                    {mode === AppMode.DESCRIPTION ? (
                        <>
                            <div className="flex justify-end mb-4 -mt-2">
                                <button onClick={openSampleProductModal} className="text-xs text-blue-400 hover:underline">
                                    {t('common.loadSampleProduct')}
                                </button>
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
                                isLoading={isLoading}
                                productNameIsKorean={productNameIsKorean}
                                keyFeaturesIsKorean={keyFeaturesIsKorean}
                                targetAudienceIsKorean={targetAudienceIsKorean}
                                onSave={handleSaveProject}
                                onExport={handleExportCurrentProject}
                                canSave={canSave}
                            />
                        </>
                    ) : (
                         <>
                            <div className="flex justify-end mb-4 -mt-2">
                                <button onClick={openSampleStoryModal} className="text-xs text-blue-400 hover:underline">
                                    {t('common.loadSampleStory')}
                                </button>
                            </div>
                            <StoryboardInputForm
                                storyIdea={storyIdea}
                                setStoryIdea={setStoryIdea}
                                config={storyboardConfig}
                                setConfig={setStoryboardConfig}
                                onSubmit={handleGenerateStoryboard}
                                isLoading={isLoading}
                                storyIdeaIsKorean={storyIdeaIsKorean}
                                onSave={handleSaveProject}
                                onExport={handleExportCurrentProject}
                                canSave={canSave}
                            />
                        </>
                    )}
                </div>
                
                {error && (
                    <div className="mt-6 max-w-4xl mx-auto p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">
                        <p><span className="font-bold">{t('common.errorPrefix')}</span> {error}</p>
                    </div>
                )}

                {isLoading && mode === AppMode.DESCRIPTION && (
                    <div className="text-center mt-8">
                        <LoadingSpinner />
                        <p className="mt-2 text-slate-400">{t('descriptionForm.loadingMessage')}</p>
                    </div>
                )}
                
                {description && mode === AppMode.DESCRIPTION && (
                    <div className="mt-8 max-w-4xl mx-auto">
                        <DescriptionDisplay description={description} />
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleProceedToStoryboard}
                                className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                            >
                                {t('descriptionDisplay.proceedButton')}
                            </button>
                        </div>
                    </div>
                )}

                {storyboardPanels.length > 0 && (
                     <div className="mt-8 max-w-7xl mx-auto">
                        <StoryboardDisplay 
                            panels={storyboardPanels} 
                            onExpandScene={handleExpandScene} 
                            onSceneDurationChange={handleSceneDurationChange}
                            onRegenerateVideo={handleRegenerateVideo}
                            onRegenerateImage={handleRegenerateImage}
                            onDeletePanel={handleDeletePanel}
                            isGeneratingImages={isGeneratingImages}
                        />
                         <div className="mt-6 flex justify-center items-center gap-4">
                            <button
                                onClick={handleGenerateAllVideos}
                                disabled={!canGenerateVideos || storyboardPanels.some(p => p.isLoadingVideo)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                               {t('storyboardDisplay.generateAllClips')}
                            </button>
                        </div>
                    </div>
                )}
                
                {hasVideos && (
                    <VideoDisplay panels={storyboardPanels} />
                )}

            </main>
            
            <DetailedStoryboardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                panels={modalPanels}
                isLoading={isModalLoading}
                error={modalError}
                originalSceneDescription={expandingSceneIndex !== null ? storyboardPanels[expandingSceneIndex]?.description : ''}
                onSaveChanges={handleSaveChangesFromModal}
            />

            <GalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                projects={projects}
                onLoad={handleLoadProject}
                onDelete={handleDeleteProject}
                onExport={handleExportProjects}
            />

            <SampleGalleryModal
                isOpen={isSampleModalOpen}
                onClose={() => setIsSampleModalOpen(false)}
                type={sampleModalType}
                products={sampleProducts}
                stories={sampleStoryIdeas}
                onSelectProduct={handleSelectSampleProduct}
                onSelectStory={handleSelectSampleStory}
            />
        </div>
    );
};

export default App;