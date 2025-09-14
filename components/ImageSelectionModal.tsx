import React, { useState } from 'react';
import { FAMOUS_PAINTINGS } from '../constants';
import { useTranslation } from '../i18n/LanguageContext';
import UploadIcon from './icons/UploadIcon';
import { MediaArtSourceImage } from '../types';

interface ImageSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (source: MediaArtSourceImage) => void;
}

const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onSelect({
                    type: 'upload',
                    url: reader.result as string,
                    title: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSelectPainting = (painting: typeof FAMOUS_PAINTINGS[0]) => {
         onSelect({
            type: 'painting',
            url: painting.imageUrl,
            title: t(painting.titleKey),
            artist: t(painting.artistKey),
        });
    };

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
                    <h2 className="text-lg font-bold text-white">{t('imageModal.title')}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl font-bold">&times;</button>
                </header>
                
                <div className="border-b border-slate-700 px-6 flex-shrink-0">
                    <nav className="flex space-x-4">
                        <button 
                            onClick={() => setActiveTab('gallery')}
                            className={`py-3 px-1 text-sm font-medium transition-colors ${activeTab === 'gallery' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
                        >
                            {t('imageModal.fromGallery')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('upload')}
                            className={`py-3 px-1 text-sm font-medium transition-colors ${activeTab === 'upload' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'}`}
                        >
                            {t('imageModal.uploadImage')}
                        </button>
                    </nav>
                </div>

                <div className="overflow-y-auto flex-grow">
                    {activeTab === 'gallery' && (
                         <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {FAMOUS_PAINTINGS.map((painting) => (
                                    <button 
                                        key={painting.id} 
                                        className="group block rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-all"
                                        onClick={() => handleSelectPainting(painting)}
                                    >
                                        <div className="aspect-[4/5] relative">
                                            <img 
                                                src={painting.imageUrl} 
                                                alt={t(painting.titleKey)} 
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 p-2 text-white">
                                                <p className="text-xs font-bold">{t(painting.titleKey)}</p>
                                                <p className="text-[10px] opacity-80">{t(painting.artistKey)}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'upload' && (
                        <div className="p-6 flex items-center justify-center h-full">
                             <label htmlFor="image-upload" className="w-full max-w-md flex flex-col items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700/80 border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-xl p-12 cursor-pointer transition-colors">
                                <UploadIcon className="w-10 h-10 text-slate-400" />
                                <span className="font-semibold text-slate-300">{t('imageModal.uploadCTA')}</span>
                                <span className="text-xs text-slate-500">{t('imageModal.uploadHint')}</span>
                            </label>
                            <input id="image-upload" type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileChange} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageSelectionModal;
