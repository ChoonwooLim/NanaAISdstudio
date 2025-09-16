import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { AspectRatio, DescriptionConfig, StoryboardConfig, VisualStyle, MediaArtStyle, VisualArtEffect, MediaArtSourceImage, MediaArtStyleParams, DataCompositionParams, DigitalNatureParams, AiDataSculptureParams, LightAndSpaceParams, KineticMirrorsParams, GenerativeBotanyParams, QuantumPhantasmParams, ArchitecturalProjectionParams } from "../types";

// Corrected: Initialize GoogleGenAI with a named apiKey parameter as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const aspectRatiosMap: Record<AspectRatio, string> = {
    [AspectRatio.LANDSCAPE]: "16:9",
    [AspectRatio.PORTRAIT]: "9:16",
    [AspectRatio.SQUARE]: "1:1",
    [AspectRatio.VERTICAL]: "3:4",
    [AspectRatio.CLASSIC]: "4:3",
};

// Helper to safely parse JSON from model responses which might include markdown
const safeJsonParse = (jsonString: string) => {
    try {
        const trimmedString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
        return JSON.parse(trimmedString);
    } catch (e) {
        try {
            // Fallback for cases where the string is not perfectly formatted
            const firstBracket = jsonString.indexOf('[');
            const lastBracket = jsonString.lastIndexOf(']');
            const firstBrace = jsonString.indexOf('{');
            const lastBrace = jsonString.lastIndexOf('}');
            
            let start = -1;
            let end = -1;

            if (firstBracket !== -1 && lastBracket !== -1) {
                start = firstBracket;
                end = lastBracket;
            } else if (firstBrace !== -1 && lastBrace !== -1) {
                start = firstBrace;
                end = lastBrace;
            }

            if (start !== -1 && end !== -1) {
                const nestedJson = jsonString.substring(start, end + 1);
                return JSON.parse(nestedJson);
            }
            return null;
        } catch (e2) {
            console.error("Failed to parse JSON:", jsonString, e2);
            return null;
        }
    }
};

export const generateDescription = async (config: DescriptionConfig): Promise<string> => {
    const prompt = `Generate a compelling product description.
    - Product Name: ${config.productName}
    - Key Features: ${config.keyFeatures}
    - Target Audience: ${config.targetAudience}
    - Tone: ${config.tone}
    - Language: ${config.language}
    
    The description should be concise, engaging, and highlight the key benefits for the target audience. Do not include a title or header.`;
    
    // Corrected: Use ai.models.generateContent as per guidelines
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    // Corrected: Access text directly from response.text property
    return response.text;
};

const storyboardPanelSchema = {
    type: Type.OBJECT,
    properties: {
        scene: { type: Type.NUMBER },
        description: { type: Type.STRING, description: 'A detailed, visually descriptive paragraph for this scene. Describe the camera shot, setting, action, and mood. This will be used as a prompt for an image generation model.' },
    }
};

export const generateStoryboard = async (idea: string, config: StoryboardConfig): Promise<{ description: string }[]> => {
    const prompt = `Create a storyboard for a short video based on this idea: "${idea}".

    **Instructions:**
    1.  Generate exactly ${config.sceneCount} scenes.
    2.  The overall mood should be ${config.mood}.
    3.  The visual style should be ${config.visualStyle}.
    4.  The total video length is approximately ${config.videoLength}, so pace the scenes accordingly.
    5.  The output language for the descriptions must be ${config.descriptionLanguage}.
    6.  For each scene, provide a detailed, visually rich description suitable for an AI image generation model. Describe the camera angle, subject, setting, action, and atmosphere.
    
    Return the result as a JSON array of objects.`;

    // Corrected: Use ai.models.generateContent with responseSchema for JSON output
    const response = await ai.models.generateContent({
        model: config.textModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: storyboardPanelSchema,
            },
        }
    });
    
    const parsed = safeJsonParse(response.text);
    if (!parsed || !Array.isArray(parsed)) {
        throw new Error("Failed to generate a valid storyboard structure.");
    }
    return parsed.map(p => ({ description: p.description }));
};

