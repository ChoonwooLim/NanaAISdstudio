import React, { useState, useEffect } from 'react';
import { StoryboardPanel } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface VideoDisplayProps {
    panels: StoryboardPanel[];
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ panels }) => {
    const { t } = useTranslation();
    const [currentClipIndex, setCurrentClipIndex] = useState(0);

    const validClipsData = React.useMemo(() => 
        panels.map((p, originalIndex) => ({
            ...p,
            originalIndex
        })).filter(p => p.videoUrl && p.videoUrl !== 'error')
    , [panels]);

    useEffect(() => {
        // Reset to the first clip if the list of panels changes.
        setCurrentClipIndex(0);
    }, [panels]);

    if (validClipsData.length === 0) {
        return null;
    }

    const handleVideoEnded = () => {
        setCurrentClipIndex(prevIndex => (prevIndex + 1) % validClipsData.length);
    };

    const handleSelectClip = (index: number) => {
        setCurrentClipIndex(index);
    }

    const currentClip = validClipsData[currentClipIndex];
    if (!currentClip) return null;

    return (
        <div className="mt-8 max-w-5xl mx-auto animate-fade-in">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">{t('videoDisplay.title')}</h2>
            <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4">
                <div className="aspect-video relative bg-black rounded-md">
                    <video 
                        key={currentClip.videoUrl} // Use key to force re-render and autoplay when src changes
                        controls 
                        autoPlay 
                        src={currentClip.videoUrl} 
                        onEnded={handleVideoEnded}
                        className="w-full h-full rounded-md" 
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {t('videoDisplay.playingScene', { current: currentClip.originalIndex + 1, total: panels.length })}
                    </div>
                </div>
                <div className="pt-4">
                    <p className="text-sm font-medium text-slate-300 mb-2">{t('videoDisplay.selectClip')}</p>
                    <div className="flex flex-wrap gap-2">
                        {validClipsData.map((clip, index) => {
                             const isActive = index === currentClipIndex;
                             return (
                                <button
                                    key={clip.originalIndex}
                                    onClick={() => handleSelectClip(index)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                                >
                                    {t('videoDisplay.sceneButton', { index: clip.originalIndex + 1 })}
                                </button>
                             )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoDisplay;