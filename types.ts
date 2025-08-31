export enum BookCategory {
  Psychology = "Psychology",
  Philosophy = "Philosophy",
  Finance = "Finance",
  SelfGrowth = "Self-Growth",
  Science = "Science",
  Technology = "Technology",
  History = "History",
  Business = "Business",
  Biography = "Biography", // Corrected from Biographies
  // Add other core categories as needed
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publicationYear?: number; // Added
  coverImageUrl: string;
  carouselCoverImageUrl?: string;
  visualSceneImageUrl?: string;
  caption: string;
  tags: string[];
  detailedSummary: string;
  brutalTruth: string; // Used for brutal quote
  coreValueParagraph: string; // Used for Core Idea section
  whyThisBookIsPerfect?: string; // Added
  podcastUrl?: string;
  podcastTitle?: string;
  podcastDuration?: string;
  trailerUrl?: string;
  oneLinerHook: string;
  category: BookCategory; // Primary category
  secondaryCategories?: BookCategory[]; // Added
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced'; // Added
  createdAt?: string; // ISO date string for when the book was added
  
  // Admin flags
  isSignature?: boolean;
  isFeaturedInTopCarousel?: boolean;
  isPushedToTop?: boolean;
  isTrending?: boolean;
  isHot?: boolean; // New flag for "Mark as Hot"
  isRecommended?: boolean;
  isTodaysCoreIdea?: boolean;
  isStaffPick?: boolean; // Added
  isAutoReadEnabled?: boolean; // For AI Narration feature

  // Advanced admin fields (optional for now in UI)
  isbn?: string;
  externalLink?: string; // For "Start Reading"
  visualSceneCaption?: string;
  status?: 'Draft' | 'Published' | 'Archived';
  scheduledPublishDate?: string; // Consider Date type if complex logic needed
  relatedBookIds?: string[];
  autoReadVoice?: 'Male' | 'Female' | 'Default'; // Voice for AI narration
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  sourceBook?: string;
}

export interface AdConfiguration {
  script: string;
  isEnabled: boolean;
  placement?: 'after_hero' | 'between_rows' | 'before_footer' | 'sidebar';
  dimensions?: '728x90' | '300x250' | '320x50' | 'cinematic_16_9' | 'custom'; // Added cinematic_16_9
  adStartDate?: string; // ISO date string for scheduling start
  adEndDate?: string;   // ISO date string for scheduling end
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface Shelf {
  id: string;
  name: string;
  bookIds: string[];
}

export interface HistoryRecord {
  id?: number; // from IndexedDB, auto-incrementing
  bookId: string;
  bookTitle: string;
  openedAt: number; // timestamp
  mode: 'read' | 'audio';
}