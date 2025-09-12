
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { StoryboardConfig } from '../types';
import StoryboardSettings from './StoryboardSettings';

interface StoryboardInputFormProps {
    storyIdea: string;
    setStoryIdea: (value: string) => void;
    config: StoryboardConfig;
    setConfig: (config: StoryboardConfig) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const StoryboardInputForm: React.FC<StoryboardInputFormProps> = ({
    storyIdea,
    setStoryIdea,
    config,
    setConfig,
    onSubmit,
    isLoading,
}) => {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            <div>
                <label htmlFor="storyIdea" className="block text-sm font-medium text-slate-300 mb-2">
                    Story Idea <span className="text-red-400">*</span>
                </label>
                <textarea
                    id="storyIdea"
                    rows={4}
                    value={storyIdea}
                    onChange={(e) => setStoryIdea(e.target.value)}
                    placeholder="e.g., A mischievous squirrel steals a magician's wand and causes chaos in a city park."
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                ></textarea>
                <p className="text-xs text-slate-500 mt-1">Describe the story you want to visualize.</p>
            </div>
            
            <StoryboardSettings config={config} setConfig={setConfig} />

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">Generating Storyboard...</span>
                        </>
                    ) : (
                        '🎨 Generate Storyboard'
                    )}
                </button>
            </div>
        </form>
    );
};

export default StoryboardInputForm;