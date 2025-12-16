"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { PlayerVideo } from "@/types/player";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  url: z.string().url({ message: "Please enter a valid URL." }),
  uploadedBy: z.string().min(2, { message: "Uploader name must be at least 2 characters." }),
});

interface AddVideoFormProps {
  onAddVideo: (video: PlayerVideo) => void;
  onClose: () => void;
}

const AddVideoForm: React.FC<AddVideoFormProps> = ({ onAddVideo, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      uploadedBy: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newVideo: PlayerVideo = {
      id: `video-${Date.now()}`,
      title: values.title,
      url: values.url,
      uploadedBy: values.uploadedBy,
      uploadDate: format(new Date(), "yyyy-MM-dd"),
    };
    onAddVideo(newVideo);
    toast.success(`Video "${newVideo.title}" added successfully!`);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add New Video</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Add a new video link related to the player.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Video Title</FormLabel>
                <FormControl>
                  <Input className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Video URL</FormLabel>
                <FormControl>
                  <Input className="bg-input border-border text-foreground" placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uploadedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Uploaded By</FormLabel>
                <FormControl>
                  <Input className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Video
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddVideoForm;