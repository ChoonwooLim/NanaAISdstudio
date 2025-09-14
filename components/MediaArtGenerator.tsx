import React, { useMemo } from 'react';
import { MediaArtState, FamousPainting, MediaArtStyle } from '../types';
import { MEDIA_ART_STYLE_OPTIONS } from '../constants';
import { useTranslation } from '../i18n/LanguageContext';
import LoadingSpinner from './LoadingSpinner';

interface MediaArtGeneratorProps {
    mediaArtState: MediaArtState;
    onStateChange: (newState: Partial<MediaArtState>) => void;
    paintings: FamousPainting[];
    onSubmit: () => void;
    isLoading: boolean;
    error: string | null;
}

const MediaArtGenerator: React.FC<MediaArtGeneratorProps> = ({
    mediaArtState,
    onStateChange,
    paintings,
    onSubmit,
    isLoading,
    error,
}) => {
    const { t } = useTranslation();
    const { selectedPaintingId, animationStyle, videoUrl } = mediaArtState;

    const selectedPainting = useMemo(() => {
        return paintings.find(p => p.id === selectedPaintingId) || null;
    }, [selectedPaintingId, paintings]);

    const handlePaintingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onStateChange({ selectedPaintingId: e.target.value, videoUrl: null });
    };

    const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onStateChange({ animationStyle: e.target.value as MediaArtStyle });
    };

    const isGenerationDisabled = isLoading || !selectedPaintingId;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Controls */}
                <div className="space-y-6">
                    <div>
                        <label htmlFor="paintingSelect" className="block text-sm font-medium text-slate-300 mb-2">
                            {t('mediaArtGenerator.selectPainting')}
                        </label>
                        <select
                            id="paintingSelect"
                            value={selectedPaintingId || ''}
                            onChange={handlePaintingChange}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                            <option value="" disabled>{t('mediaArtGenerator.pleaseSelect')}</option>
                            {paintings.map(painting => (
                                <option key={painting.id} value={painting.id} className="bg-slate-800 text-white">
                                    {t(painting.titleKey)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="animationStyle" className="block text-sm font-medium text-slate-300 mb-2">
                            {t('mediaArtGenerator.animationStyle')}
                        </label>
                        <select
                            id="animationStyle"
                            value={animationStyle}
                            onChange={handleStyleChange}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                            {MEDIA_ART_STYLE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-slate-800 text-white">
                                    {t(`mediaArtStyles.${opt.labelKey}`)}
                                </option>
                            ))}
                        </select>
                         <p className="text-xs text-slate-500 mt-1">
                            {t(`mediaArtStyles.${MEDIA_ART_STYLE_OPTIONS.find(o => o.value === animationStyle)?.descriptionKey || 'subtleMotionDesc'}`)}
                        </p>
                    </div>
                     <button
                        onClick={onSubmit}
                        disabled={isGenerationDisabled}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                <span className="ml-2">{t('common.generating')}</span>
                            </>
                        ) : (
                            `🎨 ${t('mediaArtGenerator.generateButton')}`
                        )}
                    </button>
                </div>

                {/* Preview & Result */}
                <div className="aspect-video bg-slate-900/50 border border-slate-700 rounded-lg flex items-center justify-center p-2">
                    {!selectedPainting && <p className="text-slate-500 text-sm">{t('mediaArtGenerator.selectToPreview')}</p>}
                    {selectedPainting && !videoUrl && !isLoading && (
                        <div className="w-full h-full relative">
                            <img src={selectedPainting.imageUrl} alt={t(selectedPainting.titleKey)} className="w-full h-full object-contain" />
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white p-2 rounded-md">
                                <p className="font-bold text-sm">{t(selectedPainting.titleKey)}</p>
                                <p className="text-xs">{t(selectedPainting.artistKey)}, {selectedPainting.year}</p>
                            </div>
                        </div>
                    )}
                    {isLoading && (
                        <div className="text-slate-400 text-center">
                            <LoadingSpinner />
                            <p className="text-sm mt-3">{t('mediaArtGenerator.loadingMessage')}</p>
                            <p className="text-xs text-slate-500 mt-1">{t('storyboardDisplay.generatingClipHint')}</p>
                        </div>
                    )}
                    {!isLoading && videoUrl && videoUrl !== 'error' && (
                        <video controls autoPlay loop src={videoUrl} className="w-full h-full rounded-md" />
                    )}
                     {!isLoading && videoUrl === 'error' && (
                        <div className="text-red-400 text-center p-4">
                            <p className="font-semibold">{t('common.errorPrefix')}</p>
                            <p className="text-sm mt-1">{error || t('storyboardDisplay.clipFailed')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaArtGenerator;
