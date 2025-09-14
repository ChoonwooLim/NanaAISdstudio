import { Tone, AspectRatio, VisualStyle, VideoLength, Mood, MediaArtStyle, FamousPainting } from './types';

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
    { value: Tone.PROFESSIONAL, label: 'Professional' },
    { value: Tone.FRIENDLY, label: 'Friendly & Casual' },
    { value: Tone.HUMOROUS, label: 'Witty & Humorous' },
    { value: Tone.LUXURIOUS, label: 'Luxurious & Elegant' },
];

export const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
    { value: AspectRatio.LANDSCAPE, label: '16:9 Landscape' },
    { value: AspectRatio.PORTRAIT, label: '9:16 Portrait' },
    { value: AspectRatio.SQUARE, label: '11 Square' },
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


export const MEDIA_ART_STYLE_OPTIONS: { value: MediaArtStyle, labelKey: string, descriptionKey: string }[] = [
    { value: MediaArtStyle.SUBTLE_MOTION, labelKey: 'subtleMotion', descriptionKey: 'subtleMotionDesc' },
    { value: MediaArtStyle.PARALLAX, labelKey: 'parallax', descriptionKey: 'parallaxDesc' },
    { value: MediaArtStyle.DREAMLIKE, labelKey: 'dreamlike', descriptionKey: 'dreamlikeDesc' },
    { value: MediaArtStyle.ELEMENTAL, labelKey: 'elemental', descriptionKey: 'elementalDesc' },
];

export const FAMOUS_PAINTINGS: FamousPainting[] = [
    { 
        id: 'starry-night', 
        titleKey: 'paintings.starryNight.title', 
        artistKey: 'paintings.starryNight.artist', 
        year: '1889', 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'
    },
    { 
        id: 'great-wave', 
        titleKey: 'paintings.greatWave.title', 
        artistKey: 'paintings.greatWave.artist', 
        year: 'c. 1831', 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1280px-Tsunami_by_hokusai_19th_century.jpg'
    },
    { 
        id: 'pearl-earring', 
        titleKey: 'paintings.pearlEarring.title', 
        artistKey: 'paintings.pearlEarring.artist', 
        year: 'c. 1665', 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1280px-1665_Girl_with_a_Pearl_Earring.jpg'
    },
    { 
        id: 'mona-lisa', 
        titleKey: 'paintings.monaLisa.title', 
        artistKey: 'paintings.monaLisa.artist', 
        year: 'c. 1503-1506', 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1280px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg'
    },
    { 
        id: 'wanderer-sea-fog', 
        titleKey: 'paintings.wandererSeaFog.title', 
        artistKey: 'paintings.wandererSeaFog.artist', 
        year: 'c. 1818', 
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/1280px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg'
    },
    {
        id: 'birth-of-venus',
        titleKey: 'paintings.birthOfVenus.title',
        artistKey: 'paintings.birthOfVenus.artist',
        year: 'c. 1486',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg'
    },
    {
        id: 'the-scream',
        titleKey: 'paintings.theScream.title',
        artistKey: 'paintings.theScream.artist',
        year: '1893',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/1280px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg'
    },
    {
        id: 'american-gothic',
        titleKey: 'paintings.americanGothic.title',
        artistKey: 'paintings.americanGothic.artist',
        year: '1930',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/1280px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg'
    },
    {
        id: 'the-night-watch',
        titleKey: 'paintings.theNightWatch.title',
        artistKey: 'paintings.theNightWatch.artist',
        year: '1642',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/The_Night_Watch_-_HD.jpg/1280px-The_Night_Watch_-_HD.jpg'
    },
    {
        id: 'luncheon-boating-party',
        titleKey: 'paintings.luncheonBoatingParty.title',
        artistKey: 'paintings.luncheonBoatingParty.artist',
        year: '1881',
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Pierre-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg/1280px-Pierre-Auguste_Renoir_-_Luncheon_of_the_Boating_Party_-_Google_Art_Project.jpg'
    }
];
