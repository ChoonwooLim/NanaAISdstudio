import React from 'react';
import { AppMode } from '../types';

interface HeaderProps {
    mode: AppMode;
    onOpenGallery: () => void;
}

const Header: React.FC<HeaderProps> = ({ mode, onOpenGallery }) => {
    const title = mode === AppMode.DESCRIPTION ? 'AI Product Description Generator' : 'AI Storyboard Generator';
    const subtitle = mode === AppMode.DESCRIPTION 
        ? 'Craft compelling product descriptions in seconds. Just fill in the details below and let our AI do the magic!'
        : 'Visualize your ideas instantly. Describe your story, set your creative direction, and generate a complete storyboard.';

    return (
        <header className="text-center relative">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                {title}
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                {subtitle}
            </p>
             <div className="absolute top-0 right-0">
                <button 
                    onClick={onOpenGallery}
                    className="bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Open Gallery
                </button>
            </div>
        </header>
    );
};

export default Header;
