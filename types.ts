// FIX: Re-implement the Media Art state management to support the multi-step video generation workflow, including panels for scenes, images, and videos.

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
    PIXEL_ART = 'pixel art',
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
    SUBTLE_MOTION = 'subtle motion',
    PARALLAX = 'parallax',
    DREAMLIKE = 'dreamlike',
    ELEMENTAL = 'elemental',
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

export interface StoryboardPanel {
    description: string;
    imageUrl?: string;
    isLoadingImage: boolean;
    sceneDuration?: number;
    videoUrl?: string;
    isLoadingVideo: boolean;
    videoError?: string;
}

export interface DetailedStoryboardPanel {
    description: string;
    imageUrl?: string;
    isLoadingImage: boolean;
}

export enum AppMode {
    DESCRIPTION = 'description',
    STORYBOARD = 'storyboard',
    MEDIA_ART = 'media_art',
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

export interface DescriptionState {
    productName: string;
    keyFeatures: string;
    targetAudience: string;
    tone: Tone;
    descriptionLanguage: string;
    descriptionModel: string;
    generatedDescription: string;
}

export interface StoryboardState {
    storyIdea: string;
    config: StoryboardConfig;
    panels: StoryboardPanel[];
}

export interface MediaArtSourceImage {
    type: 'painting' | 'upload';
    url: string; 
    title: string;
    artist?: string;
}

export interface MediaArtPanel {
    description: string;
    imageUrl?: string;
    isLoadingImage: boolean;
    videoUrl?: string;
    isLoadingVideo: boolean;
    videoError?: string;
}

export interface MediaArtState {
    sourceImage: MediaArtSourceImage | null;
    style: MediaArtStyle;
    panels: MediaArtPanel[];
}

export interface Project {
    id: string;
    timestamp: number;
    title: string;
    thumbnailUrl?: string;
    mode: AppMode;
    descriptionState?: DescriptionState;
    storyboardState?: StoryboardState;
    mediaArtState?: MediaArtState;
}