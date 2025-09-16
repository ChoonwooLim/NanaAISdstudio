import { Tone, StoryboardConfig, AspectRatio, VisualStyle, VideoLength, Mood, SampleProduct, SampleStory } from './types';

// Type helper for localized data
type Localized<T> = {
    en: T;
    ko: T;
};

// Note: The keys (e.g., 'aura-air-purifier') are for internal use and mapping.
export const sampleProductsData: { [key: string]: Localized<SampleProduct> } = {
  'aura-air-purifier': {
    en: {
      productName: 'Aura Smart Air Purifier',
      keyFeatures: 'AI-powered air quality monitoring, HEPA H13 filter removes 99.97% of particles, whisper-quiet operation, minimalist design, syncs with smart home ecosystems (Alexa, Google Assistant)',
      targetAudience: 'Health-conscious families, city dwellers, people with allergies, pet owners',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '아우라 스마트 공기청정기',
      keyFeatures: 'AI 기반 공기질 모니터링, 99.97% 미세먼지 제거 헤파 H13 필터, 속삭이듯 조용한 작동, 미니멀리즘 디자인, 스마트홈 연동 (알렉사, 구글 어시스턴트)',
      targetAudience: '건강을 생각하는 가족, 도시 거주자, 알레르기 환자, 반려동물 양육가구',
      tone: Tone.PROFESSIONAL,
    },
  },
  'nebula-projector': {
    en: {
      productName: 'Nebula Portable Cinema Projector',
      keyFeatures: '1080p native resolution, 4-hour battery life, 360° speaker, Android TV 10.0 built-in, auto-focus and keystone correction',
      targetAudience: 'Movie lovers, families, travelers, people who want a home theater experience anywhere',
      tone: Tone.FRIENDLY,
    },
    ko: {
      productName: '네뷸라 휴대용 시네마 프로젝터',
      keyFeatures: '1080p FHD 해상도, 4시간 배터리, 360도 스피커, 안드로이드 TV 10.0 내장, 자동 초점 및 키스톤 보정',
      targetAudience: '영화 애호가, 가족, 여행객, 어디서든 홈시어터 경험을 원하는 사람',
      tone: Tone.FRIENDLY,
    },
  },
  'terra-sneakers': {
    en: {
      productName: 'Terra Sustainable Sneakers',
      keyFeatures: 'Made from recycled ocean plastic, algae foam insole for comfort, carbon-neutral manufacturing process, minimalist Scandinavian design, durable and lightweight',
      targetAudience: 'Eco-conscious consumers, fashion-forward millennials, urban commuters',
      tone: Tone.FRIENDLY,
    },
    ko: {
      productName: '테라 지속가능 스니커즈',
      keyFeatures: '재활용 해양 플라스틱으로 제작, 편안함을 위한 해조류 폼 인솔, 탄소 중립 제조 공정, 미니멀한 스칸디나비아 디자인, 튼튼하고 가벼움',
      targetAudience: '환경을 생각하는 소비자, 패셔너블한 밀레니얼 세대, 도시 통근자',
      tone: Tone.FRIENDLY,
    },
  },
  'momentum-treadmill': {
    en: {
      productName: 'Momentum Smart Treadmill',
      keyFeatures: 'Foldable space-saving design, interactive virtual running trails, AI-powered workout personalization, heart rate monitoring, shock-absorbing running deck',
      targetAudience: 'Home fitness enthusiasts, busy professionals, apartment dwellers',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '모멘텀 스마트 트레드밀',
      keyFeatures: '접이식 공간 절약 디자인, 인터랙티브 가상 러닝 트레일, AI 기반 운동 개인화, 심박수 모니터링, 충격 흡수 러닝 데크',
      targetAudience: '홈 피트니스 애호가, 바쁜 직장인, 아파트 거주자',
      tone: Tone.PROFESSIONAL,
    },
  },
  'chefbot-assistant': {
    en: {
      productName: 'ChefBot AI Cooking Assistant',
      keyFeatures: 'Guided video recipes, automated stirring and temperature control, ingredient recognition, meal planning based on dietary needs, voice-controlled operation',
      targetAudience: 'Busy parents, aspiring home cooks, individuals with dietary restrictions',
      tone: Tone.HUMOROUS,
    },
    ko: {
      productName: '셰프봇 AI 요리 보조',
      keyFeatures: '가이드 비디오 레시피, 자동 젓기 및 온도 조절, 재료 인식, 식단 맞춤 식사 계획, 음성 제어 작동',
      targetAudience: '바쁜 부모, 요리 초보자, 식단 조절이 필요한 사람',
      tone: Tone.HUMOROUS,
    },
  },
  'evergreen-garden': {
    en: {
      productName: 'Evergreen Smart Indoor Garden',
      keyFeatures: 'Automated watering and LED grow lights, app-controlled for monitoring plant health, grows herbs and vegetables year-round, soil-free hydroponic system',
      targetAudience: 'Urban gardeners, healthy food enthusiasts, tech lovers',
      tone: Tone.FRIENDLY,
    },
    ko: {
      productName: '에버그린 스마트 실내 정원',
      keyFeatures: '자동 물주기 및 LED 성장 조명, 앱으로 식물 건강 모니터링, 일 년 내내 허브와 채소 재배, 무토양 수경 재배 시스템',
      targetAudience: '도시 농부, 건강식 애호가, 기술 애호가',
      tone: Tone.FRIENDLY,
    },
  },
  'sentinel-drone': {
    en: {
      productName: 'Sentinel Pro Drone',
      keyFeatures: '4K HDR camera with 3-axis gimbal, 30-minute flight time, obstacle avoidance sensors, 5-mile transmission range, intelligent flight modes like "Follow Me"',
      targetAudience: 'Photographers, videographers, travel bloggers, tech enthusiasts',
      tone: Tone.LUXURIOUS,
    },
    ko: {
      productName: '센티널 프로 드론',
      keyFeatures: '3축 짐벌 4K HDR 카메라, 30분 비행 시간, 장애물 회피 센서, 8km 전송 거리, "팔로우 미"와 같은 지능형 비행 모드',
      targetAudience: '사진작가, 비디오그래퍼, 여행 블로거, 기술 애호가',
      tone: Tone.LUXURIOUS,
    },
  },
  'oasis-headphones': {
    en: {
      productName: 'Oasis Noise-Cancelling Headphones',
      keyFeatures: 'Adaptive active noise cancellation, high-fidelity audio with deep bass, 24-hour battery life, comfortable over-ear design, crystal-clear microphone for calls',
      targetAudience: 'Frequent flyers, open-office workers, audiophiles, commuters',
      tone: Tone.LUXURIOUS,
    },
    ko: {
      productName: '오아시스 노이즈 캔슬링 헤드폰',
      keyFeatures: '적응형 액티브 노이즈 캔슬링, 깊은 베이스의 고음질 오디오, 24시간 배터리 수명, 편안한 오버이어 디자인, 통화를 위한 선명한 마이크',
      targetAudience: '잦은 비행기 탑승객, 개방형 사무실 근무자, 오디오 애호가, 통근자',
      tone: Tone.LUXURIOUS,
    },
  },
  'flowstate-headband': {
    en: {
      productName: 'FlowState Meditation Headband',
      keyFeatures: 'Real-time EEG feedback to guide meditation, personalized breathing exercises, tracks focus and calmness, comfortable and adjustable fabric design, connects to a library of guided sessions',
      targetAudience: 'Wellness seekers, stressed professionals, bio-hackers, people new to meditation',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '플로우스테이트 명상 헤드밴드',
      keyFeatures: '명상을 안내하는 실시간 뇌파 피드백, 개인화된 호흡 운동, 집중력 및 평온함 추적, 편안하고 조절 가능한 패브릭 디자인, 가이드 세션 라이브러리 연결',
      targetAudience: '웰빙 추구자, 스트레스받는 직장인, 바이오해커, 명상 초보자',
      tone: Tone.PROFESSIONAL,
    },
  },
  'craft-master-espresso': {
    en: {
      productName: 'Craft Master Espresso Machine',
      keyFeatures: 'Barista-grade pressure control, built-in conical burr grinder, precise temperature stability, manual steam wand for latte art, stainless steel construction',
      targetAudience: 'Coffee connoisseurs, home baristas, design lovers',
      tone: Tone.LUXURIOUS,
    },
    ko: {
      productName: '크래프트 마스터 에스프레소 머신',
      keyFeatures: '바리스타급 압력 조절, 내장형 코니컬 버 그라인더, 정밀한 온도 안정성, 라떼 아트를 위한 수동 스팀 완드, 스테인리스 스틸 구조',
      targetAudience: '커피 전문가, 홈 바리스타, 디자인 애호가',
      tone: Tone.LUXURIOUS,
    },
  },
    'catalyst-laptop': {
    en: {
      productName: 'The Catalyst Creator\'s Laptop',
      keyFeatures: '16-inch 4K OLED display, NVIDIA RTX 4080 GPU, Intel Core i9 processor, vapor chamber cooling, ultra-responsive tactile keyboard, 1TB NVMe SSD',
      targetAudience: 'Video editors, 3D artists, game developers, professional creatives',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '카탈리스트 크리에이터 노트북',
      keyFeatures: '16인치 4K OLED 디스플레이, NVIDIA RTX 4080 GPU, 인텔 코어 i9 프로세서, 베이퍼 챔버 쿨링, 초고속 반응 택타일 키보드, 1TB NVMe SSD',
      targetAudience: '영상 편집자, 3D 아티스트, 게임 개발자, 전문 크리에이터',
      tone: Tone.PROFESSIONAL,
    },
  },
  'aqua-pure-bottle': {
    en: {
      productName: 'Aqua-Pure Smart Water Bottle',
      keyFeatures: 'UV-C light purification system, self-cleaning technology, tracks water intake via app, glows to remind you to drink, stainless steel vacuum insulation',
      targetAudience: 'Fitness enthusiasts, travelers, health-conscious individuals',
      tone: Tone.FRIENDLY,
    },
    ko: {
      productName: '아쿠아퓨어 스마트 물병',
      keyFeatures: 'UV-C 빛 정화 시스템, 자동 세척 기술, 앱을 통한 수분 섭취량 추적, 물 마실 시간 알림 기능, 스테인리스 스틸 진공 단열',
      targetAudience: '피트니스 애호가, 여행자, 건강을 생각하는 개인',
      tone: Tone.FRIENDLY,
    },
  },
  'scribe-e-ink-notebook': {
    en: {
      productName: 'The Scribe E-Ink Notebook',
      keyFeatures: 'Paper-like writing experience with included stylus, converts handwritten notes to text, access to cloud storage, long-lasting battery, reads ebooks',
      targetAudience: 'Students, writers, professionals who take frequent notes, minimalists',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '스크라이브 E-잉크 노트북',
      keyFeatures: '스타일러스 펜 포함 종이 같은 필기감, 손글씨 텍스트 변환, 클라우드 저장소 접근, 긴 배터리 수명, 전자책 리더 기능',
      targetAudience: '학생, 작가, 필기를 자주 하는 전문가, 미니멀리스트',
      tone: Tone.PROFESSIONAL,
    },
  },
  'wanderer-backpack': {
    en: {
      productName: 'The Wanderer Adventure Backpack',
      keyFeatures: 'Weatherproof recycled fabric, modular packing cubes, anti-theft locking zippers, dedicated compartments for tech, ergonomic weight distribution system',
      targetAudience: 'Digital nomads, weekend travelers, photographers',
      tone: Tone.FRIENDLY,
    },
    ko: {
      productName: '원더러 어드벤처 백팩',
      keyFeatures: '방수 재활용 원단, 모듈형 패킹 큐브, 도난 방지 잠금 지퍼, 전용 테크 수납공간, 인체공학적 무게 분산 시스템',
      targetAudience: '디지털 노마드, 주말 여행자, 사진작가',
      tone: Tone.FRIENDLY,
    },
  },
  'gamers-nexus-chair': {
    en: {
      productName: 'Gamer\'s Nexus Ergonomic Chair',
      keyFeatures: '4D armrests, full-recline capability, magnetic memory foam headrest, integrated lumbar support, breathable PU leather',
      targetAudience: 'Professional gamers, streamers, anyone spending long hours at a desk',
      tone: Tone.HUMOROUS,
    },
    ko: {
      productName: '게이머스 넥서스 인체공학 의자',
      keyFeatures: '4D 팔걸이, 완전 리클라이닝 기능, 자석식 메모리폼 헤드레스트, 내장형 허리 지지대, 통기성 좋은 PU 가죽',
      targetAudience: '프로 게이머, 스트리머, 장시간 책상에 앉아있는 모든 사람',
      tone: Tone.HUMOROUS,
    },
  },
  'solarflare-power-station': {
    en: {
      productName: 'SolarFlare Portable Power Station',
      keyFeatures: 'Charges via solar panels or wall outlet, 1000Wh capacity, multiple AC/DC/USB ports, powers everything from phones to mini-fridges, rugged design for outdoor use',
      targetAudience: 'Campers, outdoor enthusiasts, emergency preparedness planners',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '솔라플레어 휴대용 파워 스테이션',
      keyFeatures: '태양광 패널 또는 벽면 콘센트로 충전, 1000Wh 용량, 다중 AC/DC/USB 포트, 휴대폰부터 미니 냉장고까지 전원 공급, 견고한 아웃도어 디자인',
      targetAudience: '캠핑족, 아웃도어 애호가, 비상 대비 계획자',
      tone: Tone.PROFESSIONAL,
    },
  },
  'composer-smart-keyboard': {
    en: {
      productName: 'The Composer Smart Keyboard',
      keyFeatures: '88 weighted keys with realistic hammer action, built-in lessons and AI feedback, vast library of instrument sounds, connects to music production software, sleek and modern design',
      targetAudience: 'Musicians, music students, producers',
      tone: Tone.LUXURIOUS,
    },
    ko: {
      productName: '컴포저 스마트 키보드',
      keyFeatures: '88개의 사실적인 해머 액션 웨이티드 건반, 내장 레슨 및 AI 피드백, 방대한 악기 사운드 라이브러리, 음악 제작 소프트웨어 연결, 세련되고 현대적인 디자인',
      targetAudience: '음악가, 음악 전공 학생, 프로듀서',
      tone: Tone.LUXURIOUS,
    },
  },
  'petconnect-ai-camera': {
    en: {
      productName: 'PetConnect AI Pet Camera',
      keyFeatures: '360-degree view with HD video, two-way audio, treat dispenser, AI-powered bark alerts and activity tracking, night vision',
      targetAudience: 'Pet owners, especially those with separation anxiety concerns',
      tone: Tone.FRIENDLY,
    },
    ko: {
      productName: '펫커넥트 AI 펫 카메라',
      keyFeatures: '360도 HD 비디오 뷰, 양방향 오디오, 간식 디스펜서, AI 기반 짖음 알림 및 활동 추적, 나이트 비전',
      targetAudience: '반려동물 주인, 특히 분리불안이 걱정되는 분들',
      tone: Tone.FRIENDLY,
    },
  },
  'guardian-smart-lock': {
    en: {
      productName: 'The Guardian Smart Lock',
      keyFeatures: 'Fingerprint, keypad, app, and key access, auto-lock and unlock features, guest access codes, activity log, tamper alerts',
      targetAudience: 'Homeowners, Airbnb hosts, tech-savvy individuals',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '가디언 스마트 잠금장치',
      keyFeatures: '지문, 키패드, 앱 및 키 접근, 자동 잠금 및 잠금 해제 기능, 게스트 액세스 코드, 활동 로그, 무단 변경 경고',
      targetAudience: '주택 소유자, 에어비앤비 호스트, 기술에 정통한 개인',
      tone: Tone.PROFESSIONAL,
    },
  },
  'artisan-stand-mixer': {
    en: {
      productName: 'The Artisan Stand Mixer',
      keyFeatures: 'Powerful 10-speed motor, iconic tilt-head design, comes with dough hook, whisk, and flat beater, durable all-metal construction, wide range of color options',
      targetAudience: 'Home bakers, cooking enthusiasts, families',
      tone: Tone.FRIENDLY,
    },
    ko: {
      productName: '아티산 스탠드 믹서',
      keyFeatures: '강력한 10단 속도 모터, 상징적인 틸트 헤드 디자인, 반죽 후크, 거품기 및 플랫 비터 포함, 내구성 있는 올메탈 구조, 다양한 색상 옵션',
      targetAudience: '홈 베이커, 요리 애호가, 가족',
      tone: Tone.FRIENDLY,
    },
  },
  'stealth-pro-mouse': {
    en: {
      productName: 'Stealth Pro Gaming Mouse',
      keyFeatures: 'Ultra-lightweight honeycomb design, 26,000 DPI optical sensor, customizable RGB lighting, lag-free wireless connection, 8 programmable buttons',
      targetAudience: 'Competitive e-sports players, FPS and MOBA gamers',
      tone: Tone.HUMOROUS,
    },
    ko: {
      productName: '스텔스 프로 게이밍 마우스',
      keyFeatures: '초경량 허니콤 디자인, 26,000 DPI 광학 센서, 커스텀 RGB 조명, 지연 없는 무선 연결, 8개의 프로그래밍 가능 버튼',
      targetAudience: '경쟁적인 e스포츠 선수, FPS 및 MOBA 게이머',
      tone: Tone.HUMOROUS,
    },
  },
  'atmos-3d-soundbar': {
    en: {
      productName: 'Atmos 3D Soundbar',
      keyFeatures: 'Dolby Atmos surround sound, wireless subwoofer for deep bass, AI sound-tuning for any room, 4K HDR passthrough, Bluetooth and Wi-Fi streaming',
      targetAudience: 'Home theater enthusiasts, movie buffs, people looking for immersive audio',
      tone: Tone.LUXURIOUS,
    },
    ko: {
      productName: '애트모스 3D 사운드바',
      keyFeatures: '돌비 애트모스 서라운드 사운드, 깊은 베이스를 위한 무선 서브우퍼, 모든 공간에 맞는 AI 사운드 튜닝, 4K HDR 패스스루, 블루투스 및 Wi-Fi 스트리밍',
      targetAudience: '홈시어터 애호가, 영화광, 몰입형 오디오를 찾는 사람들',
      tone: Tone.LUXURIOUS,
    },
  },
  'flexidesk-standing-desk': {
    en: {
      productName: 'FlexiDesk Electric Standing Desk',
      keyFeatures: 'Whisper-quiet dual motor, 4 programmable height presets, solid wood desktop, built-in cable management tray, anti-collision technology',
      targetAudience: 'Remote workers, office professionals, anyone looking to improve their posture and health',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '플렉시데스크 전동 스탠딩 데스크',
      keyFeatures: '속삭이듯 조용한 듀얼 모터, 4개의 프로그래밍 가능 높이 프리셋, 원목 데스크탑, 내장 케이블 관리 트레이, 충돌 방지 기술',
      targetAudience: '원격 근무자, 사무직 전문가, 자세와 건강을 개선하려는 모든 사람',
      tone: Tone.PROFESSIONAL,
    },
  },
  'curator-digital-art-frame': {
    en: {
      productName: 'The Curator Digital Art Frame',
      keyFeatures: 'Displays thousands of famous artworks and NFTs, anti-glare matte screen, gesture control for changing art, ambient light sensor adjusts brightness, professionally curated playlists',
      targetAudience: 'Art lovers, interior design enthusiasts, tech-forward homeowners',
      tone: Tone.LUXURIOUS,
    },
    ko: {
      productName: '큐레이터 디지털 아트 프레임',
      keyFeatures: '수천 개의 유명 예술 작품 및 NFT 전시, 눈부심 방지 무광 스크린, 예술 작품 변경을 위한 제스처 제어, 주변광 센서로 밝기 조절, 전문적으로 큐레이팅된 재생 목록',
      targetAudience: '예술 애호가, 인테리어 디자인 애호가, 기술 지향적인 주택 소유자',
      tone: Tone.LUXURIOUS,
    },
  },
  'ritual-aromatherapy-diffuser': {
    en: {
      productName: 'The Ritual Aromatherapy Diffuser',
      keyFeatures: 'Ultrasonic cool mist technology, handcrafted ceramic cover, customizable ambient light, smart timer settings, pairs with 100% pure essential oil blends',
      targetAudience: 'Wellness enthusiasts, people who practice yoga and meditation, anyone wanting a calming home environment',
      tone: Tone.FRIENDLY,
    },
    ko: {
      productName: '리추얼 아로마테라피 디퓨저',
      keyFeatures: '초음파 쿨 미스트 기술, 수공예 세라믹 커버, 맞춤형 무드 조명, 스마트 타이머 설정, 100% 순수 에센셜 오일 블렌드와 페어링',
      targetAudience: '웰빙 애호가, 요가 및 명상 실천가, 차분한 가정 환경을 원하는 모든 사람',
      tone: Tone.FRIENDLY,
    },
  },
  'tempest-smart-weather-station': {
    en: {
      productName: 'Tempest Smart Weather Station',
      keyFeatures: 'Hyperlocal weather data, AI-powered forecasting, tracks temperature, humidity, wind, rain, and lightning, solar-powered, no moving parts',
      targetAudience: 'Homeowners, gardeners, weather enthusiasts',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '템페스트 스마트 기상 관측소',
      keyFeatures: '초지역 날씨 데이터, AI 기반 예보, 온도, 습도, 바람, 비, 번개 추적, 태양광 발전, 움직이는 부품 없음',
      targetAudience: '주택 소유자, 정원사, 날씨 애호가',
      tone: Tone.PROFESSIONAL,
    },
  },
  'voyager-translator-earbuds': {
    en: {
      productName: 'The Voyager Language Translator Earbuds',
      keyFeatures: 'Real-time translation for 40 languages, high-quality audio for music and calls, comfortable and discreet design, offline translation mode for select languages',
      targetAudience: 'International travelers, business professionals, language learners',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '보이저 언어 번역 이어버드',
      keyFeatures: '40개 언어 실시간 번역, 음악 및 통화를 위한 고품질 오디오, 편안하고 눈에 띄지 않는 디자인, 일부 언어 오프라인 번역 모드',
      targetAudience: '해외 여행자, 비즈니스 전문가, 언어 학습자',
      tone: Tone.PROFESSIONAL,
    },
  },
  'forager-mushroom-kit': {
    en: {
      productName: 'The Forager Gourmet Mushroom Kit',
      keyFeatures: 'Grow organic oyster mushrooms at home, foolproof and easy to set up, harvests in just 10 days, includes recipes and growing guide, sustainable and educational',
      targetAudience: 'Foodies, families with kids, people interested in sustainable living',
      tone: Tone.HUMOROUS,
    },
    ko: {
      productName: '포레저 미식가 버섯 키트',
      keyFeatures: '집에서 유기농 느타리버섯 재배, 실패 없는 손쉬운 설치, 단 10일 만에 수확, 레시피 및 재배 가이드 포함, 지속 가능하고 교육적',
      targetAudience: '미식가, 아이가 있는 가족, 지속 가능한 삶에 관심 있는 사람',
      tone: Tone.HUMOROUS,
    },
  },
  'apex-vr-headset': {
    en: {
      productName: 'Apex VR Headset',
      keyFeatures: '4K per-eye resolution, inside-out tracking (no external sensors), intuitive haptic controllers, expansive library of games and experiences, comfortable and balanced design',
      targetAudience: 'Gamers, tech early adopters, people seeking immersive entertainment',
      tone: Tone.LUXURIOUS,
    },
    ko: {
      productName: '에이펙스 VR 헤드셋',
      keyFeatures: '눈당 4K 해상도, 인사이드-아웃 트래킹(외부 센서 불필요), 직관적인 햅틱 컨트롤러, 방대한 게임 및 경험 라이브러리, 편안하고 균형 잡힌 디자인',
      targetAudience: '게이머, 기술 얼리어답터, 몰입형 엔터테인먼트를 찾는 사람',
      tone: Tone.LUXURIOUS,
    },
  },
  'centurion-tactical-watch': {
    en: {
      productName: 'The Centurion Tactical Watch',
      keyFeatures: 'Sapphire glass screen, solar charging, GPS and GLONASS navigation, heart rate and blood oxygen sensors, military-grade durability (MIL-STD-810G)',
      targetAudience: 'Hikers, adventurers, athletes, military personnel',
      tone: Tone.PROFESSIONAL,
    },
    ko: {
      productName: '센추리온 택티컬 워치',
      keyFeatures: '사파이어 글래스 스크린, 태양광 충전, GPS 및 GLONASS 내비게이션, 심박수 및 혈중 산소 센서, 군용 등급 내구성(MIL-STD-810G)',
      targetAudience: '등산객, 모험가, 운동선수, 군인',
      tone: Tone.PROFESSIONAL,
    },
  },
};