export const generateDetailedStoryboard = async (originalScene: string, language: string): Promise<{ description: string }[]> => {
    const prompt = `Take the following single storyboard scene and expand it into 3 more detailed, sequential shots. Maintain the core idea of the original scene but break it down into a mini-sequence (e.g., establishing shot, medium shot, close-up).

    **Original Scene:** "${originalScene}"
    
    **Instructions:**
    1.  Create exactly 3 new, detailed scene descriptions.
    2.  The descriptions should logically follow each other.
    3.  Make each new description highly visual and suitable for an AI image generator.
    4.  The output language for the descriptions must be ${language}.
    
    Return the result as a JSON array of objects.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING, description: 'A detailed, visually descriptive paragraph for this shot.' }
                    }
                }
            }
        }
    });

    const parsed = safeJsonParse(response.text);
    if (!parsed || !Array.isArray(parsed)) {
        throw new Error("Failed to generate a valid detailed storyboard.");
    }
    return parsed.map(p => ({ description: p.description }));
};

export const generateImageForPanel = async (description: string, config: { imageModel: string, aspectRatio: AspectRatio, visualStyle: VisualStyle }): Promise<string> => {
    const visualStylePrompt = config.visualStyle === VisualStyle.PHOTOREALISTIC ? 'photorealistic, cinematic' : config.visualStyle;
    const prompt = `${description}, ${visualStylePrompt} style, high detail`;

    // Corrected: Use ai.models.generateImages for image generation as per guidelines.
    const response = await ai.models.generateImages({
        model: config.imageModel,
        prompt,
        config: {
            numberOfImages: 1,
            aspectRatio: aspectRatiosMap[config.aspectRatio],
            outputMimeType: 'image/jpeg',
        }
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed, no images returned.");
    }
    // Corrected: Access generated image bytes from the correct response property.
    return response.generatedImages[0].image.imageBytes;
};

export const generateVideoForPanel = async (prompt: string, imageBase64: string, videoModel: string): Promise<string> => {
    // Corrected: Use ai.models.generateVideos for video generation as per guidelines.
    let operation = await ai.models.generateVideos({
        model: videoModel,
        prompt: prompt,
        image: {
            imageBytes: imageBase64,
            mimeType: 'image/jpeg',
        },
        config: {
            numberOfVideos: 1,
        }
    });

    // Corrected: Implement polling logic for long-running video operations.
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        // Corrected: Use correct operation polling method as per guidelines.
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    // Corrected: Access download URI from the operation response.
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }
    
    // Corrected: Append API key to the download link before fetching as required by the API.
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
};

const getStylePrompt = (style: MediaArtStyle, params: MediaArtStyleParams): string => {
    switch (style) {
        case MediaArtStyle.DATA_COMPOSITION:
            const p1 = params as DataCompositionParams;
            return `The style is 'Data Composition', inspired by Ryoji Ikeda. It must feature dense, flowing data visualizations, glitch effects, and stark digital patterns. Parameters: Data Density=${p1.dataDensity}%, Glitch Intensity=${p1.glitchIntensity}%, Color Palette=${p1.colorPalette}.`;
        case MediaArtStyle.DIGITAL_NATURE:
            const p2 = params as DigitalNatureParams;
            return `The style is 'Digital Nature', inspired by teamLab. It must feature interactive particle systems that form natural elements. The scene should feel alive and responsive. Parameters: Particle System=${p2.particleSystem}, Interactivity Level=${p2.interactivity}%, Bloom Effect=${p2.bloomEffect}%.`;
        case MediaArtStyle.AI_DATA_SCULPTURE:
            const p3 = params as AiDataSculptureParams;
            return `The style is 'AI Data Sculpture', inspired by Refik Anadol. It must be a fluid, organic, and complex data visualization that resembles a living sculpture. Parameters: Fluidity=${p3.fluidity}%, Color Scheme=${p3.colorScheme}, Structural Complexity=${p3.complexity}%.`;
        case MediaArtStyle.LIGHT_AND_SPACE:
            const p4 = params as LightAndSpaceParams;
            return `The style is 'Light and Space', inspired by NONOTAK Studio. It must use geometric, structural patterns of light like beams, grids, and strobes to define the space. The mood is minimalist and intense. Parameters: Light Pattern=${p4.pattern}, Speed=${p4.speed}%, Color=${p4.color}.`;
        case MediaArtStyle.KINETIC_MIRRORS:
            const p5 = params as KineticMirrorsParams;
            return `The style is 'Kinetic Mirrors'. It should depict the original image as if reflected and fractured across a field of moving, robotic mirrors. Parameters: Fragmentation=${p5.fragmentation}%, Motion Speed=${p5.motionSpeed}%, Reflection Type=${p5.reflection}.`;
        case MediaArtStyle.GENERATIVE_BOTANY:
            const p6 = params as GenerativeBotanyParams;
            return `The style is 'Generative Botany'. It must show surreal, algorithmically-grown plants and flowers overgrowing the original image's subject. Parameters: Growth Speed=${p6.growthSpeed}%, Plant Type=${p6.plantType}, Density=${p6.density}%.`;
        case MediaArtStyle.QUANTUM_PHANTASM:
            const p7 = params as QuantumPhantasmParams;
            return `The style is 'Quantum Phantasm'. It must visualize the image as an unstable, shimmering field of quantum particles, constantly phasing in and out of existence. Parameters: Particle Size=${p7.particleSize}%, Shimmer Speed=${p7.shimmerSpeed}%, Color Palette=${p7.colorPalette}.`;
        case MediaArtStyle.ARCHITECTURAL_PROJECTION:
            const p8 = params as ArchitecturalProjectionParams;
            return `The style is 'Architectural Projection'. The image's content should be deconstructed and projection-mapped onto complex geometric structures, creating a sense of fragmented, volumetric light. Parameters: Deconstruction=${p8.deconstruction}%, Light Source=${p8.lightSource}, Texture=${p8.texture}.`;
        default:
            return '';
    }
};

