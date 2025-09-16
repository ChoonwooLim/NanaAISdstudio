import React from 'react';
import { 
    MediaArtState, 
    MediaArtStyle, 
    DataCompositionParams,
    DigitalNatureParams,
    AiDataSculptureParams,
    LightAndSpaceParams,
    KineticMirrorsParams,
    GenerativeBotanyParams,
    QuantumPhantasmParams,
    ArchitecturalProjectionParams,
    MediaArtStyleParams
} from '../types';
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

const StyleParameters: React.FC<{
    style: MediaArtStyle;
    params: MediaArtStyleParams;
    setParams: (params: MediaArtStyleParams) => void;
}> = ({ style, params, setParams }) => {
    const { t } = useTranslation();

    const handleParamChange = (key: string, value: any) => {
        setParams({ ...params, [key]: value });
    };

    const renderSlider = (key: string, label: string, value: number) => (
        <div>
            <label className="block text-xs font-medium text-slate-400">{label}</label>
            <div className="flex items-center gap-3">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => handleParamChange(key, parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-300 w-8 text-center">{value}</span>
            </div>
        </div>
    );
    
    const renderSelect = (key: string, label: string, value: string, options: {value: string, label: string}[]) => (
        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => handleParamChange(key, e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {options.map(opt => <option key={opt.value} value={opt.value} className="bg-slate-800">{opt.label}</option>)}
            </select>
        </div>
    )

    switch (style) {
        case MediaArtStyle.DATA_COMPOSITION:
            const p1 = params as DataCompositionParams;
            return (
                <div className="space-y-4">
                    {renderSlider('dataDensity', t('mediaArtParams.dataDensity'), p1.dataDensity)}
                    {renderSlider('glitchIntensity', t('mediaArtParams.glitchIntensity'), p1.glitchIntensity)}
                    {renderSelect('colorPalette', t('mediaArtParams.colorPalette'), p1.colorPalette, [
                        {value: 'monochrome', label: t('mediaArtParams.monochrome')},
                        {value: 'binary', label: t('mediaArtParams.binary')},
                        {value: 'signal_noise', label: t('mediaArtParams.signal_noise')}
                    ])}
                </div>
            );
        case MediaArtStyle.DIGITAL_NATURE:
            const p2 = params as DigitalNatureParams;
            return (
                <div className="space-y-4">
                    {renderSelect('particleSystem', t('mediaArtParams.particleSystem'), p2.particleSystem, [
                         {value: 'flowers', label: t('mediaArtParams.flowers')},
                         {value: 'butterflies', label: t('mediaArtParams.butterflies')},
                         {value: 'light_trails', label: t('mediaArtParams.light_trails')},
                         {value: 'leaves', label: t('mediaArtParams.leaves')}
                    ])}
                    {renderSlider('interactivity', t('mediaArtParams.interactivity'), p2.interactivity)}
                    {renderSlider('bloomEffect', t('mediaArtParams.bloomEffect'), p2.bloomEffect)}
                </div>
            );
        case MediaArtStyle.AI_DATA_SCULPTURE:
            const p3 = params as AiDataSculptureParams;
            return (
                 <div className="space-y-4">
                    {renderSlider('fluidity', t('mediaArtParams.fluidity'), p3.fluidity)}
                    {renderSlider('complexity', t('mediaArtParams.complexity'), p3.complexity)}
                    {renderSelect('colorScheme', t('mediaArtParams.colorScheme'), p3.colorScheme, [
                        {value: 'nebula', label: t('mediaArtParams.nebula')},
                        {value: 'oceanic', label: t('mediaArtParams.oceanic')},
                        {value: 'molten_metal', label: t('mediaArtParams.molten_metal')},
                        {value: 'crystal', label: t('mediaArtParams.crystal')}
                    ])}
                </div>
            );
         case MediaArtStyle.LIGHT_AND_SPACE:
            const p4 = params as LightAndSpaceParams;
            return (
                 <div className="space-y-4">
                    {renderSlider('speed', t('mediaArtParams.speed'), p4.speed)}
                     {renderSelect('pattern', t('mediaArtParams.pattern'), p4.pattern, [
                        {value: 'grids', label: t('mediaArtParams.grids')},
                        {value: 'beams', label: t('mediaArtParams.beams')},
                        {value: 'waves', label: t('mediaArtParams.waves')},
                        {value: 'strobes', label: t('mediaArtParams.strobes')}
                    ])}
                    {renderSelect('color', t('mediaArtParams.color'), p4.color, [
                        {value: 'white', label: t('mediaArtParams.white')},
                        {value: 'electric_blue', label: t('mediaArtParams.electric_blue')},
                        {value: 'laser_red', label: t('mediaArtParams.laser_red')}
                    ])}
                </div>
            );
        // ... add cases for other styles
        default:
            return null;
    }
};


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
    const { sourceImage, style, styleParams, panels } = state;

    const handleStyleChange = (newStyle: MediaArtStyle) => {
        const styleConfig = MEDIA_ART_STYLE_OPTIONS.find(opt => opt.value === newStyle);
        if (styleConfig) {
            setState(s => ({ 
                ...s, 
                style: newStyle,
                styleParams: styleConfig.defaultParams
            }));
        }
    };
    
    const handleParamsChange = (newParams: MediaArtStyleParams) => {
        setState(s => ({ ...s, styleParams: newParams }));
    };

    const isGenerateScenesDisabled = isLoading || !sourceImage;
    const hasGeneratedScenes = panels.length > 0;
    const areAllImagesGenerated = hasGeneratedScenes && panels.every(p => p.imageUrl && p.imageUrl !== 'error');
    const areAnyClipsGenerating = hasGeneratedScenes && panels.some(p => p.isLoadingVideo);
    
    const selectedStyleConfig = MEDIA_ART_STYLE_OPTIONS.find(opt => opt.value === style);

    return (
        <div className="space-y-8">
            {/* 1. Source Image & Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {MEDIA_ART_STYLE_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleStyleChange(option.value)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3 ${style === option.value ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}
                            >
                                <span className="text-2xl">{option.icon}</span>
                                <div>
                                    <h4 className="font-semibold text-sm text-slate-200">{t(`mediaArtStyles.${option.labelKey}`)}</h4>
                                    <p className="text-xs text-slate-400 mt-1">{t(`mediaArtStyles.${option.descriptionKey}`)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Style Parameters */}
             {selectedStyleConfig && (
                <div className="animate-fade-in bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4">{t('mediaArt.styleParameters')}</h3>
                    <StyleParameters style={style} params={styleParams} setParams={handleParamsChange} />
                </div>
            )}


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
