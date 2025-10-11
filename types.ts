import { Modality } from "@google/genai";

// Defines all necessary types for the application.
export enum AppMode {
    DESCRIPTION = 'DESCRIPTION',
    STORYBOARD = 'STORYBOARD',
    MEDIA_ART = 'MEDIA_ART',
    VISUAL_ART = 'VISUAL_ART',
    IMAGE_TRANSITION = 'IMAGE_TRANSITION',
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
    ANAMORPHIC = '2.39:1',
    WIDESCREEN_CINEMA = '1.85:1',
    ACADEMY = '1.37:1',
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

export enum CameraType {
    DEFAULT = 'default',
    ARRI_ALEXA_65 = 'ARRI Alexa 65',
    RED_MONSTRO_8K = 'RED Monstro 8K',
    PANAVISION_DXL2 = 'Panavision DXL2',
    IMAX = 'IMAX 70mm',
}

export enum ColorTone {
    NATURAL = 'natural',
    TECHNICOLOR = 'vibrant Technicolor',
    BLEACH_BYPASS = 'gritty bleach bypass',
    SEPIA = 'warm sepia tone',
    TEAL_AND_ORANGE = 'modern teal and orange',
    VIBRANT_SATURATION = 'vibrant, high-saturation',
    MUTED_COOL = 'muted, cool blue tones',
}

export enum LensType {
    DEFAULT = 'default',
    WIDE_ANGLE_24MM = 'wide-angle 24mm',
    STANDARD_50MM = 'standard 50mm',
    TELEPHOTO_85MM = 'telephoto 85mm',
    MACRO = 'macro close-up',
}

export enum LightingStyle {
    DEFAULT = 'default',
    GOLDEN_HOUR = 'warm, golden hour lighting',
    HIGH_CONTRAST_NOIR = 'high-contrast noir (chiaroscuro)',
    SOFT_DIFFUSED = 'soft, diffused studio lighting',
    NEON_NOIR = 'saturated neon noir',
    NATURAL_DAYLIGHT = 'natural, bright daylight',
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

export enum ImageTransitionStyle {
    MORPH = 'morph',
    PHYSICS_MORPH = 'physics_morph',
    PARTICLE_DISSOLVE = 'particle_dissolve',
    CINEMATIC_ZOOM = 'cinematic_zoom',
    FLUID_PAINT = 'fluid_paint',
}

export enum VideoModelID {
    STANDARD = 'veo-2.0-generate-001',
    CINEMATIC = 'veo-2.1-cinematic',
    ANIMATOR = 'veo-animator',
    FX = 'veo-fx',
    LITE = 'veo-lite',
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
    videoModel: VideoModelID;
    // New Cinematic Options
    cameraType: CameraType;
    colorTone: ColorTone;
    lensType: LensType;
    lightingStyle: LightingStyle;
    filmGrain: boolean;
}

export interface StoryboardPanel {
    description: string; // The action description

    startFramePrompt: string;
    imageUrl?: string; // This is the startImageUrl
    isLoadingImage?: boolean; // This is the isLoadingStartImage

    endFramePrompt: string;
    endImageUrl?: string;
    isLoadingEndImage?: boolean;

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
    videoModel: VideoModelID;
    resultVideoUrl: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface TransitionMedia {
    type: 'image' | 'video';
    url: string; // dataURL
    title: string;
}

export interface ImageTransitionState {
    startMedia: TransitionMedia | null;
    endMedia: TransitionMedia | null;
    prompt: string;
    style: ImageTransitionStyle;
    videoModel: VideoModelID;
    resultVideoUrl: string | null;
    isLoading: boolean;
    error: string | null;
}