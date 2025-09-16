
import React, { useState } from 'react';
import { MediaArtState, MediaArtStyle, MediaArtStyleParams, DataCompositionParams, DigitalNatureParams, AiDataSculptureParams, LightAndSpaceParams, KineticMirrorsParams, GenerativeBotanyParams, QuantumPhantasmParams, ArchitecturalProjectionParams } from '../types';
import { MEDIA_ART_STYLE_OPTIONS } from '../constants';
import { useTranslation } from '../i18n/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import RefreshIcon from './icons/RefreshIcon';
import DeleteIcon from './icons/DeleteIcon';
import DownloadIcon from './icons/DownloadIcon';

// Note: This component is intentionally simplified. Saving, exporting, and individual clip generation
// are omitted as per the user's focus on core generation flow and layout.

interface MediaArtGeneratorProps {
    state: MediaArtState;
    setState: React.Dispatch<React.SetStateAction<MediaArtState>>;
    onOpenImageSelector: () => void;
    onGenerateScenes: () => void;
    onRegenerateImage: (index: number) => void;
    onDeletePanel: (index: number) => void;
    isLoading: boolean;
    error: string | null;
}

const StyleParameterControls: React.FC<{
    style: MediaArtStyle;
    params: MediaArtStyleParams;
    onChange: (param: string, value: any) => void;
}> = ({ style, params, onChange }) => {
    const { t } = useTranslation();

    const renderSlider = (labelKey: string, paramName: string, value: number, min: number, max: number) => (
        <div>
            <label className="block text-xs font-medium text-slate-400">{t(`mediaArtParams.${labelKey}`)}: <span className="font-bold text-slate-300">{value}%</span></label>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(paramName, parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mt-1"
            />
        </div>
    );
    
    const renderSelect = (labelKey: string, paramName: string, value: string, options: {value: string, labelKey: string}[]) => (
        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{t(`mediaArtParams.${labelKey}`)}</label>
             <select
                value={value}
                onChange={(e) => onChange(paramName, e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                {options.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{t(`mediaArtParams.options.${o.labelKey}`)}</option>)}
            </select>
        </div>
    );

    switch (style) {
        case MediaArtStyle.DATA_COMPOSITION:
            const p1 = params as DataCompositionParams;
            return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {renderSlider('dataDensity', 'dataDensity', p1.dataDensity, 0, 100)}
                {renderSlider('glitchIntensity', 'glitchIntensity', p1.glitchIntensity, 0, 100)}
                {renderSelect('colorPalette', 'colorPalette', p1.colorPalette, 
                    [{value: 'monochrome', labelKey: 'monochrome'}, {value: 'binary', labelKey: 'binary'}, {value: 'signal_noise', labelKey: 'signalNoise'}])}
            </div>;
        
        case MediaArtStyle.DIGITAL_NATURE:
            const p2 = params as DigitalNatureParams;
            return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {renderSelect('particleSystem', 'particleSystem', p2.particleSystem, 
                    [{value: 'flowers', labelKey: 'flowers'}, {value: 'butterflies', labelKey: 'butterflies'}, {value: 'light_trails', labelKey: 'lightTrails'}, {value: 'leaves', labelKey: 'leaves'}])}
                {renderSlider('interactivity', 'interactivity', p2.interactivity, 0, 100)}
                {renderSlider('bloomEffect', 'bloomEffect', p2.bloomEffect, 0, 100)}
            </div>;

        case MediaArtStyle.AI_DATA_SCULPTURE:
            const p3 = params as AiDataSculptureParams;
            return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                 {renderSlider('fluidity', 'fluidity', p3.fluidity, 0, 100)}
                 {renderSelect('colorScheme', 'colorScheme', p3.colorScheme,
                    [{value: 'nebula', labelKey: 'nebula'}, {value: 'oceanic', labelKey: 'oceanic'}, {value: 'molten_metal', labelKey: 'moltenMetal'}, {value: 'crystal', labelKey: 'crystal'}])}
                {renderSlider('complexity', 'complexity', p3.complexity, 0, 100)}
            </div>;
        
        case MediaArtStyle.LIGHT_AND_SPACE:
            const p4 = params as LightAndSpaceParams;
            return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {renderSelect('pattern', 'pattern', p4.pattern,
                    [{value: 'strobes', labelKey: 'strobes'}, {value: 'grids', labelKey: 'grids'}, {value: 'waves', labelKey: 'waves'}, {value: 'beams', labelKey: 'beams'}])}
                {renderSlider('speed', 'speed', p4.speed, 0, 100)}
                {renderSelect('color', 'color', p4.color,
                    [{value: 'white', labelKey: 'white'}, {value: 'electric_blue', labelKey: 'electricBlue'}, {value: 'laser_red', labelKey: 'laserRed'}])}
            </div>;

        case MediaArtStyle.KINETIC_MIRRORS:
            const p5 = params as KineticMirrorsParams;
            return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {renderSlider('fragmentation', 'fragmentation', p5.fragmentation, 0, 100)}
                {renderSlider('motionSpeed', 'motionSpeed', p5.motionSpeed, 0, 100)}
                {renderSelect('reflection', 'reflection', p5.reflection,
                    [{value: 'sharp', labelKey: 'sharp'}, {value: 'distorted', labelKey: 'distorted'}, {value: 'prismatic', labelKey: 'prismatic'}])}
            </div>;

        case MediaArtStyle.GENERATIVE_BOTANY:
            const p6 = params as GenerativeBotanyParams;
            return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {renderSlider('growthSpeed', 'growthSpeed', p6.growthSpeed, 0, 100)}
                {renderSelect('plantType', 'plantType', p6.plantType,
                    [{value: 'alien_flora', labelKey: 'alienFlora'}, {value: 'crystal_flowers', labelKey: 'crystalFlowers'}, {value: 'glowing_fungi', labelKey: 'glowingFungi'}])}
                {renderSlider('density', 'density', p6.density, 0, 100)}
            </div>;
        
        case MediaArtStyle.QUANTUM_PHANTASM:
            const p7 = params as QuantumPhantasmParams;
            return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {renderSlider('particleSize', 'particleSize', p7.particleSize, 0, 100)}
                {renderSlider('shimmerSpeed', 'shimmerSpeed', p7.shimmerSpeed, 0, 100)}
                {renderSelect('colorPalette', 'colorPalette', p7.colorPalette,
                    [{value: 'ethereal', labelKey: 'ethereal'}, {value: 'iridescent', labelKey: 'iridescent'}, {value: 'void', labelKey: 'void'}])}
            </div>;

        case MediaArtStyle.ARCHITECTURAL_PROJECTION:
            const p8 = params as ArchitecturalProjectionParams;
            return <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                {renderSlider('deconstruction', 'deconstruction', p8.deconstruction, 0, 100)}
                {renderSelect('lightSource', 'lightSource', p8.lightSource,
                    [{value: 'internal', labelKey: 'internal'}, {value: 'external', labelKey: 'external'}, {value: 'volumetric', labelKey: 'volumetric'}])}
                {renderSelect('texture', 'texture', p8.texture,
                    [{value: 'wireframe', labelKey: 'wireframe'}, {value: 'holographic', labelKey: 'holographic'}, {value: 'concrete', labelKey: 'concrete'}])}
            </div>;

        default:
            return null;
    }
};


const MediaArtGenerator: React.FC<MediaArtGeneratorProps> = ({ state, setState, onOpenImageSelector, onGenerateScenes, onRegenerateImage, onDeletePanel, isLoading, error }) => {
    const { t } = useTranslation();
    const { sourceImage, style, styleParams, panels } = state;
    // FIX: Add `useState` to React import to fix reference error.
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const handleStyleChange = (newStyle: MediaArtStyle) => {
        const styleOption = MEDIA_ART_STYLE_OPTIONS.find(opt => opt.value === newStyle);
        setState(s => ({
            ...s,
            style: newStyle,
            styleParams: styleOption ? styleOption.defaultParams : s.styleParams
        }));
    };

    const handleParamChange = (param: string, value: any) => {
        setState(s => ({
            ...s,
            styleParams: {
                ...(s.styleParams as any),
                [param]: value,
            },
        }));
    };

    const allImagesLoaded = panels.length > 0 && panels.every(p => p.imageUrl && !p.isLoadingImage);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- Left Column: Image --- */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-200">{t('mediaArt.sourceImageTitle')}</h3>
                     <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 min-h-[28rem] flex flex-col justify-center">
                        {sourceImage ? (
                            <div className="flex flex-col items-center text-center">
                                <div className="w-full max-w-sm rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={sourceImage.url} alt={sourceImage.title} className="w-full h-full object-cover aspect-square"/>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-bold text-lg text-white">{sourceImage.title}</h4>
                                    {sourceImage.artist && <p className="text-sm text-slate-400">{sourceImage.artist}</p>}
                                    <button
                                        onClick={onOpenImageSelector}
                                        className="mt-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                                    >
                                        {t('mediaArt.changeImage')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={onOpenImageSelector}
                                className="w-full h-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border-2 border-dashed border-slate-600 font-medium py-10 px-4 rounded-lg transition-colors flex flex-col items-center justify-center"
                            >
                                <span className="text-lg">{t('mediaArt.selectImageCTA')}</span>
                                <span className="text-sm text-slate-400 mt-1">{t('mediaArt.selectImageHint')}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* --- Right Column: Style --- */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-200">{t('mediaArt.styleTitle')}</h3>
                    <div className="space-y-2">
                        {MEDIA_ART_STYLE_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleStyleChange(option.value)}
                                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-4 ${style === option.value ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}
                            >
                                <span className="text-2xl">{option.icon}</span>
                                <div>
                                    <h4 className="font-semibold text-slate-200 text-sm">{t(`mediaArtStyles.${option.labelKey}`)}</h4>
                                    <p className="text-xs text-slate-400">{t(`mediaArtStyles.${option.descriptionKey}`)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Full Width: Parameters --- */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-200">{t('mediaArt.paramsTitle')}</h3>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <StyleParameterControls style={style} params={styleParams} onChange={handleParamChange} />
                </div>
            </div>

            {/* --- Full Width: Action Button --- */}
            <div className="pt-2">
                 <button
                    onClick={onGenerateScenes}
                    disabled={isLoading || !sourceImage}
                    className="w-full sm:w-auto flex-grow flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">{t('mediaArt.generating')}</span>
                        </>
                    ) : (
                       t('mediaArt.generateScenes')
                    )}
                </button>
            </div>
            
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            
            {/* --- Full Width: Results --- */}
            {(isLoading || panels.length > 0) && (
                 <div className="mt-8">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-slate-200">{t('mediaArt.resultsTitle')}</h2>
                        <button
                            onClick={() => { /* PDF Export Logic Here */ }}
                            disabled={!allImagesLoaded || isExportingPdf}
                            className="flex items-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExportingPdf ? (
                                <>
                                    <LoadingSpinner />
                                    <span className="ml-2">{t('mediaArt.exportingPdf')}</span>
                                </>
                            ) : (
                                <>
                                    <DownloadIcon className="w-4 h-4" />
                                    <span className="ml-2">{t('mediaArt.exportPdf')}</span>
                                </>
                            )}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading && panels.length === 0 && Array.from({ length: 4 }).map((_, index) => (
                             <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg shadow-lg">
                                <div className="aspect-video bg-slate-800 flex items-center justify-center">
                                    <div className="flex flex-col items-center text-slate-400">
                                        <LoadingSpinner />
                                        <p className="text-xs mt-2">{t('storyboardDisplay.drawingPanel', { index: index + 1 })}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-800/40">
                                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}

                        {panels.map((panel, index) => (
                             <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-lg">
                                <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                                    {panel.isLoadingImage && (
                                        <div className="flex flex-col items-center text-slate-400">
                                            <LoadingSpinner />
                                            <p className="text-xs mt-2">{t('storyboardDisplay.drawingPanel', { index: index + 1 })}</p>
                                        </div>
                                    )}
                                    {panel.imageUrl && panel.imageUrl !== 'error' && (
                                        <img src={panel.imageUrl} alt={`Media art panel ${index + 1}`} className="w-full h-full object-cover" />
                                    )}
                                     {panel.imageUrl === 'error' && (
                                        <div className="text-red-400 text-center p-4">
                                            <p className="font-semibold">Oops!</p>
                                            <p className="text-xs">{t('storyboardDisplay.imageError')}</p>
                                        </div>
                                    )}
                                </div>
                                 <div className="p-4 flex-grow flex flex-col bg-slate-800/40">
                                    <p className="text-sm text-slate-300 leading-relaxed flex-grow">{panel.description}</p>
                                    <div className="mt-4 flex justify-end items-center space-x-2">
                                        <button
                                            onClick={() => onRegenerateImage(index)}
                                            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={t('storyboardDisplay.regenerateImage')}
                                            disabled={panel.isLoadingImage}
                                        >
                                            <RefreshIcon className="w-4 h-4 text-slate-300" />
                                        </button>
                                        <button
                                            onClick={() => onDeletePanel(index)}
                                            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={t('storyboardDisplay.deletePanel')}
                                        >
                                            <DeleteIcon className="w-4 h-4 text-slate-300 hover:text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}
        </div>
    );
};

export default MediaArtGenerator;
