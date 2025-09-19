import { Modality } from "@google/genai";

// Defines all necessary types for the application.
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
    DATA_COMPOSITION = 'data_composition',
    DIGITAL_NATURE = 'digital_nature',
    AI_DATA_SCULPTURE = 'ai_data_sculpture',
    LIGHT_AND_SPACE = 'light_and_space',
    KINETIC_MIRRORS = 'kinetic_mirrors',
    GENERATIVE_BOTANY = 'generative_botany',
    QUANTUM_PHANTASM = 'quantum_phantasm',
    ARCHITECTURAL_PROJECTION = 'architectural_projection',
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
    endImageUrl?: string;
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

// Media Art Style Parameters
export interface DataCompositionParams {
    dataDensity: number; // 0-100
    glitchIntensity: number; // 0-100
    colorPalette: 'monochrome' | 'binary' | 'signal_noise';
}

export interface DigitalNatureParams {
    particleSystem: 'flowers' | 'butterflies' | 'light_trails' | 'leaves';
    interactivity: number; // 0-100
    bloomEffect: number; // 0-100
}

export interface AiDataSculptureParams {
    fluidity: number; // 0-100
    colorScheme: 'nebula' | 'oceanic' | 'molten_metal' | 'crystal';
    complexity: number; // 0-100
}

export interface LightAndSpaceParams {
    pattern: 'strobes' | 'grids' | 'waves' | 'beams';
    speed: number; // 0-100
    color: 'white' | 'electric_blue' | 'laser_red';
}

export interface KineticMirrorsParams {
    fragmentation: number; // 0-100
    motionSpeed: number; // 0-100
    reflection: 'sharp' | 'distorted' | 'prismatic';
}

export interface GenerativeBotanyParams {
    growthSpeed: number; // 0-100
    plantType: 'alien_flora' | 'crystal_flowers' | 'glowing_fungi';
    density: number; // 0-100
}

export interface QuantumPhantasmParams {
    particleSize: number; // 0-100
    shimmerSpeed: number; // 0-100
    colorPalette: 'ethereal' | 'iridescent' | 'void';
}

export interface ArchitecturalProjectionParams {
    deconstruction: number; // 0-100
    lightSource: 'internal' | 'external' | 'volumetric';
    texture: 'wireframe' | 'holographic' | 'concrete';
}

export type MediaArtStyleParams =
    | DataCompositionParams
    | DigitalNatureParams
    | AiDataSculptureParams
    | LightAndSpaceParams
    | KineticMirrorsParams
    | GenerativeBotanyParams
    | QuantumPhantasmParams
    | ArchitecturalProjectionParams;


export interface MediaArtState {
    sourceImage: MediaArtSourceImage | null;
    style: MediaArtStyle;
    styleParams: MediaArtStyleParams;
    panels: StoryboardPanel[];
    config: StoryboardConfig;
}

export interface VisualArtState {
    inputText: string;
    sourceImage: MediaArtSourceImage | null;
    effect: VisualArtEffect;
    resultVideoUrl: string | null;
    isLoading: boolean;
    error: string | null;
}
