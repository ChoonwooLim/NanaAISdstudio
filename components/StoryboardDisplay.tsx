import React from 'react';
import { StoryboardPanel } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../i18n/LanguageContext';
import RefreshIcon from './icons/RefreshIcon';
import DeleteIcon from './icons/DeleteIcon';
import DownloadIcon from './icons/DownloadIcon';

interface StoryboardDisplayProps {
    panels: StoryboardPanel[];
    storyIdea: string;
    onExpandScene: (sceneDescription: string, index: number) => void;
    onSceneDurationChange: (index: number, duration: number) => void;
    onRegenerateVideo: (index: number) => void;
    onRegenerateImage: (index: number) => void;
    onDeletePanel: (index: number) => void;
    isGeneratingImages: boolean;
    onExportPdf: () => void;
    isExportingPdf: boolean;
}

const StoryboardDisplay: React.FC<StoryboardDisplayProps> = ({
    panels,
    storyIdea,
    onExpandScene,
    onSceneDurationChange,
    onRegenerateVideo,
    onRegenerateImage,
    onDeletePanel,
    isGeneratingImages,
    onExportPdf,
    isExportingPdf
}) => {
    const { t } = useTranslation();

    if (panels.length === 0 && !isGeneratingImages) {
        return null;
    }

    const totalDuration = panels.reduce((acc, panel) => acc + (panel.sceneDuration || 4), 0);
    const canExportPdf = panels.length > 0 && !panels.some(p => !p.imageUrl || p.imageUrl === 'error');

    return (
        <div className="mt-8 animate-fade-in">
            <div className="mb-6 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-200">{t('storyboardDisplay.title')}</h2>
                        <p className="text-sm text-slate-400 mt-1">"{storyIdea}"</p>
                    </div>
                    <button
                        onClick={onExportPdf}
                        disabled={!canExportPdf || isExportingPdf}
                        className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExportingPdf ? (
                            <>
                                <LoadingSpinner />
                                <span>{t('storyboardDisplay.exportingPdf')}</span>
                            </>
                        ) : (
                            <>
                                <DownloadIcon className="w-4 h-4" />
                                <span>{t('storyboardDisplay.exportPdf')}</span>
                            </>
                        )}
                    </button>
                </div>
                <div className="mt-3 text-xs text-slate-500 flex items-center gap-4">
                    <span>{t('storyboardDisplay.scenes', { count: panels.length })}</span>
                    <span>{t('storyboardDisplay.estimatedLength', { duration: totalDuration })}</span>
                </div>
            </div>

            {isGeneratingImages && panels.every(p => p.isLoadingImage) && (
                 <div className="flex flex-col items-center justify-center text-slate-400 py-12">
                    <LoadingSpinner />
                    <p className="mt-3 text-sm text-center whitespace-pre-wrap">{t('storyboardDisplay.generatingScenes')}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {panels.map((panel, index) => (
                    <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
                        <div className="relative aspect-video bg-slate-800 flex items-center justify-center">
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">
                                {t('storyboardDisplay.scene', { index: index + 1 })}
                            </div>
                             {panel.isLoadingImage && (
                                <div className="flex flex-col items-center text-slate-400">
                                    <LoadingSpinner />
                                    <p className="text-xs mt-2">{t('storyboardDisplay.generatingImage')}</p>
                                </div>
                            )}
                            {panel.imageUrl && panel.imageUrl !== 'error' && panel.imageUrl !== 'quota_error' && (
                                <img src={panel.imageUrl} alt={`Panel ${index + 1}: ${panel.description}`} className="w-full h-full object-cover" />
                            )}
                            {panel.imageUrl === 'error' && (
                                <div className="text-red-400 text-center p-4">
                                    <p className="font-semibold">Oops!</p>
                                    <p className="text-xs">{t('storyboardDisplay.imageError')}</p>
                                </div>
                            )}
                             {panel.imageUrl === 'quota_error' && (
                                <div className="text-yellow-400 text-center p-4">
                                    <p className="font-semibold">{t('storyboardDisplay.quotaErrorTitle')}</p>
                                    <p className="text-xs mt-1">{t('storyboardDisplay.imageError')}</p>
                                    <p className="text-xs mt-1 text-slate-400">{t('storyboardDisplay.checkPlan')}</p>
                                </div>
                            )}

                            {panel.isLoadingVideo && (
                                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                                    <LoadingSpinner />
                                    <p className="text-sm mt-2">{t('storyboardDisplay.generatingClip')}</p>
                                    <p className="text-xs text-slate-400">{t('storyboardDisplay.generatingClipHint')}</p>
                                </div>
                            )}
                             {panel.videoUrl === 'error' && (
                                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-red-400 p-4 text-center">
                                    <p className="font-semibold">{t('storyboardDisplay.videoErrorTitle')}</p>
                                    <p className="text-xs mt-1">{panel.videoError || t('storyboardDisplay.videoError')}</p>
                                </div>
                            )}

                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                            <textarea
                                defaultValue={panel.description}
                                readOnly // For now, will implement editing later if needed
                                rows={3}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-xs text-slate-300 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            />
                        </div>
                        <div className="p-3 border-t border-slate-700 bg-slate-900/30 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <button onClick={() => onRegenerateImage(index)} title={t('tooltips.regenerateImage')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50" disabled={panel.isLoadingImage}>
                                    <RefreshIcon className="w-4 h-4 text-slate-300"/>
                                </button>
                                <button onClick={() => onRegenerateVideo(index)} title={t('tooltips.generateVideo')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50" disabled={panel.isLoadingVideo || !panel.imageUrl || panel.imageUrl === 'error' || panel.imageUrl === 'quota_error'}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                                </button>
                                <button onClick={() => onExpandScene(panel.description, index)} title={t('tooltips.expandScene')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50" disabled={panel.isLoadingImage}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"/><path d="M3 16.2V21h4.8"/><path d="M3 3h4.8v4.8"/><path d="M16.2 3H21v4.8"/></svg>
                                </button>
                                <button onClick={() => onDeletePanel(index)} title={t('tooltips.deletePanel')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                                    <DeleteIcon className="w-4 h-4 text-slate-300"/>
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <label htmlFor={`duration-${index}`} className="text-xs text-slate-400">{t('storyboardDisplay.duration')}</label>
                                <input 
                                    type="number" 
                                    id={`duration-${index}`} 
                                    value={panel.sceneDuration || 4} 
                                    onChange={(e) => onSceneDurationChange(index, parseInt(e.target.value, 10) || 4)}
                                    min="1" max="15"
                                    className="w-16 bg-slate-700 border border-slate-600 rounded-md px-2 py-1 text-xs text-center"
                                />
                                <span className="text-xs text-slate-500">s</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoryboardDisplay;