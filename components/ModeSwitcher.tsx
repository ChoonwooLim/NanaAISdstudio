import React from 'react';
import { AppMode } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface ModeSwitcherProps {
    mode: AppMode;
    setMode: (mode: AppMode) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ mode, setMode }) => {
    const { t } = useTranslation();
    const getButtonClass = (buttonMode: AppMode) => {
        const baseClass = "w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300";
        if (mode === buttonMode) {
            return `${baseClass} bg-slate-700 text-white shadow-inner`;
        }
        return `${baseClass} bg-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200`;
    };

    return (
        <div className="p-1 bg-slate-800/70 border border-slate-700 rounded-xl grid grid-cols-2 md:grid-cols-4 items-center gap-1">
            <button
                onClick={() => setMode(AppMode.DESCRIPTION)}
                className={getButtonClass(AppMode.DESCRIPTION)}
            >
                {t('modeSwitcher.productDescription')}
            </button>
            <button
                onClick={() => setMode(AppMode.STORYBOARD)}
                className={getButtonClass(AppMode.STORYBOARD)}
            >
                {t('modeSwitcher.storyboard')}
            </button>
            <button
                onClick={() => setMode(AppMode.MEDIA_ART)}
                className={getButtonClass(AppMode.MEDIA_ART)}
            >
                {t('modeSwitcher.mediaArt')}
            </button>
             <button
                onClick={() => setMode(AppMode.VISUAL_ART)}
                className={getButtonClass(AppMode.VISUAL_ART)}
            >
                {t('modeSwitcher.visualArt')}
            </button>
        </div>
    );
};

export default ModeSwitcher;