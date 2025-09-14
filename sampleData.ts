import { Tone, StoryboardConfig, AspectRatio, VisualStyle, VideoLength, Mood, SampleProduct, SampleStory } from './types';

export const sampleProducts: SampleProduct[] = [
  {
    productName: 'Aura Smart Air Purifier',
    keyFeatures: 'AI-powered air quality monitoring, HEPA H13 filter removes 99.97% of particles, whisper-quiet operation, minimalist design, syncs with smart home ecosystems (Alexa, Google Assistant)',
    targetAudience: 'Health-conscious families, city dwellers, people with allergies, pet owners',
    tone: Tone.PROFESSIONAL,
  },
  {
    productName: 'Nebula Portable Cinema Projector',
    keyFeatures: '1080p native resolution, 4-hour battery life, 360° speaker, Android TV 10.0 built-in, auto-focus and keystone correction',
    targetAudience: 'Movie lovers, families, travelers, people who want a home theater experience anywhere',
    tone: Tone.FRIENDLY,
  },
  {
    productName: 'Terra Sustainable Sneakers',
    keyFeatures: 'Made from recycled ocean plastic, algae foam insole for comfort, carbon-neutral manufacturing process, minimalist Scandinavian design, durable and lightweight',
    targetAudience: 'Eco-conscious consumers, fashion-forward millennials, urban commuters',
    tone: Tone.FRIENDLY,
  },
  {
    productName: 'Momentum Smart Treadmill',
    keyFeatures: 'Foldable space-saving design, interactive virtual running trails, AI-powered workout personalization, heart rate monitoring, shock-absorbing running deck',
    targetAudience: 'Home fitness enthusiasts, busy professionals, apartment dwellers',
    tone: Tone.PROFESSIONAL,
  },
  {
    productName: 'ChefBot AI Cooking Assistant',
    keyFeatures: 'Guided video recipes, automated stirring and temperature control, ingredient recognition, meal planning based on dietary needs, voice-controlled operation',
    targetAudience: 'Busy parents, aspiring home cooks, individuals with dietary restrictions',
    tone: Tone.HUMOROUS,
  },
  {
    productName: 'Evergreen Smart Indoor Garden',
    keyFeatures: 'Automated watering and LED grow lights, app-controlled for monitoring plant health, grows herbs and vegetables year-round, soil-free hydroponic system',
    targetAudience: 'Urban gardeners, healthy food enthusiasts, tech lovers',
    tone: Tone.FRIENDLY,
  },
  {
    productName: 'Sentinel Pro Drone',
    keyFeatures: '4K HDR camera with 3-axis gimbal, 30-minute flight time, obstacle avoidance sensors, 5-mile transmission range, intelligent flight modes like "Follow Me"',
    targetAudience: 'Photographers, videographers, travel bloggers, tech enthusiasts',
    tone: Tone.LUXURIOUS,
  },
  {
    productName: 'Oasis Noise-Cancelling Headphones',
    keyFeatures: 'Adaptive active noise cancellation, high-fidelity audio with deep bass, 24-hour battery life, comfortable over-ear design, crystal-clear microphone for calls',
    targetAudience: 'Frequent flyers, open-office workers, audiophiles, commuters',
    tone: Tone.LUXURIOUS,
  },
  {
    productName: 'FlowState Meditation Headband',
    keyFeatures: 'Real-time EEG feedback to guide meditation, personalized breathing exercises, tracks focus and calmness, comfortable and adjustable fabric design, connects to a library of guided sessions',
    targetAudience: 'Wellness seekers, stressed professionals, bio-hackers, people new to meditation',
    tone: Tone.PROFESSIONAL,
  },
  {
    productName: 'Craft Master Espresso Machine',
    keyFeatures: 'Barista-grade pressure control, built-in conical burr grinder, precise temperature stability, manual steam wand for latte art, stainless steel construction',
    targetAudience: 'Coffee connoisseurs, home baristas, design lovers',
    tone: Tone.LUXURIOUS,
  },
  {
    productName: 'The Catalyst Creator\'s Laptop',
    keyFeatures: '16-inch 4K OLED display, NVIDIA RTX 4080 GPU, Intel Core i9 processor, vapor chamber cooling, ultra-responsive tactile keyboard, 1TB NVMe SSD',
    targetAudience: 'Video editors, 3D artists, game developers, professional creatives',
    tone: Tone.PROFESSIONAL,
  },
  {
    productName: 'Aqua-Pure Smart Water Bottle',
    keyFeatures: 'UV-C light purification system, self-cleaning technology, tracks water intake via app, glows to remind you to drink, stainless steel vacuum insulation',
    targetAudience: 'Fitness enthusiasts, travelers, health-conscious individuals',
    tone: Tone.FRIENDLY,
  },
  {
    productName: 'The Scribe E-Ink Notebook',
    keyFeatures: 'Paper-like writing experience with included stylus, converts handwritten notes to text, access to cloud storage, long-lasting battery, reads ebooks',
    targetAudience: 'Students, writers, professionals who take frequent notes, minimalists',
    tone: Tone.PROFESSIONAL,
  },
  {
    productName: 'The Wanderer Adventure Backpack',
    keyFeatures: 'Weatherproof recycled fabric, modular packing cubes, anti-theft locking zippers, dedicated compartments for tech, ergonomic weight distribution system',
    targetAudience: 'Digital nomads, weekend travelers, photographers',
    tone: Tone.FRIENDLY,
  },
  {
    productName: 'Gamer\'s Nexus Ergonomic Chair',
    keyFeatures: '4D armrests, full-recline capability, magnetic memory foam headrest, integrated lumbar support, breathable PU leather',
    targetAudience: 'Professional gamers, streamers, anyone spending long hours at a desk',
    tone: Tone.HUMOROUS,
  },
  {
    productName: 'SolarFlare Portable Power Station',
    keyFeatures: 'Charges via solar panels or wall outlet, 1000Wh capacity, multiple AC/DC/USB ports, powers everything from phones to mini-fridges, rugged design for outdoor use',
    targetAudience: 'Campers, outdoor enthusiasts, emergency preparedness planners',
    tone: Tone.PROFESSIONAL,
  },
  {
    productName: 'The Composer Smart Keyboard',
    keyFeatures: '88 weighted keys with realistic hammer action, built-in lessons and AI feedback, vast library of instrument sounds, connects to music production software, sleek and modern design',
    targetAudience: 'Musicians, music students, producers',
    tone: Tone.LUXURIOUS,
  },
  {
    productName: 'PetConnect AI Pet Camera',
    keyFeatures: '360-degree view with HD video, two-way audio, treat dispenser, AI-powered bark alerts and activity tracking, night vision',
    targetAudience: 'Pet owners, especially those with separation anxiety concerns',
    tone: Tone.FRIENDLY,
  },
  {
    productName: 'The Guardian Smart Lock',
    keyFeatures: 'Fingerprint, keypad, app, and key access, auto-lock and unlock features, guest access codes, activity log, tamper alerts',
    targetAudience: 'Homeowners, Airbnb hosts, tech-savvy individuals',
    tone: Tone.PROFESSIONAL,
  },
  {
    productName: 'The Artisan Stand Mixer',
    keyFeatures: 'Powerful 10-speed motor, iconic tilt-head design, comes with dough hook, whisk, and flat beater, durable all-metal construction, wide range of color options',
    targetAudience: 'Home bakers, cooking enthusiasts, families',
    tone: Tone.FRIENDLY,
  },
  {
      productName: 'Stealth Pro Gaming Mouse',
      keyFeatures: 'Ultra-lightweight honeycomb design, 26,000 DPI optical sensor, customizable RGB lighting, lag-free wireless connection, 8 programmable buttons',
      targetAudience: 'Competitive e-sports players, FPS and MOBA gamers',
      tone: Tone.HUMOROUS,
  },
  {
      productName: 'Atmos 3D Soundbar',
      keyFeatures: 'Dolby Atmos surround sound, wireless subwoofer for deep bass, AI sound-tuning for any room, 4K HDR passthrough, Bluetooth and Wi-Fi streaming',
      targetAudience: 'Home theater enthusiasts, movie buffs, people looking for immersive audio',
      tone: Tone.LUXURIOUS,
  },
  {
      productName: 'FlexiDesk Electric Standing Desk',
      keyFeatures: 'Whisper-quiet dual motor, 4 programmable height presets, solid wood desktop, built-in cable management tray, anti-collision technology',
      targetAudience: 'Remote workers, office professionals, anyone looking to improve their posture and health',
      tone: Tone.PROFESSIONAL,
  },
  {
      productName: 'The Curator Digital Art Frame',
      keyFeatures: 'Displays thousands of famous artworks and NFTs, anti-glare matte screen, gesture control for changing art, ambient light sensor adjusts brightness, professionally curated playlists',
      targetAudience: 'Art lovers, interior design enthusiasts, tech-forward homeowners',
      tone: Tone.LUXURIOUS,
  },
  {
      productName: 'The Ritual Aromatherapy Diffuser',
      keyFeatures: 'Ultrasonic cool mist technology, handcrafted ceramic cover, customizable ambient light, smart timer settings, pairs with 100% pure essential oil blends',
      targetAudience: 'Wellness enthusiasts, people who practice yoga and meditation, anyone wanting a calming home environment',
      tone: Tone.FRIENDLY,
  },
  {
      productName: 'Tempest Smart Weather Station',
      keyFeatures: 'Hyperlocal weather data, AI-powered forecasting, tracks temperature, humidity, wind, rain, and lightning, solar-powered, no moving parts',
      targetAudience: 'Homeowners, gardeners, weather enthusiasts',
      tone: Tone.PROFESSIONAL,
  },
  {
      productName: 'The Voyager Language Translator Earbuds',
      keyFeatures: 'Real-time translation for 40 languages, high-quality audio for music and calls, comfortable and discreet design, offline translation mode for select languages',
      targetAudience: 'International travelers, business professionals, language learners',
      tone: Tone.PROFESSIONAL,
  },
  {
      productName: 'The Forager Gourmet Mushroom Kit',
      keyFeatures: 'Grow organic oyster mushrooms at home, foolproof and easy to set up, harvests in just 10 days, includes recipes and growing guide, sustainable and educational',
      targetAudience: 'Foodies, families with kids, people interested in sustainable living',
      tone: Tone.HUMOROUS,
  },
  {
      productName: 'Apex VR Headset',
      keyFeatures: '4K per-eye resolution, inside-out tracking (no external sensors), intuitive haptic controllers, expansive library of games and experiences, comfortable and balanced design',
      targetAudience: 'Gamers, tech early adopters, people seeking immersive entertainment',
      tone: Tone.LUXURIOUS,
  },
  {
      productName: 'The Centurion Tactical Watch',
      keyFeatures: 'Sapphire glass screen, solar charging, GPS and GLONASS navigation, heart rate and blood oxygen sensors, military-grade durability (MIL-STD-810G)',
      targetAudience: 'Hikers, adventurers, athletes, military personnel',
      tone: Tone.PROFESSIONAL,
  },
];


