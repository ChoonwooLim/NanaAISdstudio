// FIX: Created this file to implement the Media Art generation feature, resolving module resolution errors.

import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { MEDIA_ART_STYLE_OPTIONS, FAMOUS_PAINTINGS } from '../constants';
import * as geminiService from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import UploadIcon from './icons/UploadIcon';
import { FamousPainting } from '../types';

const MediaArtGenerator: React.FC = () => {
    const { t } = useTranslation();
    const [sourceImage, setSourceImage] = useState<{ url: string; data: string; mime: string; } | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>(MEDIA_ART_STYLE_OPTIONS[0].value);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1];
                setSourceImage({
                    url: URL.createObjectURL(file),
                    data: base64String,
                    mime: file.type
                });
                setResultImage(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaintingSelect = async (painting: FamousPainting) => {
        try {
            const response = await fetch(painting.imageUrl);
            const blob = await response.blob();
            const file = new File([blob], `${painting.id}.jpg`, { type: blob.type });
            handleImageUpload(file);
        } catch (err) {
            console.error('Error fetching painting image:', err);
            setError(t('mediaArt.fetchError'));
        }
    };

    const generatePrompt = useCallback(() => {
        const style = MEDIA_ART_STYLE_OPTIONS.find(s => s.value === selectedStyle);
        const styleDesc = t(`mediaArt.styles.${style?.labelKey}.prompt`);
        return t('mediaArt.basePrompt', { style: styleDesc });
    }, [selectedStyle, t]);

    const handleSubmit = async () => {
        if (!sourceImage) {
            setError(t('mediaArt.noImageError'));
            return;
        }
        setIsLoading(true);
        setResultImage(null);
        setError(null);

        try {
            const prompt = generatePrompt();
            const result = await geminiService.generateMediaArt(prompt, sourceImage.data, sourceImage.mime);
            if (result.image) {
                setResultImage(`data:image/png;base64,${result.image}`);
            } else {
                throw new Error(t('mediaArt.noImageReturned'));
            }
        } catch (err: any) {
            console.error('Media Art generation failed:', err);
            setError(err.message || t('mediaArt.genericError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Image Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200">{t('mediaArt.sourceImageTitle')}</h3>
                    <div className="aspect-video bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-slate-400 relative overflow-hidden">
                        {sourceImage ? (
                            <img src={sourceImage.url} alt={t('mediaArt.sourceImageAlt')} className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center">
                                <UploadIcon className="w-10 h-10 mx-auto text-slate-500" />
                                <p className="mt-2 text-sm">{t('mediaArt.uploadPrompt')}</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-2 text-sm font-semibold text-blue-400 hover:text-blue-300"
                                >
                                    {t('mediaArt.browseFiles')}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        )}
                    </div>
                    <div className="space-y-3">
                        <p className="text-sm text-slate-400">{t('mediaArt.orSelectPainting')}</p>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                            {FAMOUS_PAINTINGS.slice(0, 5).map(painting => (
                                <button key={painting.id} onClick={() => handlePaintingSelect(painting)} className="aspect-square rounded-md overflow-hidden transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <img src={painting.imageUrl} alt={t(painting.titleKey)} className="w-full h-full object-cover" title={t(painting.titleKey)} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Result Display */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200">{t('mediaArt.resultImageTitle')}</h3>
                    <div className="aspect-video bg-slate-900/70 border border-slate-700 rounded-lg flex items-center justify-center text-slate-500 relative overflow-hidden">
                        {isLoading && (
                            <div className="text-center">
                                <LoadingSpinner />
                                <p className="mt-2 text-sm">{t('mediaArt.generating')}</p>
                            </div>
                        )}
                        {!isLoading && resultImage && (
                            <img src={resultImage} alt={t('mediaArt.resultImageAlt')} className="w-full h-full object-contain" />
                        )}
                        {!isLoading && !resultImage && (
                            <p className="text-sm">{t('mediaArt.resultWillAppear')}</p>
                        )}
                        {error && !isLoading && (
                             <div className="p-4 text-center text-red-400">
                                <p className="font-semibold">{t('common.errorPrefix')}</p>
                                <p className="text-xs">{error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">{t('mediaArt.styleSelectionTitle')}</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {MEDIA_ART_STYLE_OPTIONS.map(style => (
                            <button
                                key={style.value}
                                onClick={() => setSelectedStyle(style.value)}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${selectedStyle === style.value ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}
                            >
                                <h4 className="font-semibold text-slate-200">{t(`mediaArt.styles.${style.labelKey}.label`)}</h4>
                                <p className="text-xs text-slate-400 mt-1">{t(`mediaArt.styles.${style.labelKey}.description`)}</p>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="pt-2 flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !sourceImage}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                <span className="ml-2">{t('common.generating')}</span>
                            </>
                        ) : (
                            t('mediaArt.generateButton')
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MediaArtGenerator;
