
import React from 'react';
import { StoryboardPanel } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface StoryboardDisplayProps {
    panels: StoryboardPanel[];
    onExpandScene: (sceneDescription: string, index: number) => void;
}

const StoryboardDisplay: React.FC<StoryboardDisplayProps> = ({ panels, onExpandScene }) => {
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
                                 <div className="text-red-400 text-center p-4">
                                    <p className="font-semibold">Oops!</p>
                                    <p className="text-xs">Could not generate image for this panel.</p>
                                 </div>
                            )}
                        </div>
                        <div className="p-4 flex-grow flex flex-col bg-slate-800/40">
                            <p className="text-sm text-slate-300 leading-relaxed flex-grow">{panel.description}</p>
                            <div className="mt-4 text-right">
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
                                <h4 className="text-xs font-semibold text-slate-400 mb-2">Video Clip</h4>
                                <div className="aspect-video bg-slate-800 rounded-md flex items-center justify-center">
                                    {panel.isLoadingVideo && (
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
