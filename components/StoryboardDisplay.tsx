import React, { useState } from 'react';
import { StoryboardPanel } from '../types';
import LoadingSpinner from './LoadingSpinner';
import RefreshIcon from './icons/RefreshIcon';
import { useTranslation } from '../i18n/LanguageContext';
import DeleteIcon from './icons/DeleteIcon';
import DownloadIcon from './icons/DownloadIcon';

// Add declarations for window-loaded scripts to satisfy TypeScript
declare const html2canvas: any;
// FIX: Add declaration for jspdf on the window object to resolve TypeScript error.
declare global {
    interface Window {
        jspdf: any;
    }
}

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
    const [isExportingPdf, setIsExportingPdf] = useState(false);
    
    const currentlyGeneratingIndex = panels.findIndex(p => p.isLoadingImage && !p.imageUrl);
    const allImagesLoaded = !isGeneratingImages && panels.length > 0 && panels.every(p => p.imageUrl && !p.isLoadingImage);

    const handleExportPdf = async () => {
        if (!allImagesLoaded || isExportingPdf) return;
        setIsExportingPdf(true);

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4',
                putOnlyUsedFonts: true,
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // --- Cover Page ---
            pdf.setFillColor(15, 23, 42); // bg-slate-900
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            pdf.setTextColor(226, 232, 240); // text-slate-200
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(24);
            pdf.text('Storyboard', pdfWidth / 2, 80, { align: 'center' });
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(12);
            pdf.setTextColor(148, 163, 184); // text-slate-400
            const wrappedTitle = pdf.splitTextToSize(storyIdea, pdfWidth - 80);
            pdf.text(wrappedTitle, pdfWidth / 2, 110, { align: 'center' });
            pdf.setFontSize(10);
            pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pdfWidth / 2, pdfHeight - 40, { align: 'center' });

            // --- Panel Pages ---
            const panelsToProcess = panels.filter(p => p.imageUrl && !p.imageUrl.startsWith('error'));
            for (let i = 0; i < panelsToProcess.length; i += 2) {
                pdf.addPage();
                pdf.setFillColor(15, 23, 42);
                pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
                
                const pagePanels = panelsToProcess.slice(i, i + 2);
                const container = document.createElement('div');
                container.style.width = `${pdfWidth - 80}px`; 
                container.style.position = 'absolute';
                container.style.left = '-9999px';
                container.style.backgroundColor = '#0f172a'; // bg-slate-900
                
                container.innerHTML = pagePanels.map((panel, pageIndex) => `
                    <div style="margin-bottom: 30px; font-family: Inter, sans-serif;">
                        <h3 style="font-size: 16px; font-weight: 600; color: #e2e8f0; margin-bottom: 10px;">Scene #${i + pageIndex + 1}</h3>
                        <img src="${panel.imageUrl}" style="width: 100%; border-radius: 8px; margin-bottom: 10px; aspect-ratio: 16/9; object-fit: cover;" />
                        <p style="font-size: 12px; color: #94a3b8; line-height: 1.6;">${panel.description?.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
                    </div>
                `).join('');
                
                document.body.appendChild(container);

                const images = Array.from(container.getElementsByTagName('img'));
                await Promise.all(images.map(img => {
                    if (img.complete) return Promise.resolve();
                    return new Promise(resolve => { img.onload = img.onerror = resolve; });
                }));
                
                const canvas = await html2canvas(container, {
                    backgroundColor: '#0f172a',
                    useCORS: true,
                    scale: 2
                });

                document.body.removeChild(container);

                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * (pdfWidth - 80)) / imgProps.width;
                
                pdf.addImage(imgData, 'PNG', 40, 40, pdfWidth - 80, imgHeight);
            }
            
            const safeFilename = storyIdea.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30);
            pdf.save(`storyboard-${safeFilename || 'export'}.pdf`);

        } catch (err) {
            console.error("Failed to export PDF:", err);
        } finally {
            setIsExportingPdf(false);
        }
    };

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold text-slate-200">{t('storyboardDisplay.title')}</h2>
                 <button
                    onClick={handleExportPdf}
                    disabled={!allImagesLoaded || isExportingPdf}
                    className="flex items-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExportingPdf ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">{t('storyboardDisplay.exportingPdf')}</span>
                        </>
                    ) : (
                        <>
                            <DownloadIcon className="w-4 h-4" />
                            <span className="ml-2">{t('storyboardDisplay.exportPdf')}</span>
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