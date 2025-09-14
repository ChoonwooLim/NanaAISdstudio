import React, { useEffect, useState } from 'react';
import { DetailedStoryboardPanel } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../i18n/LanguageContext';

interface DetailedStoryboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    panels: DetailedStoryboardPanel[];
    isLoading: boolean;
    error: string | null;
    originalSceneDescription?: string;
    onSaveChanges: (editedPanels: DetailedStoryboardPanel[]) => void;
}

const DetailedStoryboardModal: React.FC<DetailedStoryboardModalProps> = ({
    isOpen,
    onClose,
    panels,
    isLoading,
    error,
    originalSceneDescription,
    onSaveChanges,
}) => {
    const { t } = useTranslation();
    const [editablePanels, setEditablePanels] = useState<DetailedStoryboardPanel[]>([]);

    useEffect(() => {
        // When the panels prop changes (i.e., when new data loads), update the local editable state.
        setEditablePanels(panels);
    }, [panels]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const handleDescriptionChange = (index: number, newDescription: string) => {
        const updatedPanels = editablePanels.map((panel, i) => 
            i === index ? { ...panel, description: newDescription } : panel
        );
        setEditablePanels(updatedPanels);
    };

    const handleSave = () => {
        onSaveChanges(editablePanels);
    };

    const isSaveDisabled = isLoading || editablePanels.some(p => p.isLoadingImage);

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">{t('detailedModal.title')}</h2>
                        <p className="text-xs text-slate-400 mt-1 max-w-lg truncate">{t('detailedModal.originalPrefix')} "{originalSceneDescription}"</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl font-bold">&times;</button>
                </header>

                <div className="p-6 overflow-y-auto flex-grow">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center text-slate-400 py-12">
                            <LoadingSpinner />
                            <p className="mt-3 text-sm text-center whitespace-pre-wrap">{t('detailedModal.loadingMessage')}</p>
                        </div>
                    )}
                    {error && !isLoading && (
                         <div className="p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">
                            <p><span className="font-bold">{t('common.errorPrefix')}</span> {error}</p>
                        </div>
                    )}
                    {!isLoading && !error && editablePanels.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {editablePanels.map((panel, index) => (
                                <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
                                    <div className="aspect-video bg-slate-800 flex items-center justify-center">
                                         {panel.isLoadingImage && (
                                            <div className="flex flex-col items-center text-slate-400">
                                                <LoadingSpinner />
                                                <p className="text-xs mt-2">{t('detailedModal.drawingShot', { index: index + 1 })}</p>
                                            </div>
                                        )}
                                        {panel.imageUrl && panel.imageUrl !== 'error' && panel.imageUrl !== 'quota_error' && (
                                            <img src={panel.imageUrl} alt={`Detailed panel ${index + 1}: ${panel.description}`} className="w-full h-full object-cover" />
                                        )}
                                        {panel.imageUrl === 'error' && (
                                            <div className="text-red-400 text-center p-4">
                                                <p className="font-semibold">Oops!</p>
                                                <p className="text-xs">{t('storyboardDisplay.imageError')}</p>
                                            </div>
                                        )}
                                        {panel.imageUrl === 'quota_error' && (
                                            <div className="text-yellow-400 text-center p-4">
                                                <p className="font-semibold">{t('storyboardDisplay.quotaErrorTitle')}</p>
                                                <p className="text-xs mt-1">{t('storyboardDisplay.imageError')}</p>
                                                <p className="text-xs mt-1 text-slate-400">{t('storyboardDisplay.checkPlan')}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <textarea
                                            value={panel.description}
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                            rows={3}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-2 text-xs text-slate-300 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            aria-label={`Edit description for detailed panel ${index + 1}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                 <footer className="p-4 border-t border-slate-700 flex-shrink-0 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isSaveDisabled}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-5 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        {t('detailedModal.saveButton')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default DetailedStoryboardModal;