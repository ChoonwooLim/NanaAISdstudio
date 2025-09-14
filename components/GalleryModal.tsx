import React from 'react';
import { Project } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface GalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    onLoad: (id: string) => void;
    onDelete: (id: string) => void;
    onExport: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, projects, onLoad, onDelete, onExport }) => {
    const { t } = useTranslation();
    if (!isOpen) return null;

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
                    <h2 className="text-lg font-bold text-white">{t('galleryModal.title')}</h2>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={onExport} 
                            disabled={projects.length === 0} 
                            className="text-xs font-medium bg-slate-600/50 hover:bg-slate-600/80 text-slate-200 py-1.5 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {t('common.exportAll')}
                        </button>
                        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl font-bold">&times;</button>
                    </div>
                </header>

                <div className="p-6 overflow-y-auto flex-grow">
                    {projects.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            <p>{t('galleryModal.noProjects')}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div key={project.id} className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden flex flex-col group">
                                    <div className="aspect-video bg-slate-800 flex items-center justify-center">
                                        {project.thumbnailUrl ? (
                                            <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-slate-600 text-xs">{t('galleryModal.noPreview')}</div>
                                        )}
                                    </div>
                                    <div className="p-3 flex-grow flex flex-col">
                                        <p className="text-sm font-semibold text-slate-200 truncate flex-grow" title={project.title}>
                                            {project.title}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(project.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="p-2 border-t border-slate-700 bg-slate-900/30 flex justify-end space-x-2">
                                        <button 
                                            onClick={() => onLoad(project.id)}
                                            className="text-xs font-medium bg-blue-600/50 hover:bg-blue-600/80 text-blue-200 py-1 px-3 rounded-md transition-colors"
                                        >
                                            {t('galleryModal.load')}
                                        </button>
                                        <button 
                                            onClick={() => onDelete(project.id)}
                                            className="text-xs font-medium bg-red-600/50 hover:bg-red-600/80 text-red-200 py-1 px-3 rounded-md transition-colors"
                                        >
                                            {t('galleryModal.delete')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryModal;