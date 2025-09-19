import React, { useState } from 'react';
import { MediaArtState, MediaArtStyle, MediaArtStyleParams, DataCompositionParams, DigitalNatureParams, AiDataSculptureParams, LightAndSpaceParams, KineticMirrorsParams, GenerativeBotanyParams, QuantumPhantasmParams, ArchitecturalProjectionParams, StoryboardConfig } from '../types';
import { MEDIA_ART_STYLE_OPTIONS } from '../constants';
import { useTranslation } from '../i18n/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import UploadIcon from './icons/UploadIcon';
import DownloadIcon from './icons/DownloadIcon';
import StoryboardSettings from './StoryboardSettings';

declare var jspdf: any;
declare var html2canvas: any;

interface MediaArtGeneratorProps {
    state: MediaArtState;
    setState: React.Dispatch<React.SetStateAction<MediaArtState>>;
    onOpenImageSelector: () => void;
    onGenerateScenes: () => void;
    onRegenerateVideo: (index: number) => void;
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
    onRegenerateVideo,
    isLoading,
    error,
}) => {
    const { t } = useTranslation();
    const { sourceImage, style, styleParams, panels } = state;
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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

    const handleConfigChange = (newConfig: StoryboardConfig) => {
        setState(s => ({ ...s, config: newConfig }));
    };

    const handleExportPdf = async () => {
        if (panels.length === 0) return;
        setIsExportingPdf(true);
        const pdfContainer = document.createElement('div');
        try {
            const { jsPDF } = jspdf;
            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            const pdfWidthMm = 210;
            const pdfHeightMm = 297;
            const marginMm = 15;

            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            pdfContainer.style.top = '0px';
            const pageWidthPx = 794;
            const pageHeightPx = 1123;
            pdfContainer.style.width = `${pageWidthPx}px`;
            pdfContainer.style.height = `${pageHeightPx}px`;
            pdfContainer.style.fontFamily = "'Noto Sans KR', 'Inter', sans-serif";
            document.body.appendChild(pdfContainer);

            // --- Cover Page ---
            const sourceImageInfo = sourceImage ? `<p style="font-size: 16px; color: #94a3b8; margin-top: 16px;">Source: ${sourceImage.title}</p>` : '';
            pdfContainer.innerHTML = `
                <div style="background-color: #0f172a; color: white; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 40px; box-sizing: border-box; text-align: center;">
                    <h1 style="font-size: 36px; font-weight: bold; line-height: 1.3;">Media Art Storyboard</h1>
                    ${sourceImageInfo}
                </div>
            `;
            const coverCanvas = await html2canvas(pdfContainer.firstElementChild as HTMLElement, { scale: 2 });
            pdf.addImage(coverCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidthMm, pdfHeightMm);

            // --- Storyboard Pages ---
            if (panels.length > 0) pdf.addPage();
            
            const pageWrapper = document.createElement('div');
            pageWrapper.style.backgroundColor = '#0f172a';
            pageWrapper.style.color = 'white';
            pageWrapper.style.width = '100%';
            pageWrapper.style.minHeight = '100%';
            pageWrapper.style.padding = `${(marginMm / pdfWidthMm) * pageWidthPx}px`;
            pageWrapper.style.boxSizing = 'border-box';
            pdfContainer.innerHTML = '';
            pdfContainer.appendChild(pageWrapper);

            for (let i = 0; i < panels.length; i++) {
                const panel = panels[i];
                const panelEl = document.createElement('div');
                panelEl.innerHTML = `
                    <div style="border: 1px solid #334155; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                        <div style="padding: 12px; background-color: #1e293b;">
                            <h3 style="font-size: 16px; font-weight: bold;">Transition ${i + 1}</h3>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background-color: #334155;">
                            <div style="position: relative; background-color: #0f172a; aspect-ratio: 16/9;">
                                <div style="position: absolute; top: 8px; left: 8px; background-color: rgba(0,0,0,0.5); color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">Start Frame</div>
                                <img src="${panel.imageUrl || ''}" style="width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                            <div style="position: relative; background-color: #0f172a; aspect-ratio: 16/9;">
                                 <div style="position: absolute; top: 8px; left: 8px; background-color: rgba(0,0,0,0.5); color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">End Frame</div>
                                <img src="${panel.endImageUrl || ''}" style="width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                        </div>
                        <div style="padding: 16px; background-color: #1e293b;">
                            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">Transition Prompt:</p>
                            <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; word-wrap: break-word;">${panel.description}</p>
                        </div>
                    </div>`;

                pageWrapper.appendChild(panelEl);

                if (pageWrapper.offsetHeight > pageHeightPx && pageWrapper.children.length > 1) {
                    pageWrapper.removeChild(panelEl);
                    const pageCanvas = await html2canvas(pageWrapper, { scale: 2 });
                    pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidthMm, pdfHeightMm);
                    pdf.addPage();
                    pageWrapper.innerHTML = '';
                    pageWrapper.appendChild(panelEl);
                }
            }

            if (pageWrapper.children.length > 0) {
                const lastPageCanvas = await html2canvas(pageWrapper, { scale: 2 });
                pdf.addImage(lastPageCanvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidthMm, pdfHeightMm);
            }
            
            const safeTitle = sourceImage?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'export';
            pdf.save(`media-art-${safeTitle}.pdf`);
        } catch (err) {
            console.error("Failed to export PDF:", err);
        } finally {
            if (pdfContainer) document.body.removeChild(pdfContainer);
            setIsExportingPdf(false);
        }
    };

    const isGenerateDisabled = isLoading || !sourceImage;
    const canExportPdf = panels.length > 0 && !panels.some(p => !p.imageUrl || p.imageUrl === 'error');

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

            {/* --- Advanced Settings --- */}
            <div className="flex justify-between items-center pt-2">
                <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                >
                    {showSettings ? t('storyboardForm.hideSettings') : t('storyboardForm.showSettings')}
                </button>
            </div>

            {showSettings && (
                <div className="animate-fade-in">
                    <StoryboardSettings config={state.config} setConfig={handleConfigChange} />
                </div>
            )}


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
            {(panels.length > 0 || isLoading) && (
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
                             <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
                                 <div className="p-3">
                                     <h4 className="text-sm font-semibold text-slate-300">{t('mediaArt.transition')} {index + 1}</h4>
                                 </div>
                                 <div className="grid grid-cols-2 gap-px bg-slate-700">
                                     <div className="relative aspect-video bg-slate-800 flex flex-col items-center justify-center">
                                         <p className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">{t('mediaArt.startFrame')}</p>
                                        {panel.imageUrl && panel.imageUrl !== 'error' && panel.imageUrl !== 'quota_error' && (
                                            <img src={panel.imageUrl} alt={`${t('mediaArt.startFrame')} ${index + 1}`} className="w-full h-full object-cover" />
                                        )}
                                        {panel.imageUrl === 'error' && (
                                            <div className="text-red-400 text-center p-2">
                                                <p className="font-semibold">Oops!</p>
                                                <p className="text-xs">{t('storyboardDisplay.imageError')}</p>
                                            </div>
                                        )}
                                        {panel.imageUrl === 'quota_error' && (
                                            <div className="text-yellow-400 text-center p-2">
                                                <p className="font-semibold">{t('storyboardDisplay.quotaErrorTitle')}</p>
                                                <p className="text-xs mt-1 text-slate-400">{t('storyboardDisplay.checkPlan')}</p>
                                            </div>
                                        )}
                                     </div>
                                      <div className="relative aspect-video bg-slate-800 flex flex-col items-center justify-center">
                                         <p className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded">{t('mediaArt.endFrame')}</p>
                                        {panel.endImageUrl && panel.endImageUrl !== 'error' && panel.endImageUrl !== 'quota_error' && (
                                            <img src={panel.endImageUrl} alt={`${t('mediaArt.endFrame')} ${index + 1}`} className="w-full h-full object-cover" />
                                        )}
                                        {panel.endImageUrl === 'error' && (
                                            <div className="text-red-400 text-center p-2">
                                                <p className="font-semibold">Oops!</p>
                                                <p className="text-xs">{t('storyboardDisplay.imageError')}</p>
                                            </div>
                                        )}
                                        {panel.endImageUrl === 'quota_error' && (
                                            <div className="text-yellow-400 text-center p-2">
                                                <p className="font-semibold">{t('storyboardDisplay.quotaErrorTitle')}</p>
                                                <p className="text-xs mt-1 text-slate-400">{t('storyboardDisplay.checkPlan')}</p>
                                            </div>
                                        )}
                                     </div>
                                 </div>
                                 <div className="p-4 flex-grow flex flex-col">
                                     <label htmlFor={`transition-prompt-${index}`} className="text-xs text-slate-400 mb-1 flex-shrink-0">{t('mediaArt.transitionPrompt')}:</label>
                                     <textarea
                                        id={`transition-prompt-${index}`}
                                        readOnly
                                        value={panel.description}
                                        className="w-full flex-grow bg-slate-700/50 border border-slate-600 rounded-md p-2 text-sm text-slate-300 leading-relaxed resize-none focus:ring-0 focus:border-slate-600"
                                     />
                                 </div>
                                  <div className="p-3 border-t border-slate-700 bg-slate-900/30 flex items-center justify-between gap-2">
                                     <div className="flex-grow min-w-0">
                                         {panel.isLoadingVideo && (
                                            <div className="h-10 bg-slate-900/50 rounded-lg flex items-center justify-center text-white px-2">
                                                <LoadingSpinner />
                                                <p className="text-xs ml-2">{t('storyboardDisplay.generatingClip')}</p>
                                            </div>
                                        )}
                                         {panel.videoUrl === 'error' && (
                                            <div className="h-10 bg-red-900/50 rounded-lg flex items-center justify-center text-red-300 p-2 text-center">
                                                <p className="text-xs font-semibold">{t('storyboardDisplay.videoErrorTitle')}</p>
                                            </div>
                                        )}
                                          {panel.videoUrl && panel.videoUrl !== 'error' && !panel.isLoadingVideo && (
                                            <video
                                                key={panel.videoUrl}
                                                src={panel.videoUrl}
                                                controls
                                                className="w-full rounded-md max-h-48"
                                            />
                                        )}
                                     </div>
                                     <div className="flex-shrink-0">
                                         <button
                                            onClick={() => onRegenerateVideo(index)}
                                            title={t('mediaArt.generateTransition')}
                                            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2 text-xs px-3"
                                            disabled={panel.isLoadingVideo || !panel.imageUrl || panel.imageUrl === 'error' || panel.imageUrl === 'quota_error'}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                                            <span className="hidden sm:inline">{t('mediaArt.generateTransition')}</span>
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