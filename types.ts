import { Modality } from "@google/genai";

// FIX: Define all necessary types for the application.

export enum AppMode {
    DESCRIPTION = 'DESCRIPTION',
    STORYBOARD = 'STORYBOARD',
    MEDIA_ART = 'MEDIA_ART',
    VISUAL_ART = 'VISUAL_ART',
}

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
    FAST_PACED = 'fast-paced and energetic',
    EMOTIONAL = 'slow and emotional',
    MYSTERIOUS = 'mysterious and suspenseful',
    COMEDIC = 'comedic and lighthearted',
    EPIC = 'epic and grandiose',
}

export enum MediaArtStyle {
    SUBTLE_MOTION = 'subtle motion',
    PARALLAX = 'parallax effect',
    DREAMLIKE = 'dreamlike and ethereal',
    ELEMENTAL = 'elemental forces',
}

export enum VisualArtEffect {
    GLITCH = 'glitch art',
    KALEIDOSCOPE = 'kaleidoscope',
    LIQUID_CHROMATIC = 'liquid chromatic aberration',
    PIXEL_SORT = 'pixel sorting',
    ASCII_STORM = 'ascii storm',
}


export interface DescriptionConfig {
    productName: string;
    keyFeatures: string;
    targetAudience: string;
    tone: Tone;
    language: string;
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
    isLoadingImage?: boolean;
    videoUrl?: string;
    isLoadingVideo?: boolean;
    videoError?: string | null;
    sceneDuration?: number;
}

export interface DetailedStoryboardPanel {
    description: string;
    imageUrl?: string;
    isLoadingImage?: boolean;
}

export interface FamousPainting {
    id: string;
    titleKey: string;
    artistKey: string;
    year: string;
    imageUrl: string;
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

export interface Project {
    id: string;
    timestamp: number;
    title: string;
    thumbnailUrl?: string;
    data: any; // Can be the state of any of the modes
}

export interface MediaArtSourceImage {
    type: 'upload' | 'painting';
    url: string; // dataURL or remote URL
    title: string;
    artist?: string;
}

export interface MediaArtState {
    sourceImage: MediaArtSourceImage | null;
    style: MediaArtStyle;
    panels: StoryboardPanel[];
}

export interface VisualArtState {
    inputText: string;
    effect: VisualArtEffect;
    resultVideoUrl: string | null;
    isLoading: boolean;
    error: string | null;
}