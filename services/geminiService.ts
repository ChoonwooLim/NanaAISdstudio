// FIX: Created this file to house all Gemini API interactions, resolving module resolution errors.

import { GoogleGenAI, Modality, Type } from "@google/genai";
import { StoryboardConfig, DetailedStoryboardPanel, Tone } from "../types";

// The user must set this in their environment.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}

// Initialize the Google AI client
const ai = new GoogleGenAI({ apiKey: apiKey! });

/**
 * Detects if the given text contains Korean characters.
 */
export const detectLanguage = async (text: string): Promise<boolean> => {
    if (!text || text.trim() === '') return false;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Does the following text contain Korean? Answer with only "yes" or "no": "${text}"`,
        });
        return response.text.toLowerCase().includes('yes');
    } catch (error) {
        console.error('Error detecting language:', error);
        return false;
    }
};

/**
 * Generates a product description.
 */
export const generateDescription = async (
    productName: string,
    keyFeatures: string,
    targetAudience: string,
    tone: Tone,
    language: string,
    model: string
): Promise<string> => {
    const prompt = `Generate a compelling product description in ${language}.
    Product Name: ${productName}
    Key Features: ${keyFeatures}
    Target Audience: ${targetAudience}
    Tone of Voice: ${tone}`;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });
    return response.text;
};

/**
 * Generates a storyboard scene list from an idea.
 */
export const generateStoryboard = async (
    idea: string,
    config: StoryboardConfig
): Promise<string[]> => {
    const prompt = `Create a storyboard for a short video based on this idea: "${idea}".
    The video should have exactly ${config.sceneCount} scenes.
    The mood should be ${config.mood}.
    The overall video length is approximately ${config.videoLength}.
    Provide a concise, one-sentence description for each scene, focusing on the visual elements.
    The descriptions should be in ${config.descriptionLanguage}.`;

    const response = await ai.models.generateContent({
        model: config.textModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    scenes: {
                        type: Type.ARRAY,
                        description: `An array of ${config.sceneCount} scene descriptions.`,
                        items: { type: Type.STRING }
                    }
                },
                required: ['scenes']
            }
        }
    });

    const result = JSON.parse(response.text);
    return result.scenes;
};

/**
 * Generates an image for a single storyboard panel.
 */
export const generateImage = async (
    description: string,
    visualStyle: string,
    aspectRatio: string,
    imageModel: string
): Promise<string> => {
    const prompt = `${description}, ${visualStyle} style.`;
    const response = await ai.models.generateImages({
        model: imageModel,
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "4:3" | "3:4",
        },
    });
    return response.generatedImages[0].image.imageBytes;
};

/**
 * Expands a single scene into a more detailed multi-shot storyboard.
 */
export const generateDetailedStoryboard = async (
    sceneDescription: string,
    config: StoryboardConfig
): Promise<DetailedStoryboardPanel[]> => {
    const prompt = `Expand this single scene into 3 distinct shots: "${sceneDescription}".
    Describe each shot with a focus on camera angle and action.
    The descriptions should be in ${config.descriptionLanguage}.`;

    const response = await ai.models.generateContent({
        model: config.textModel,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    shots: {
                        type: Type.ARRAY,
                        description: 'An array of 3 detailed shot descriptions.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                description: { type: Type.STRING }
                            },
                            required: ['description']
                        }
                    }
                },
                required: ['shots']
            }
        }
    });

    const result = JSON.parse(response.text);
    return result.shots.map((shot: any) => ({ description: shot.description }));
};

/**
 * Generates a short video clip from an image and a description.
 */
export const generateVideo = async (
    videoModel: string,
    prompt: string,
    imageBase64: string,
    sceneDuration: number
): Promise<string> => {
    const fullPrompt = `${prompt}. A video clip, approximately ${sceneDuration} seconds long.`;
    
    let operation = await ai.models.generateVideos({
        model: videoModel,
        prompt: fullPrompt,
        image: {
            imageBytes: imageBase64,
            mimeType: 'image/png',
        },
        config: {
            numberOfVideos: 1,
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink && apiKey) {
        const response = await fetch(`${downloadLink}&key=${apiKey}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }
        const videoBlob = await response.blob();
        return URL.createObjectURL(videoBlob);
    }
    throw new Error('Video generation failed to produce a download link.');
};


/**
 * Edits an image based on a text prompt using the image editing model.
 */
export const generateMediaArt = async (
    prompt: string,
    base64ImageData: string,
    mimeType: string
): Promise<{ text: string | null; image: string | null }> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64ImageData,
                        mimeType: mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let textResult: string | null = null;
    let imageResult: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                textResult = part.text;
            } else if (part.inlineData) {
                imageResult = part.inlineData.data;
            }
        }
    }

    if (!imageResult) {
        throw new Error("The model did not return an image.");
    }

    return { text: textResult, image: imageResult };
};
