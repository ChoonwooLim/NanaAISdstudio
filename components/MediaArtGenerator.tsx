import React, { useState } from 'react';
import { MediaArtState, MediaArtStyle, MediaArtStyleParams, DataCompositionParams, DigitalNatureParams, AiDataSculptureParams, LightAndSpaceParams, KineticMirrorsParams, GenerativeBotanyParams, QuantumPhantasmParams, ArchitecturalProjectionParams } from '../types';
import { MEDIA_ART_STYLE_OPTIONS } from '../constants';
import { useTranslation } from '../i18n/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import UploadIcon from './icons/UploadIcon';
import RefreshIcon from './icons/RefreshIcon';
import DeleteIcon from './icons/DeleteIcon';
import DownloadIcon from './icons/DownloadIcon';

declare var jspdf: any;
declare var html2canvas: any;

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

    const renderSlider = (labelKey: string, paramName: string, value: number, min: number, max: number, step: number) => (
        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">{t(labelKey)} ({value}%)</label>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(paramName, parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
        </div>
    );

    const renderSelect = (labelKey: string, paramName: string, value: string, optionsKey: string) => {
        const options = t(`mediaArtParams.options.${optionsKey}`, {}) as any;
        return (
            <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">{t(labelKey)}</label>
                <select
                    value={value}
                    onChange={(e) => onChange(paramName, e.target.value)}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500"
                >
                    {Object.entries(options).map(([key, label]) => <option key={key} value={key} className="bg-slate-800">{label as string}</option>)}
                </select>
            </div>
        )
    };
    
    switch (style) {
        case MediaArtStyle.DATA_COMPOSITION: {
            const p = params as DataCompositionParams;
            return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSlider('mediaArtParams.dataDensity', 'dataDensity', p.dataDensity, 0, 100, 1)}
                {renderSlider('mediaArtParams.glitchIntensity', 'glitchIntensity', p.glitchIntensity, 0, 100, 1)}
                {renderSelect('mediaArtParams.colorPalette', 'colorPalette', p.colorPalette, 'dataCompositionPalettes')}
            </div>;
        }
        case MediaArtStyle.DIGITAL_NATURE: {
            const p = params as DigitalNatureParams;
             return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSlider('mediaArtParams.interactivity', 'interactivity', p.interactivity, 0, 100, 1)}
                {renderSlider('mediaArtParams.bloomEffect', 'bloomEffect', p.bloomEffect, 0, 100, 1)}
                {renderSelect('mediaArtParams.particleSystem', 'particleSystem', p.particleSystem, 'digitalNatureSystems')}
            </div>;
        }
        case MediaArtStyle.AI_DATA_SCULPTURE: {
             const p = params as AiDataSculptureParams;
             return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSlider('mediaArtParams.fluidity', 'fluidity', p.fluidity, 0, 100, 1)}
                {renderSlider('mediaArtParams.complexity', 'complexity', p.complexity, 0, 100, 1)}
                {renderSelect('mediaArtParams.colorScheme', 'colorScheme', p.colorScheme, 'aiDataSculptureSchemes')}
            </div>;
        }
        case MediaArtStyle.LIGHT_AND_SPACE: {
            const p = params as LightAndSpaceParams;
            return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSlider('mediaArtParams.speed', 'speed', p.speed, 0, 100, 1)}
                {renderSelect('mediaArtParams.pattern', 'pattern', p.pattern, 'lightAndSpacePatterns')}
                {renderSelect('mediaArtParams.color', 'color', p.color, 'lightAndSpaceColors')}
            </div>;
        }
        case MediaArtStyle.KINETIC_MIRRORS: {
            const p = params as KineticMirrorsParams;
            return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSlider('mediaArtParams.fragmentation', 'fragmentation', p.fragmentation, 0, 100, 1)}
                {renderSlider('mediaArtParams.motionSpeed', 'motionSpeed', p.motionSpeed, 0, 100, 1)}
                {renderSelect('mediaArtParams.reflection', 'reflection', p.reflection, 'kineticMirrorsReflections')}
            </div>;
        }
        case MediaArtStyle.GENERATIVE_BOTANY: {
            const p = params as GenerativeBotanyParams;
            return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSlider('mediaArtParams.growthSpeed', 'growthSpeed', p.growthSpeed, 0, 100, 1)}
                {renderSlider('mediaArtParams.density', 'density', p.density, 0, 100, 1)}
                {renderSelect('mediaArtParams.plantType', 'plantType', p.plantType, 'generativeBotanyTypes')}
            </div>;
        }
        case MediaArtStyle.QUANTUM_PHANTASM: {
            const p = params as QuantumPhantasmParams;
            return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSlider('mediaArtParams.particleSize', 'particleSize', p.particleSize, 0, 100, 1)}
                {renderSlider('mediaArtParams.shimmerSpeed', 'shimmerSpeed', p.shimmerSpeed, 0, 100, 1)}
                {renderSelect('mediaArtParams.colorPalette', 'colorPalette', p.colorPalette, 'quantumPhantasmPalettes')}
            </div>;
        }
        case MediaArtStyle.ARCHITECTURAL_PROJECTION: {
            const p = params as ArchitecturalProjectionParams;
            return <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderSlider('mediaArtParams.deconstruction', 'deconstruction', p.deconstruction, 0, 100, 1)}
                {renderSelect('mediaArtParams.lightSource', 'lightSource', p.lightSource, 'architecturalProjectionLightSources')}
                {renderSelect('mediaArtParams.texture', 'texture', p.texture, 'architecturalProjectionTextures')}
            </div>;
        }
        default:
            return null;
    }
};

