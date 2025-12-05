"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useShortlists } from '@/context/ShortlistContext';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(3, { message: "Shortlist name must be at least 3 characters." }),
});

interface CreateShortlistDialogProps {
  onClose: () => void;
}

const CreateShortlistDialog: React.FC<CreateShortlistDialogProps> = ({ onClose }) => {
  const { createShortlist } = useShortlists();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createShortlist(values.name);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
      <DialogHeader>
        <DialogTitle className="text-2xl">Create New Shortlist</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Give your new shortlist a name.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Shortlist Name</FormLabel>
                <FormControl>
                  <Input className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Shortlist
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreateShortlistDialog;