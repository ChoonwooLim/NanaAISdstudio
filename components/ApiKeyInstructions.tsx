import React from 'react';

const ApiKeyInstructions: React.FC = () => {
    return (
        <div className="bg-slate-900 min-h-screen text-white font-sans flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                    Gemini API Key Required
                </h1>
                <p className="mt-4 text-slate-400">
                    Welcome! To use this application, you need to provide your Google Gemini API key.
                </p>
                <div className="mt-6 text-left bg-slate-900/70 border border-slate-700 rounded-lg p-4">
                    <p className="text-slate-300 font-medium">How to set up your API key:</p>
                    <ol className="list-decimal list-inside mt-3 text-slate-400 space-y-2 text-sm">
                        <li>
                            Obtain your API key from{' '}
                            <a 
                                href="https://aistudio.google.com/app/apikey" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline"
                            >
                                Google AI Studio
                            </a>.
                        </li>
                        <li>
                            Set it as an environment variable named{' '}
                            <code className="bg-slate-700 text-yellow-300 px-1.5 py-0.5 rounded-md font-mono text-xs">API_KEY</code>{' '}
                            in your execution environment.
                        </li>
                         <li>
                            Once the key is set, please reload this application.
                        </li>
                    </ol>
                </div>
                 <p className="mt-6 text-xs text-slate-500">
                    Your API key is used directly by the application and is never stored or shared.
                </p>
            </div>
        </div>
    );
};

export default ApiKeyInstructions;
