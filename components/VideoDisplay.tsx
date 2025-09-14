import React, { useState, useEffect } from 'react';
import { StoryboardPanel } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface VideoDisplayProps {
    panels: StoryboardPanel[];
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ panels }) => {
    const { t } = useTranslation();
    const validClips = panels.filter(p => p.videoUrl && p.videoUrl !== 'error');
    const [currentClipIndex, setCurrentClipIndex] = useState(0);

    useEffect(() => {
        // Reset to the first clip if the list of panels changes.
        setCurrentClipIndex(0);
    }, [panels]);

    if (validClips.length === 0) {
        return null;
    }

    const handleVideoEnded = () => {
        setCurrentClipIndex(prevIndex => (prevIndex + 1) % validClips.length);
    };

    const currentClip = validClips[currentClipIndex];
    if (!currentClip) return null; // Should not happen if validClips.length > 0

    // Find the original index to display the correct scene number
    const originalPanelIndex = panels.findIndex(p => p.description === currentClip.description);

    return (
        <div className="mt-8 max-w-5xl mx-auto animate-fade-in">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">{t('videoDisplay.title')}</h2>
            <div className="aspect-video bg-slate-900/70 border border-slate-700 rounded-lg flex flex-col items-center justify-center p-4 relative">
                <video 
                    key={currentClip.videoUrl} // Use key to force re-render and autoplay when src changes
                    controls 
                    autoPlay 
                    src={currentClip.videoUrl} 
                    onEnded={handleVideoEnded}
                    className="w-full h-full rounded-md" 
                />
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {t('videoDisplay.playingScene', { current: originalPanelIndex + 1, total: panels.length })}
                </div>
            </div>
        </div>
    );
};

export default VideoDisplay;