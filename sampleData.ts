import { Tone, StoryboardConfig, AspectRatio, VisualStyle, VideoLength, Mood } from './types';

interface SampleProduct {
  productName: string;
  keyFeatures: string;
  targetAudience: string;
  tone: Tone;
}

export const sampleProducts: SampleProduct[] = [
  {
    productName: 'Quantum Leap Smartwatch',
    keyFeatures: 'Holographic display, AI health monitoring, 5-day battery life, titanium alloy body, seamless OS integration',
    targetAudience: 'Tech enthusiasts, busy professionals, fitness trackers',
    tone: Tone.LUXURIOUS,
  },
  {
    productName: 'Zenith Ergonomic Office Chair',
    keyFeatures: 'Dynamic lumbar support, breathable mesh back, 4D adjustable armrests, memory foam seat cushion, silent glide wheels',
    targetAudience: 'Remote workers, gamers, office professionals, students',
    tone: Tone.PROFESSIONAL,
  },
  {
    productName: '"Glow Up" Vitamin C Serum',
    keyFeatures: '20% Vitamin C, hyaluronic acid, antioxidant-rich, vegan & cruelty-free, fades dark spots',
    targetAudience: 'Skincare lovers, people concerned with aging, individuals with uneven skin tone',
    tone: Tone.FRIENDLY,
  },
  {
    productName: 'Cosmic Crisp Cold Brew Coffee',
    keyFeatures: 'Organic single-origin beans, 18-hour slow steep, naturally sweet, low acidity, notes of chocolate and caramel',
    targetAudience: 'Coffee connoisseurs, busy students, morning commuters',
    tone: Tone.HUMOROUS,
  },
  {
    productName: 'Nomad All-Weather Backpack',
    keyFeatures: 'Waterproof recycled materials, anti-theft design, dedicated laptop compartment, USB charging port, expandable storage',
    targetAudience: 'Travelers, urban commuters, photographers, students',
    tone: Tone.FRIENDLY,
  }
];

interface SampleStory {
    idea: string;
    config: StoryboardConfig;
}

export const sampleStoryIdeas: SampleStory[] = [
    {
        idea: "A mischievous squirrel steals a magician's wand and causes chaos in a city park.",
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.ANIME,
            videoLength: VideoLength.SHORT,
            mood: Mood.COMEDIC,
            descriptionLanguage: 'English',
        }
    },
    {
        idea: "A forgotten toy robot in an attic suddenly wakes up and goes on an adventure to find its owner.",
        config: {
            sceneCount: 6,
            aspectRatio: AspectRatio.CLASSIC,
            visualStyle: VisualStyle.CLAYMATION,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'English',
        }
    },
    {
        idea: "A lonely astronaut on Mars discovers a mysterious, glowing plant that pulses with light.",
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.LONG,
            mood: Mood.MYSTERIOUS,
            descriptionLanguage: 'English',
        }
    },
     {
        idea: "A group of friendly monsters who are afraid of the dark learn to be brave with the help of a tiny firefly.",
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.SQUARE,
            visualStyle: VisualStyle.WATERCOLOR,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'English',
        }
    },
     {
        idea: "A top-down view of a city where the cars are replaced by giant, racing snails with colorful shells.",
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.PHOTOREALISTIC,
            videoLength: VideoLength.SHORT,
            mood: Mood.FAST_PACED,
            descriptionLanguage: 'English',
        }
    }
];