export const generateMediaArtStoryboard = async (sourceImage: MediaArtSourceImage, style: MediaArtStyle, params: MediaArtStyleParams, language: string) => {
    const styleInstruction = getStylePrompt(style, params);

    const prompt = `Analyze the provided image (${sourceImage.title}). Based on its content and composition, generate a 4-scene storyboard for a short, artistic video. Each scene description must be a creative interpretation of the original image, transformed through the lens of the chosen style.

    **Style Instructions:**
    ${styleInstruction}

    **General Instructions:**
    1.  Create exactly 4 scene descriptions that form a cohesive visual arc.
    2.  Each description should be highly visual and evocative, suitable for an AI image generation model, and must incorporate the specific style parameters.
    3.  The descriptions must be in ${language}.
    
    Return the result as a JSON array of objects.`;
    
    const imagePart = await (async () => {
        if (sourceImage.url.startsWith('data:')) {
            return {
                inlineData: {
                    data: sourceImage.url.split(',')[1],
                    mimeType: sourceImage.url.match(/:(.*?);/)?.[1] || 'image/jpeg'
                }
            };
        }
        
        // Handle remote URL by fetching and converting to base64
        const response = await fetch(sourceImage.url);
        if (!response.ok) {
            throw new Error(`Failed to fetch image from URL: ${sourceImage.url}`);
        }
        const blob = await response.blob();
        
        const data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        return {
            inlineData: {
                data,
                mimeType: blob.type || 'image/jpeg'
            }
        };
    })();
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: storyboardPanelSchema,
            }
        }
    });

    const parsed = safeJsonParse(response.text);
    if (!parsed || !Array.isArray(parsed)) {
        throw new Error("Failed to generate a valid media art storyboard.");
    }
    return parsed.map((p: any) => ({ description: p.description }));
};

export const generateVisualArtVideo = async (text: string, effect: VisualArtEffect): Promise<string> => {
    const prompt = `Create a dynamic, visually striking motion graphics video.
    - Text: "${text}"
    - Visual Effect: ${effect}
    - Style: Abstract, high-energy, and suitable for a short social media clip.
    The text should be the central focus, animated with the chosen effect. The background should be complementary and dynamic.`;

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
};