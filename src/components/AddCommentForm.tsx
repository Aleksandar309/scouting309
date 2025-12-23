"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ForumComment } from "@/types/forum";
import { Scout } from "@/types/scout";

const formSchema = z.object({
  authorId: z.string().min(1, { message: "Please select an author." }),
  content: z.string().min(5, { message: "Comment must be at least 5 characters." }),
});

interface AddCommentFormProps {
  postId: string;
  onAddComment: (postId: string, comment: ForumComment) => void;
  onClose: () => void;
  scouts: Scout[]; // Assuming scouts are the users who can comment
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ postId, onAddComment, onClose, scouts }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authorId: "",
      content: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const author = scouts.find(s => s.id === values.authorId);
    if (!author) {
      toast.error("Selected author not found.");
      return;
    }

    const newComment: ForumComment = {
      id: `comment-${Date.now()}`,
      authorId: values.authorId,
      authorName: author.name,
      authorAvatarUrl: author.avatarUrl,
      timestamp: new Date().toISOString(),
      content: values.content,
    };
    onAddComment(postId, newComment);
    toast.success("Comment added successfully!");
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add a Comment</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Share your thoughts on this post.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Your Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select your name" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    {scouts.map((scout) => (
                      <SelectItem key={scout.id} value={scout.id}>
                        {scout.name}
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
                <FormLabel className="text-muted-foreground">Comment</FormLabel>
                <FormControl>
                  <Textarea className="bg-input border-border text-foreground min-h-[80px]" placeholder="Write your comment here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Comment
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddCommentForm;