"use client";

import React, { useState } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { ShadowTeam } from '@/types/shadow-team';
import { FM_FORMATIONS } from '@/utils/formations';

const formSchema = z.object({
  name: z.string().min(3, { message: "Team name must be at least 3 characters." }),
  sharingSettings: z.enum(['private', 'public', 'team']).default('private'),
  calendarIntegration: z.boolean().default(false),
});

interface CreateShadowTeamDialogProps {
  onConfirm: (newTeam: Omit<ShadowTeam, 'id' | 'playersByPosition'>) => void;
  onClose: () => void;
}

const CreateShadowTeamDialog: React.FC<CreateShadowTeamDialogProps> = ({ onConfirm, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sharingSettings: "private",
      calendarIntegration: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onConfirm({
      name: values.name,
      formationId: FM_FORMATIONS[0]?.id || "", // Default to the first formation
      sharingSettings: values.sharingSettings,
      calendarIntegration: values.calendarIntegration,
    });
    toast.success(`Shadow Team "${values.name}" created!`);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
      <DialogHeader>
        <DialogTitle className="text-2xl">Create New Shadow Team</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Give your team a name and configure settings.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Team Name</FormLabel>
                <FormControl>
                  <Input className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sharingSettings"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Sharing Settings</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <option value="private">Private (Only you)</option>
                    <option value="team">Team (Club staff)</option>
                    <option value="public">Public (Shareable link)</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="calendarIntegration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-muted-foreground">
                    Integrate with Calendar
                  </FormLabel>
                  <FormDescription className="text-xs text-muted-foreground">
                    See matches of shadow team players in your calendar.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Confirm</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CreateShadowTeamDialog;