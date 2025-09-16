import React, { useState } from 'react';
import {
    MediaArtState,
    MediaArtStyle,
    MediaArtStyleParams,
    DataCompositionParams,
    DigitalNatureParams,
    AiDataSculptureParams,
    LightAndSpaceParams,
    KineticMirrorsParams,
    GenerativeBotanyParams,
    QuantumPhantasmParams,
    ArchitecturalProjectionParams,
    StoryboardPanel
} from '../types';
import { MEDIA_ART_STYLE_OPTIONS } from '../constants';
import { useTranslation } from '../i18n/LanguageContext';
import LoadingSpinner from './LoadingSpinner';
import DownloadIcon from './icons/DownloadIcon';
import RefreshIcon from './icons/RefreshIcon';
import DeleteIcon from './icons/DeleteIcon';

// Add declarations for window-loaded scripts
declare const html2canvas: any;
declare global {
    interface Window {
        jspdf: any;
    }
}

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
    onExport: () => void; // This can be removed if PDF export is handled internally
    canSave: boolean;
}

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

    const allImagesLoaded = !isLoading && panels.length > 0 && panels.every(p => p.imageUrl && !p.isLoadingImage);

    const handleStyleSelect = (newStyle: MediaArtStyle) => {
        const styleOption = MEDIA_ART_STYLE_OPTIONS.find(opt => opt.value === newStyle);
        if (styleOption) {
            setState(s => ({
                ...s,
                style: newStyle,
                styleParams: styleOption.defaultParams,
                panels: [], // Reset panels when style changes
            }));
        }
    };

    const handleParamsChange = (newParams: Partial<MediaArtStyleParams>) => {
        setState(s => ({ ...s, styleParams: { ...s.styleParams, ...newParams } as MediaArtStyleParams }));
    };

    const handleExportPdf = async () => {
        if (!allImagesLoaded || isExportingPdf) return;
        setIsExportingPdf(true);

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Cover Page
            pdf.setFillColor(15, 23, 42);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            pdf.setTextColor(226, 232, 240);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(24);
            pdf.text('Media Art Storyboard', pdfWidth / 2, 80, { align: 'center' });
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(12);
            pdf.setTextColor(148, 163, 184);
            const titleText = sourceImage ? `Source: ${sourceImage.title}` : 'Untitled Project';
            const wrappedTitle = pdf.splitTextToSize(titleText, pdfWidth - 80);
            pdf.text(wrappedTitle, pdfWidth / 2, 110, { align: 'center' });
            
            // Panel Pages
            const panelsToProcess = panels.filter(p => p.imageUrl && !p.imageUrl.startsWith('error'));
            for (let i = 0; i < panelsToProcess.length; i += 2) {
                pdf.addPage();
                pdf.setFillColor(15, 23, 42);
                pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
                
                const pagePanels = panelsToProcess.slice(i, i + 2);
                for (let j = 0; j < pagePanels.length; j++) {
                    const panel = pagePanels[j];
                    const panelIndex = i + j;
                    const yPos = j === 0 ? 40 : pdfHeight / 2 + 20;

                    const container = document.createElement('div');
                    container.style.width = `${pdfWidth - 80}px`;
                    container.style.position = 'absolute';
                    container.style.left = '-9999px';
                    container.style.backgroundColor = '#0f172a';
                    container.innerHTML = `
                        <div style="font-family: Inter, sans-serif;">
                            <h3 style="font-size: 16px; font-weight: 600; color: #e2e8f0; margin-bottom: 10px;">Scene #${panelIndex + 1}</h3>
                            <img src="${panel.imageUrl}" style="width: 100%; border-radius: 8px; margin-bottom: 10px; aspect-ratio: 16/9; object-fit: cover;" />
                            <p style="font-size: 12px; color: #94a3b8; line-height: 1.6;">${panel.description?.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                        </div>
                    `;
                    document.body.appendChild(container);

                    await new Promise(resolve => {
                        const img = container.querySelector('img');
                        if (img?.complete) resolve(true);
                        else if (img) {
                           img.onload = img.onerror = () => resolve(true);
                        } else resolve(true);
                    });

                    const canvas = await html2canvas(container, { backgroundColor: '#0f172a', useCORS: true, scale: 2 });
                    document.body.removeChild(container);
                    
                    const imgData = canvas.toDataURL('image/png');
                    const imgProps = pdf.getImageProperties(imgData);
                    const imgHeight = (imgProps.height * (pdfWidth - 80)) / imgProps.width;
                    
                    pdf.addImage(imgData, 'PNG', 40, yPos, pdfWidth - 80, imgHeight);
                }
            }
            
            const safeFilename = sourceImage?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30) || 'art';
            pdf.save(`media-art-${safeFilename}.pdf`);

        } catch (err) {
            console.error("Failed to export PDF:", err);
        } finally {
            setIsExportingPdf(false);
        }
    };


    const isGenerateDisabled = isLoading || !sourceImage;

    const renderParameterControls = () => {
        const currentParams = styleParams;
        switch (style) {
            case MediaArtStyle.DATA_COMPOSITION:
                const p1 = currentParams as DataCompositionParams;
                return (<>
                    <div><label className="text-xs text-slate-400">Data Density ({p1.dataDensity}%)</label><input type="range" min="0" max="100" value={p1.dataDensity} onChange={e => handleParamsChange({ dataDensity: +e.target.value })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" /></div>
                    <div><label className="text-xs text-slate-400">Glitch Intensity ({p1.glitchIntensity}%)</label><input type="range" min="0" max="100" value={p1.glitchIntensity} onChange={e => handleParamsChange({ glitchIntensity: +e.target.value })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" /></div>
                    <div><label className="text-xs text-slate-400">Color Palette</label><select value={p1.colorPalette} onChange={e => handleParamsChange({ colorPalette: e.target.value as any })} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-2 py-1 text-xs text-white"><option value="monochrome">Monochrome</option><option value="binary">Binary</option><option value="signal_noise">Signal Noise</option></select></div>
                </>);
            case MediaArtStyle.DIGITAL_NATURE:
                const p2 = currentParams as DigitalNatureParams;
                return (<>
                    <div><label className="text-xs text-slate-400">Particle System</label><select value={p2.particleSystem} onChange={e => handleParamsChange({ particleSystem: e.target.value as any })} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-2 py-1 text-xs text-white"><option value="flowers">Flowers</option><option value="butterflies">Butterflies</option><option value="light_trails">Light Trails</option><option value="leaves">Leaves</option></select></div>
                    <div><label className="text-xs text-slate-400">Interactivity ({p2.interactivity}%)</label><input type="range" min="0" max="100" value={p2.interactivity} onChange={e => handleParamsChange({ interactivity: +e.target.value })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" /></div>
                    <div><label className="text-xs text-slate-400">Bloom Effect ({p2.bloomEffect}%)</label><input type="range" min="0" max="100" value={p2.bloomEffect} onChange={e => handleParamsChange({ bloomEffect: +e.target.value })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" /></div>
                </>);
            case MediaArtStyle.AI_DATA_SCULPTURE:
                 const p3 = currentParams as AiDataSculptureParams;
                 return (<>
                    <div><label className="text-xs text-slate-400">Fluidity ({p3.fluidity}%)</label><input type="range" min="0" max="100" value={p3.fluidity} onChange={e => handleParamsChange({ fluidity: +e.target.value })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" /></div>
                    <div><label className="text-xs text-slate-400">Color Scheme</label><select value={p3.colorScheme} onChange={e => handleParamsChange({ colorScheme: e.target.value as any })} className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-2 py-1 text-xs text-white"><option value="nebula">Nebula</option><option value="oceanic">Oceanic</option><option value="molten_metal">Molten Metal</option><option value="crystal">Crystal</option></select></div>
                    <div><label className="text-xs text-slate-400">Complexity ({p3.complexity}%)</label><input type="range" min="0" max="100" value={p3.complexity} onChange={e => handleParamsChange({ complexity: +e.target.value })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" /></div>
                 </>);
            default:
                const p = currentParams as any;
                const paramKeys = Object.keys(p);
                return paramKeys.map(key => {
                    const value = p[key];
                    if (typeof value === 'number') {
                        return <div key={key}><label className="text-xs text-slate-400">{key} ({value}%)</label><input type="range" min="0" max="100" value={value} onChange={e => handleParamsChange({ [key]: +e.target.value })} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" /></div>
                    }
                    if (typeof value === 'string') {
                        return <div key={key}><label className="text-xs text-slate-400">{key}</label><p className="text-sm text-white">{value}</p></div>
                    }
                    return null;
                });
        }
    };


    return (
        <div className="space-y-8">
            {/* Step 1 & 2: Image and Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">{t('mediaArt.step1')}</h3>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 h-full">
                        {!sourceImage ? (
                            <button onClick={onOpenImageSelector} className="w-full h-full flex flex-col items-center justify-center bg-blue-500/10 hover:bg-blue-500/20 border-2 border-dashed border-blue-500/30 text-blue-300 font-semibold py-3 px-4 rounded-lg transition-colors">
                                {t('mediaArt.selectImage')}
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <img src={sourceImage.url} alt={sourceImage.title} className="w-full rounded-md" />
                                <div>
                                    <p className="text-sm font-semibold text-white truncate" title={sourceImage.title}>{sourceImage.title}</p>
                                    {sourceImage.artist && <p className="text-xs text-slate-400">{sourceImage.artist}</p>}
                                </div>
                                <button onClick={onOpenImageSelector} className="w-full text-center text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 py-2 rounded-md transition-colors">
                                    {t('mediaArt.changeImage')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {sourceImage && (
                    <div className="animate-fade-in">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">{t('mediaArt.step2')}</h3>
                        <div className="space-y-2">
                             {MEDIA_ART_STYLE_OPTIONS.map(option => (
                                <button key={option.value} onClick={() => handleStyleSelect(option.value)} className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${style === option.value ? 'bg-green-500/20 border-green-500' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'}`}>
                                    <div className="flex items-center gap-3"><span className="text-xl">{option.icon}</span><div><p className="font-semibold text-slate-200">{t(`mediaArtStyles.${option.labelKey}`)}</p><p className="text-xs text-slate-400">{t(`mediaArtStyles.${option.descriptionKey}`)}</p></div></div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Step 3: Parameters */}
            {sourceImage && (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-semibold text-slate-200 mb-3">{t('mediaArt.step3')}</h3>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {renderParameterControls()}
                    </div>
                </div>
            )}
            
            {/* Step 4: Generation and Results */}
            <div className="animate-fade-in">
                {(panels.length > 0 || isLoading || error) ? (
                     <div className="flex justify-between items-center mb-4">
                         <h2 className="text-xl font-semibold text-slate-200">{t('mediaArt.storyboardTitle')}</h2>
                          <button onClick={handleExportPdf} disabled={!allImagesLoaded || isExportingPdf} className="flex items-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {isExportingPdf ? (<><LoadingSpinner /><span className="ml-2">{t('mediaArt.exportingPdf')}</span></>) : (<><DownloadIcon className="w-4 h-4" /><span className="ml-2">{t('mediaArt.exportPdf')}</span></>)}
                        </button>
                    </div>
                ) : null}

                 {!sourceImage && (
                    <div className="text-center text-slate-500 border-2 border-dashed border-slate-700 rounded-xl p-12">
                        {t('mediaArt.selectImagePrompt')}
                    </div>
                )}
                
                {sourceImage && panels.length === 0 && !isLoading && !error && (
                    <div className="text-center text-slate-400 border-2 border-dashed border-slate-700 rounded-xl p-12 space-y-4">
                         <p>{t('mediaArt.readyToGenerate')}</p>
                         <button onClick={onGenerateScenes} disabled={isGenerateDisabled} className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                            {t('mediaArt.generateScenes')}
                        </button>
                    </div>
                )}
                
                {(isLoading || panels.length > 0 || error) && (
                    <div className="space-y-4">
                         {error && <p className="text-red-400 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</p>}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isLoading && panels.length === 0 && Array.from({ length: 4 }).map((_, i) => (<div key={i} className="aspect-video bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center"><LoadingSpinner /></div>))}
                            {panels.map((panel, index) => (
                                <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-lg">
                                    <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                                        {panel.isLoadingImage && <LoadingSpinner />}
                                        {panel.imageUrl && panel.imageUrl !== 'error' && <img src={panel.imageUrl} alt={`Panel ${index + 1}`} className="w-full h-full object-cover" />}
                                        {panel.imageUrl === 'error' && <p className="text-red-400 text-xs text-center p-2">{t('storyboardDisplay.imageError')}</p>}
                                    </div>
                                    <div className="p-3 text-xs text-slate-300 bg-slate-800/40 flex-grow">{panel.description}</div>
                                    <div className="p-2 border-t border-slate-700 flex justify-end items-center space-x-2">
                                        <button onClick={() => onRegenerateImage(index)} title={t('storyboardDisplay.regenerateImage')} className="p-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={panel.isLoadingImage}><RefreshIcon className="w-4 h-4 text-slate-300" /></button>
                                        <button onClick={() => onDeletePanel(index)} title={t('storyboardDisplay.deletePanel')} className="p-1.5 bg-slate-700/50 hover:bg-slate-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed" disabled={panel.isLoadingImage}><DeleteIcon className="w-4 h-4 text-slate-300 hover:text-red-400" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {panels.length > 0 && !isLoading && (
                            <div className="pt-4"><button onClick={onGenerateScenes} disabled={isGenerateDisabled} className="w-full sm:w-auto flex-grow flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">{t('common.regenerateAll')}</button></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaArtGenerator;
