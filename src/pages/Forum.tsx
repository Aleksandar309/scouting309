"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlusCircle, MessageSquare, ThumbsUp } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ForumPost, ForumComment, ForumCategory } from '@/types/forum';
import { FORUM_CATEGORIES } from '@/data/mockForumPosts';
import { Scout } from '@/types/scout';
import { Player } from '@/types/player';
import ForumPostCard from '@/components/ForumPostCard';
import CreatePostForm from '@/components/CreatePostForm';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface ForumProps {
  forumPosts: ForumPost[];
  setForumPosts: React.Dispatch<React.SetStateAction<ForumPost[]>>;
  scouts: Scout[];
  players: Player[];
}

const Forum: React.FC<ForumProps> = ({ forumPosts, setForumPosts, scouts, players }) => {
  const navigate = useNavigate();
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);

  const handleAddPost = (newPost: ForumPost) => {
    setForumPosts((prevPosts) => [newPost, ...prevPosts]);
    setIsCreatePostDialogOpen(false);
  };

  const handleAddComment = (postId: string, newComment: ForumComment) => {
    setForumPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  const handleLikePost = (postId: string) => {
    setForumPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 } // Simple like toggle, can be enhanced with user tracking
          : post
      )
    );
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background text-foreground p-6 pt-16">
      <div className="max-w-4xl w-full">
        <div className="flex justify-start mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground p-0 h-auto"
          >
            <ChevronLeft className="h-5 w-5 mr-1" /> Nazad
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <MessageSquare className="h-8 w-8 mr-3 text-primary" /> Forum
          </h1>
          <Dialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Kreiraj novi post
              </Button>
            </DialogTrigger>
            <CreatePostForm
              onAddPost={handleAddPost}
              onClose={() => setIsCreatePostDialogOpen(false)}
              categories={FORUM_CATEGORIES}
              scouts={scouts}
              players={players}
            />
          </Dialog>
        </div>

        <Tabs defaultValue={FORUM_CATEGORIES[0]?.id} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted border-border mb-6">
            {FORUM_CATEGORIES.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground hover:bg-accent">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {FORUM_CATEGORIES.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
              {forumPosts
                .filter((post) => post.categoryId === category.id)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((post) => (
                  <ForumPostCard
                    key={post.id}
                    post={post}
                    onAddComment={handleAddComment}
                    onLikePost={handleLikePost}
                    players={scouts} // Pass scouts as potential comment authors
                  />
                ))}
              {forumPosts.filter((post) => post.categoryId === category.id).length === 0 && (
                <Card className="bg-card border-border text-card-foreground text-center p-8">
                  <CardTitle className="text-xl mb-4">Nema postova u ovoj kategoriji!</CardTitle>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Budite prvi koji će objaviti post u "{category.name}".
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Forum;