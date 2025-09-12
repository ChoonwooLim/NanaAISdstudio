import React, { useState, useEffect } from 'react';
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
    AppState
} from './types';
import {
    generateDescription,
    generateStoryboardFromIdea,
    generateImageForPanel,
    expandSceneToDetailedPanels,
    generateVideoForPanel,
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

import { sampleProducts, sampleStoryIdeas } from './sampleData';


const initialStoryboardConfig: StoryboardConfig = {
    sceneCount: 4,
    aspectRatio: AspectRatio.LANDSCAPE,
    visualStyle: VisualStyle.CINEMATIC,
    videoLength: VideoLength.MEDIUM,
    mood: Mood.EPIC,
};

const App: React.FC = () => {
    // App State
    const [mode, setMode] = useState<AppMode>(AppMode.DESCRIPTION);
    const [productName, setProductName] = useState('');
    const [keyFeatures, setKeyFeatures] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
    const [description, setDescription] = useState('');
    const [storyIdea, setStoryIdea] = useState('');
    const [storyboardConfig, setStoryboardConfig] = useState<StoryboardConfig>(initialStoryboardConfig);
    const [storyboardPanels, setStoryboardPanels] = useState<StoryboardPanel[]>([]);
    
    // UI State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPanels, setModalPanels] = useState<DetailedStoryboardPanel[]>([]);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [expandingSceneIndex, setExpandingSceneIndex] = useState<number | null>(null);
    
    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);

    const apiKey = process.env.API_KEY;

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
            setError("Could not load saved projects from the database.");
        }
    };

    const applyState = (loadedState: AppState) => {
        setMode(loadedState.mode);
        setProductName(loadedState.productName);
        setKeyFeatures(loadedState.keyFeatures);
        setTargetAudience(loadedState.targetAudience);
        setTone(loadedState.tone);
        setStoryIdea(loadedState.storyIdea);
        setStoryboardConfig(loadedState.storyboardConfig);
        setDescription(loadedState.description);
        setStoryboardPanels(loadedState.storyboardPanels);
    };
    
    const handleLoadProject = async (id: string) => {
        const project = await getProject(id);
        if (project) {
            applyState(project.appState);
            setIsGalleryOpen(false);
            setError(null);
        } else {
            setError("Failed to load the selected project.");
        }
    };

    const handleDeleteProject = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            await deleteProject(id);
            await loadProjects(); // Refresh the list
        }
    };

    const getAppState = (): AppState => ({
        mode,
        productName,
        keyFeatures,
        targetAudience,
        tone,
        storyIdea,
        storyboardConfig,
        description,
        storyboardPanels,
    });

    const handleSaveProject = async () => {
        const title = productName || storyIdea || 'Untitled Project';
        const timestamp = Date.now();
        const id = timestamp.toString();
        const thumbnailUrl = storyboardPanels.find(p => p.imageUrl && p.imageUrl !== 'error')?.imageUrl || '';

        const project: Project = {
            id,
            title,
            timestamp,
            thumbnailUrl,
            appState: getAppState(),
        };

        try {
            await saveProject(project);
            await loadProjects(); // Refresh gallery list
            alert(`Project "${title}" saved!`);
        } catch (err) {
            console.error("Failed to save project:", err);
            setError("Failed to save the project.");
        }
    };

    const handleGenerateDescription = async () => {
        if (!productName || !keyFeatures) {
            setError('Product Name and Key Features are required.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setDescription('');

        try {
            const result = await generateDescription({ productName, keyFeatures, targetAudience, tone });
            setDescription(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleProceedToStoryboard = () => {
        setMode(AppMode.STORYBOARD);
        setStoryIdea(`Create a short video ad for ${productName}. The ad should highlight its key features: ${keyFeatures}. The tone should be ${tone}. Here is the product description for inspiration: "${description}"`);
        setStoryboardPanels([]); // Clear previous storyboard
    };

    const handleGenerateStoryboard = async () => {
        if (!storyIdea) {
            setError('Story Idea is required.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setStoryboardPanels([]);

        try {
            const scenes = await generateStoryboardFromIdea(storyIdea, storyboardConfig);
            const panels: StoryboardPanel[] = scenes.map(scene => ({
                description: scene.description,
                imageUrl: '',
                isLoadingImage: true,
                sceneDuration: 4,
            }));
            setStoryboardPanels(panels);
        } catch (err: any) {
            setError(err.message || 'Failed to generate storyboard scenes.');
            setIsLoading(false); // Stop loading if scene generation fails
        } finally {
            // The main loading spinner stops, but panel spinners will continue
            setIsLoading(false);
        }
    };

    // Effect to generate images when panels are created/updated
    useEffect(() => {
        const generateImages = async () => {
            const imagePromises = storyboardPanels.map((panel, index) => {
                if (panel.isLoadingImage && !panel.imageUrl) {
                    return generateImageForPanel(panel.description, storyboardConfig.visualStyle, storyboardConfig.aspectRatio)
                        .then(imageUrl => ({ index, imageUrl, status: 'success' }))
                        .catch(error => {
                            console.error(`Failed to generate image for panel ${index}:`, error);
                            return { index, imageUrl: 'error', status: 'error' };
                        });
                }
                return null;
            }).filter(Boolean);

            for (const promise of imagePromises) {
                 const result = await promise;
                 if (result) {
                    setStoryboardPanels(prevPanels =>
                        prevPanels.map((p, i) => i === result.index ? { ...p, imageUrl: result.imageUrl, isLoadingImage: false } : p)
                    );
                 }
            }
        };
        generateImages();
    }, [storyboardPanels, storyboardConfig.visualStyle, storyboardConfig.aspectRatio]);

    const handleExpandScene = async (sceneDescription: string, index: number) => {
        setExpandingSceneIndex(index);
        setIsModalOpen(true);
        setIsModalLoading(true);
        setModalError(null);
        setModalPanels([]);

        try {
            const detailedScenes = await expandSceneToDetailedPanels(sceneDescription);
            const initialModalPanels: DetailedStoryboardPanel[] = detailedScenes.map(scene => ({
                description: scene.description,
                imageUrl: '',
                isLoadingImage: true,
            }));
            setModalPanels(initialModalPanels);
            
            const generatedPanels = await Promise.all(initialModalPanels.map(async (panel) => {
                try {
                    const imageUrl = await generateImageForPanel(panel.description, storyboardConfig.visualStyle, storyboardConfig.aspectRatio);
                    return { ...panel, imageUrl, isLoadingImage: false };
                } catch (err) {
                    console.error(`Failed to generate modal image for "${panel.description}":`, err);
                    return { ...panel, imageUrl: 'error', isLoadingImage: false };
                }
            }));
            setModalPanels(generatedPanels);

        } catch (err: any) {
            setModalError(err.message || 'Failed to expand scene.');
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
            generateVideoForPanel(panel.description, imageBase64, storyboardConfig.visualStyle, panel.sceneDuration || 4)
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

    const loadSampleProduct = () => {
        const sample = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        setProductName(sample.productName);
        setKeyFeatures(sample.keyFeatures);
        setTargetAudience(sample.targetAudience);
        setTone(sample.tone);
    };

    const loadSampleStory = () => {
        const sample = sampleStoryIdeas[Math.floor(Math.random() * sampleStoryIdeas.length)];
        setStoryIdea(sample.idea);
        setStoryboardConfig(sample.config);
    };

    if (!apiKey) {
        return <ApiKeyInstructions />;
    }

    const canGenerateVideos = storyboardPanels.length > 0 && storyboardPanels.every(p => p.imageUrl && p.imageUrl !== 'error');
    const hasVideos = storyboardPanels.some(p => p.videoUrl && p.videoUrl !== 'error');

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Header mode={mode} onOpenGallery={() => setIsGalleryOpen(true)} />

                <div className="mt-8 max-w-lg mx-auto">
                    <ModeSwitcher mode={mode} setMode={setMode} />
                </div>

                <div className="mt-8 max-w-4xl mx-auto p-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-xl">
                    {mode === AppMode.DESCRIPTION ? (
                        <>
                            <div className="flex justify-end mb-4 -mt-2">
                                <button onClick={loadSampleProduct} className="text-xs text-blue-400 hover:underline">
                                    Load Sample Product
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
                                onSubmit={handleGenerateDescription}
                                isLoading={isLoading}
                            />
                        </>
                    ) : (
                         <>
                            <div className="flex justify-end mb-4 -mt-2">
                                <button onClick={loadSampleStory} className="text-xs text-blue-400 hover:underline">
                                    Load Sample Story
                                </button>
                            </div>
                            <StoryboardInputForm
                                storyIdea={storyIdea}
                                setStoryIdea={setStoryIdea}
                                config={storyboardConfig}
                                setConfig={setStoryboardConfig}
                                onSubmit={handleGenerateStoryboard}
                                isLoading={isLoading}
                            />
                        </>
                    )}
                </div>
                
                {error && (
                    <div className="mt-6 max-w-4xl mx-auto p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">
                        <p><span className="font-bold">Error:</span> {error}</p>
                    </div>
                )}

                {isLoading && mode === AppMode.DESCRIPTION && (
                    <div className="text-center mt-8">
                        <LoadingSpinner />
                        <p className="mt-2 text-slate-400">Generating your compelling description...</p>
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
                                🚀 Create Storyboard from Description
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
                        />
                         <div className="mt-6 flex justify-center items-center gap-4">
                            <button
                                onClick={handleGenerateAllVideos}
                                disabled={!canGenerateVideos || storyboardPanels.some(p => p.isLoadingVideo)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                               🎬 Generate All Video Clips
                            </button>
                             <button
                                onClick={handleSaveProject}
                                disabled={!canGenerateVideos}
                                className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                💾 Save Project
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
            />
        </div>
    );
};

export default App;