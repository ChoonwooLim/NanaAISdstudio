import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import StoryboardInputForm from './components/StoryboardInputForm';
import ModeSwitcher from './components/ModeSwitcher';
import DescriptionDisplay from './components/DescriptionDisplay';
import StoryboardDisplay from './components/StoryboardDisplay';
import DetailedStoryboardModal from './components/DetailedStoryboardModal';
import VideoDisplay from './components/VideoDisplay';
import ApiKeyInstructions from './components/ApiKeyInstructions';
import StoryboardSettings from './components/StoryboardSettings';
import LoadingSpinner from './components/LoadingSpinner';
import GalleryModal from './components/GalleryModal';
import { Tone, StoryboardPanel, DetailedStoryboardPanel, AppMode, StoryboardConfig, AspectRatio, VisualStyle, VideoLength, Mood, Project, AppState } from './types';
import * as geminiService from './services/geminiService';
import * as dbService from './services/db';
import { sampleProducts, sampleStoryIdeas } from './sampleData';

const App: React.FC = () => {
    // Check for API Key before rendering the main app
    if (!process.env.API_KEY) {
        return <ApiKeyInstructions />;
    }

    // App mode state
    const [mode, setMode] = useState<AppMode>(AppMode.DESCRIPTION);
    
    // Form state
    const [productName, setProductName] = useState('');
    const [keyFeatures, setKeyFeatures] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
    const [storyIdea, setStoryIdea] = useState('');
    const [storyboardConfig, setStoryboardConfig] = useState<StoryboardConfig>({
        sceneCount: 4,
        aspectRatio: AspectRatio.LANDSCAPE,
        visualStyle: VisualStyle.CINEMATIC,
        videoLength: VideoLength.SHORT,
        mood: Mood.FAST_PACED,
    });

    // Generation state
    const [isLoadingDescription, setIsLoadingDescription] = useState(false);
    const [isLoadingStoryboard, setIsLoadingStoryboard] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [storyboardPanels, setStoryboardPanels] = useState<StoryboardPanel[]>([]);

    // Detailed view modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [detailedPanels, setDetailedPanels] = useState<DetailedStoryboardPanel[]>([]);
    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalError, setModalError] = useState<string | null>(null);
    const [originalSceneDescription, setOriginalSceneDescription] = useState<string>();
    const [expandingSceneIndex, setExpandingSceneIndex] = useState<number | null>(null);

    // Video generation state
    const [isBatchGenerating, setIsBatchGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0 });
    
    // Gallery State
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Initialize DB on component mount
        dbService.initDB();
        loadProjectsForGallery();
    }, []);

    const loadProjectsForGallery = async () => {
        const savedProjects = await dbService.getProjects();
        setProjects(savedProjects);
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

        // Reset transient states
        setError(null);
        setIsLoadingDescription(false);
        setIsLoadingStoryboard(false);
        setIsBatchGenerating(false);
        setGenerationProgress({ current: 0, total: 0 });
    };

    const handleLoadProject = async (projectId: string) => {
        try {
            const projectState = await dbService.getProjectState(projectId);
            if (projectState) {
                applyState(projectState);
                setIsGalleryOpen(false);
            } else {
                console.error("Project state not found");
                setError("Could not load the project. It might have been deleted.");
            }
        } catch (err: any) {
            console.error("Failed to load project:", err);
            setError(`Failed to load project: ${err.message}`);
        }
    };

    const handleSaveProject = async () => {
        const title = mode === AppMode.DESCRIPTION ? productName : storyIdea;
        if (!title.trim()) {
            alert("Please provide a product name or story idea to save the project.");
            return;
        }

        setIsSaving(true);
        const currentState: AppState = {
            mode,
            productName,
            keyFeatures,
            targetAudience,
            tone,
            storyIdea,
            storyboardConfig,
            description,
            storyboardPanels,
        };
        
        try {
            await dbService.saveProject(currentState);
            await loadProjectsForGallery(); // Refresh gallery list
        } catch (err: any) {
            setError(`Failed to save project: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDeleteProject = async (projectId: string) => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            try {
                await dbService.deleteProject(projectId);
                await loadProjectsForGallery(); // Refresh gallery
            } catch (err: any) {
                 setError(`Failed to delete project: ${err.message}`);
            }
        }
    };


    const resetState = (isModeChange: boolean = false) => {
        setIsLoadingDescription(false);
        setIsLoadingStoryboard(false);
        setError(null);
        setDescription('');
        setStoryboardPanels([]);
        setIsModalOpen(false);
        setDetailedPanels([]);
        setIsModalLoading(false);
        setModalError(null);
        setExpandingSceneIndex(null);
        setIsBatchGenerating(false);
        setGenerationProgress({ current: 0, total: 0 });
        if (isModeChange) {
            setProductName('');
            setKeyFeatures('');
            setTargetAudience('');
            setTone(Tone.PROFESSIONAL);
            setStoryIdea('');
            setStoryboardConfig({
                sceneCount: 4,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.SHORT,
                mood: Mood.FAST_PACED,
            });
        }
    };

    const handleModeChange = (newMode: AppMode) => {
        if (newMode !== mode) {
            setMode(newMode);
            resetState(true);
        }
    };

    const generateImagesForPanels = async (panelsData: {description: string}[], config: StoryboardConfig) => {
        const initialPanels: StoryboardPanel[] = panelsData.map(p => ({
            description: p.description,
            imageUrl: '',
            isLoadingImage: true
        }));
        setStoryboardPanels(initialPanels);

        // Generate images sequentially with a delay to respect API rate limits
        for (let i = 0; i < initialPanels.length; i++) {
            const panel = initialPanels[i];
            try {
                const imageUrl = await geminiService.generateImageForPanel(panel.description, config.visualStyle, config.aspectRatio);
                setStoryboardPanels(prev => prev.map((p, index) => index === i ? { ...p, imageUrl, isLoadingImage: false } : p));
            } catch (err) {
                console.error(`Failed to generate image for panel ${i}:`, err);
                setStoryboardPanels(prev => prev.map((p, index) => index === i ? { ...p, imageUrl: 'error', isLoadingImage: false } : p));
            }
            
            // Add a delay between requests to avoid hitting rate limits.
            if (i < initialPanels.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
            }
        }
    };

    const handleGenerateDescription = async () => {
        resetState();
        setIsLoadingDescription(true);
        try {
            const generatedDesc = await geminiService.generateDescription({
                productName,
                keyFeatures,
                targetAudience,
                tone,
            });
            setDescription(generatedDesc);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoadingDescription(false);
        }
    };
    
    const handleGenerateStoryboardFromDesc = async () => {
        if (!description) {
            setError("No description available to generate a storyboard from.");
            return;
        }
        setIsLoadingStoryboard(true);
        setStoryboardPanels([]);
        setError(null);
        try {
            const panelsData = await geminiService.generateStoryboardFromDescription(description, storyboardConfig.sceneCount);
            await generateImagesForPanels(panelsData, storyboardConfig);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred while generating the storyboard.');
        } finally {
            setIsLoadingStoryboard(false);
        }
    };

     const handleGenerateStoryboardFromIdea = async () => {
        resetState(false); // keep settings but clear results
        setIsLoadingStoryboard(true);
        try {
            const panelsData = await geminiService.generateStoryboardFromIdea(storyIdea, storyboardConfig);
            await generateImagesForPanels(panelsData, storyboardConfig);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoadingStoryboard(false);
        }
    };
    
    const handleExpandScene = async (sceneDescription: string, index: number) => {
        setIsModalOpen(true);
        setIsModalLoading(true);
        setModalError(null);
        setDetailedPanels([]);
        setOriginalSceneDescription(sceneDescription);
        setExpandingSceneIndex(index);

        try {
            const detailedPanelsData = await geminiService.expandSceneToDetailedPanels(sceneDescription);
            const initialDetailedPanels: DetailedStoryboardPanel[] = detailedPanelsData.map(p => ({
                description: p.description,
                imageUrl: '',
                isLoadingImage: true,
            }));
            setDetailedPanels(initialDetailedPanels);
            setIsModalLoading(false);

            // Also generate these images sequentially with a delay
            for (let i = 0; i < initialDetailedPanels.length; i++) {
                const panel = initialDetailedPanels[i];
                try {
                    const imageUrl = await geminiService.generateImageForPanel(panel.description, storyboardConfig.visualStyle, storyboardConfig.aspectRatio);
                    setDetailedPanels(prev => prev.map((p, idx) => idx === i ? { ...p, imageUrl, isLoadingImage: false } : p));
                } catch (err) {
                    setDetailedPanels(prev => prev.map((p, idx) => idx === i ? { ...p, imageUrl: 'error', isLoadingImage: false } : p));
                }
                
                // Add a delay between requests to avoid hitting rate limits.
                if (i < initialDetailedPanels.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
                }
            }

        } catch (err: any) {
            setModalError(err.message || 'Failed to expand scene.');
            setIsModalLoading(false);
        }
    };

    const handleSaveChangesFromModal = (editedPanels: DetailedStoryboardPanel[]) => {
        if (expandingSceneIndex === null) return;

        const newStoryboardPanels = [...storyboardPanels];
        newStoryboardPanels.splice(expandingSceneIndex, 1, ...editedPanels as StoryboardPanel[]);
        
        setStoryboardPanels(newStoryboardPanels);
        setIsModalOpen(false);
        setExpandingSceneIndex(null);
    };

    const handleGenerateVideo = async () => {
        const panelsToProcess = storyboardPanels.filter(p => p.imageUrl && p.imageUrl !== 'error');
        if (panelsToProcess.length === 0) return;

        setIsBatchGenerating(true);
        setGenerationProgress({ current: 0, total: panelsToProcess.length });
        
        const processingDescriptions = new Set(panelsToProcess.map(p => p.description));
        setStoryboardPanels(prev => 
            prev.map(p => processingDescriptions.has(p.description) ? { ...p, isLoadingVideo: true, videoUrl: undefined } : p)
        );

        let currentCount = 0;
        for (const panel of panelsToProcess) {
            try {
                // The imageUrl is a base64 or blob URL, which needs to be converted to base64 string for the API.
                const imageBase64 = await dbService.urlToBase64(panel.imageUrl);
                const videoUrl = await geminiService.generateVideoForPanel(panel.description, imageBase64, storyboardConfig.visualStyle);
                
                setStoryboardPanels(prev => 
                    prev.map(p => p.description === panel.description ? { ...p, videoUrl, isLoadingVideo: false } : p)
                );
            } catch (error) {
                console.error(`Failed to generate video for panel: ${panel.description}`, error);
                setStoryboardPanels(prev => 
                    prev.map(p => p.description === panel.description ? { ...p, isLoadingVideo: false, videoUrl: 'error' } : p)
                );
            }
            currentCount++;
            setGenerationProgress(prev => ({ ...prev, current: currentCount }));
        }
        
        setIsBatchGenerating(false);
    };

    const handleTrySample = () => {
        resetState();
        if (mode === AppMode.DESCRIPTION) {
            const sample = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
            setProductName(sample.productName);
            setKeyFeatures(sample.keyFeatures);
            setTargetAudience(sample.targetAudience);
            setTone(sample.tone);
        } else {
            const sample = sampleStoryIdeas[Math.floor(Math.random() * sampleStoryIdeas.length)];
            setStoryIdea(sample.idea);
            setStoryboardConfig(sample.config);
        }
    };

    const isGenerateVideoDisabled = isBatchGenerating || storyboardPanels.length === 0 || storyboardPanels.some(p => p.isLoadingImage) || !storyboardPanels.some(p => p.imageUrl && p.imageUrl !== 'error');
    
    const panelsWithClips = storyboardPanels.filter(p => p.videoUrl && p.videoUrl !== 'error');
    const totalPanelsForClips = storyboardPanels.filter(p => p.imageUrl && p.imageUrl !== 'error').length;
    const allClipsGenerated = !isBatchGenerating && panelsWithClips.length > 0 && panelsWithClips.length === totalPanelsForClips;

    return (
        <div className="bg-slate-900 min-h-screen text-white font-sans">
            <main className="container mx-auto px-4 py-8 sm:py-16">
                <Header mode={mode} onOpenGallery={() => setIsGalleryOpen(true)} />
                <div className="mt-8 max-w-3xl mx-auto">
                    <ModeSwitcher mode={mode} setMode={handleModeChange} />
                </div>
                <div className="mt-4 text-center">
                    <button onClick={handleTrySample} disabled={isLoadingDescription || isLoadingStoryboard || isBatchGenerating} className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
                        ✨ Try a Sample
                    </button>
                </div>
                <div className="mt-6 max-w-3xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
                    {mode === AppMode.DESCRIPTION ? (
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
                            isLoading={isLoadingDescription}
                        />
                    ) : (
                        <StoryboardInputForm
                            storyIdea={storyIdea}
                            setStoryIdea={setStoryIdea}
                            config={storyboardConfig}
                            setConfig={setStoryboardConfig}
                            onSubmit={handleGenerateStoryboardFromIdea}
                            isLoading={isLoadingStoryboard}
                        />
                    )}
                </div>

                {error && !isLoadingDescription && !isLoadingStoryboard && (
                    <div className="mt-8 max-w-3xl mx-auto p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">
                        <p><span className="font-bold">Error:</span> {error}</p>
                    </div>
                )}

                {description && (
                    <div className="mt-8 max-w-3xl mx-auto animate-fade-in">
                        <DescriptionDisplay description={description} />
                    </div>
                )}

                {mode === AppMode.DESCRIPTION && description && storyboardPanels.length === 0 && (
                     <div className="mt-8 max-w-3xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl animate-slide-up">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4">Generate Storyboard from Description</h3>
                        <div className="space-y-6">
                            <StoryboardSettings config={storyboardConfig} setConfig={setStoryboardConfig} />
                            <div className="pt-2">
                                <button
                                    onClick={handleGenerateStoryboardFromDesc}
                                    disabled={isLoadingDescription || isLoadingStoryboard}
                                    className="w-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                                >
                                    {isLoadingStoryboard ? (
                                        <>
                                            <LoadingSpinner />
                                            <span className="ml-2">Generating Storyboard...</span>
                                        </>
                                    ) : (
                                        '🎨 Generate Storyboard'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {storyboardPanels.length > 0 && (
                    <div className="mt-8 max-w-5xl mx-auto">
                        <StoryboardDisplay panels={storyboardPanels} onExpandScene={handleExpandScene} />
                         <div className="mt-6 text-center">
                            <button
                                onClick={handleGenerateVideo}
                                disabled={isGenerateVideoDisabled}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {isBatchGenerating ? `🎬 Generating Clips (${generationProgress.current}/${generationProgress.total})...` : '🎥 Generate All Video Clips'}
                            </button>
                         </div>
                    </div>
                )}

                {allClipsGenerated && (
                     <div className="mt-8 max-w-5xl mx-auto animate-fade-in space-y-6">
                        <VideoDisplay panels={storyboardPanels} />
                        <div className="text-center">
                            <button
                                onClick={handleSaveProject}
                                disabled={isSaving}
                                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                               {isSaving ? '💾 Saving...' : '💾 Save to Gallery'}
                            </button>
                        </div>
                        <div className="text-center">
                            <button
                                disabled={true}
                                className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 opacity-50 cursor-not-allowed"
                            >
                                🎵 Generate Audio Track
                            </button>
                            <p className="text-xs text-slate-500 mt-2">BGM & Sound Effect generation is coming soon!</p>
                        </div>
                    </div>
                )}

                <DetailedStoryboardModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    panels={detailedPanels}
                    isLoading={isModalLoading}
                    error={modalError}
                    originalSceneDescription={originalSceneDescription}
                    onSaveChanges={handleSaveChangesFromModal}
                />

                <GalleryModal 
                    isOpen={isGalleryOpen}
                    onClose={() => setIsGalleryOpen(false)}
                    projects={projects}
                    onLoad={handleLoadProject}
                    onDelete={handleDeleteProject}
                />
            </main>
        </div>
    );
};

export default App;