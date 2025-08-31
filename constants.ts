import { Book, BookCategory, Quote } from './types';

export const APP_NAME = "Freetic";

export const CATEGORIES: BookCategory[] = [
  BookCategory.Philosophy,
  BookCategory.Psychology,
  BookCategory.Business,
  BookCategory.SelfGrowth,
  BookCategory.Biography,
  BookCategory.History,
  BookCategory.Science,
  BookCategory.Technology,
  BookCategory.Finance,
];

// Special filter categories for the CategoryFilterBar - distinct from BookCategory for assigning to books
export const FILTER_BAR_CATEGORIES = [
  "All", // Special case
  "Trending Now", // Maps to book.isTrending
  "Staff Picks", // Maps to book.isStaffPick
  // "Deep Truths", "Brutal Classics", // These would require new flags or complex tag logic - omit for now
  ...CATEGORIES // Spread the actual book categories
];


export const INITIAL_BOOKS: Book[] = [
  {
    id: "1",
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    publicationYear: 2011,
    coverImageUrl: "https://picsum.photos/seed/sapiens2/200/300", // Updated for 2:3
    carouselCoverImageUrl: "https://picsum.photos/seed/sapiens-hero/1920/1080", // Updated for 16:9
    visualSceneImageUrl: "https://picsum.photos/seed/sapiens-scene2/1200/675", // 16:9
    caption: "A sweeping exploration of human history and our place in the world.",
    tags: ["history", "anthropology", "evolution"],
    detailedSummary: "Sapiens explores the history of humankind from the Stone Age to the present day, focusing on key cognitive, agricultural, and scientific revolutions. Harari examines how Homo sapiens came to dominate the planet and questions our future trajectory. It's a grand narrative that challenges conventional wisdom about human progress and happiness. The book is structured in four parts: The Cognitive Revolution, The Agricultural Revolution, The Unification of Humankind, and The Scientific Revolution. Each section delves into how these pivotal moments shaped our societies, our economies, and our very psychology. Harari's writing is both accessible and profound, making complex ideas understandable to a general audience. He doesn't just recount historical events; he interprets them, often offering provocative perspectives on money, religion, empires, and the concept of human rights. He argues that many of our most cherished beliefs are 'fictions'—shared stories that enable large-scale cooperation. This insight forms one of the central pillars of the book, explaining how we moved from small hunter-gatherer bands to global civilizations. The final chapters contemplate the future, as biotechnology and artificial intelligence begin to challenge the very definition of what it means to be human, turning Sapiens into creators of new life forms, and potentially, our own successors.",
    brutalTruth: "Humans are storytelling animals, often driven by fictions we collectively create.",
    coreValueParagraph: "Understanding our past is crucial to comprehending our present and shaping a more conscious future. This book offers a profound perspective on what it means to be human.",
    whyThisBookIsPerfect: "If you crave a mind-expanding journey through time that challenges your core beliefs about humanity, Sapiens delivers an unforgettable experience.",
    trailerUrl: "https://www.youtube.com/embed/KDb6y0cOuzs",
    podcastUrl: "https://example.com/sapiens_summary.mp3",
    podcastTitle: "Sapiens Audio Digest",
    podcastDuration: "12:45",
    oneLinerHook: "We conquered the world with stories. What's yours?",
    category: BookCategory.History,
    isSignature: true,
    isFeaturedInTopCarousel: true,
    isHot: true, // Added for testing
    isAutoReadEnabled: true,
    autoReadVoice: 'Male',
    externalLink: "https://www.amazon.com/Sapiens-Humankind-Yuval-Noah-Harari/dp/0062316095",
  },
  {
    id: "2",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    publicationYear: 2011,
    coverImageUrl: "https://picsum.photos/seed/thinking2/200/300",
    carouselCoverImageUrl: "https://picsum.photos/seed/thinking-hero/1920/1080",
    visualSceneImageUrl: "https://picsum.photos/seed/thinking-scene2/1200/675",
    caption: "Unveiling the two systems that drive the way we think.",
    tags: ["psychology", "decision-making", "cognitive-bias"],
    detailedSummary: "Nobel laureate Daniel Kahneman explains the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, more deliberative, and more logical. Kahneman exposes the extraordinary capabilities—and also the faults and biases—of fast thinking, and reveals the pervasive influence of intuitive impressions on our thoughts and choices.",
    brutalTruth: "Your intuition is a beautiful liar. Trust, but verify.",
    coreValueParagraph: "Mastering your mind begins with understanding its inherent flaws. This book provides the tools to make better decisions in all aspects of life.",
    whyThisBookIsPerfect: "Ready to confront your own biases and unlock smarter decision-making? This book is your essential guide to the hidden machinery of your mind.",
    trailerUrl: "https://www.youtube.com/embed/ Charan_2x3YBM",
    oneLinerHook: "Your brain has two minds. Know them both.",
    category: BookCategory.Psychology,
    isFeaturedInTopCarousel: true,
    isPushedToTop: true,
    isStaffPick: true,
    isTrending: true, // Added for testing
  },
  {
    id: "3",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    publicationYear: 1949,
    coverImageUrl: "https://picsum.photos/seed/investor2/200/300",
    visualSceneImageUrl: "https://picsum.photos/seed/investor-scene2/1200/675",
    caption: "The definitive guide to value investing.",
    tags: ["finance", "investing", "value-investing"],
    detailedSummary: "Widely regarded as the bible of value investing, 'The Intelligent Investor' outlines Benjamin Graham's philosophy of minimizing risk and maximizing long-term returns. It teaches strategies for analyzing companies, understanding market fluctuations, and developing a disciplined investment approach. Warren Buffett has called it 'by far the best book on investing ever written.'",
    brutalTruth: "The market is a psycho. Don't play its emotional games.",
    coreValueParagraph: "Financial freedom is built on sound principles, not speculation. This timeless classic offers the wisdom to navigate markets intelligently.",
    whyThisBookIsPerfect: "Tired of financial hype? This classic cuts through the noise, offering timeless wisdom for building real, sustainable wealth.",
    oneLinerHook: "Invest like a genius. Not a gambler.",
    category: BookCategory.Finance,
    isTrending: true,
    isHot: true, // Added for testing
  },
  {
    id: "4",
    title: "Man's Search for Meaning",
    author: "Viktor Frankl",
    publicationYear: 1946,
    coverImageUrl: "https://picsum.photos/seed/meaning2/200/300",
    carouselCoverImageUrl: "https://picsum.photos/seed/meaning-hero/1920/1080",
    visualSceneImageUrl: "https://picsum.photos/seed/meaning-scene2/1200/675",
    caption: "Finding purpose even in the darkest of times.",
    tags: ["psychology", "philosophy", "resilience", "meaning"],
    detailedSummary: "Psychiatrist Viktor Frankl's memoir of his experiences in Nazi concentration camps and his development of logotherapy. Frankl argues that we cannot avoid suffering but we can choose how to cope with it, find meaning in it, and move forward with renewed purpose. He posits that the primary human drive is not pleasure, but the discovery and pursuit of what we personally find meaningful.",
    brutalTruth: "Suffering is inevitable. Meaning is a choice.",
    coreValueParagraph: "Life's meaning is not given, but found. This profound work shows how purpose can be discovered even in immense suffering, offering hope and a path to resilience.",
    whyThisBookIsPerfect: "Facing adversity or questioning your purpose? Frankl's profound insights offer a lifeline to meaning in a chaotic world.",
    oneLinerHook: "He who has a 'why' can bear any 'how'.",
    category: BookCategory.Philosophy,
    isRecommended: true,
    isFeaturedInTopCarousel: true,
  },
  {
    id: "5",
    title: "Atomic Habits",
    author: "James Clear",
    publicationYear: 2018,
    coverImageUrl: "https://picsum.photos/seed/habits2/200/300",
    visualSceneImageUrl: "https://picsum.photos/seed/habits-scene2/1200/675",
    caption: "Tiny changes, remarkable results: an easy & proven way to build good habits & break bad ones.",
    tags: ["self-growth", "productivity", "habits"],
    detailedSummary: "James Clear presents a practical framework for improving every day. 'Atomic Habits' reveals how small, incremental changes can lead to remarkable results over time. He uncovers the science behind habit formation and provides actionable strategies for building good habits, breaking bad ones, and mastering the tiny behaviors that lead to significant outcomes. The core of his philosophy is the Four Laws of Behavior Change: Make it Obvious, Make it Attractive, Make it Easy, and Make it Satisfying. By applying these laws, you can design your environment and routines to make good habits inevitable and bad habits impossible. Clear provides countless examples, from business leaders to artists and athletes, who have used these principles to achieve greatness. The book is not just about changing habits, but about building identity. He argues that true behavior change is identity change; you become the type of person who achieves what you want to achieve. This shift in perspective is what makes the habits stick for the long term, creating a compound effect of self-improvement.",
    brutalTruth: "Your systems, not your goals, dictate your success.",
    coreValueParagraph: "Lasting change comes from compounding small improvements. This book provides a clear roadmap to build systems for continuous self-improvement.",
    whyThisBookIsPerfect: "Stop dreaming about change and start building it, one tiny habit at a time. This book is your blueprint for transformation.",
    oneLinerHook: "1% better every day. It adds up.",
    category: BookCategory.SelfGrowth,
    isTodaysCoreIdea: true,
    isStaffPick: true,
    isAutoReadEnabled: true,
    autoReadVoice: 'Female',
  },
  {
    id: "6",
    title: "Cosmos",
    author: "Carl Sagan",
    publicationYear: 1980,
    coverImageUrl: "https://picsum.photos/seed/cosmos2/200/300",
    visualSceneImageUrl: "https://picsum.photos/seed/cosmos-scene2/1200/675",
    caption: "A breathtaking journey through the universe and our place within it.",
    tags: ["science", "astronomy", "philosophy"],
    detailedSummary: "Based on his landmark television series, Carl Sagan's 'Cosmos' explores 15 billion years of cosmic evolution and the development of science and civilization. Sagan masterfully conveys complex scientific concepts with clarity and wonder, inviting readers to contemplate the vastness of space and the interconnectedness of all things. It's an inspiring call to cherish our planet and pursue knowledge.",
    brutalTruth: "We are stardust dreaming of stars. Wake up.",
    coreValueParagraph: "The pursuit of knowledge and a sense of wonder are essential to the human spirit. 'Cosmos' ignites curiosity about the universe and our responsibility as its inhabitants.",
    whyThisBookIsPerfect: "Feeling small? This book will expand your perspective to cosmic proportions and reignite your sense of wonder about existence.",
    oneLinerHook: "The universe is within us. Explore it.",
    category: BookCategory.Science,
    isRecommended: true,
  }
];

export const INITIAL_QUOTES: Quote[] = [
  { id: "q1", text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", sourceBook: "Dialogues of Plato" },
  { id: "q2", text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle (often attributed, actual source complex)", sourceBook: "Nicomachean Ethics (paraphrased)" },
  { id: "q3", text: "The unexamined life is not worth living.", author: "Socrates", sourceBook: "Plato's Apology" },
  { id: "q4", text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", author: "Ralph Waldo Emerson" },
  { id: "q5", text: "Your assumptions are your windows on the world. Scrub them off every once in a while, or the light won't come in.", author: "Isaac Asimov" },
];

export const ADMIN_USERNAME = "@freetic";
export const ADMIN_PASSWORD = "ninjaking36F@";