const MediaArtGenerator: React.FC<MediaArtGeneratorProps> = ({
    state,
    setState,
    onOpenImageSelector,
    onGenerateScenes,
    onRegenerateImage,
    onDeletePanel,
    isLoading,
    error,
}) => {
    const { t } = useTranslation();
    const { sourceImage, style, styleParams, panels } = state;
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    const handleStyleChange = (newStyle: MediaArtStyle) => {
        const styleOption = MEDIA_ART_STYLE_OPTIONS.find(opt => opt.value === newStyle);
        if (styleOption) {
            setState(s => ({ ...s, style: newStyle, styleParams: styleOption.defaultParams }));
        }
    };

    const handleParamChange = (param: string, value: any) => {
        setState(s => ({
            ...s,
            styleParams: {
                ...(s.styleParams as any),
                [param]: value
            }
        }));
    };

    const handleExportPdf = async () => {
        if (panels.length === 0 || panels.some(p => p.isLoadingImage)) return;
        setIsExportingPdf(true);

        try {
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pdfWidth = 210;
            const pdfHeight = 297;
            const margin = 15;
            const contentWidth = pdfWidth - (margin * 2);
            let yPos = margin;

            // Cover page
            pdf.setFillColor(15, 23, 42); // slate-900
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            pdf.setFontSize(28);
            pdf.setTextColor(255, 255, 255);
            pdf.text('Media Art', pdfWidth / 2, 40, { align: 'center' });
            if (sourceImage) {
                pdf.setFontSize(14);
                pdf.setTextColor(148, 163, 184); // slate-400
                pdf.text(`Source: ${sourceImage.title}`, pdfWidth / 2, 50, { align: 'center' });
            }
            
            const panelElements = document.querySelectorAll('.media-art-panel-pdf');

            for (let i = 0; i < panelElements.length; i++) {
                const panelEl = panelElements[i] as HTMLElement;
                const canvas = await html2canvas(panelEl, { backgroundColor: '#1e293b', scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

                const requiredSpace = imgHeight + 10; // Image height + margin
                if (yPos > margin && yPos + requiredSpace > pdfHeight - margin) {
                    pdf.addPage();
                    yPos = margin;
                }
                
                pdf.addImage(imgData, 'PNG', margin, yPos, contentWidth, imgHeight);
                yPos += imgHeight + 10;
            }

            const safeTitle = sourceImage?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'export';
            pdf.save(`media-art-${safeTitle}.pdf`);

        } catch (err) {
            console.error("Failed to export PDF:", err);
        } finally {
            setIsExportingPdf(false);
        }
    };

    const selectedStyleOption = MEDIA_ART_STYLE_OPTIONS.find(opt => opt.value === style);
    const isGenerateDisabled = isLoading || !sourceImage;
    const canExportPdf = panels.length > 0 && !panels.some(p => p.isLoadingImage || !p.imageUrl || p.imageUrl === 'error');

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- Left Column: Image Selection --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200">{t('mediaArt.sourceImageTitle')}</h3>
                    {sourceImage ? (
                        <div className="relative group">
                            <img src={sourceImage.url} alt={sourceImage.title} className="w-full rounded-xl shadow-lg" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                <button onClick={onOpenImageSelector} className="bg-white/10 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                                    {t('mediaArt.changeImage')}
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                                <h3 className="text-white font-bold text-sm">{sourceImage.title}</h3>
                                {sourceImage.artist && <p className="text-slate-300 text-xs">{sourceImage.artist}</p>}
                            </div>
                        </div>
                    ) : (
                        <button onClick={onOpenImageSelector} className="w-full aspect-[4/5] flex flex-col items-center justify-center gap-3 bg-slate-800/50 hover:bg-slate-800 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-12 cursor-pointer transition-colors">
                            <UploadIcon className="w-10 h-10 text-slate-400" />
                            <span className="font-semibold text-slate-300">{t('mediaArt.selectImageCTA')}</span>
                            <span className="text-xs text-slate-500 text-center">{t('mediaArt.selectImageHint')}</span>
                        </button>
                    )}
                </div>

                {/* --- Right Column: Style Selection --- */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-200">{t('mediaArt.styleTitle')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {MEDIA_ART_STYLE_OPTIONS.map(option => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleStyleChange(option.value)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 text-left h-full flex flex-col ${style === option.value ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'}`}
                            >
                                <span className="text-2xl">{option.icon}</span>
                                <h4 className="font-semibold text-sm mt-2 text-slate-200">{t(`mediaArtStyles.${option.labelKey}`)}</h4>
                                <p className="text-xs text-slate-400 mt-1 flex-grow">{t(`mediaArtStyles.${option.descriptionKey}`)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Parameters Section (Full Width) --- */}
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/30">
                <h3 className="block text-sm font-semibold text-slate-300 mb-4">{t('mediaArt.paramsTitle')}</h3>
                <StyleParameterControls style={style} params={styleParams} onChange={handleParamChange} />
            </div>

            {/* --- Generate Button --- */}
            <div className="pt-2">
                <button
                    type="button"
                    onClick={onGenerateScenes}
                    disabled={isGenerateDisabled}
                    className="w-full max-w-md mx-auto flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <><LoadingSpinner /><span className="ml-2">{t('mediaArt.generating')}</span></>
                    ) : (
                        t('mediaArt.generateScenes')
                    )}
                </button>
            </div>
            
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

            {/* --- Results --- */}
            {(isLoading || panels.length > 0) && (
                 <div className="mt-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-200">{t('mediaArt.resultsTitle')}</h2>
                        <button
                            onClick={handleExportPdf}
                            disabled={!canExportPdf || isExportingPdf}
                            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isExportingPdf ? (
                                <>
                                    <LoadingSpinner />
                                    <span>{t('mediaArt.exportingPdf')}</span>
                                </>
                            ) : (
                                <>
                                    <DownloadIcon className="w-4 h-4" />
                                    <span>{t('mediaArt.exportPdf')}</span>
                                </>
                            )}
                        </button>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {panels.map((panel, index) => (
                             <div key={index} className="media-art-panel-pdf bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
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
                                    {panel.imageUrl && panel.imageUrl !== 'error' && (
                                        <img src={panel.imageUrl} alt={`Panel ${index + 1}`} className="w-full h-full object-cover" />
                                    )}
                                     {panel.imageUrl === 'error' && (
                                        <div className="text-red-400 text-center p-4">
                                            <p className="font-semibold">Oops!</p>
                                            <p className="text-xs">{t('storyboardDisplay.imageError')}</p>
                                        </div>
                                    )}
                                 </div>
                                 <div className="p-4 flex-grow">
                                     <p className="text-sm text-slate-300 leading-relaxed">{panel.description}</p>
                                 </div>
                                  <div className="p-3 border-t border-slate-700 bg-slate-900/30 flex items-center justify-end gap-2">
                                    <button onClick={() => onRegenerateImage(index)} title={t('tooltips.regenerateImage')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50" disabled={panel.isLoadingImage}>
                                        <RefreshIcon className="w-4 h-4 text-slate-300"/>
                                    </button>
                                    <button onClick={() => onDeletePanel(index)} title={t('tooltips.deletePanel')} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors">
                                        <DeleteIcon className="w-4 h-4 text-slate-300"/>
                                    </button>
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