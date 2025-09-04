
import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import StoryboardInputForm from './components/StoryboardInputForm';
import ModeSwitcher from './components/ModeSwitcher';
import DescriptionDisplay from './components/DescriptionDisplay';
import StoryboardDisplay from './components/StoryboardDisplay';
import DetailedStoryboardModal from './components/DetailedStoryboardModal';
import VideoDisplay from './components/VideoDisplay';
import ApiKeyInstructions from './components/ApiKeyInstructions';
import { Tone, StoryboardPanel, DetailedStoryboardPanel, AppMode, StoryboardConfig, AspectRatio, VisualStyle, VideoLength, Mood } from './types';
import * as geminiService from './services/geminiService';
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
    const [isLoading, setIsLoading] = useState(false);
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
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [videoError, setVideoError] = useState<string|null>(null);
    const [videoUrl, setVideoUrl] = useState<string|null>(null);
    const [videoProgressMessage, setVideoProgressMessage] = useState('');

    const resetState = (isModeChange: boolean = false) => {
        setIsLoading(false);
        setError(null);
        setDescription('');
        setStoryboardPanels([]);
        setIsModalOpen(false);
        setDetailedPanels([]);
        setIsModalLoading(false);
        setModalError(null);
        setVideoUrl(null);
        setVideoError(null);
        setIsVideoLoading(false);
        setExpandingSceneIndex(null);
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

    const handleGenerateDescriptionAndFlow = async () => {
        resetState();
        setIsLoading(true);
        try {
            const generatedDesc = await geminiService.generateDescription({
                productName,
                keyFeatures,
                targetAudience,
                tone,
            });
            setDescription(generatedDesc);
            const panelsData = await geminiService.generateStoryboardFromDescription(generatedDesc);
            // For description flow, use default storyboard config
            await generateImagesForPanels(panelsData, {
                 sceneCount: 4,
                 aspectRatio: AspectRatio.LANDSCAPE,
                 visualStyle: VisualStyle.CINEMATIC,
                 videoLength: VideoLength.SHORT,
                 mood: Mood.FAST_PACED,
            });

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

     const handleGenerateStoryboardFromIdea = async () => {
        resetState();
        setIsLoading(true);
        try {
            const panelsData = await geminiService.generateStoryboardFromIdea(storyIdea, storyboardConfig);
            await generateImagesForPanels(panelsData, storyboardConfig);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
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
        // The editedPanels are DetailedStoryboardPanel, but are structurally identical to StoryboardPanel
        // so we can insert them directly.
        newStoryboardPanels.splice(expandingSceneIndex, 1, ...editedPanels as StoryboardPanel[]);
        
        setStoryboardPanels(newStoryboardPanels);
        setIsModalOpen(false);
        setExpandingSceneIndex(null);
    };

    const handleGenerateVideo = async () => {
        setIsVideoLoading(true);
        setVideoError(null);
        setVideoUrl(null);
        setVideoProgressMessage('Initializing video generation...');
        
        const validPanels = storyboardPanels.filter(p => p.imageUrl && p.imageUrl !== 'error');
        if (validPanels.length === 0) {
            setVideoError("Cannot generate video without at least one valid storyboard panel.");
            setIsVideoLoading(false);
            return;
        }

        try {
            setVideoProgressMessage('This can take a few minutes. Please wait...');
            const url = await geminiService.generateVideoFromStoryboard(validPanels);
            setVideoUrl(url);
        } catch (err: any) {
            setVideoError(err.message || 'An unknown error occurred during video generation.');
        } finally {
            setIsVideoLoading(false);
        }
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

    const isGenerateVideoDisabled = isVideoLoading || storyboardPanels.length === 0 || storyboardPanels.some(p => p.isLoadingImage) || !storyboardPanels.some(p => p.imageUrl && p.imageUrl !== 'error');

    return (
        <div className="bg-slate-900 min-h-screen text-white font-sans">
            <main className="container mx-auto px-4 py-8 sm:py-16">
                <Header mode={mode} />
                <div className="mt-8 max-w-3xl mx-auto">
                    <ModeSwitcher mode={mode} setMode={handleModeChange} />
                </div>
                <div className="mt-4 text-center">
                    <button onClick={handleTrySample} disabled={isLoading} className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
                        ✨ 샘플 데이터로 채우기
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
                            onSubmit={handleGenerateDescriptionAndFlow}
                            isLoading={isLoading}
                        />
                    ) : (
                        <StoryboardInputForm
                            storyIdea={storyIdea}
                            setStoryIdea={setStoryIdea}
                            config={storyboardConfig}
                            setConfig={setStoryboardConfig}
                            onSubmit={handleGenerateStoryboardFromIdea}
                            isLoading={isLoading}
                        />
                    )}
                </div>

                {error && !isLoading && (
                    <div className="mt-8 max-w-3xl mx-auto p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">
                        <p><span className="font-bold">Error:</span> {error}</p>
                    </div>
                )}

                {description && (
                    <div className="mt-8 max-w-3xl mx-auto">
                        <DescriptionDisplay description={description} />
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
                                {isVideoLoading ? '🎬 Rendering Video...' : '🎥 Generate Video'}
                            </button>
                         </div>
                    </div>
                )}

                <div className="max-w-5xl mx-auto">
                    <VideoDisplay 
                        videoUrl={videoUrl}
                        isLoading={isVideoLoading}
                        error={videoError}
                        progressMessage={videoProgressMessage}
                    />
                </div>

                <DetailedStoryboardModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    panels={detailedPanels}
                    isLoading={isModalLoading}
                    error={modalError}
                    originalSceneDescription={originalSceneDescription}
                    onSaveChanges={handleSaveChangesFromModal}
                />
            </main>
        </div>
    );
};

export default App;
