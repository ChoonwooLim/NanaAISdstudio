import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    const { t } = useTranslation();

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
        >
            <div
                className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h2 id="confirmation-title" className="text-lg font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl font-bold" aria-label="Close">&times;</button>
                </header>
                <div className="p-6 text-slate-300 text-sm leading-relaxed">
                    {message.split('\n').map((line, i) => <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>)}
                </div>
                <footer className="p-4 border-t border-slate-700 flex flex-col sm:flex-row-reverse justify-start gap-3">
                    <button
                        onClick={onConfirm}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-5 rounded-lg shadow-lg transition-all"
                    >
                        {t('confirmations.confirm')}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-2 px-5 rounded-lg transition-colors"
                    >
                        {t('confirmations.cancel')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ConfirmationModal;
