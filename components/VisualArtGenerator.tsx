import React from 'react';
import { VisualArtState, VisualArtEffect, MediaArtSourceImage } from '../types';
import { VISUAL_ART_EFFECT_OPTIONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../i18n/LanguageContext';
import ImageUploader from './ImageUploader';

interface VisualArtGeneratorProps {
    state: VisualArtState;
    setState: React.Dispatch<React.SetStateAction<VisualArtState>>;
    onGenerate: () => void;
}

const VisualArtGenerator: React.FC<VisualArtGeneratorProps> = ({ state, setState, onGenerate }) => {
    const { t } = useTranslation();
    const { inputText, effect, resultVideoUrl, isLoading, error, sourceImage } = state;

    const handleEffectChange = (newEffect: VisualArtEffect) => {
        setState(s => ({ ...s, effect: newEffect }));
    };
    
    const handleImageSelect = (image: MediaArtSourceImage) => {
        setState(s => ({ ...s, sourceImage: image, resultVideoUrl: null, error: null }));
    };

    const handleRemoveImage = () => {
        setState(s => ({ ...s, sourceImage: null }));
    };

    const isGenerateDisabled = isLoading || (!inputText.trim() && !sourceImage);

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-200">{t('visualArt.title')}</h2>
                <p className="text-sm text-slate-400 mt-2">{t('visualArt.instruction')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Image Input */}
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-400">
                        {t('visualArt.imageInputLabel')}
                    </label>
                    {sourceImage ? (
                        <div className="relative group">
                            <img src={sourceImage.url} alt={sourceImage.title} className="w-full rounded-xl shadow-lg" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                <button onClick={handleRemoveImage} className="bg-red-500/80 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors">
                                    {t('visualArt.removeImage')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <ImageUploader onImageSelect={handleImageSelect} />
                    )}
                </div>
                
                {/* Text Input */}
                <div className="space-y-2">
                    <label htmlFor="visual-art-input" className="block text-xs font-medium text-slate-400">
                        {t('visualArt.textInputLabel')}
                    </label>
                    <textarea
                        id="visual-art-input"
                        rows={5}
                        value={inputText}
                        onChange={(e) => setState(s => ({ ...s, inputText: e.target.value, resultVideoUrl: null, error: null }))}
                        placeholder={t('visualArt.textInputPlaceholder')}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
            </div>

            <div className="animate-fade-in space-y-8">
                {/* Effect Selection */}
                <div className="space-y-4">
                     <label className="block text-sm font-medium text-slate-300 text-center">{t('visualArt.styleTitle')}</label>
                     <div className="flex flex-wrap justify-center gap-3">
                        {VISUAL_ART_EFFECT_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleEffectChange(option.value)}
                                className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 text-left text-sm ${effect === option.value ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}
                            >
                                <span className="font-semibold text-slate-200">{t(`visualArtEffects.${option.labelKey}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Generate Button */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={onGenerate}
                        disabled={isGenerateDisabled}
                        className="w-full max-w-md mx-auto flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner />
                                <span className="ml-2">{t('visualArt.generating')}</span>
                            </>
                        ) : (
                            t('visualArt.generateButton')
                        )}
                    </button>
                </div>

                 {/* Result */}
                {(resultVideoUrl || isLoading || error) && (
                    <div className="space-y-4 pt-4">
                        <h3 className="text-xl font-semibold text-slate-200 text-center">{t('visualArt.resultTitle')}</h3>
                         <div className="relative max-w-lg mx-auto aspect-video bg-slate-900/70 border border-slate-700 rounded-2xl flex items-center justify-center">
                            {isLoading && (
                                <div className="text-center text-slate-400">
                                    <LoadingSpinner />
                                    <p className="text-sm mt-2">{t('storyboardDisplay.generatingClip')}</p>
                                    <p className="text-xs text-slate-500">{t('storyboardDisplay.generatingClipHint')}</p>
                                </div>
                            )}
                            {error && !isLoading && <p className="text-red-400 p-4 text-center">{error}</p>}
                            {resultVideoUrl && !isLoading && (
                                <video 
                                    src={resultVideoUrl} 
                                    controls 
                                    autoPlay
                                    loop
                                    className="w-full h-full object-contain rounded-2xl" 
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualArtGenerator;
