import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface VideoDisplayProps {
    videoUrl: string | null;
    isLoading: boolean;
    error: string | null;
    progressMessage: string;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ videoUrl, isLoading, error, progressMessage }) => {
    if (!videoUrl && !isLoading && !error) {
        return null; // Don't render anything if there's no activity
    }

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Generated Video</h2>
            <div className="aspect-video bg-slate-900/70 border border-slate-700 rounded-lg flex items-center justify-center p-4">
                {isLoading && (
                    <div className="text-center text-slate-400">
                        <LoadingSpinner />
                        <p className="mt-4 font-semibold">Generating Video</p>
                        <p className="text-sm mt-1">{progressMessage}</p>
                    </div>
                )}
                {error && !isLoading && (
                    <div className="text-red-400 text-center">
                        <p className="font-semibold">Video Generation Failed</p>
                        <p className="text-sm mt-1">{error}</p>
                    </div>
                )}
                {videoUrl && !isLoading && !error && (
                    <video controls src={videoUrl} className="w-full h-full rounded-md" />
                )}
            </div>
        </div>
    );
};

export default VideoDisplay;
