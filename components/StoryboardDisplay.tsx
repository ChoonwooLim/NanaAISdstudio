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
                    <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
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
                        <div className="p-4 flex-grow flex flex-col">
                            <p className="text-sm text-slate-300 leading-relaxed flex-grow">{panel.description}</p>
                            <div className="mt-4 text-right">
                                <button
                                    onClick={() => onExpandScene(panel.description, index)}
                                    className="bg-teal-600/50 hover:bg-teal-600/80 border border-teal-500/60 text-teal-200 text-xs font-semibold py-1.5 px-3 rounded-md transition-all duration-200 transform hover:scale-105"
                                    disabled={!panel.imageUrl || panel.imageUrl === 'error'}
                                >
                                   🎬 Expand Scene
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryboardDisplay;