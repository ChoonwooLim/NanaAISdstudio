import { GoogleGenAI, GenerateContentResponse, Type, Modality, Operation, GenerateVideosResponse } from "@google/genai";
import { Tone, StoryboardConfig, StoryboardPanel, DetailedStoryboardPanel, MediaArtStyle, AspectRatio, MediaArtSourceImage } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAspectRatioString = (aspectRatio: AspectRatio): "1:1" | "16:9" | "9:16" | "4:3" | "3:4" => {
    switch (aspectRatio) {
        case AspectRatio.LANDSCAPE: return "16:9";
        case AspectRatio.PORTRAIT: return "9:16";
        case AspectRatio.SQUARE: return "1:1";
        case AspectRatio.VERTICAL: return "3:4";
        case AspectRatio.CLASSIC: return "4:3";
        default: return "1:1";
    }
};

const parseOperationError = (error: any): string => {
    if (typeof error === 'object' && error !== null && error.message) {
        let message = error.message;
        if (error.details && Array.isArray(error.details) && error.details.length > 0) {
            const detailMessage = error.details.map((d: any) => d.detail || JSON.stringify(d)).join('; ');
            message += ` - Details: ${detailMessage}`;
        }
        return message;
    }
    if (typeof error === 'string') {
        return error;
    }
    try {
        return JSON.stringify(error);
    } catch {
        return 'Unknown video generation error.';
    }
};


export const imageUrlToBase64 = async (url: string): Promise<{ dataUrl: string, mimeType: string }> => {
    if (url.startsWith('data:')) {
        const [header] = url.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        return { dataUrl: url, mimeType };
    }
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const blob = await response.blob();
        const mimeType = blob.type;
        const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        return { dataUrl, mimeType };
    } catch (error) {
        console.error("Error converting image URL to base64:", error);
        throw new Error("Could not load image from the provided URL.");
    }
};


export const generateDescription = async (
    productName: string,
    keyFeatures: string,
    targetAudience: string,
    tone: Tone,
    language: string,
    model: string
): Promise<string> => {
    const prompt = `
        You are a world-class marketing copywriter. Generate a compelling product description.
        **Product Name:** ${productName}
        **Key Features:** ${keyFeatures}
        **Target Audience:** ${targetAudience}
        **Tone of Voice:** ${tone}
        **Language:** ${language}

        Instructions:
        - Write a captivating product description that highlights the key features and benefits for the target audience.
        - The tone should be consistently ${tone}.
        - The final output must be in ${language}.
        - Do not include headers or titles like "Product Description:". Just provide the description text itself.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating description:", error);
        throw new Error("Failed to generate product description.");
    }
};

export const generateStoryboard = async (
    storyIdea: string,
    config: StoryboardConfig
): Promise<StoryboardPanel[]> => {
    const prompt = `
        Create a storyboard with exactly ${config.sceneCount} scenes for the following idea:
        **Story Idea:** ${storyIdea}
        **Visual Style:** ${config.visualStyle}
        **Mood and Pacing:** ${config.mood}
        **Target Video Length:** ${config.videoLength}
        **Language for Descriptions:** ${config.descriptionLanguage}

        Instructions:
        1.  Break down the story idea into ${config.sceneCount} distinct scenes.
        2.  For each scene, provide a concise, single-paragraph description of the visual elements and action. This description will be used as a prompt for an image generation AI.
        3.  The descriptions must be vivid, detailed, and written in a way that an AI image generator can understand.
        4.  Maintain a consistent tone and narrative flow across all scenes.
        5.  Ensure the descriptions match the requested visual style and mood.
        6.  The output language for the descriptions must be ${config.descriptionLanguage}.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: config.textModel,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        scenes: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    scene_number: { type: Type.NUMBER },
                                    description: { type: Type.STRING },
                                },
                                required: ["scene_number", "description"],
                            },
                        },
                    },
                    required: ["scenes"],
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        const scenes: { description: string }[] = jsonResponse.scenes || [];

        return scenes.map(scene => ({
            description: scene.description,
            isLoadingImage: true,
            isLoadingVideo: false,
        }));
    } catch (error) {
        console.error("Error generating storyboard:", error);
        throw new Error("Failed to generate storyboard scenes.");
    }
};

export const generateImageForPanel = async (
    panelDescription: string,
    config: StoryboardConfig
): Promise<string> => {
    const prompt = `${panelDescription}, in the style of ${config.visualStyle}, cinematic, high detail, professional`;

    try {
        const response = await ai.models.generateImages({
            model: config.imageModel,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: getAspectRatioString(config.aspectRatio),
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error && error.message.includes('quota')) {
            throw new Error('quota_error');
        }
        throw error;
    }
};

export const expandSceneToDetailedPanels = async (
    originalSceneDescription: string,
    language: string,
    model: string
): Promise<DetailedStoryboardPanel[]> => {
    const prompt = `
        You are a film director breaking down a single scene into three distinct camera shots.
        **Original Scene Description:** "${originalSceneDescription}"

        Instructions:
        1. Deconstruct the original scene into three sequential, detailed shots (e.g., an establishing shot, a medium shot, a close-up).
        2. For each shot, write a new, concise, single-paragraph description from a camera's perspective.
        3. These descriptions will be used to generate images, so they must be visually descriptive.
        4. The descriptions must be in ${language}.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        shots: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    shot_number: { type: Type.NUMBER },
                                    description: { type: Type.STRING },
                                },
                                required: ["shot_number", "description"],
                            },
                        },
                    },
                    required: ["shots"],
                },
            },
        });
        
        const jsonResponse = JSON.parse(response.text);
        const shots: { description: string }[] = jsonResponse.shots || [];

        return shots.slice(0, 3).map(shot => ({
            description: shot.description,
            isLoadingImage: true,
        }));
    } catch (error) {
        console.error("Error expanding scene:", error);
        throw new Error("Failed to expand scene into detailed shots.");
    }
};

export const generateVideoForPanel = async (
    imageUrl: string,
    panelDescription: string,
    sceneDuration: number,
    videoModel: string
): Promise<string> => {
    if (!imageUrl.startsWith('data:image/')) {
        throw new Error('Invalid image URL format.');
    }
    const [header, base64Data] = imageUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    
    let operation: Operation<GenerateVideosResponse> = await ai.models.generateVideos({
        model: videoModel,
        prompt: `A cinematic, high-quality, ${sceneDuration}-second video clip based on this scene: "${panelDescription}"`,
        image: {
            imageBytes: base64Data,
            mimeType: mimeType,
        },
        config: {
            numberOfVideos: 1,
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
            if (operation.error) {
            const errorMessage = parseOperationError(operation.error);
            throw new Error(errorMessage);
        }
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
            console.error("Video generation response:", operation.response);
        throw new Error("Video generation failed to produce a download link.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};

export const deconstructPaintingIntoScenes = async (
    sourceImage: { title: string, artist?: string },
    style: MediaArtStyle
): Promise<string[]> => {
    const prompt = `
        You are a visionary film director. Deconstruct the image "${sourceImage.title}" ${sourceImage.artist ? `by ${sourceImage.artist}` : ''} into 4 cinematic scenes for a short animated video. The animation style should be "${style}".
        For each of the 4 scenes, provide a concise, single-paragraph description of the camera shot and the animation. These descriptions will be used to generate both an image and a video clip.
        Provide only the descriptions.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: { scenes: { type: Type.ARRAY, items: { type: Type.STRING } } }
            }
        }
    });
    const result = JSON.parse(response.text);
    if (!result.scenes || result.scenes.length === 0) {
        throw new Error("AI failed to deconstruct the image into scenes.");
    }
    return result.scenes.slice(0, 4);
};

export const generateMediaArtImage = async (
    panelDescription: string,
    sourceImage: { title: string, artist?: string, base64Data: string, mimeType: string }
): Promise<string> => {
    const prompt = `Re-imagine this image to fit the following scene description, maintaining the original artistic style of "${sourceImage.title}" ${sourceImage.artist ? `by ${sourceImage.artist}` : ''}: "${panelDescription}"`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    { inlineData: { data: sourceImage.base64Data, mimeType: sourceImage.mimeType } },
                    { text: prompt }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            }
        });

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        throw new Error("Media art image generation failed to return an image.");
    } catch (error) {
        console.error("Error generating media art image:", error);
        throw error;
    }
};

export const generateMediaArtClip = async (
    panelImageUrl: string,
    panelDescription: string
): Promise<string> => {
    if (!panelImageUrl.startsWith('data:image/')) {
        throw new Error('Invalid image URL format for media art clip.');
    }
    const [header, base64Data] = panelImageUrl.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';

    let operation: Operation<GenerateVideosResponse> = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: `Animate this image based on the scene description: "${panelDescription}". The motion should be cinematic, high quality, and aesthetically beautiful. Create a short, 4-second video clip.`,
        image: { imageBytes: base64Data, mimeType: mimeType },
        config: { numberOfVideos: 1 }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        if (operation.error) {
            const errorMessage = parseOperationError(operation.error);
            throw new Error(errorMessage);
        }
    }
    
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        console.error("Video generation response:", operation.response);
        throw new Error("Video generation failed to produce a download link.");
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};