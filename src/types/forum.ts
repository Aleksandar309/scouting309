export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  timestamp: string; // ISO string
  content: string;
}

export interface ForumPost {
  id: string;
  categoryId: string; // NEW: To link posts to specific forum categories/tabs
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  timestamp: string; // ISO string
  content: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'image';
  playerTags?: { id: string; name: string }[]; // Array of tagged player IDs and names
  comments: ForumComment[];
  likes: number;
}

export interface ForumCategory { // NEW: Interface for forum categories
  id: string;
  name: string;
  description: string;
}