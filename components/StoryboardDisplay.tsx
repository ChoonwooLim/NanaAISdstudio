
import React from 'react';
import { StoryboardPanel } from '../types';
import LoadingSpinner from './LoadingSpinner';
import RefreshIcon from './icons/RefreshIcon';

const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

interface StoryboardDisplayProps {
    panels: StoryboardPanel[];
    onExpandScene: (sceneDescription: string, index: number) => void;
    onSceneDurationChange: (index: number, duration: number) => void;
    onRegenerateVideo: (index: number) => void;
    onRegenerateImage: (index: number) => void;
    onDeletePanel: (index: number) => void;
}

const StoryboardDisplay: React.FC<StoryboardDisplayProps> = ({ panels, onExpandScene, onSceneDurationChange, onRegenerateVideo, onRegenerateImage, onDeletePanel }) => {
    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Generated Storyboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {panels.map((panel, index) => (
                    <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-lg">
                        <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                            {panel.isLoadingImage && (
                                <div className="flex flex-col items-center text-slate-400">
                                    <LoadingSpinner />
                                    <p className="text-xs mt-2">Drawing panel {index + 1}...</p>
                                </div>
                            )}
                            {panel.imageUrl && panel.imageUrl !== 'error' && (
                                <img src={panel.imageUrl} alt={`Storyboard panel ${index + 1}: ${panel.description}`} className="w-full h-full object-cover" />
                            )}
                            {panel.imageUrl === 'error' && (
                                 <div className="text-red-400 text-center p-4 flex flex-col items-center justify-center h-full">
                                    <div>
                                        <p className="font-semibold">Oops!</p>
                                        <p className="text-xs">Could not generate image.</p>
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        <button
                                            onClick={() => onRegenerateImage(index)}
                                            className="flex items-center text-xs font-medium bg-yellow-600/50 hover:bg-yellow-600/80 text-yellow-200 py-1 px-2 rounded-md transition-colors"
                                            title="Regenerate image"
                                        >
                                            <RefreshIcon className="w-3 h-3" />
                                            <span className="ml-1.5">Regenerate</span>
                                        </button>
                                        <button
                                            onClick={() => onDeletePanel(index)}
                                            className="flex items-center text-xs font-medium bg-red-600/50 hover:bg-red-600/80 text-red-200 py-1 px-2 rounded-md transition-colors"
                                            title="Delete panel"
                                        >
                                            <DeleteIcon className="w-3 h-3" />
                                            <span className="ml-1.5">Delete</span>
                                        </button>
                                    </div>
                                 </div>
                            )}
                        </div>
                        <div className="p-4 flex-grow flex flex-col bg-slate-800/40">
                            <p className="text-sm text-slate-300 leading-relaxed flex-grow">{panel.description}</p>
                            
                            <div className="mt-4 flex justify-between items-center gap-4">
                                {!panel.isLoadingImage && panel.imageUrl && panel.imageUrl !== 'error' ? (
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor={`duration-${index}`} className="text-xs text-slate-400 flex-shrink-0">Duration (s):</label>
                                        <input
                                            id={`duration-${index}`}
                                            type="number"
                                            min="2"
                                            max="10"
                                            value={panel.sceneDuration || 4}
                                            onChange={(e) => onSceneDurationChange(index, parseInt(e.target.value, 10))}
                                            className="w-16 bg-slate-700/50 border border-slate-600 rounded-md px-2 py-1 text-xs text-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                ) : <div />}
                                <button
                                    onClick={() => onExpandScene(panel.description, index)}
                                    className="bg-teal-600/50 hover:bg-teal-600/80 border border-teal-500/60 text-teal-200 text-xs font-semibold py-1.5 px-3 rounded-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!panel.imageUrl || panel.imageUrl === 'error'}
                                >
                                   🎬 Expand Scene
                                </button>
                            </div>
                        </div>
                         {(panel.isLoadingVideo || panel.videoUrl) && (
                            <div className="border-t border-slate-700 p-3 bg-slate-900/50">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xs font-semibold text-slate-400">Video Clip</h4>
                                    {panel.videoUrl && (
                                        <button
                                            onClick={() => onRegenerateVideo(index)}
                                            disabled={panel.isLoadingVideo}
                                            className="flex items-center text-xs font-medium bg-cyan-600/50 hover:bg-cyan-600/80 text-cyan-200 py-1 px-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Regenerate this video clip"
                                        >
                                            <RefreshIcon className={`w-3 h-3 ${panel.isLoadingVideo ? 'animate-spin' : ''}`} />
                                            <span className="ml-1.5">{panel.isLoadingVideo ? 'Generating...' : 'Regenerate'}</span>
                                        </button>
                                    )}
                                </div>
                                <div className="aspect-video bg-slate-800 rounded-md flex items-center justify-center">
                                    {panel.isLoadingVideo && !panel.videoUrl && (
                                        <div className="flex items-center text-slate-400">
                                            <LoadingSpinner />
                                            <p className="text-xs ml-2">Generating clip...</p>
                                        </div>
                                    )}
                                    {panel.videoUrl && panel.videoUrl === 'error' && (
                                        <div className="text-red-400 text-center">
                                            <p className="text-xs font-semibold">Clip generation failed.</p>
                                        </div>
                                    )}
                                     {panel.videoUrl && panel.videoUrl !== 'error' && (
                                        <video controls src={panel.videoUrl} className="w-full h-full rounded-md" />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryboardDisplay;
