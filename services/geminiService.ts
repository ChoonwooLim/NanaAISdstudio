import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { AspectRatio, DescriptionConfig, StoryboardConfig, VisualStyle, MediaArtStyle, VisualArtEffect, MediaArtSourceImage, MediaArtStyleParams, DataCompositionParams, DigitalNatureParams, AiDataSculptureParams, LightAndSpaceParams, KineticMirrorsParams, GenerativeBotanyParams, QuantumPhantasmParams, ArchitecturalProjectionParams, ImageTransitionStyle, VideoModelID, TransitionMedia, CameraType, ColorTone, LensType, LightingStyle } from "../types";

// Corrected: Initialize GoogleGenAI with a named apiKey parameter as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Cost estimation constant
export const COST_PER_IMAGEN_IMAGE = 0.02; // Example cost, adjust based on actual pricing

const aspectRatiosMap: Record<AspectRatio, string> = {
    [AspectRatio.LANDSCAPE]: "16:9",
    [AspectRatio.PORTRAIT]: "9:16",
    [AspectRatio.SQUARE]: "1:1",
    [AspectRatio.ANAMORPHIC]: "2.39:1",
    [AspectRatio.WIDESCREEN_CINEMA]: "1.85:1",
    [AspectRatio.ACADEMY]: "1.37:1",
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

// Helper to get base64 data and mime type from a MediaArtSourceImage
const getImageData = async (sourceImage: MediaArtSourceImage): Promise<{data: string, mimeType: string}> => {
    if (sourceImage.url.startsWith('data:')) {
        return {
            data: sourceImage.url.split(',')[1],
            mimeType: sourceImage.url.match(/:(.*?);/)?.[1] || 'image/jpeg'
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
        data,
        mimeType: blob.type || 'image/jpeg'
    };
};

// Helper to add style prefixes for different video models
const getVideoModelPromptPrefix = (model: VideoModelID): string => {
    switch (model) {
        case VideoModelID.CINEMATIC:
            return "Style Emphasis: Create a hyper-realistic, cinematic video with film grain, dramatic lighting, and a high-end feel. ";
        case VideoModelID.ANIMATOR:
            return "Style Emphasis: Animate this scene with smooth motion and exaggerated expressions, perfectly matching the specified animation style (e.g., anime, claymation). ";
        case VideoModelID.FX:
            return "Style Emphasis: Focus on creating stunning visual effects. Generate dynamic particles, fire, smoke, or fluid simulations as described in the prompt. ";
        case VideoModelID.LITE:
            return "Instruction: Generate a fast preview. Prioritize speed over ultimate quality. ";
        case VideoModelID.STANDARD:
        default:
            return "";
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
        actionDescription: { type: Type.STRING, description: 'A short, one-sentence description of the main action or camera movement in the scene.' },
        startFramePrompt: { type: Type.STRING, description: 'A detailed, visually descriptive prompt for the scene\'s starting image.' },
        endFramePrompt: { type: Type.STRING, description: 'A detailed, visually descriptive prompt for the scene\'s ending image.' },
    }
};

export const generateStoryboard = async (idea: string, config: StoryboardConfig): Promise<{ actionDescription: string, startFramePrompt: string, endFramePrompt: string }[]> => {
    const systemInstruction = `You are a professional storyboard creator and virtual cinematographer AI. Your task is to generate a structured storyboard based on a user's idea and a strict set of constraints. You must follow all constraints precisely. The output must be a valid JSON array of objects conforming to the provided schema.`;

    const prompt = `Generate a storyboard based on the following idea and constraints.

**Idea:**
"${idea}"

**Constraint Checklist:**
- **Number of Scenes:** Exactly ${config.sceneCount}. This is a strict requirement.
- **Visual Style:** ${config.visualStyle}.
- **Overall Mood:** ${config.mood}.
- **Video Pacing:** Suitable for a ${config.videoLength} video.
- **Language for Prompts:** ${config.descriptionLanguage}.
- **Camera Simulation:** ${config.cameraType === CameraType.DEFAULT ? 'Standard digital camera' : `Simulate the look of a ${config.cameraType} camera.`}
- **Lens & Framing:** ${config.lensType === LensType.DEFAULT ? 'Use appropriate framing for the shot' : `Shot with a ${config.lensType} lens.`}
- **Lighting Style:** ${config.lightingStyle === LightingStyle.DEFAULT ? 'Use appropriate lighting for the mood' : `Lit with ${config.lightingStyle}.`}
- **Color Grade:** ${config.colorTone === ColorTone.NATURAL ? 'Natural, balanced colors' : `Apply a ${config.colorTone} color grade.`}
- **Film Grain:** ${config.filmGrain ? 'Add subtle, realistic film grain.' : 'No film grain.'}


**Output Format:**
For each of the ${config.sceneCount} scenes, provide:
1. "actionDescription": A short, one-sentence summary of the camera movement or character action.
2. "startFramePrompt": A detailed, visually rich description for the FIRST frame of the action. **This prompt must incorporate every constraint from the checklist above.**
3. "endFramePrompt": A detailed, visually rich description for the LAST frame of the action. **This prompt must also incorporate every constraint from the checklist.**

The final output must be a JSON array with exactly ${config.sceneCount} objects.`;

    // Corrected: Use ai.models.generateContent with responseSchema for JSON output
    const response = await ai.models.generateContent({
        model: config.textModel,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
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
    return parsed.map(p => ({
        actionDescription: p.actionDescription,
        startFramePrompt: p.startFramePrompt,
        endFramePrompt: p.endFramePrompt,
    }));
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

export const generateImageForPanel = async (description: string, config: StoryboardConfig): Promise<string> => {
    const visualStylePrompt = config.visualStyle === VisualStyle.PHOTOREALISTIC ? 'photorealistic, cinematic' : config.visualStyle;
    const negativePrompt = ', no text, no subtitles, no words, no letters, no characters, no watermark';
    let prompt = `${description}, ${visualStylePrompt} style, high detail${negativePrompt}`;

    const supportedImagenRatios = [
        AspectRatio.LANDSCAPE,      // "16:9"
        AspectRatio.PORTRAIT,       // "9:16"
        AspectRatio.SQUARE,         // "1:1"
        AspectRatio.VERTICAL,       // "3:4"
        AspectRatio.CLASSIC,        // "4:3"
    ];
    
    const useFlashModelForAspectRatio = !supportedImagenRatios.includes(config.aspectRatio);

    if (config.imageModel === 'gemini-2.5-flash-image' || useFlashModelForAspectRatio) {
        prompt += `, aspect ratio ${aspectRatiosMap[config.aspectRatio]}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data; // base64 string
                }
            }
        }
        throw new Error("Image generation with gemini-2.5-flash-image failed, no image part in response.");
    } else {
        const response = await ai.models.generateImages({
            model: config.imageModel, // Assumes 'imagen-4.0-generate-001'
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
        return response.generatedImages[0].image.imageBytes;
    }
};

export const generateVideoForPanel = async (prompt: string, imageBase64: string, videoModel: VideoModelID, isMediaArt: boolean = false): Promise<string> => {
    let finalPrompt = prompt;
    if (isMediaArt) {
        // Re-engineered the prompt to be more structured and robust, prioritizing the detailed
        // end-frame description to ensure accuracy even with long, complex prompts.
        finalPrompt = `Your primary task is to create a video that ends with a precise image.
        
**Target Image Description (The Final Frame):** 
${prompt}

**Starting Image (The First Frame):** 
The provided input image.

**Animation Instructions:**
- The video's first frame MUST be 100% identical to the Starting Image.
- The video's final frame MUST be a photorealistic, high-quality, and detailed rendering that is 100% identical to the Target Image Description above.
- The animation between the start and end frames must be a smooth, cinematic morphing transition. Do not use a simple cross-fade.
- Maintain the highest possible visual quality.
- Do not add any text or watermarks to the video.`;
    }

    const modelPrefix = getVideoModelPromptPrefix(videoModel);

    // Corrected: Use ai.models.generateVideos for video generation as per guidelines.
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: modelPrefix + finalPrompt,
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

export const generateMediaArtKeyframePrompts = async (sourceImage: MediaArtSourceImage, style: MediaArtStyle, params: MediaArtStyleParams, config: StoryboardConfig): Promise<string[]> => {
    const styleInstruction = getStylePrompt(style, params);
    const numberOfKeyframes = config.sceneCount + 1;

    // This prompt has been optimized to be more concise and structured, reducing the likelihood of token limit errors.
    const prompt = `
**Task**: Generate a JSON array of exactly ${numberOfKeyframes} image prompts for an animation.
**Animation Concept**: The animation starts as an abstract interpretation of the provided image ("${sourceImage.title}") and gradually transitions to become a photorealistic copy of it.

**Parameters**:
- **Core Abstract Style**: ${styleInstruction}
- **Mood**: ${config.mood}
- **Language**: ${config.descriptionLanguage}

**JSON Output Requirements**:
- The output MUST be a valid JSON array.
- The array MUST contain exactly ${numberOfKeyframes} string elements.

**Keyframe Prompt Instructions**:
1.  **Keyframe 1 (Most Abstract)**: A radical artistic interpretation based on the Core Style. Only 10-20% of the original image should be recognizable.
2.  **Intermediate Keyframes**: Gradually and evenly decrease abstraction and increase realism towards the original image across the remaining intermediate prompts.
3.  **Keyframe ${numberOfKeyframes} (Most Realistic)**: A perfect, photorealistic description of the original source image. The Core Style must be completely absent.
4.  Each prompt in the array must be a single, visually rich paragraph.
`;
    
    const { data, mimeType } = await getImageData(sourceImage);
    const imagePart = {
        inlineData: { data, mimeType }
    };
    
    const response = await ai.models.generateContent({
        model: config.textModel,
        contents: { parts: [{ text: prompt }, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                    description: 'A detailed, visually descriptive paragraph for an image keyframe.'
                },
            }
        }
    });

    const parsed = safeJsonParse(response.text);
    if (!parsed || !Array.isArray(parsed) || parsed.some(p => typeof p !== 'string')) {
        throw new Error("Failed to generate a valid media art keyframe prompt list.");
    }
    return parsed;
};

export const generateVisualArtVideo = async (text: string, effect: VisualArtEffect, videoModel: VideoModelID, image?: MediaArtSourceImage | null): Promise<string> => {
    let prompt = `Create a dynamic, visually striking motion graphics video based on the following parameters. The style should be abstract, high-energy, and suitable for a short social media clip.

- Visual Effect: ${effect}
`;

    if (image && text) {
        prompt += `- Source Image: The visuals should be heavily inspired by the provided image.\n`;
        prompt += `- Text: Animate the text "${text}" with the specified effect, integrating it smoothly with the image-inspired visuals.`;
    } else if (image) {
        prompt += `- Source Image: Animate the provided image itself using the specified visual effect. There is no text to display.`;
    } else if (text) {
        prompt += `- Text: The text "${text}" should be the central focus. Animate it with the chosen effect. The background should be complementary and dynamic.`;
    } else {
        // This case should be prevented by the UI
        prompt += `- Generate a generic abstract animation with the specified effect.`;
    }

    let imagePart;
    if (image) {
        const { data, mimeType } = await getImageData(image);
        imagePart = {
            imageBytes: data,
            mimeType: mimeType,
        };
    }

    const modelPrefix = getVideoModelPromptPrefix(videoModel);

    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: modelPrefix + prompt,
        ...(imagePart && { image: imagePart }),
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

const getTransitionStylePrompt = (style: ImageTransitionStyle, userPrompt: string, startDesc: string, endDesc: string): string => {
    let styleInstruction = '';
    switch (style) {
        case ImageTransitionStyle.PHYSICS_MORPH:
            styleInstruction = `The transition must be a physics-based morph. Animate the objects and elements within the start scene with realistic physics (gravity, momentum, collision). They should move, interact, and settle before seamlessly morphing into the final arrangement of the end scene. The transition should feel dynamic and grounded in reality.`;
            break;
        case ImageTransitionStyle.PARTICLE_DISSOLVE:
            styleInstruction = `The transition must be a particle dissolve. The start scene should dissolve into a swirling vortex of glowing particles. These particles will then elegantly coalesce and reform to create the end scene. The transition should feel magical and ethereal.`;
            break;
        case ImageTransitionStyle.CINEMATIC_ZOOM:
            styleInstruction = `The transition must be a slow, cinematic Ken Burns effect. Start with a close-up on a key detail in the start scene, then slowly pan and zoom out to reveal the full scene. As the zoom completes, cross-dissolve smoothly into the end scene, which may also have its own subtle pan or zoom. The movement must be smooth and professional.`;
            break;
        case ImageTransitionStyle.FLUID_PAINT:
            styleInstruction = `The transition must look like a fluid paint effect. Treat the start scene as a wet oil painting. Animate it with visible, fluid brushstrokes that swirl and blend the colors, transforming the scene dynamically. The paint should then settle and resolve into the sharp details of the end scene.`;
            break;
        case ImageTransitionStyle.MORPH:
        default:
            styleInstruction = `The transition must be a direct, smooth, and cinematic morphing effect between the start and end scenes.`;
            break;
    }

    return `
    **Primary Goal:** Create a short video that transitions from a starting scene to an ending scene.
    
    **Starting Scene Description:** ${startDesc}
    
    **Ending Scene Description:** ${endDesc}

    **Transition Style:** ${styleInstruction}

    **User's Creative Direction:** ${userPrompt}

    **Strict Requirements:**
    1.  The very first frame of the video MUST be identical to the provided start image.
    2.  The very last frame of the video MUST be a perfect visual representation of the 'Ending Scene Description'.
    3.  The animation between them must follow the specified transition style and user direction.
    4.  The final video must be high-quality and visually seamless.
    `;
}

const extractFrameFromMedia = async (media: TransitionMedia): Promise<{ data: string; mimeType: 'image/jpeg' }> => {
    if (media.type === 'image') {
        const response = await fetch(media.url);
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
             const reader = new FileReader();
             reader.onloadend = () => resolve(reader.result as string);
             reader.onerror = reject;
             reader.readAsDataURL(blob);
        });
        return { data: dataUrl.split(',')[1], mimeType: 'image/jpeg' };
    } else { // video
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;

            video.onloadeddata = () => {
                video.currentTime = 0;
            };

            video.onseeked = () => {
                // Delay slightly to ensure the frame is painted
                setTimeout(() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        URL.revokeObjectURL(video.src);
                        return reject(new Error('Canvas context not available'));
                    }
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    URL.revokeObjectURL(video.src); 
                    resolve({ data: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
                }, 100);
            };

            video.onerror = (e) => {
                URL.revokeObjectURL(video.src);
                reject(new Error('Failed to load video for frame extraction.'));
            };
            
            video.src = media.url;
            video.load();
        });
    }
};


export const generateImageTransitionVideo = async (startMedia: TransitionMedia, endMedia: TransitionMedia, userPrompt: string, style: ImageTransitionStyle, videoModel: VideoModelID): Promise<string> => {
    // Step 1: Extract first frame from both start and end media.
    const [startFrame, endFrame] = await Promise.all([
        extractFrameFromMedia(startMedia),
        extractFrameFromMedia(endMedia),
    ]);
    
    // Step 2: Get AI descriptions of both frames.
    const descriptionPrompt = "Concisely describe this image with vivid visual details. Focus on the main subject, setting, colors, and mood. This description will be used to guide a video animation AI.";

    const startImagePart = { inlineData: { data: startFrame.data, mimeType: startFrame.mimeType } };
    const endImagePart = { inlineData: { data: endFrame.data, mimeType: endFrame.mimeType } };

    const [startDescResponse, endDescResponse] = await Promise.all([
        ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [{ text: descriptionPrompt }, startImagePart] } }),
        ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [{ text: descriptionPrompt }, endImagePart] } }),
    ]);

    const startDescription = startDescResponse.text;
    const endDescription = endDescResponse.text;

    // Step 3: Create the final detailed prompt for the video model.
    const detailedPrompt = getTransitionStylePrompt(style, userPrompt, startDescription, endDescription);
    const modelPrefix = getVideoModelPromptPrefix(videoModel);

    // Step 4: Generate the video using the start frame and the new detailed prompt.
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: modelPrefix + detailedPrompt,
        image: {
            imageBytes: startFrame.data,
            mimeType: startFrame.mimeType,
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
