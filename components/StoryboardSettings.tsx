import React from 'react';
import { StoryboardConfig, AspectRatio, VisualStyle, VideoLength, Mood } from '../types';
import { 
    ASPECT_RATIO_OPTIONS, 
    VISUAL_STYLE_OPTIONS, 
    VIDEO_LENGTH_OPTIONS, 
    MOOD_OPTIONS, 
    DESCRIPTION_LANGUAGE_OPTIONS,
    TEXT_MODEL_OPTIONS,
    IMAGE_MODEL_OPTIONS,
    VIDEO_MODEL_OPTIONS
} from '../constants';
import { useTranslation } from '../i18n/LanguageContext';

interface StoryboardSettingsProps {
    config: StoryboardConfig;
    setConfig: (config: StoryboardConfig) => void;
}

const StoryboardSettings: React.FC<StoryboardSettingsProps> = ({ config, setConfig }) => {
    const { t } = useTranslation();
    
    const handleConfigChange = (field: keyof StoryboardConfig, value: any) => {
        const newConfig = { ...config, [field]: value };
        // Ensure scene count is within bounds
        if (field === 'sceneCount') {
            const numValue = parseInt(value, 10);
            if (numValue < 2) {
                newConfig.sceneCount = 2;
            } else if (numValue > 10) {
                newConfig.sceneCount = 10;
            } else {
                newConfig.sceneCount = numValue;
            }
        }
        setConfig(newConfig);
    };

    const selectedTextModel = TEXT_MODEL_OPTIONS.find(o => o.value === config.textModel);
    const selectedImageModel = IMAGE_MODEL_OPTIONS.find(o => o.value === config.imageModel);
    const selectedVideoModel = VIDEO_MODEL_OPTIONS.find(o => o.value === config.videoModel);

    return (
        <fieldset className="space-y-6">
            <legend className="block text-sm font-medium text-slate-300 mb-2">{t('storyboardSettings.title')}</legend>
            
            {/* Story Settings */}
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/30">
                <h3 className="block text-xs font-semibold text-slate-300 mb-4">{t('storyboardSettings.storySection')}</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                     <div>
                        <label htmlFor="sceneCount" className="block text-xs font-medium text-slate-400 mb-1">
                           {t('storyboardSettings.scenes')}
                        </label>
                        <input
                            id="sceneCount"
                            type="number"
                            min="2"
                            max="10"
                            value={config.sceneCount}
                            onChange={(e) => handleConfigChange('sceneCount', e.target.value)}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="mood" className="block text-xs font-medium text-slate-400 mb-1">
                           {t('storyboardSettings.moodPacing')}
                        </label>
                        <select
                            id="mood"
                            value={config.mood}
                            onChange={(e) => handleConfigChange('mood', e.target.value as Mood)}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {MOOD_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="videoLength" className="block text-xs font-medium text-slate-400 mb-1">
                           {t('storyboardSettings.pacing')}
                        </label>
                        <select
                            id="videoLength"
                            value={config.videoLength}
                            onChange={(e) => handleConfigChange('videoLength', e.target.value as VideoLength)}
                             className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {VIDEO_LENGTH_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="descriptionLanguage" className="block text-xs font-medium text-slate-400 mb-1">
                            {t('storyboardSettings.descriptionLanguage')}
                        </label>
                        <select
                            id="descriptionLanguage"
                            value={config.descriptionLanguage}
                            onChange={(e) => handleConfigChange('descriptionLanguage', e.target.value)}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {DESCRIPTION_LANGUAGE_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="textModel" className="block text-xs font-medium text-slate-400 mb-1">
                            {t('storyboardSettings.textModel')}
                        </label>
                        <select
                            id="textModel"
                            value={config.textModel}
                            onChange={(e) => handleConfigChange('textModel', e.target.value)}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {TEXT_MODEL_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                        {selectedTextModel && <p className="text-xs text-slate-500 mt-1">{selectedTextModel.description}</p>}
                    </div>
                </div>
            </div>

            {/* Image Settings */}
            <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/30">
                <h3 className="block text-xs font-semibold text-slate-300 mb-4">{t('storyboardSettings.imageSection')}</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                     <div>
                        <label htmlFor="aspectRatio" className="block text-xs font-medium text-slate-400 mb-1">
                           {t('storyboardSettings.aspectRatio')}
                        </label>
                        <select
                            id="aspectRatio"
                            value={config.aspectRatio}
                            onChange={(e) => handleConfigChange('aspectRatio', e.target.value as AspectRatio)}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {ASPECT_RATIO_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="visualStyle" className="block text-xs font-medium text-slate-400 mb-1">
                           {t('storyboardSettings.visualStyle')}
                        </label>
                        <select
                            id="visualStyle"
                            value={config.visualStyle}
                            onChange={(e) => handleConfigChange('visualStyle', e.target.value as VisualStyle)}
                             className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {VISUAL_STYLE_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="imageModel" className="block text-xs font-medium text-slate-400 mb-1">
                            {t('storyboardSettings.imageModel')}
                        </label>
                        <select
                            id="imageModel"
                            value={config.imageModel}
                            onChange={(e) => handleConfigChange('imageModel', e.target.value)}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {IMAGE_MODEL_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                        {selectedImageModel && <p className="text-xs text-slate-500 mt-1">{selectedImageModel.description}</p>}
                    </div>
                 </div>
            </div>

            {/* Video Settings */}
             <div className="p-4 border border-slate-700 rounded-lg bg-slate-900/30">
                <h3 className="block text-xs font-semibold text-slate-300 mb-4">{t('storyboardSettings.videoSection')}</h3>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="videoModel" className="block text-xs font-medium text-slate-400 mb-1">
                            {t('storyboardSettings.videoModel')}
                        </label>
                        <select
                            id="videoModel"
                            value={config.videoModel}
                            onChange={(e) => handleConfigChange('videoModel', e.target.value)}
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {VIDEO_MODEL_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-slate-800">{o.label}</option>)}
                        </select>
                        {selectedVideoModel && <p className="text-xs text-slate-500 mt-1">{selectedVideoModel.description}</p>}
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 mt-4">{t('storyboardSettings.videoNote')}</p>
            </div>

        </fieldset>
    );
};

export default StoryboardSettings;