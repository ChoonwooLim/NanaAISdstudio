import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';
import { useTranslation } from '../i18n/LanguageContext';

interface DescriptionDisplayProps {
    description: string;
}

const DescriptionDisplay: React.FC<DescriptionDisplayProps> = ({ description }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(description);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">{t('descriptionDisplay.title')}</h2>
            <div className="relative bg-slate-900/70 border border-slate-700 rounded-lg p-6">
                <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors duration-200"
                    aria-label={t('descriptionDisplay.copyToClipboard')}
                >
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5 text-slate-400" />}
                </button>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {description}
                </div>
            </div>
        </div>
    );
};

export default DescriptionDisplay;