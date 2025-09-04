import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { StoryboardConfig, AspectRatio, VisualStyle, VideoLength, Mood } from '../types';
import { ASPECT_RATIO_OPTIONS, VISUAL_STYLE_OPTIONS, VIDEO_LENGTH_OPTIONS, MOOD_OPTIONS } from '../constants';

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
    const handleConfigChange = (field: keyof StoryboardConfig, value: any) => {
        setConfig({ ...config, [field]: value });
    };

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
            
            <fieldset>
                <legend className="block text-sm font-medium text-slate-300 mb-2">Advanced Settings</legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border border-slate-700 rounded-lg bg-slate-900/30">
                     <div>
                        <label htmlFor="sceneCount" className="block text-xs font-medium text-slate-400 mb-1">
                           Scenes
                        </label>
                        <input
                            id="sceneCount"
                            type="number"
                            min="2"
                            max="10"
                            value={config.sceneCount}
                            onChange={(e) => handleConfigChange('sceneCount', parseInt(e.target.value, 10))}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="aspectRatio" className="block text-xs font-medium text-slate-400 mb-1">
                           Aspect Ratio
                        </label>
                        <select
                            id="aspectRatio"
                            value={config.aspectRatio}
                            onChange={(e) => handleConfigChange('aspectRatio', e.target.value as AspectRatio)}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {ASPECT_RATIO_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="visualStyle" className="block text-xs font-medium text-slate-400 mb-1">
                           Visual Style
                        </label>
                        <select
                            id="visualStyle"
                            value={config.visualStyle}
                            onChange={(e) => handleConfigChange('visualStyle', e.target.value as VisualStyle)}
                             className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {VISUAL_STYLE_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="videoLength" className="block text-xs font-medium text-slate-400 mb-1">
                           Target Length
                        </label>
                        <select
                            id="videoLength"
                            value={config.videoLength}
                            onChange={(e) => handleConfigChange('videoLength', e.target.value as VideoLength)}
                             className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {VIDEO_LENGTH_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                    </div>
                     <div className="col-span-2 md:col-span-2">
                        <label htmlFor="mood" className="block text-xs font-medium text-slate-400 mb-1">
                           Mood & Pacing
                        </label>
                        <select
                            id="mood"
                            value={config.mood}
                            onChange={(e) => handleConfigChange('mood', e.target.value as Mood)}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {MOOD_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                    </div>
                </div>
            </fieldset>

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
