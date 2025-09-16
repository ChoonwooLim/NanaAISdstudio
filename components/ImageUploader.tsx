import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import UploadIcon from './icons/UploadIcon';
// FIX: Corrected the import to use the existing 'MediaArtSourceImage' type as suggested by the error.
import { MediaArtSourceImage } from '../types';

interface ImageUploaderProps {
    // FIX: Updated the type to 'MediaArtSourceImage'.
    onImageSelect: (image: MediaArtSourceImage) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
    const { t } = useTranslation();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // FIX: Updated the object to match the 'MediaArtSourceImage' interface.
                onImageSelect({
                    type: 'upload',
                    url: reader.result as string,
                    title: file.name
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <label htmlFor="visual-art-upload" className="w-full flex flex-col items-center justify-center gap-3 bg-slate-900/70 hover:bg-slate-800/80 border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-12 cursor-pointer transition-colors">
                <UploadIcon className="w-12 h-12 text-slate-500" />
                <span className="font-semibold text-slate-300">{t('imageUploader.cta')}</span>
                <span className="text-sm text-slate-500 text-center">{t('imageUploader.hint')}</span>
            </label>
            <input id="visual-art-upload" type="file" accept="image/png, image/jpeg, image/webp" className="hidden" onChange={handleFileChange} />
        </div>
    );
};

export default ImageUploader;