export const sampleStoryIdeasData: { [key: string]: Localized<SampleStory> } = {
    'asmr-unboxing': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: 'ASMR 언박싱',
            idea: "가상의 고급 테크 제품에 대한 시각적으로 놀라운 ASMR 언박싱 비디오를 만드세요. 선명한 사운드에 집중하세요: 포장지 뜯는 소리, 상자가 부드럽게 열리는 클릭 소리, 보호 필름을 조심스럽게 떼어내는 소리. 공개된 제품은 빛나는 미래형 기기입니다.",
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.SHORT,
                mood: Mood.MYSTERIOUS,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'cottagecore-aesthetic': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '코티지코어 감성',
            idea: "'코티지코어 감성'을 담은 영화 같은 짧은 비디오를 만드세요. 시골풍 주방에서 사워도우 빵을 굽고, 들꽃 정원을 슬로우 모션으로 가꾸고, 아늑한 벽난로 옆에서 독서하는 장면을 보여주세요. 따뜻하고, 향수를 자극하며, 평화로운 분위기여야 합니다.",
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.SQUARE,
                visualStyle: VisualStyle.WATERCOLOR,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.EMOTIONAL,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'diy-home-renovation': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: 'DIY 홈 리모델링',
            idea: "어수선하고 낡은 방이 현대적이고 미니멀한 홈 오피스로 변신하는 과정을 보여주는 빠르고 에너지 넘치는 타임랩스 비디오. 페인팅, 가구 조립, 정리하는 빠른 컷들을 보여주고 만족스러운 최종 모습으로 마무리하세요.",
            config: {
                sceneCount: 6,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.PHOTOREALISTIC,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.FAST_PACED,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'satisfying-cleaning': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '만족스러운 청소 동기부여',
            idea: "시각적으로 만족스러운 청소 비디오. 클로즈업, 슬로우 모션 샷을 사용하세요: 고압 세척기가 테라스의 때를 벗겨내는 모습, 스퀴지가 창문에 완벽한 자국을 남기는 모습, 비누 거품이 매혹적인 패턴을 만드는 모습.",
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.SHORT,
                mood: Mood.FAST_PACED,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'cozy-gaming-setup': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '아늑한 게이밍 셋업 투어',
            idea: "밤의 궁극의 아늑한 게이밍 셋업 투어. 방은 RGB 조명과 네온사인의 따뜻한 불빛으로 밝혀져 있습니다. 기계식 키보드, 편안한 게이밍 의자, 책상 위에서 자고 있는 고양이 등 디테일에 집중하세요.",
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.ANIME,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.MYSTERIOUS,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'futuristic-tech-concept': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '미래 기술 컨셉',
            idea: "네온 불빛의 사이버펑크 도시를 가로지르는 개인 비행체와 같은 미래 기술 컨셉을 위한 웅장하고 영화 같은 트레일러. 분위기는 웅장하고, 경외감을 불러일으키며, 약간 디스토피아적입니다.",
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.LONG,
                mood: Mood.EPIC,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'miniature-claymation-cooking': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '미니어처 클레이메이션 요리',
            idea: "작은 클레이 캐릭터가 미니어처 피자를 요리하는 매력적인 스톱모션 애니메이션. 작은 반죽을 반죽하고, 성냥개비로 소스를 바르고, 아주 작은 토핑을 올리는 과정을 보여주세요.",
            config: {
                sceneCount: 6,
                aspectRatio: AspectRatio.SQUARE,
                visualStyle: VisualStyle.CLAYMATION,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.COMEDIC,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'abandoned-places-exploration': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '폐허 탐험',
            idea: "잊혀지고 무성하게 자란 저택을 신비롭고 긴장감 넘치게 탐험합니다. 카메라는 먼지 쌓인 방들을 천천히 통과하며 과거의 흔적을 드러냅니다. 깨진 창문으로 햇빛이 들어와 떠다니는 먼지 입자들을 비춥니다.",
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.CLASSIC,
                visualStyle: VisualStyle.PHOTOREALISTIC,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.MYSTERIOUS,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'epic-drone-footage': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '자연의 웅장한 드론 영상',
            idea: "드라마틱한 풍경 위를 비행하는 숨 막히고 웅장한 드론 영상. 화산 분화구 위를 솟아오르고, 청록색 빙하 호수 위를 스치듯 지나가고, 거대한 절벽 아래로 폭포를 쫓아가는 샷을 포함하세요.",
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.LONG,
                mood: Mood.EPIC,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'pet-fails-compilation': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '반려동물 실패 모음',
            idea: "흔한 반려동물 실패 사례를 담은 가볍고 재미있는 애니메이션. 극적으로 점프를 잘못 판단하는 고양이, 웃긴 자세로 끼인 개, 볼에 너무 많은 음식을 채우는 햄스터.",
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.SQUARE,
                visualStyle: VisualStyle.ANIME,
                videoLength: VideoLength.SHORT,
                mood: Mood.COMEDIC,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'street-food-tour': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '길거리 음식 투어',
            idea: '활기 넘치는 아시아 야시장의 활기차고 빠른 속도의 투어. 지글지글 끓는 음식, 웍에서 피어오르는 증기, 군중의 다채로운 혼돈을 클로즈업으로 촬영합니다. 분위기는 활기차고 식욕을 돋웁니다.',
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.PHOTOREALISTIC,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.FAST_PACED,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'day-in-the-life': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '어느 하루',
            idea: '외로운 등대지기의 감성적이고 영화 같은 "어느 하루". 아름답고 폭풍우가 치는 바다를 배경으로 한 그들의 일상을 보여주고, 자연과의 평화로운 교감의 순간으로 마무리합니다.',
            config: {
                sceneCount: 6,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.LONG,
                mood: Mood.EMOTIONAL,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'lofi-study-beats': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '로파이 공부 비트 애니메이션',
            idea: '클래식한 로파이 애니메이션 루프. 한 캐릭터(로파이 소녀처럼)가 비 내리는 아늑한 방에서 공부하거나 휴식을 취하고 있습니다. 장면은 차분하고 따뜻한 조명과 고양이 꼬리가 까딱이는 것과 같은 미묘한 움직임으로 가득 차 있습니다.',
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.ANIME,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.EMOTIONAL,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'mythical-creatures': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '신화 속 생물 다큐멘터리',
            idea: '자연 다큐멘터리 스타일의 가짜 다큐멘터리이지만 신화 속 생물을 특징으로 합니다. 산 위를 솟아오르는 장엄한 그리핀, 굴속의 용 가족, 고대 숲에서 언뜻 보이는 수줍은 유니콘.',
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.PHOTOREALISTIC,
                videoLength: VideoLength.LONG,
                mood: Mood.EPIC,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'oddly-satisfying-machines': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '이상하게 만족스러운 기계',
            idea: '루브 골드버그 스타일의 기계가 지나치게 복잡하고 완벽하게 반복되는 방식으로 간단한 작업을 수행하는 매혹적인 애니메이션. 부드럽고 완벽한 움직임과 만족스러운 기계의 딸깍거리고 윙윙거리는 소리에 집중하세요.',
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.SQUARE,
                visualStyle: VisualStyle.CLAYMATION,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.FAST_PACED,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'travel-vlog-japan': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '일본 여행 브이로그',
            idea: '아름답고 고요한 일본 여행 브이로그. 평화로운 대나무 숲, 시부야 교차로의 활기찬 혼돈, 교토의 고요한 사원, 만개한 벚꽃 등 장면의 몽타주.',
            config: {
                sceneCount: 6,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.EMOTIONAL,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'dark-academia': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '다크 아카데미아',
            idea: '"다크 아카데미아" 미학을 담은 분위기 있고 신비로운 비디오. 웅장한 고딕 양식의 도서관에서 늦게까지 공부하는 학생, 촛불 아래 만년필로 글을 쓰는 모습, 안개 낀 대학 교정을 걷는 장면들.',
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.CLASSIC,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.MYSTERIOUS,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'gourmet-meal-prep': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '고급 요리 준비',
            idea: '셰프가 복잡한 고급 요리를 준비하는 탑다운, 패스트모션 비디오. 정밀한 칼 솜씨, 예술적인 플레이팅, 신선한 재료의 아름다운 색상에 초점을 맞춥니다.',
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.SQUARE,
                visualStyle: VisualStyle.PHOTOREALISTIC,
                videoLength: VideoLength.SHORT,
                mood: Mood.FAST_PACED,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    '8bit-pixel-art-adventure': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '8비트 픽셀 아트 어드벤처',
            idea: '픽셀 아트 스타일로 들려주는 짧고 장대한 모험 이야기. 작은 영웅이 울창한 숲과 어두운 동굴을 여행하고, 거대한 픽셀 괴물과 싸워 성에 도달합니다.',
            config: {
                sceneCount: 6,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.PIXEL_ART,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.EPIC,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'magical-potion-making': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '마법 물약 만들기',
            idea: '빛나는 물약을 만드는 기발하고 마법 같은 장면. 재료가 공중에 떠다니고, 액체는 색을 바꾸며, 최종 물약은 수정 병 안에서 별빛처럼 반짝입니다.',
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.ANIME,
                videoLength: VideoLength.SHORT,
                mood: Mood.MYSTERIOUS,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'solana-phone-unboxing': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '솔라나 폰 언박싱',
            idea: '반전이 있는 테크 언박싱 비디오. 상자를 열면 솔라나 스마트폰이 나타나고, 이어서 방 안에 홀로그램 암호화폐 차트를 투사하여 급격한 상승세를 보여줍니다. 스타일은 세련되고 미래적입니다.',
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.SHORT,
                mood: Mood.EPIC,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'ai-takeover-comedy': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: 'AI 세계 정복 코미디',
            idea: '"AI의 세계 정복"을 코믹하고 가볍게 해석합니다. 귀엽고 친근한 로봇 그룹이 부엌을 엉망으로 만드는 로봇 셰프나 목줄에 엉키는 로봇 개 산책 도우미처럼 인간의 일을 비효율적으로 하려고 애쓰는 모습을 보여줍니다.',
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.SQUARE,
                visualStyle: VisualStyle.CLAYMATION,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.COMEDIC,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'perfect-coffee-pour': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '완벽한 커피 따르기',
            idea: '완벽한 라떼 아트 따르기의 극도로 만족스러운 슬로우 모션 비디오. 풍부한 에스프레소 크레마 위에 아름다운 로제타 패턴을 만드는 스팀 우유의 벨벳 같은 질감에 초점을 맞춥니다.',
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.PHOTOREALISTIC,
                videoLength: VideoLength.SHORT,
                mood: Mood.EMOTIONAL,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'skincare-routine': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '스킨케어 루틴',
            idea: '미니멀리스트 스킨케어 루틴을 보여주는 고요하고 깨끗한 비디오. 세럼과 크림의 질감을 클로즈업합니다. 배경은 식물이 많은 밝은 햇살이 드는 욕실입니다. 분위기는 차분하고 상쾌합니다.',
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.EMOTIONAL,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'pov-commute': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '1인칭 시점 통근',
            idea: '전동 스케이트보드를 타고 붐비는 도시를 통과하는 빠른 속도의 1인칭 시점(POV) 통근. 교통 체증을 뚫고 공원을 가로질러 현대적인 사무실 건물에 도착하는 모든 과정을 끊김 없이 활기찬 시퀀스로 보여줍니다.',
            config: {
                sceneCount: 6,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.PHOTOREALISTIC,
                videoLength: VideoLength.SHORT,
                mood: Mood.FAST_PACED,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'tiny-house-tour': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '작은 집 투어',
            idea: '숲속에 영리하게 디자인된 작은 집의 아늑하고 매력적인 투어. 공간 절약형 가구, 자연을 내다보는 큰 창문, 평화롭고 미니멀한 삶의 전반적인 느낌을 강조하세요.',
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.WATERCOLOR,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.EMOTIONAL,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'watercolor-landscape-painting': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '수채화 풍경화 그리기',
            idea: '산 풍경 수채화가 생생하게 살아나는 편안한 타임랩스. 색상 레이어가 쌓여 아름답고 분위기 있는 풍경을 만드는 화가의 붓 터치를 보여주세요.',
            config: {
                sceneCount: 4,
                aspectRatio: AspectRatio.SQUARE,
                visualStyle: VisualStyle.WATERCOLOR,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.EMOTIONAL,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'historical-fashion-evolution': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '역사적 패션 변천사',
            idea: '단일 10년(예: 1920년대) 동안의 패션 변천사를 보여주는 시각적으로 매력적인 퀵컷 비디오. 캐릭터의 의상과 헤어스타일이 빠르게 바뀌어 시대의 다양한 트렌드를 보여줍니다.',
            config: {
                sceneCount: 6,
                aspectRatio: AspectRatio.PORTRAIT,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.SHORT,
                mood: Mood.FAST_PACED,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'surreal-dream-sequence': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '초현실적인 꿈 시퀀스',
            idea: '기이하고 신비로운 꿈 시퀀스. 시계가 녹아내리고, 캐릭터들이 구름 위를 걸으며, 풍경이 불가능한 방식으로 끊임없이 변합니다. 시각적 스타일은 초현실적이고 상상력이 풍부합니다.',
            config: {
                sceneCount: 5,
                aspectRatio: AspectRatio.CLASSIC,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.MEDIUM,
                mood: Mood.MYSTERIOUS,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    },
    'space-colony-timelapse': {
        en: {
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
                videoModel: 'veo-2.0-generate-001',
            }
        },
        ko: {
            keyword: '우주 식민지 타임랩스',
            idea: '화성에 인간 식민지를 건설하는 과정을 보여주는 웅장한 타임랩스. 첫 번째 착륙선에서 시작하여 바이오돔, 거주지, 테라포밍 장비의 성장을 점진적으로 보여주며 붉은 하늘 아래 분주한 도시가 나타날 때까지 보여줍니다.',
            config: {
                sceneCount: 6,
                aspectRatio: AspectRatio.LANDSCAPE,
                visualStyle: VisualStyle.CINEMATIC,
                videoLength: VideoLength.LONG,
                mood: Mood.EPIC,
                descriptionLanguage: 'Korean',
                textModel: 'gemini-2.5-flash',
                imageModel: 'imagen-4.0-generate-001',
                videoModel: 'veo-2.0-generate-001',
            }
        }
    }
};
