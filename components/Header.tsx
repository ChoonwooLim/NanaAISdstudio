import React from 'react';

interface HeaderProps {
    onOpenGallery: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenGallery }) => {
    const title = 'Artifex.AI Studio Pro';
    const subtitle = 'From product descriptions to video storyboards, bring your ideas to life with AI.';

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