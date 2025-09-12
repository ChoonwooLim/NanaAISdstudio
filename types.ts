

export enum Tone {
    PROFESSIONAL = 'PROFESSIONAL',
    FRIENDLY = 'FRIENDLY',
    HUMOROUS = 'HUMOROUS',
    LUXURIOUS = 'LUXURIOUS',
}

export enum AppMode {
    DESCRIPTION = 'DESCRIPTION',
    STORYBOARD = 'STORYBOARD',
}

export enum AspectRatio {
    LANDSCAPE = '16:9',
    PORTRAIT = '9:16',
    SQUARE = '1:1',
    CLASSIC = '4:3',
}

export enum VideoLength {
    SHORT = '15 seconds',
    MEDIUM = '30 seconds',
    LONG = '60 seconds',
}

export enum VisualStyle {
    PHOTOREALISTIC = 'Photorealistic',
    CINEMATIC = 'Cinematic',
    ANIME = 'Anime',
    WATERCOLOR = 'Watercolor',
    CLAYMATION = 'Claymation',
    PIXEL_ART = 'Pixel Art',
}

export enum Mood {
    FAST_PACED = 'Fast-paced & Energetic',
    EMOTIONAL = 'Slow & Emotional',
    MYSTERIOUS = 'Mysterious & Suspenseful',
    COMEDIC = 'Comedic & Lighthearted',
    EPIC = 'Epic & Grandiose',
}

export interface ProductDetails {
    productName: string;
    keyFeatures: string;
    targetAudience?: string;
    tone: Tone;
}

export interface StoryboardConfig {
    sceneCount: number;
    aspectRatio: AspectRatio;
    visualStyle: VisualStyle;
    videoLength: VideoLength;
    mood: Mood;
}

export interface StoryboardPanel {
    description: string;
    imageUrl: string; // Can be a base64 data URL, blob URL, 'error', or empty string
    isLoadingImage: boolean;
    videoUrl?: string; // Can be a blob URL, 'error', or undefined
    isLoadingVideo?: boolean;
}

export interface DetailedStoryboardPanel {
    description: string;
    imageUrl: string; // Can be a base64 data URL, blob URL, 'error', or empty string
    isLoadingImage: boolean;
    videoUrl?: string;
    isLoadingVideo?: boolean;
}

// App state structure for saving/loading
export interface AppState {
    mode: AppMode;
    productName: string;
    keyFeatures: string;
    targetAudience: string;
    tone: Tone;
    storyIdea: string;
    storyboardConfig: StoryboardConfig;
    description: string;
    storyboardPanels: StoryboardPanel[];
}

// Structure for a saved project in the gallery
export interface Project {
    id: string; // Unique ID, e.g., timestamp
    title: string;
    timestamp: number;
    thumbnailUrl: string; // First panel's image as a blob URL for quick preview
    appState: AppState;
}