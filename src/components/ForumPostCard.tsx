"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, PlusCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ForumPost, ForumComment } from '@/types/forum';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import AddCommentForm from './AddCommentForm';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ForumPostCardProps {
  post: ForumPost;
  onAddComment: (postId: string, comment: ForumComment) => void;
  onLikePost: (postId: string) => void;
  players: any[]; // Assuming players are passed for tagging
}

const ForumPostCard: React.FC<ForumPostCardProps> = ({ post, onAddComment, onLikePost, players }) => {
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const displayedComments = showAllComments ? post.comments : post.comments.slice(0, 2);

  const renderContentWithTags = (content: string) => {
    if (!post.playerTags || post.playerTags.length === 0) {
      return content;
    }

    let renderedContent: (string | JSX.Element)[] = [content];

    post.playerTags.forEach(tag => {
      const newContent: (string | JSX.Element)[] = [];
      renderedContent.forEach(segment => {
        if (typeof segment === 'string') {
          const parts = segment.split(new RegExp(`(${tag.name})`, 'gi'));
          parts.forEach((part, index) => {
            if (part.toLowerCase() === tag.name.toLowerCase()) {
              newContent.push(
                <Link key={`${tag.id}-${index}`} to={`/player/${tag.id}`} className="text-primary hover:underline font-semibold">
                  @{tag.name}
                </Link>
              );
            } else {
              newContent.push(part);
            }
          });
        } else {
          newContent.push(segment);
        }
      });
      renderedContent = newContent;
    });

    return <>{renderedContent}</>;
  };

  return (
    <Card className="bg-card border-border text-card-foreground shadow-sm">
      <CardHeader className="flex flex-row items-start space-x-4 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
          <AvatarFallback className="bg-primary text-primary-foreground">{post.authorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold">{post.authorName}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(parseISO(post.timestamp), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground whitespace-pre-wrap">
          {renderContentWithTags(post.content)}
        </p>

        {post.mediaUrl && (
          <div className="mt-4">
            {post.mediaType === 'image' ? (
              <img src={post.mediaUrl} alt="Post media" className="max-w-full h-auto rounded-md" />
            ) : post.mediaType === 'video' ? (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-md"
                  src={post.mediaUrl.includes("youtube.com") ? `https://www.youtube.com/embed/${post.mediaUrl.split('v=')[1]?.split('&')[0]}` : post.mediaUrl}
                  title="Post video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : null}
          </div>
        )}

        {post.playerTags && post.playerTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.playerTags.map(tag => (
              <Link key={tag.id} to={`/player/${tag.id}`}>
                <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-accent cursor-pointer">
                  @{tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-4 border-t border-border pt-3">
          <Button variant="ghost" size="sm" onClick={() => onLikePost(post.id)} className="text-muted-foreground hover:text-primary hover:bg-accent">
            <ThumbsUp className="h-4 w-4 mr-1" /> {post.likes} Likes
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-accent" onClick={() => setIsCommentFormOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-1" /> {post.comments.length} Comments
          </Button>
        </div>

        {post.comments.length > 0 && (
          <div className="space-y-3 mt-4">
            {displayedComments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={comment.authorAvatarUrl} alt={comment.authorName} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">{comment.authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-muted p-2 rounded-md">
                  <p className="text-sm font-semibold text-foreground">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(parseISO(comment.timestamp), { addSuffix: true })}
                  </p>
                  <p className="text-sm text-foreground mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
            {post.comments.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllComments(!showAllComments)}
                className="w-full text-muted-foreground hover:text-primary hover:bg-accent"
              >
                {showAllComments ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" /> View all {post.comments.length} comments
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        <Dialog open={isCommentFormOpen} onOpenChange={setIsCommentFormOpen}>
          <AddCommentForm
            postId={post.id}
            onAddComment={onAddComment}
            onClose={() => setIsCommentFormOpen(false)}
            scouts={players} // Assuming 'players' here is actually 'scouts' or 'users' for comment authors
          />
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ForumPostCard;