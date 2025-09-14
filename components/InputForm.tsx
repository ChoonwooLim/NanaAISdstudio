import React from 'react';
import { Tone } from '../types';
import { TONE_OPTIONS, TEXT_MODEL_OPTIONS, DESCRIPTION_LANGUAGE_OPTIONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from '../i18n/LanguageContext';
import SaveIcon from './icons/SaveIcon';
import DownloadIcon from './icons/DownloadIcon';

interface InputFormProps {
    productName: string;
    setProductName: (value: string) => void;
    keyFeatures: string;
    setKeyFeatures: (value: string) => void;
    targetAudience: string;
    setTargetAudience: (value: string) => void;
    tone: Tone;
    setTone: (value: Tone) => void;
    descriptionLanguage: string;
    setDescriptionLanguage: (value: string) => void;
    descriptionModel: string;
    setDescriptionModel: (value: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    productNameIsKorean: boolean;
    keyFeaturesIsKorean: boolean;
    targetAudienceIsKorean: boolean;
    onSave: () => void;
    onExport: () => void;
    canSave: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
    productName,
    setProductName,
    keyFeatures,
    setKeyFeatures,
    targetAudience,
    setTargetAudience,
    tone,
    setTone,
    descriptionLanguage,
    setDescriptionLanguage,
    descriptionModel,
    setDescriptionModel,
    onSubmit,
    isLoading,
    productNameIsKorean,
    keyFeaturesIsKorean,
    targetAudienceIsKorean,
    onSave,
    onExport,
    canSave,
}) => {
    const { t } = useTranslation();
    const selectedModel = TEXT_MODEL_OPTIONS.find(o => o.value === descriptionModel);
    
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            <div>
                <label htmlFor="productName" className="block text-sm font-medium text-slate-300 mb-2">
                    {t('descriptionForm.productName')} <span className="text-red-400">*</span>
                </label>
                <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={t('descriptionForm.productNamePlaceholder')}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                {productNameIsKorean && <p className="text-xs text-cyan-400 mt-1">{t('common.koreanDetected')}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">
                        {t('descriptionForm.toneOfVoice')}
                    </label>
                    <select
                        id="tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value as Tone)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                        {TONE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                                {t(`tones.${option.value}`)}
                            </option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="descriptionLanguage" className="block text-sm font-medium text-slate-300 mb-2">
                        {t('common.language')}
                    </label>
                    <select
                        id="descriptionLanguage"
                        value={descriptionLanguage}
                        onChange={(e) => setDescriptionLanguage(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                        {DESCRIPTION_LANGUAGE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                 <div>
                    <label htmlFor="descriptionModel" className="block text-sm font-medium text-slate-300 mb-2">
                        {t('descriptionForm.aiModel')}
                    </label>
                    <select
                        id="descriptionModel"
                        value={descriptionModel}
                        onChange={(e) => setDescriptionModel(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                        {TEXT_MODEL_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {selectedModel && <p className="text-xs text-slate-500 mt-1">{selectedModel.description}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="keyFeatures" className="block text-sm font-medium text-slate-300 mb-2">
                    {t('descriptionForm.keyFeatures')} <span className="text-red-400">*</span>
                </label>
                <textarea
                    id="keyFeatures"
                    rows={4}
                    value={keyFeatures}
                    onChange={(e) => setKeyFeatures(e.target.value)}
                    placeholder={t('descriptionForm.keyFeaturesPlaceholder')}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                ></textarea>
                 {keyFeaturesIsKorean && <p className="text-xs text-cyan-400 mt-1">{t('common.koreanDetected')}</p>}
                <p className="text-xs text-slate-500 mt-1">{t('descriptionForm.keyFeaturesHint')}</p>
            </div>
            
            <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-300 mb-2">
                    {t('descriptionForm.targetAudience')}
                </label>
                <input
                    id="targetAudience"
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder={t('descriptionForm.targetAudiencePlaceholder')}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                 {targetAudienceIsKorean && <p className="text-xs text-cyan-400 mt-1">{t('common.koreanDetected')}</p>}
            </div>
            
            <div className="pt-2 flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">{t('common.generating')}</span>
                        </>
                    ) : (
                        t('descriptionForm.generateButton')
                    )}
                </button>
                <div className="flex-shrink-0 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={!canSave}
                        className="flex items-center justify-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('tooltips.saveToGallery')}
                    >
                        <SaveIcon className="w-5 h-5" />
                        <span className="hidden sm:inline ml-2">{t('common.saveToGallery')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={onExport}
                        disabled={!canSave}
                        className="flex items-center justify-center bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={t('tooltips.exportProject')}
                    >
                        <DownloadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline ml-2">{t('common.export')}</span>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default InputForm;