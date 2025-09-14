import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { StoryboardConfig } from '../types';
import StoryboardSettings from './StoryboardSettings';
import { useTranslation } from '../i18n/LanguageContext';
import SaveIcon from './icons/SaveIcon';
import DownloadIcon from './icons/DownloadIcon';

interface StoryboardInputFormProps {
    storyIdea: string;
    setStoryIdea: (value: string) => void;
    config: StoryboardConfig;
    setConfig: (config: StoryboardConfig) => void;
    onSubmit: () => void;
    isLoading: boolean;
    storyIdeaIsKorean: boolean;
    onSave: () => void;
    onExport: () => void;
    canSave: boolean;
}

const StoryboardInputForm: React.FC<StoryboardInputFormProps> = ({
    storyIdea,
    setStoryIdea,
    config,
    setConfig,
    onSubmit,
    isLoading,
    storyIdeaIsKorean,
    onSave,
    onExport,
    canSave,
}) => {
    const { t } = useTranslation();
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            <div>
                <label htmlFor="storyIdea" className="block text-sm font-medium text-slate-300 mb-2">
                    {t('storyboardForm.storyIdea')} <span className="text-red-400">*</span>
                </label>
                <textarea
                    id="storyIdea"
                    rows={4}
                    value={storyIdea}
                    onChange={(e) => setStoryIdea(e.target.value)}
                    placeholder={t('storyboardForm.storyIdeaPlaceholder')}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                ></textarea>
                 {storyIdeaIsKorean && <p className="text-xs text-cyan-400 mt-1">{t('common.koreanDetectedIdea')}</p>}
                <p className="text-xs text-slate-500 mt-1">{t('storyboardForm.storyIdeaHint')}</p>
            </div>
            
            <StoryboardSettings config={config} setConfig={setConfig} />

            <div className="pt-2 flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">{t('storyboardForm.loadingMessage')}</span>
                        </>
                    ) : (
                        t('storyboardForm.generateButton')
                    )}
                </button>
                <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={!canSave}
                        className="flex items-center justify-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('tooltips.saveToGallery')}
                    >
                        <SaveIcon className="w-5 h-5" />
                        <span className="hidden sm:inline ml-2">{t('common.saveToGallery')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onExport}
                        disabled={!canSave}
                        className="flex items-center justify-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('tooltips.exportProject')}
                    >
                        <DownloadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline ml-2">{t('common.export')}</span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default StoryboardInputForm;