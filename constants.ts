import { Tone, AspectRatio, VisualStyle, VideoLength, Mood } from './types';

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
    { value: Tone.PROFESSIONAL, label: 'Professional' },
    { value: Tone.FRIENDLY, label: 'Friendly & Casual' },
    { value: Tone.HUMOROUS, label: 'Witty & Humorous' },
    { value: Tone.LUXURIOUS, label: 'Luxurious & Elegant' },
];

export const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
    { value: AspectRatio.LANDSCAPE, label: '16:9 Landscape' },
    { value: AspectRatio.PORTRAIT, label: '9:16 Portrait (Shorts)' },
    { value: AspectRatio.SQUARE, label: '1:1 Square' },
    { value: AspectRatio.CLASSIC, label: '4:3 Classic TV' },
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