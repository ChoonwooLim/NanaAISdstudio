import { GoogleGenAI, Type } from '@google/genai';
import { ProductDetails, Tone, StoryboardPanel, StoryboardConfig, AspectRatio, VisualStyle } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Retries an async function with exponential backoff to handle transient API errors.
 * @param fn The async function to execute.
 * @param retries Number of retries.
 * @param delay Initial delay in ms.
 * @param backoffFactor The factor to multiply delay with for each retry.
 * @returns The result of the async function.
 */
const retryWithBackoff = async <T>(
    fn: () => Promise<T>,
    retries = 3,
    delay = 2000,
    backoffFactor = 2
): Promise<T> => {
    let lastError: Error | undefined;

    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            if (i < retries - 1) {
                const waitTime = delay * Math.pow(backoffFactor, i);
                console.warn(`API call failed. Retrying in ${waitTime}ms... (Attempt ${i + 1}/${retries})`, error.message);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }
    
    console.error('API call failed after all retries.', lastError);
    if (lastError) {
        // Enhance the error message for better context in the UI.
        lastError.message = `API call failed after ${retries} attempts. Please try again later. Last error: ${lastError.message}`;
    }
    throw lastError || new Error('API call failed after all retries.');
};


const TONE_MAP: Record<Tone, string> = {
    [Tone.PROFESSIONAL]: 'professional, clear, and confident',
    [Tone.FRIENDLY]: 'friendly, casual, and relatable',
    [Tone.HUMOROUS]: 'witty, humorous, and clever',
    [Tone.LUXURIOUS]: 'luxurious, elegant, and sophisticated',
};

export const generateDescription = async (details: ProductDetails): Promise<string> => {
    const toneDescription = TONE_MAP[details.tone];
    const prompt = `Generate a compelling product description for a product with the following details:
- Product Name: ${details.productName}
- Key Features: ${details.keyFeatures}
- Target Audience: ${details.targetAudience || 'general audience'}
- Tone of voice: ${toneDescription}

The description should be engaging, highlight the key features as benefits, and be optimized for an e-commerce website. Do not use markdown. Return only the description text.`;

    try {
        const response = await retryWithBackoff(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        }));

        return response.text.trim();
    } catch (error: any) {
        console.error('Error generating description:', error);
        throw new Error(`Failed to generate product description. ${error.message}`);
    }
};

const generateStoryboardScenes = async (prompt: string): Promise<{ description: string }[]> => {
     try {
        const response = await retryWithBackoff(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: {
                                type: Type.STRING,
                                description: 'A concise description of the scene for this storyboard panel.'
                            }
                        },
                        required: ['description']
                    }
                }
            }
        }));

        const jsonText = response.text.trim();
        const panels = JSON.parse(jsonText);
        // Ensure it's an array of objects with a description property
        if (Array.isArray(panels) && panels.every(p => typeof p.description === 'string')) {
            return panels;
        } else {
            throw new Error('Invalid storyboard format received from AI.');
        }
    } catch (error: any) {
        console.error('Error generating storyboard scenes:', error);
        throw new Error(`Failed to generate storyboard scenes. ${error.message}`);
    }
}


export const generateStoryboardFromDescription = async (productDescription: string, sceneCount: number): Promise<{ description: string }[]> => {
    const prompt = `Based on the following product description, create a ${sceneCount}-panel storyboard for a short video ad. For each panel, provide a concise scene description.

Product Description: "${productDescription}"

Return the result as a JSON array of objects, where each object has a "description" key. Example: [{"description": "Scene 1 description..."}, {"description": "Scene 2 description..."}]`;
    return generateStoryboardScenes(prompt);
};

export const generateStoryboardFromIdea = async (storyIdea: string, config: StoryboardConfig): Promise<{ description: string }[]> => {
    const prompt = `Create a high-end storyboard based on the following creative direction.

Creative Direction:
- Story Idea: "${storyIdea}"
- Number of Scenes: Exactly ${config.sceneCount} scenes.
- Target Video Length: The pacing should be suitable for a ${config.videoLength} video.
- Mood & Pacing: ${config.mood}.
- Visual Style: The descriptions should align with a ${config.visualStyle} aesthetic.

For each of the ${config.sceneCount} scenes, provide a concise and vivid description that visually tells the story according to the specified mood and style.

Return the result as a JSON array of objects, where each object has a "description" key.`;
    return generateStoryboardScenes(prompt);
};


export const generateImageForPanel = async (description: string, style: VisualStyle, aspectRatio: AspectRatio): Promise<string> => {
    const prompt = `Generate an image for a storyboard panel in a ${style.toLowerCase()} style.
The image should be cinematic and high-quality.
Scene description: "${description}"`;

    try {
        const response = await retryWithBackoff(() => ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        }));

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error('No image was generated.');
        }
    } catch (error: any) {
        console.error('Error generating image for panel:', error);
        throw new Error(`Failed to generate image for the panel. ${error.message}`);
    }
};


export const expandSceneToDetailedPanels = async (sceneDescription: string): Promise<{ description: string }[]> => {
    const prompt = `Break down the following scene into 3 detailed shots for a storyboard. For each shot, provide a concise description focusing on camera angle, action, and subject.

Original Scene: "${sceneDescription}"

Return the result as a JSON array of objects, where each object has a "description" key.`;

    try {
        const response = await retryWithBackoff(() => ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: {
                                type: Type.STRING,
                                description: 'A concise description of the detailed shot.'
                            }
                        },
                        required: ['description']
                    }
                }
            }
        }));

        const jsonText = response.text.trim();
        const panels = JSON.parse(jsonText);
        if (Array.isArray(panels) && panels.every(p => typeof p.description === 'string')) {
            return panels;
        } else {
            throw new Error('Invalid detailed panel format received from AI.');
        }
    } catch (error: any) {
        console.error('Error expanding scene:', error);
        throw new Error(`Failed to expand scene. ${error.message}`);
    }
};

export const generateVideoForPanel = async (description: string, imageBase64: string, visualStyle: VisualStyle): Promise<string> => {
    const prompt = `Create a very short video clip, approximately 3-5 seconds long, for a single storyboard scene. The visual style must be ${visualStyle}. Scene: "${description}"`;

    try {
        let operation = await retryWithBackoff(() => ai.models.generateVideos({
            model: 'veo-2.0-generate-001',
            prompt: prompt,
            image: {
                imageBytes: imageBase64,
                mimeType: 'image/jpeg',
            },
            config: {
                numberOfVideos: 1
            }
        }));

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await retryWithBackoff(() => ai.operations.getVideosOperation({ operation: operation }), 3, 1000);
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) {
            throw new Error('Video generation completed, but no download link was found.');
        }

        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!videoResponse.ok) {
            throw new Error(`Failed to download video file: ${videoResponse.statusText}`);
        }
        const videoBlob = await videoResponse.blob();
        return URL.createObjectURL(videoBlob);

    } catch (error: any) {
        console.error('Error generating video for panel:', error);
        throw new Error(`Failed to generate video for panel. ${error.message}`);
    }
};