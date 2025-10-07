import React, { useState } from 'react';
import StoryboardSettings from './StoryboardSettings';
import { StoryboardConfig } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../i18n/LanguageContext';
import { COST_PER_IMAGEN_IMAGE } from '../services/geminiService';

interface StoryboardInputFormProps {
    onGenerate: (idea: string, config: StoryboardConfig, oneByOne: boolean) => void;
    isLoading: boolean;
    config: StoryboardConfig;
    setConfig: (config: StoryboardConfig) => void;
    onShowSampleGallery: () => void;
}

const StoryboardInputForm: React.FC<StoryboardInputFormProps> = ({ onGenerate, isLoading, config, setConfig, onShowSampleGallery }) => {
    const { t } = useTranslation();
    const [idea, setIdea] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [generateOneByOne, setGenerateOneByOne] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim()) {
            onGenerate(idea, config, generateOneByOne);
        }
    };

    const estimatedCost = (config.sceneCount * COST_PER_IMAGEN_IMAGE).toFixed(2);
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="story-idea" className="block text-sm font-medium text-slate-300 mb-2">
                    {t('storyboardForm.ideaLabel')}
                </label>
                <textarea
                    id="story-idea"
                    rows={4}
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder={t('storyboardForm.ideaPlaceholder')}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            <div className="flex justify-between items-center flex-wrap gap-4">
                <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                >
                    {showSettings ? t('storyboardForm.hideSettings') : t('storyboardForm.showSettings')}
                </button>
                 <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                        <input
                        id="one-by-one-checkbox"
                        aria-describedby="one-by-one-description"
                        name="one-by-one"
                        type="checkbox"
                        checked={generateOneByOne}
                        onChange={(e) => setGenerateOneByOne(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-blue-600 focus:ring-blue-600"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="one-by-one-checkbox" className="font-medium text-slate-300">
                             {t('storyboardForm.oneByOneLabel')}
                        </label>
                        <p id="one-by-one-description" className="text-slate-500">
                            {t('storyboardForm.oneByOneDescription')}
                        </p>
                    </div>
                </div>
            </div>

            {showSettings && (
                <div className="animate-fade-in">
                    <StoryboardSettings config={config} setConfig={setConfig} />
                </div>
            )}
            
            {!generateOneByOne && (
                 <div className="p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg text-center text-xs text-yellow-300">
                    {t('storyboardForm.costWarning', { cost: estimatedCost })}
                </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button
                    type="submit"
                    disabled={isLoading || !idea.trim()}
                    className="w-full sm:w-auto flex-grow flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                           <LoadingSpinner />
                           <span className="ml-2">{t('storyboardForm.generating')}</span>
                        </>
                    ) : (
                       t('storyboardForm.generateButton')
                    )}
                </button>
                 <button
                    type="button"
                    onClick={onShowSampleGallery}
                    className="w-full sm:w-auto bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                    {t('storyboardForm.loadSample')}
                </button>
            </div>
        </form>
    );
};

export default StoryboardInputForm;
