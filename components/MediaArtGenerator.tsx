import React from 'react';
import { MediaArtState, MediaArtStyle } from '../types';
import { MEDIA_ART_STYLE_OPTIONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../i18n/LanguageContext';
import VideoDisplay from './VideoDisplay';
import RefreshIcon from './icons/RefreshIcon';
import DeleteIcon from './icons/DeleteIcon';
import SaveIcon from './icons/SaveIcon';
import DownloadIcon from './icons/DownloadIcon';

interface MediaArtGeneratorProps {
    state: MediaArtState;
    setState: React.Dispatch<React.SetStateAction<MediaArtState>>;
    onOpenImageSelector: () => void;
    onGenerateScenes: () => void;
    onGenerateClip: (index: number) => void;
    onGenerateAllClips: () => void;
    onRegenerateImage: (index: number) => void;
    onDeletePanel: (index: number) => void;
    isLoading: boolean;
    error: string | null;
    onSave: () => void;
    onExport: () => void;
    canSave: boolean;
}

const MediaArtGenerator: React.FC<MediaArtGeneratorProps> = ({
    state,
    setState,
    onOpenImageSelector,
    onGenerateScenes,
    onGenerateClip,
    onGenerateAllClips,
    onRegenerateImage,
    onDeletePanel,
    isLoading,
    error,
    onSave,
    onExport,
    canSave,
}) => {
    const { t } = useTranslation();
    const { sourceImage, style, panels } = state;

    const handleStyleChange = (newStyle: MediaArtStyle) => {
        setState(s => ({ ...s, style: newStyle }));
    };

    const isGenerateScenesDisabled = isLoading || !sourceImage;
    const hasGeneratedScenes = panels.length > 0;
    const areAllImagesGenerated = hasGeneratedScenes && panels.every(p => p.imageUrl && p.imageUrl !== 'error');
    const areAnyClipsGenerating = hasGeneratedScenes && panels.some(p => p.isLoadingVideo);
    
    return (
        <div className="space-y-8">
            {/* 1. Source Image & Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-300">
                        {t('mediaArt.sourceImageTitle')}
                    </label>
                    <div 
                        className="relative aspect-video w-full bg-slate-900/70 border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={onOpenImageSelector}
                    >
                        {sourceImage ? (
                            <>
                                <img src={sourceImage.url} alt={sourceImage.title} className="w-full h-full object-contain rounded-2xl p-2" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                                    <span className="text-white font-semibold">{t('mediaArt.changeImage')}</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-slate-500 p-4">
                                <p className="font-semibold">{t('mediaArt.selectImagePrompt')}</p>
                                <p className="text-sm mt-1">{t('mediaArt.selectImageSubprompt')}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-300">
                        {t('mediaArt.styleTitle')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {MEDIA_ART_STYLE_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleStyleChange(option.value)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${style === option.value ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}
                            >
                                <h4 className="font-semibold text-sm text-slate-200">{t(`mediaArtStyles.${option.labelKey}`)}</h4>
                                <p className="text-xs text-slate-400 mt-1">{t(`mediaArtStyles.${option.descriptionKey}`)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. Generate Scenes Button */}
            <div className="pt-2 flex items-center gap-4">
                <button
                    type="button"
                    onClick={onGenerateScenes}
                    disabled={isGenerateScenesDisabled}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading && !hasGeneratedScenes ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">{t('mediaArt.generatingScenes')}</span>
                        </>
                    ) : (
                        t('mediaArt.generateScenesButton')
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
             {error && <p className="text-sm text-red-400 text-center mt-4">{error}</p>}


            {/* 3. Generated Scenes */}
            {hasGeneratedScenes && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold text-slate-200">{t('mediaArt.generatedScenesTitle')}</h3>
                        <button
                            onClick={onGenerateAllClips}
                            disabled={!areAllImagesGenerated || areAnyClipsGenerating}
                            className="flex items-center text-sm font-medium bg-green-600/50 hover:bg-green-600/80 text-green-200 py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🎬 <span className="ml-2">{t('mediaArt.generateAllClips')}</span>
                        </button>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {panels.map((panel, index) => {
                             const isImageReady = panel.imageUrl && panel.imageUrl !== 'error';
                             return (
                                <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-lg">
                                    <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                                        {panel.isLoadingImage ? (
                                            <div className="flex flex-col items-center text-slate-400">
                                                <LoadingSpinner />
                                                <p className="text-xs mt-2">{t('mediaArt.generatingSceneImage')}</p>
                                            </div>
                                        ) : panel.imageUrl === 'error' ? (
                                            <div className="text-red-400 text-center p-4">
                                                <p className="font-semibold">{t('storyboardDisplay.imageError')}</p>
                                            </div>
                                        ) : panel.imageUrl ? (
                                            <img src={panel.imageUrl} alt={`Scene ${index + 1}`} className="w-full h-full object-cover" />
                                        ) : null}

                                        <div className="absolute top-2 right-2 flex items-center gap-2">
                                            <button onClick={() => onRegenerateImage(index)} className="p-1.5 bg-black/50 hover:bg-black/80 rounded-full transition-colors" title={t('storyboardDisplay.regenerateImage')}><RefreshIcon className="w-4 h-4 text-white" /></button>
                                            <button onClick={() => onDeletePanel(index)} className="p-1.5 bg-black/50 hover:bg-black/80 rounded-full transition-colors" title={t('storyboardDisplay.deletePanel')}><DeleteIcon className="w-4 h-4 text-white" /></button>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col bg-slate-800/40">
                                        <p className="text-sm text-slate-300 leading-relaxed flex-grow">{panel.description}</p>
                                    </div>
                                    {isImageReady && (
                                        <div className="border-t border-slate-700 p-3 bg-slate-900/50">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="text-xs font-semibold text-slate-400">{t('storyboardDisplay.videoClip')}</h4>
                                                {panel.videoUrl && panel.videoUrl !== 'error' ? (
                                                    <button onClick={() => onGenerateClip(index)} disabled={panel.isLoadingVideo} className="flex items-center text-xs font-medium bg-cyan-600/50 hover:bg-cyan-600/80 text-cyan-200 py-1 px-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                        <RefreshIcon className={`w-3 h-3 ${panel.isLoadingVideo ? 'animate-spin' : ''}`} />
                                                        <span className="ml-1.5">{panel.isLoadingVideo ? t('common.generating') : t('common.regenerate')}</span>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => onGenerateClip(index)} disabled={panel.isLoadingVideo} className="flex items-center text-xs font-medium bg-green-600/50 hover:bg-green-600/80 text-green-200 py-1 px-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                                        {panel.isLoadingVideo ? <><LoadingSpinner /><span className="ml-1.5">{t('common.generating')}</span></> : <>🎬<span className="ml-1.5">{t('storyboardDisplay.generateClip')}</span></>}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="aspect-video bg-slate-800 rounded-md flex items-center justify-center text-center">
                                                {panel.isLoadingVideo && (
                                                    <div className="text-slate-400">
                                                        <div className="inline-block"><LoadingSpinner /></div>
                                                        <p className="text-xs mt-2">{t('storyboardDisplay.generatingClip')}</p>
                                                        <p className="text-xs text-slate-500">{t('storyboardDisplay.generatingClipHint')}</p>
                                                    </div>
                                                )}
                                                {!panel.isLoadingVideo && panel.videoUrl === 'error' && (
                                                    <div className="text-red-400 p-2">
                                                        <p className="text-xs font-semibold">{t('storyboardDisplay.clipFailed')}</p>
                                                        {panel.videoError && <p className="text-xs mt-1 opacity-80">{panel.videoError}</p>}
                                                    </div>
                                                )}
                                                {!panel.isLoadingVideo && panel.videoUrl && panel.videoUrl !== 'error' && (
                                                    <video controls src={panel.videoUrl} className="w-full h-full rounded-md" />
                                                )}
                                                {!panel.isLoadingVideo && !panel.videoUrl && (
                                                    <div className="text-slate-500 text-xs">
                                                        {t('storyboardDisplay.generateClipPrompt')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            
            {/* 4. Final Video */}
            {areAllImagesGenerated && <VideoDisplay panels={panels} />}
        </div>
    );
};

export default MediaArtGenerator;