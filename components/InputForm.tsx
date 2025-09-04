
import React from 'react';
import { Tone } from '../types';
import { TONE_OPTIONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

interface InputFormProps {
    productName: string;
    setProductName: (value: string) => void;
    keyFeatures: string;
    setKeyFeatures: (value: string) => void;
    targetAudience: string;
    setTargetAudience: (value: string) => void;
    tone: Tone;
    setTone: (value: Tone) => void;
    onSubmit: () => void;
    isLoading: boolean;
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
    onSubmit,
    isLoading,
}) => {
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-slate-300 mb-2">
                        Product Name <span className="text-red-400">*</span>
                    </label>
                    <input
                        id="productName"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g., Ergonomic Office Chair"
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
                 <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">
                        Tone of Voice
                    </label>
                    <select
                        id="tone"
                        value={tone}
                        onChange={(e) => setTone(e.target.value as Tone)}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                        {TONE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="keyFeatures" className="block text-sm font-medium text-slate-300 mb-2">
                    Key Features / Keywords <span className="text-red-400">*</span>
                </label>
                <textarea
                    id="keyFeatures"
                    rows={4}
                    value={keyFeatures}
                    onChange={(e) => setKeyFeatures(e.target.value)}
                    placeholder="e.g., Lumbar support, breathable mesh, adjustable armrests, silent wheels"
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                ></textarea>
                <p className="text-xs text-slate-500 mt-1">Separate features with commas.</p>
            </div>
            
            <div>
                <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-300 mb-2">
                    Target Audience (Optional)
                </label>
                <input
                    id="targetAudience"
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Remote workers, gamers, students"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
            </div>
            
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            <span className="ml-2">Generating...</span>
                        </>
                    ) : (
                        '✨ Generate Description'
                    )}
                </button>
            </div>
        </form>
    );
};

export default InputForm;
