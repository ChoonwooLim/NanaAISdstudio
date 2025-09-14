// FIX: Created this file to define and export shared types, resolving module resolution errors.

export enum Tone {
    PROFESSIONAL = 'professional',
    FRIENDLY = 'friendly',
    HUMOROUS = 'humorous',
    LUXURIOUS = 'luxurious',
}

export enum AspectRatio {
    LANDSCAPE = '16:9',
    PORTRAIT = '9:16',
    SQUARE = '1:1',
    VERTICAL = '3:4',
    CLASSIC = '4:3',
}

export enum VisualStyle {
    PHOTOREALISTIC = 'photorealistic',
    CINEMATIC = 'cinematic',
    ANIME = 'anime',
    WATERCOLOR = 'watercolor',
    CLAYMATION = 'claymation',
    PIXEL_ART = 'pixel-art',
}

export enum VideoLength {
    SHORT = 'short',
    MEDIUM = 'medium',
    LONG = 'long',
}

export enum Mood {
    FAST_PACED = 'fast-paced',
    EMOTIONAL = 'emotional',
    MYSTERIOUS = 'mysterious',
    COMEDIC = 'comedic',
    EPIC = 'epic',
}

export enum MediaArtStyle {
    SUBTLE_MOTION = 'subtle-motion',
    PARALLAX = 'parallax',
    DREAMLIKE = 'dreamlike',
    ELEMENTAL = 'elemental',
}

export enum AppMode {
    DESCRIPTION = 'description',
    STORYBOARD = 'storyboard',
    MEDIA_ART = 'media-art',
}

export interface FamousPainting {
    id: string;
    titleKey: string;
    artistKey: string;
    year: string;
    imageUrl: string;
}

export interface StoryboardConfig {
    sceneCount: number;
    aspectRatio: AspectRatio;
    visualStyle: VisualStyle;
    videoLength: VideoLength;
    mood: Mood;
    descriptionLanguage: string;
    textModel: string;
    imageModel: string;
    videoModel: string;
}

export interface SampleProduct {
    productName: string;
    keyFeatures: string;
    targetAudience: string;
    tone: Tone;
}

export interface SampleStory {
    keyword: string;
    idea: string;
    config: StoryboardConfig;
}

export interface StoryboardPanel {
    description: string;
    imageUrl: string | null;
    isLoadingImage: boolean;
    videoUrl: string | null;
    isLoadingVideo: boolean;
    sceneDuration: number;
}

export interface DetailedStoryboardPanel {
    description: string;
    imageUrl?: string | null;
    isLoadingImage?: boolean;
}

export interface Project {
    id: string;
    timestamp: number;
    title: string;
    thumbnailUrl: string | null;
    mode: AppMode;
    // Description mode state
    productName?: string;
    keyFeatures?: string;
    targetAudience?: string;
    tone?: Tone;
    descriptionLanguage?: string;
    descriptionModel?: string;
    description?: string;
    // Storyboard mode state
    storyIdea?: string;
    storyboardConfig?: StoryboardConfig;
    panels?: StoryboardPanel[];
    // Media Art state
    mediaArt?: {
        sourceImageUrl: string;
        resultImageUrl: string;
        prompt: string;
    }
}
