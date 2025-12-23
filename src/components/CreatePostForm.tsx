"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { PlusCircle, Image, Video, Tag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ForumPost, ForumCategory } from "@/types/forum";
import { Scout } from "@/types/scout";
import { Player } from "@/types/player";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Please select a category." }),
  authorId: z.string().min(1, { message: "Please select an author." }),
  content: z.string().min(10, { message: "Post content must be at least 10 characters." }),
  mediaUrl: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
  mediaType: z.enum(['image', 'video']).optional(),
  playerTags: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  newPlayerTag: z.string().optional(), // Temporary field for adding new tags
});

interface CreatePostFormProps {
  onAddPost: (post: ForumPost) => void;
  onClose: () => void;
  categories: ForumCategory[];
  scouts: Scout[];
  players: Player[]; // All players for tagging
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onAddPost, onClose, categories, scouts, players }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      authorId: "",
      content: "",
      mediaUrl: "",
      mediaType: undefined,
      playerTags: [],
      newPlayerTag: "",
    },
  });

  const [openPlayerCommand, setOpenPlayerCommand] = useState(false);
  const [playerSearchValue, setPlayerSearchValue] = useState("");
  const currentTags = form.watch("playerTags") || [];

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const author = scouts.find(s => s.id === values.authorId);
    if (!author) {
      toast.error("Selected author not found.");
      return;
    }

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      categoryId: values.categoryId,
      authorId: values.authorId,
      authorName: author.name,
      authorAvatarUrl: author.avatarUrl,
      timestamp: new Date().toISOString(),
      content: values.content,
      mediaUrl: values.mediaUrl || undefined,
      mediaType: values.mediaUrl ? values.mediaType : undefined,
      playerTags: values.playerTags,
      comments: [],
      likes: 0,
    };
    onAddPost(newPost);
    toast.success(`Post "${newPost.content.substring(0, 30)}..." created!`);
    onClose();
  };

  const handleAddPlayerTag = (playerId: string, playerName: string) => {
    const existingTags = form.getValues("playerTags") || [];
    if (!existingTags.some(tag => tag.id === playerId)) {
      form.setValue("playerTags", [...existingTags, { id: playerId, name: playerName }]);
      setPlayerSearchValue("");
      setOpenPlayerCommand(false);
    } else {
      toast.info(`${playerName} is already tagged.`);
    }
  };

  const handleRemovePlayerTag = (tagId: string) => {
    const existingTags = form.getValues("playerTags") || [];
    form.setValue("playerTags", existingTags.filter(tag => tag.id !== tagId));
  };

  return (
    <DialogContent className="sm:max-w-[700px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Create New Forum Post</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Share your thoughts, questions, or insights with the community.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Author</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    {scouts.map((scout) => (
                      <SelectItem key={scout.id} value={scout.id}>
                        {scout.name} ({scout.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Post Content</FormLabel>
                <FormControl>
                  <Textarea className="bg-input border-border text-foreground min-h-[120px]" placeholder="What's on your mind?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mediaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground flex items-center">
                    <Image className="h-4 w-4 mr-2" /> Media URL (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" placeholder="e.g., https://example.com/image.jpg or youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mediaType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground flex items-center">
                    <Video className="h-4 w-4 mr-2" /> Media Type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!form.watch("mediaUrl")}>
                    <FormControl>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Select media type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="border-t border-border pt-4">
            <FormLabel className="text-muted-foreground flex items-center mb-2">
              <Tag className="h-4 w-4 mr-2" /> Tag Players (Optional)
            </FormLabel>
            <div className="flex flex-wrap gap-2 mb-3">
              {currentTags.map(tag => (
                <Badge key={tag.id} variant="secondary" className="bg-muted text-muted-foreground flex items-center gap-1">
                  @{tag.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePlayerTag(tag.id)}
                    className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <Popover open={openPlayerCommand} onOpenChange={setOpenPlayerCommand}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPlayerCommand}
                  className="w-full justify-between bg-input border-border text-foreground"
                >
                  {playerSearchValue ? playerSearchValue : "Search and tag players..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                <Command>
                  <CommandInput
                    placeholder="Search player..."
                    value={playerSearchValue}
                    onValueChange={setPlayerSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No player found.</CommandEmpty>
                    <CommandGroup>
                      {players
                        .filter(player =>
                          player.name.toLowerCase().includes(playerSearchValue.toLowerCase())
                        )
                        .map((player) => (
                          <CommandItem
                            value={player.name}
                            key={player.id}
                            onSelect={() => handleAddPlayerTag(player.id, player.name)}
                            className="cursor-pointer hover:bg-accent"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currentTags.some(tag => tag.id === player.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {player.name} ({player.team})
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Post
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreatePostForm;