import React from 'react';
import { AppMode } from '../types';

interface HeaderProps {
    mode: AppMode;
}

const Header: React.FC<HeaderProps> = ({ mode }) => {
    const title = mode === AppMode.DESCRIPTION ? 'AI Product Description Generator' : 'AI Storyboard Generator';
    const subtitle = mode === AppMode.DESCRIPTION 
        ? 'Craft compelling product descriptions in seconds. Just fill in the details below and let our AI do the magic!'
        : 'Visualize your ideas instantly. Describe your story, set your creative direction, and generate a complete storyboard.';

    return (
        <header className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                {title}
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
                {subtitle}
            </p>
        </header>
    );
};

export default Header;