export const sampleStoryIdeas: SampleStory[] = [
    {
        keyword: 'ASMR Unboxing',
        idea: "Create a visually stunning ASMR unboxing video for a fictional, luxury tech product. Focus on crisp sounds: the tearing of wrapping paper, the soft click of the box opening, and the gentle peel of protective film. The product revealed is a glowing, futuristic gadget.",
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.SHORT,
            mood: Mood.MYSTERIOUS,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Cottagecore Aesthetic',
        idea: "Create a cinematic short video capturing the 'Cottagecore Aesthetic.' Show scenes of baking sourdough bread in a rustic kitchen, tending to a wildflower garden in slow-motion, and reading by a cozy fireplace. The mood should be warm, nostalgic, and peaceful.",
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.SQUARE,
            visualStyle: VisualStyle.WATERCOLOR,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'DIY Home Renovation',
        idea: "A fast-paced, energetic time-lapse video showing the transformation of a cluttered, old room into a modern, minimalist home office. Show quick cuts of painting, assembling furniture, and organizing, ending with a satisfying final reveal.",
        config: {
            sceneCount: 6,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.PHOTOREALISTIC,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.FAST_PACED,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'Satisfying Cleaning Motivation',
        idea: "A visually satisfying video of cleaning. Use close-up, slow-motion shots: a power washer stripping grime off a patio, a squeegee leaving a perfect streak on a window, and soap suds creating mesmerizing patterns.",
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.SHORT,
            mood: Mood.FAST_PACED,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'Cozy Gaming Setup Tour',
        idea: "A tour of the ultimate cozy gaming setup at night. The room is lit by the warm glow of RGB lights and neon signs. Focus on the details: the mechanical keyboard, the comfy gaming chair, and a cat sleeping on the desk.",
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.ANIME,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.MYSTERIOUS,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Futuristic Tech Concept',
        idea: "An epic, cinematic trailer for a futuristic tech concept, like personal flying vehicles weaving through a neon-lit cyberpunk city. The mood is grand, awe-inspiring, and slightly dystopian.",
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.LONG,
            mood: Mood.EPIC,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Miniature Claymation Cooking',
        idea: "A charming stop-motion animation of a tiny clay character cooking a miniature pizza. Show the process of kneading tiny dough, spreading sauce with a matchstick, and placing minuscule toppings.",
        config: {
            sceneCount: 6,
            aspectRatio: AspectRatio.SQUARE,
            visualStyle: VisualStyle.CLAYMATION,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.COMEDIC,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Abandoned Places Exploration',
        idea: "A mysterious and suspenseful exploration of a forgotten, overgrown mansion. The camera moves slowly through dusty rooms, revealing hints of the past. Sunlight streams through broken windows, illuminating floating dust particles.",
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.CLASSIC,
            visualStyle: VisualStyle.PHOTOREALISTIC,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.MYSTERIOUS,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Epic Drone Footage of Nature',
        idea: "Breathtaking, epic drone footage flying over dramatic landscapes. Include shots of soaring over a volcanic crater, skimming across a turquoise glacier lake, and chasing a waterfall down a massive cliff.",
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.LONG,
            mood: Mood.EPIC,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Pet Fails Compilation',
        idea: "A lighthearted and funny animation of common pet fails. A cat dramatically misjudging a jump, a dog getting stuck in a funny position, and a hamster stuffing its cheeks with too much food.",
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.SQUARE,
            visualStyle: VisualStyle.ANIME,
            videoLength: VideoLength.SHORT,
            mood: Mood.COMEDIC,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Street Food Tour',
        idea: 'A vibrant, fast-paced tour of a bustling Asian night market. Close-up shots of sizzling food, steam rising from woks, and the colorful chaos of the crowd. The mood is energetic and appetizing.',
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.PHOTOREALISTIC,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.FAST_PACED,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'A Day in the Life',
        idea: 'An emotional and cinematic "Day in the Life" of a lonely lighthouse keeper. Show scenes of their routine against the backdrop of a beautiful, stormy sea, ending with a moment of peaceful connection with nature.',
        config: {
            sceneCount: 6,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.LONG,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Lo-Fi Study Beats Animation',
        idea: 'A classic lo-fi animation loop. A character (like the lo-fi girl) is studying or relaxing in a cozy, rain-streaked room. The scene is filled with calm, warm lighting and subtle movements, like a cat\'s tail twitching.',
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.ANIME,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Mythical Creatures Documentary',
        idea: 'A faux-documentary in the style of a nature show, but featuring mythical creatures. A majestic griffin soaring over mountains, a family of dragons in their lair, and a shy unicorn glimpsed in an ancient forest.',
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.PHOTOREALISTIC,
            videoLength: VideoLength.LONG,
            mood: Mood.EPIC,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Oddly Satisfying Machines',
        idea: 'A mesmerizing animation of a Rube Goldberg-style machine performing a simple task in an overly complex and perfectly looping way. Focus on the smooth, flawless motion and the satisfying clicks and whirs of the mechanics.',
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.SQUARE,
            visualStyle: VisualStyle.CLAYMATION,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.FAST_PACED,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Travel Vlog to Japan',
        idea: 'A beautiful and serene travel vlog of Japan. A montage of scenes: a peaceful bamboo forest, the vibrant chaos of Shibuya Crossing, a tranquil temple in Kyoto, and cherry blossoms in full bloom.',
        config: {
            sceneCount: 6,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'Japanese',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Dark Academia',
        idea: 'A moody, mysterious video capturing the "Dark Academia" aesthetic. Scenes of a student studying late in a grand, Gothic library, writing with a fountain pen by candlelight, and walking through foggy university grounds.',
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.CLASSIC,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.MYSTERIOUS,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Gourmet Meal Preparation',
        idea: 'A top-down, fast-motion video of a chef preparing a complex, gourmet dish. The focus is on the precise knife skills, the artful plating, and the beautiful colors of the fresh ingredients.',
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.SQUARE,
            visualStyle: VisualStyle.PHOTOREALISTIC,
            videoLength: VideoLength.SHORT,
            mood: Mood.FAST_PACED,
            descriptionLanguage: 'French',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: '8-Bit Pixel Art Adventure',
        idea: 'A short, epic adventure story told in a pixel art style. A tiny hero travels through a lush forest, a dark cave, and battles a giant pixelated monster to reach a castle.',
        config: {
            sceneCount: 6,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.PIXEL_ART,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.EPIC,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Magical Potion Making',
        idea: 'A whimsical and magical scene of making a glowing potion. Ingredients float in the air, liquids change color, and the final potion sparkles with starlight in a crystal vial.',
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.ANIME,
            videoLength: VideoLength.SHORT,
            mood: Mood.MYSTERIOUS,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'Solana Phone Unboxing',
        idea: 'A tech unboxing video with a twist. The box is opened to reveal a Solana smartphone, which then projects a holographic crypto chart into the room, showing meteoric gains. The style is sleek and futuristic.',
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.SHORT,
            mood: Mood.EPIC,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'AI Taking Over the World',
        idea: 'A comedic, lighthearted take on the "AI takeover." A group of cute, friendly robots are shown inefficiently trying to do human jobs, like a robot chef making a mess in the kitchen or a robot dog walker getting tangled in leashes.',
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.SQUARE,
            visualStyle: VisualStyle.CLAYMATION,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.COMEDIC,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'The Perfect Coffee Pour',
        idea: 'An extremely satisfying, slow-motion video of the perfect latte art pour. The focus is on the velvety texture of the steamed milk as it creates a beautiful rosetta pattern on the rich crema of the espresso.',
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.PHOTOREALISTIC,
            videoLength: VideoLength.SHORT,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'Skincare Routine',
        idea: 'A serene and clean video showing a minimalist skincare routine. Close-ups on the textures of serums and creams. The setting is a bright, sunlit bathroom with lots of plants. The mood is calm and refreshing.',
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'POV Commute',
        idea: 'A fast-paced, first-person-view (POV) commute through a bustling city on an electric skateboard. Weave through traffic, cruise through parks, and arrive at a modern office building, all in a seamless, energetic sequence.',
        config: {
            sceneCount: 6,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.PHOTOREALISTIC,
            videoLength: VideoLength.SHORT,
            mood: Mood.FAST_PACED,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'Tiny House Tour',
        idea: 'A cozy and charming tour of a cleverly designed tiny house in the middle of a forest. Highlight the space-saving furniture, the large windows looking out onto nature, and the overall sense of peaceful, minimalist living.',
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.WATERCOLOR,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'Watercolor Landscape Painting',
        idea: 'A relaxing time-lapse of a watercolor painting of a mountain scene coming to life. Show the artist\'s brush strokes as layers of color build up to create a beautiful, atmospheric landscape.',
        config: {
            sceneCount: 4,
            aspectRatio: AspectRatio.SQUARE,
            visualStyle: VisualStyle.WATERCOLOR,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.EMOTIONAL,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'Historical Fashion Evolution',
        idea: 'A visually engaging, quick-cut video showing the evolution of fashion through a single decade (e.g., the 1920s). A character\'s outfit and hairstyle rapidly change to showcase the different trends of the era.',
        config: {
            sceneCount: 6,
            aspectRatio: AspectRatio.PORTRAIT,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.SHORT,
            mood: Mood.FAST_PACED,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
     {
        keyword: 'Surreal Dream Sequence',
        idea: 'A bizarre and mysterious dream sequence. Clocks melt, characters walk on clouds, and the landscape constantly shifts in impossible ways. The visual style is surreal and highly imaginative.',
        config: {
            sceneCount: 5,
            aspectRatio: AspectRatio.CLASSIC,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.MEDIUM,
            mood: Mood.MYSTERIOUS,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    },
    {
        keyword: 'Space Colony Timelapse',
        idea: 'An epic timelapse showing the construction of a human colony on Mars. Start with the first landing pod and progressively show the growth of biodomes, habitats, and terraforming equipment until a bustling city emerges under the red sky.',
        config: {
            sceneCount: 6,
            aspectRatio: AspectRatio.LANDSCAPE,
            visualStyle: VisualStyle.CINEMATIC,
            videoLength: VideoLength.LONG,
            mood: Mood.EPIC,
            descriptionLanguage: 'English',
            textModel: 'gemini-2.5-flash',
            imageModel: 'imagen-4.0-generate-001',
        }
    }
];
