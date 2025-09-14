import { Tone, AspectRatio, VisualStyle, VideoLength, Mood } from './types';

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
    { value: Tone.PROFESSIONAL, label: 'Professional' },
    { value: Tone.FRIENDLY, label: 'Friendly & Casual' },
    { value: Tone.HUMOROUS, label: 'Witty & Humorous' },
    { value: Tone.LUXURIOUS, label: 'Luxurious & Elegant' },
];

export const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
    { value: AspectRatio.LANDSCAPE, label: '16:9 Landscape' },
    { value: AspectRatio.PORTRAIT, label: '9:16 Portrait' },
    { value: AspectRatio.SQUARE, label: '1:1 Square' },
    { value: AspectRatio.VERTICAL, label: '3:4 Vertical' },
    { value: AspectRatio.CLASSIC, label: '4:3 Classic' },
];

export const VISUAL_STYLE_OPTIONS: { value: VisualStyle; label: string }[] = [
    { value: VisualStyle.PHOTOREALISTIC, label: 'Photorealistic' },
    { value: VisualStyle.CINEMATIC, label: 'Cinematic' },
    { value: VisualStyle.ANIME, label: 'Anime' },
    { value: VisualStyle.WATERCOLOR, label: 'Watercolor' },
    { value: VisualStyle.CLAYMATION, label: 'Claymation' },
    { value: VisualStyle.PIXEL_ART, label: 'Pixel Art' },
];

export const VIDEO_LENGTH_OPTIONS: { value: VideoLength; label: string }[] = [
    { value: VideoLength.SHORT, label: '15 seconds' },
    { value: VideoLength.MEDIUM, label: '30 seconds' },
    { value: VideoLength.LONG, label: '60 seconds' },
];

export const MOOD_OPTIONS: { value: Mood; label: string }[] = [
    { value: Mood.FAST_PACED, label: 'Fast-paced & Energetic' },
    { value: Mood.EMOTIONAL, label: 'Slow & Emotional' },
    { value: Mood.MYSTERIOUS, label: 'Mysterious & Suspenseful' },
    { value: Mood.COMEDIC, label: 'Comedic & Lighthearted' },
    { value: Mood.EPIC, label: 'Epic & Grandiose' },
];

export const DESCRIPTION_LANGUAGE_OPTIONS: { value: string; label: string }[] = [
    { value: 'English', label: 'English' },
    { value: 'Korean', label: '한국어' },
    { value: 'Japanese', label: '日本語' },
    { value: 'Spanish', label: 'Español' },
    { value: 'French', label: 'Français' },
];

// FIX: Removed 'gemini-2.5-pro' to adhere to the coding guidelines, which specify 'gemini-2.5-flash' for general text tasks.
export const TEXT_MODEL_OPTIONS: { value: string; label: string; description: string }[] = [
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', description: 'Fast, multimodal, and cost-effective for most tasks.' },
];

// FIX: Removed 'imagen-3.0-generate-001' to adhere to the coding guidelines, which specify 'imagen-4.0-generate-001' for image generation.
export const IMAGE_MODEL_OPTIONS: { value: string; label: string; description: string }[] = [
    { value: 'imagen-4.0-generate-001', label: 'Imagen 4.0', description: 'Google\'s most advanced image generation model.' },
];

// FIX: Removed 'veo-3.0-generate-001' to adhere to the coding guidelines, which specify 'veo-2.0-generate-001' for video generation.
export const VIDEO_MODEL_OPTIONS: { value: string; label: string; description: string }[] = [
    { value: 'veo-2.0-generate-001', label: 'Veo 2.0', description: 'Google\'s advanced video model.' },
];
