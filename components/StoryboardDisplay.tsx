import React from 'react';
import { StoryboardPanel } from '../types';
import LoadingSpinner from './LoadingSpinner';
import RefreshIcon from './icons/RefreshIcon';
import { useTranslation } from '../i18n/LanguageContext';
import DeleteIcon from './icons/DeleteIcon';
import DownloadIcon from './icons/DownloadIcon';

// Add declarations for CDN libraries
declare const jspdf: any;
declare const html2canvas: any;

interface StoryboardDisplayProps {
    panels: StoryboardPanel[];
    storyIdea: string;
    onExpandScene: (sceneDescription: string, index: number) => void;
    onSceneDurationChange: (index: number, duration: number) => void;
    onRegenerateVideo: (index: number) => void;
    onRegenerateImage: (index: number) => void;
    onDeletePanel: (index: number) => void;
    isGeneratingImages: boolean;
}

const StoryboardDisplay: React.FC<StoryboardDisplayProps> = ({ panels, storyIdea, onExpandScene, onSceneDurationChange, onRegenerateVideo, onRegenerateImage, onDeletePanel, isGeneratingImages }) => {
    const { t } = useTranslation();
    const [isExportingPdf, setIsExportingPdf] = React.useState(false);
    const currentlyGeneratingIndex = panels.findIndex(p => p.isLoadingImage && !p.imageUrl);
    const allImagesLoaded = panels.length > 0 && panels.every(p => p.imageUrl && !p.isLoadingImage);

    const handleExportPDF = async () => {
        if (!allImagesLoaded) {
            alert("Please wait for all images to generate before exporting.");
            return;
        }
        setIsExportingPdf(true);
        try {
            const { jsPDF } = jspdf;
            const doc = new jsPDF('p', 'mm', 'a4'); // portrait, mm, a4
            const a4Width = 210;
            const a4Height = 297;
            const margin = 15;

            // Create a hidden element for rendering
            const pdfContainer = document.createElement('div');
            pdfContainer.style.position = 'absolute';
            pdfContainer.style.left = '-9999px';
            pdfContainer.style.width = `${a4Width}mm`;
            pdfContainer.style.background = '#0f172a'; // bg-slate-900
            pdfContainer.style.color = 'white';
            pdfContainer.style.fontFamily = `'Inter', sans-serif`;
            pdfContainer.style.padding = `${margin}mm`;
            pdfContainer.style.boxSizing = 'border-box';
            document.body.appendChild(pdfContainer);

            // --- Title Page ---
            const escapedStoryIdea = storyIdea.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            pdfContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: ${a4Height - (margin * 2)}mm; text-align: center;">
                    <h1 style="font-size: 24pt; font-weight: bold; margin: 0; color: white;">Storyboard</h1>
                    <p style="font-size: 14pt; margin-top: 20px; color: #94a3b8;">${escapedStoryIdea}</p>
                    <p style="font-size: 10pt; color: #64748b; position: absolute; bottom: 30px;">Generated with Artifex.AI Studio Pro</p>
                </div>
            `;
            
            const titleCanvas = await html2canvas(pdfContainer, { scale: 2, backgroundColor: '#0f172a' });
            const titleImgData = titleCanvas.toDataURL('image/png');
            doc.addImage(titleImgData, 'PNG', 0, 0, a4Width, a4Height);

            // --- Panels Pages ---
            const panelsPerPage = 2;
            for (let i = 0; i < panels.length; i += panelsPerPage) {
                const pagePanels = panels.slice(i, i + panelsPerPage);
                
                pdfContainer.innerHTML = pagePanels.map((panel, index) => {
                    const escapedDescription = panel.description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    return `
                    <div style="margin-bottom: 15mm; height: ${((a4Height - (margin*2))/panelsPerPage) - 7.5}mm; display: flex; flex-direction: column;">
                        <h2 style="font-size: 12pt; font-weight: 600; margin-bottom: 8px; color: white;">Scene ${i + index + 1}</h2>
                        ${panel.imageUrl && panel.imageUrl.startsWith('data') ? `<img src="${panel.imageUrl}" style="width: 100%; height: auto; object-fit: cover; aspect-ratio: 16/9; border-radius: 8px; margin-bottom: 8px;" />` : `<div style="width: 100%; aspect-ratio: 16/9; background: #1e293b; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 10pt; color: #94a3b8; margin-bottom: 8px;">No Image</div>`}
                        <p style="font-size: 9pt; color: #cbd5e1; line-height: 1.5; white-space: pre-wrap;">${escapedDescription}</p>
                    </div>
                `}).join('');

                doc.addPage();
                const panelCanvas = await html2canvas(pdfContainer, { scale: 2, backgroundColor: '#0f172a' });
                const panelImgData = panelCanvas.toDataURL('image/png');
                doc.addImage(panelImgData, 'PNG', 0, 0, a4Width, a4Height);
            }

            // --- Cleanup and Save ---
            document.body.removeChild(pdfContainer);
            const safeTitle = storyIdea.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
            doc.save(`storyboard-${safeTitle || 'project'}.pdf`);
            
        } catch (e) {
            console.error("Failed to export PDF:", e);
            alert("Sorry, there was an error creating the PDF.");
        } finally {
            setIsExportingPdf(false);
        }
    };
    
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold text-slate-200">{t('storyboardDisplay.title')}</h2>
                 <button
                    onClick={handleExportPDF}
                    disabled={!allImagesLoaded || isExportingPdf}
                    className="flex items-center justify-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExportingPdf ? (
                        <>
                           <LoadingSpinner />
                           <span className="ml-2 text-sm">{t('storyboardDisplay.exportingPdf')}</span>
                        </>
                    ) : (
                        <>
                            <DownloadIcon className="w-4 h-4" />
                            <span className="ml-2 text-sm">{t('storyboardDisplay.exportPdf')}</span>
                        </>
                    )}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {panels.map((panel, index) => {
                    const canGenerateVideo = !panel.isLoadingImage && panel.imageUrl && panel.imageUrl.startsWith('data:image');

                    return (
                        <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg overflow-hidden flex flex-col shadow-lg">
                            <div className="aspect-video bg-slate-800 flex items-center justify-center relative">
                                {panel.isLoadingImage && (
                                     <div className="flex flex-col items-center text-slate-400">
                                        {isGeneratingImages && currentlyGeneratingIndex === index ? (
                                            <>
                                                <LoadingSpinner />
                                                <p className="text-xs mt-2">{t('storyboardDisplay.drawingPanel', { index: index + 1 })}</p>
                                            </>
                                        ) : (
                                             <p className="text-xs">{t('storyboardDisplay.queued')}</p>
                                        )}
                                    </div>
                                )}
                                {panel.imageUrl && panel.imageUrl !== 'error' && panel.imageUrl !== 'quota_error' && (
                                    <img src={panel.imageUrl} alt={`Storyboard panel ${index + 1}: ${panel.description}`} className="w-full h-full object-cover" />
                                )}
                                {panel.imageUrl === 'error' && (
                                     <div className="text-red-400 text-center p-4 flex flex-col items-center justify-center h-full">
                                        <div>
                                            <p className="font-semibold">Oops!</p>
                                            <p className="text-xs">{t('storyboardDisplay.imageError')}</p>
                                        </div>
                                     </div>
                                )}
                                 {panel.imageUrl === 'quota_error' && (
                                    <div className="text-yellow-400 text-center p-4 flex flex-col items-center justify-center h-full">
                                        <div>
                                            <p className="font-semibold">{t('storyboardDisplay.quotaErrorTitle')}</p>
                                            <p className="text-xs mt-1">{t('storyboardDisplay.quotaError')}</p>
                                            <p className="text-xs mt-2 text-slate-400">
                                                {t('storyboardDisplay.quotaErrorCheckPlan', {
                                                    link: `<a href="https://ai.google.dev/gemini-api/docs/rate-limits" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline">${t('storyboardDisplay.googleAIStudio')}</a>`
                                                }).split('<a')[0]}
                                                <a href="https://ai.google.dev/gemini-api/docs/rate-limits" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                    {t('storyboardDisplay.googleAIStudio')}
                                                </a>
                                                .
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex-grow flex flex-col bg-slate-800/40 relative">
                                <p className="text-sm text-slate-300 leading-relaxed flex-grow">{panel.description}</p>
                                
                                <div className="mt-4 flex justify-between items-center gap-4">
                                    {canGenerateVideo ? (
                                        <div className="flex items-center space-x-2">
                                            <label htmlFor={`duration-${index}`} className="text-xs text-slate-400 flex-shrink-0">{t('storyboardDisplay.duration')}</label>
                                            <input
                                                id={`duration-${index}`}
                                                type="number"
                                                min="2"
                                                max="10"
                                                value={panel.sceneDuration || 4}
                                                onChange={(e) => onSceneDurationChange(index, parseInt(e.target.value, 10))}
                                                className="w-16 bg-slate-700/50 border border-slate-600 rounded-md px-2 py-1 text-xs text-white focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                                            />
                                        </div>
                                    ) : <div />}
                                    
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => onRegenerateImage(index)}
                                            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={t('storyboardDisplay.regenerateImage')}
                                            disabled={!canGenerateVideo}
                                        >
                                            <RefreshIcon className="w-4 h-4 text-slate-300" />
                                        </button>
                                        <button
                                            onClick={() => onDeletePanel(index)}
                                            className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={t('storyboardDisplay.deletePanel')}
                                            disabled={!canGenerateVideo}
                                        >
                                            <DeleteIcon className="w-4 h-4 text-slate-300 hover:text-red-400" />
                                        </button>
                                        <button
                                            onClick={() => onExpandScene(panel.description, index)}
                                            className="bg-teal-600/50 hover:bg-teal-600/80 border border-teal-500/60 text-teal-200 text-xs font-semibold py-1.5 px-3 rounded-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!canGenerateVideo}
                                        >
                                           {t('storyboardDisplay.expandScene')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                             {canGenerateVideo && (
                                <div className="border-t border-slate-700 p-3 bg-slate-900/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-xs font-semibold text-slate-400">{t('storyboardDisplay.videoClip')}</h4>
                                        
                                        {!panel.isLoadingVideo && !panel.videoUrl && (
                                            <button
                                                onClick={() => onRegenerateVideo(index)}
                                                className="flex items-center text-xs font-medium bg-green-600/50 hover:bg-green-600/80 text-green-200 py-1 px-2 rounded-md transition-colors"
                                                title={t('storyboardDisplay.generateClipTitle')}
                                            >
                                                🎬
                                                <span className="ml-1.5">{t('storyboardDisplay.generateClip')}</span>
                                            </button>
                                        )}

                                        {panel.videoUrl && (
                                            <button
                                                onClick={() => onRegenerateVideo(index)}
                                                disabled={panel.isLoadingVideo}
                                                className="flex items-center text-xs font-medium bg-cyan-600/50 hover:bg-cyan-600/80 text-cyan-200 py-1 px-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={t('storyboardDisplay.regenerateVideo')}
                                            >
                                                <RefreshIcon className={`w-3 h-3 ${panel.isLoadingVideo ? 'animate-spin' : ''}`} />
                                                <span className="ml-1.5">{panel.isLoadingVideo ? t('common.generating') : t('common.regenerate')}</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="aspect-video bg-slate-800 rounded-md flex items-center justify-center text-center">
                                        {panel.isLoadingVideo && (
                                            <div className="text-slate-400">
                                                <div className="inline-block">
                                                    <LoadingSpinner />
                                                </div>
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
    );
};

export default StoryboardDisplay;