export interface LoungeComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  timestamp: string; // ISO string
  content: string;
}

export interface LoungePost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  timestamp: string; // ISO string
  content: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'image';
  playerTags?: { id: string; name: string }[]; // Array of tagged player IDs and names
  comments: LoungeComment[];
  likes: number;
}