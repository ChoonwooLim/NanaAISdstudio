import React, { useState, useEffect } from 'react';
import { SampleProduct, SampleStory } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface SampleGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'product' | 'story';
    products: SampleProduct[];
    stories: SampleStory[];
    onSelectProduct: (product: SampleProduct) => void;
    onSelectStory: (story: SampleStory) => void;
}

const SampleGalleryModal: React.FC<SampleGalleryModalProps> = ({
    isOpen,
    onClose,
    type,
    products,
    stories,
    onSelectProduct,
    onSelectStory,
}) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

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

    const title = type === 'product' ? t('sampleModal.productTitle') : t('sampleModal.storyTitle');
    const items = type === 'product' ? products : stories;
    const placeholder = type === 'product' ? t('sampleModal.productSearchPlaceholder') : t('sampleModal.storySearchPlaceholder');

    const filteredItems = items.filter(item => {
        if (type === 'product') {
            const product = item as SampleProduct;
            return product.productName.toLowerCase().includes(searchTerm.toLowerCase()) || product.keyFeatures.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            const story = item as SampleStory;
            return story.keyword.toLowerCase().includes(searchTerm.toLowerCase()) || story.idea.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl font-bold">&times;</button>
                </header>
                
                <div className="p-4 flex-shrink-0">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>

                <div className="overflow-y-auto flex-grow p-4 pt-0">
                    <ul className="space-y-3">
                        {filteredItems.map((item, index) => {
                            const name = type === 'product' ? (item as SampleProduct).productName : (item as SampleStory).keyword;
                            const description = type === 'product' ? (item as SampleProduct).keyFeatures : (item as SampleStory).idea;
                            
                            const handleSelect = () => {
                                if (type === 'product') {
                                    onSelectProduct(item as SampleProduct);
                                } else {
                                    onSelectStory(item as SampleStory);
                                }
                            };

                            return (
                                <li key={index}>
                                    <button
                                        onClick={handleSelect}
                                        className="w-full text-left p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all duration-200 transform hover:border-blue-500 hover:scale-[1.02]"
                                    >
                                        <h3 className="font-semibold text-blue-400">{name}</h3>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{description}</p>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                     {filteredItems.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            <p>{t('sampleModal.noResults', { searchTerm })}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SampleGalleryModal;