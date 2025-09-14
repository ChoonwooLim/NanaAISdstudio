import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

const ApiKeyInstructions: React.FC = () => {
    const { t } = useTranslation();
    const googleAIStudioLink = `<a 
        href="https://aistudio.google.com/app/apikey" 
        target="_blank" 
        rel="noopener noreferrer"
        class="text-blue-400 hover:text-blue-300 underline"
    >${t('storyboardDisplay.googleAIStudio')}</a>`;
    const apiKeyCode = `<code class="bg-slate-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-xs">API_KEY</code>`;

    return (
        <div className="bg-slate-900 min-h-screen text-white font-sans flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                    {t('apiKeyInstructions.title')}
                </h1>
                <p className="mt-4 text-slate-400">
                    {t('apiKeyInstructions.welcome')}
                </p>
                <div className="mt-6 text-left bg-slate-900/70 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 font-medium">{t('apiKeyInstructions.howTo')}</p>
                    <ol className="list-decimal list-inside mt-3 text-slate-400 space-y-2 text-sm">
                        <li dangerouslySetInnerHTML={{ __html: t('apiKeyInstructions.step1', { link: googleAIStudioLink }) }} />
                        <li dangerouslySetInnerHTML={{ __html: t('apiKeyInstructions.step2', { apiKey: apiKeyCode }) }} />
                        <li>{t('apiKeyInstructions.step3')}</li>
                    </ol>
                </div>
                 <p className="mt-6 text-xs text-slate-500">
                    {t('apiKeyInstructions.disclaimer')}
                </p>
            </div>
        </div>
    );
};

export default ApiKeyInstructions;