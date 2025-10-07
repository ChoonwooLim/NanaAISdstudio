import React from 'react';
import { ImageTransitionState, TransitionMedia, ImageTransitionStyle, VideoModelID } from '../types';
import { VIDEO_MODEL_OPTIONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../i18n/LanguageContext';
import UploadIcon from './icons/UploadIcon';

interface ImageTransitionGeneratorProps {
    state: ImageTransitionState;
    setState: React.Dispatch<React.SetStateAction<ImageTransitionState>>;
    onGenerate: (state: ImageTransitionState) => void;
}

const MediaDisplay: React.FC<{
    media: TransitionMedia;
    onRemove: () => void;
}> = ({ media, onRemove }) => {
    const { t } = useTranslation();
    return (
        <div className="relative group aspect-video">
            {media.type === 'image' ? (
                 <img src={media.url} alt={media.title} className="w-full h-full object-cover rounded-xl shadow-lg" />
            ) : (
                <video src={media.url} controls muted loop className="w-full h-full object-cover rounded-xl shadow-lg" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                <button onClick={onRemove} className="bg-red-500/80 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors">
                    {t('visualArt.removeImage')}
                </button>
            </div>
        </div>
    );
};

const MediaUploader: React.FC<{
    onMediaSelect: (media: TransitionMedia) => void;
    id: string;
}> = ({ onMediaSelect, id }) => {
    const { t } = useTranslation();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onMediaSelect({
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    url: reader.result as string,
                    title: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };
     return (
        <div className="w-full max-w-lg mx-auto">
            <label htmlFor={id} className="w-full aspect-video flex flex-col items-center justify-center gap-3 bg-slate-900/70 hover:bg-slate-800/80 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 cursor-pointer transition-colors">
                <UploadIcon className="w-10 h-10 text-slate-500" />
                <span className="font-semibold text-slate-300 text-center">{t('imageUploader.cta')}</span>
                <span className="text-sm text-slate-500 text-center">{t('imageUploader.hint')}</span>
            </label>
            <input id={id} type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={handleFileChange} />
        </div>
    );
};


const TRANSITION_STYLE_OPTIONS: { value: ImageTransitionStyle, titleKey: string, descriptionKey: string }[] = [
    { value: ImageTransitionStyle.MORPH, titleKey: 'imageTransition.styleOptions.morph.title', descriptionKey: 'imageTransition.styleOptions.morph.description' },
    { value: ImageTransitionStyle.PHYSICS_MORPH, titleKey: 'imageTransition.styleOptions.physicsMorph.title', descriptionKey: 'imageTransition.styleOptions.physicsMorph.description' },
    { value: ImageTransitionStyle.PARTICLE_DISSOLVE, titleKey: 'imageTransition.styleOptions.particleDissolve.title', descriptionKey: 'imageTransition.styleOptions.particleDissolve.description' },
    { value: ImageTransitionStyle.CINEMATIC_ZOOM, titleKey: 'imageTransition.styleOptions.cinematicZoom.title', descriptionKey: 'imageTransition.styleOptions.cinematicZoom.description' },
    { value: ImageTransitionStyle.FLUID_PAINT, titleKey: 'imageTransition.styleOptions.fluidPaint.title', descriptionKey: 'imageTransition.styleOptions.fluidPaint.description' },
];

const ImageTransitionGenerator: React.FC<ImageTransitionGeneratorProps> = ({ state, setState, onGenerate }) => {
    const { t } = useTranslation();
    const { startMedia, endMedia, prompt, style, resultVideoUrl, isLoading, error, videoModel } = state;

    const handleMediaSelect = (media: TransitionMedia, type: 'start' | 'end') => {
        if (type === 'start') {
            setState(s => ({ ...s, startMedia: media, resultVideoUrl: null, error: null }));
        } else {
            setState(s => ({ ...s, endMedia: media, resultVideoUrl: null, error: null }));
        }
    };

    const handleRemoveMedia = (type: 'start' | 'end') => {
        if (type === 'start') {
            setState(s => ({ ...s, startMedia: null }));
        } else {
            setState(s => ({ ...s, endMedia: null }));
        }
    };

    const handleStyleChange = (newStyle: ImageTransitionStyle) => {
        setState(s => ({ ...s, style: newStyle }));
    };

    const handleModelChange = (newModel: VideoModelID) => {
        setState(s => ({...s, videoModel: newModel}));
    };

    const isGenerateDisabled = isLoading || !startMedia || !endMedia;
    const selectedVideoModel = VIDEO_MODEL_OPTIONS.find(o => o.value === videoModel);

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-200">{t('imageTransition.title')}</h2>
                <p className="text-sm text-slate-400 mt-2">{t('imageTransition.instruction')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Start Media */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2 text-center">
                        {t('imageTransition.startImageLabel')}
                    </label>
                    {startMedia ? (
                        <MediaDisplay media={startMedia} onRemove={() => handleRemoveMedia('start')} />
                    ) : (
                        <MediaUploader onMediaSelect={(media) => handleMediaSelect(media, 'start')} id="start-media-uploader" />
                    )}
                </div>
                
                {/* End Media */}
                 <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300 mb-2 text-center">
                        {t('imageTransition.endImageLabel')}
                    </label>
                    {endMedia ? (
                        <MediaDisplay media={endMedia} onRemove={() => handleRemoveMedia('end')} />
                    ) : (
                        <MediaUploader onMediaSelect={(media) => handleMediaSelect(media, 'end')} id="end-media-uploader" />
                    )}
                </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2 max-w-2xl mx-auto">
                <label htmlFor="transition-prompt-input" className="block text-sm font-medium text-slate-300">
                    {t('imageTransition.promptLabel')}
                </label>
                <textarea
                    id="transition-prompt-input"
                    rows={3}
                    value={prompt}
                    onChange={(e) => setState(s => ({ ...s, prompt: e.target.value, resultVideoUrl: null, error: null }))}
                    placeholder={t('imageTransition.promptPlaceholder')}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
            </div>

            {/* Style Selection */}
            <div className="space-y-4 max-w-3xl mx-auto">
                <label className="block text-sm font-medium text-slate-300 text-center">{t('imageTransition.styleTitle')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {TRANSITION_STYLE_OPTIONS.map(option => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleStyleChange(option.value)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-center h-full flex flex-col items-center justify-center ${style === option.value ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                            title={t(option.descriptionKey)}
                        >
                            <span className="font-semibold text-sm text-slate-200">{t(option.titleKey)}</span>
                        </button>
                    ))}
                </div>
                <p className="text-center text-xs text-slate-500 mt-2">
                    {t(TRANSITION_STYLE_OPTIONS.find(opt => opt.value === style)!.descriptionKey)}
                </p>
            </div>

            {/* Video Model Selection */}
            <div className="space-y-2 max-w-sm mx-auto">
                <label htmlFor="transition-video-model" className="block text-sm font-medium text-slate-300 text-center">{t('imageTransition.videoModelLabel')}</label>
                <select
                    id="transition-video-model"
                    value={videoModel}
                    onChange={(e) => handleModelChange(e.target.value as VideoModelID)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-purple-500"
                >
                    {VIDEO_MODEL_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{t(o.labelKey)}</option>)}
                </select>
                {selectedVideoModel && <p className="text-xs text-slate-500 mt-1 text-center">{t(selectedVideoModel.descriptionKey)}</p>}
            </div>
            
            {/* Generate Button */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={() => onGenerate(state)}
                    disabled={isGenerateDisabled}
                    className="w-full max-w-md mx-auto flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">{t('imageTransition.generating')}</span>
                        </>
                    ) : (
                        t('imageTransition.generateButton')
                    )}
                </button>
            </div>

            {/* Result */}
            {(resultVideoUrl || isLoading || error) && (
                <div className="space-y-4 pt-4">
                    <h3 className="text-xl font-semibold text-slate-200 text-center">{t('imageTransition.resultTitle')}</h3>
                    <div className="relative max-w-2xl mx-auto aspect-video bg-slate-900/70 border border-slate-700 rounded-2xl flex items-center justify-center">
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
    );
};

export default ImageTransitionGenerator;