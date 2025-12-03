"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"; // Ispravljeno: Dodato 'as'
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Player } from "@/types/player";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  scout: z.string().min(2, {
    message: "Scout name must be at least 2 characters.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  rating: z.coerce.number().min(1).max(10, {
    message: "Overall Rating must be between 1 and 10.",
  }),
  currentAbility: z.coerce.number().min(1).max(10, {
    message: "Current Ability must be between 1 and 10.",
  }),
  potentialAbility: z.coerce.number().min(1).max(10, {
    message: "Potential Ability must be between 1 and 10.",
  }),
  teamFit: z.coerce.number().min(1).max(10, {
    message: "Team Fit must be between 1 and 10.",
  }),
  keyStrengths: z.string().optional(),
  areasForDevelopment: z.string().optional(),
});

interface ScoutReportFormProps {
  player: Player;
  onReportSubmit: (report: Player["scoutingReports"][0]) => void;
  onClose: () => void;
}

const ScoutReportForm: React.FC<ScoutReportFormProps> = ({ player, onReportSubmit, onClose }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      scout: "",
      date: new Date(),
      rating: 7,
      currentAbility: player.scoutingProfile.currentAbility, // Default from player's current profile
      potentialAbility: player.scoutingProfile.potentialAbility, // Default from player's current profile
      teamFit: player.scoutingProfile.teamFit, // Default from player's current profile
      keyStrengths: "",
      areasForDevelopment: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newReport = {
      id: `rep${player.scoutingReports.length + 1}`, // Simple ID generation
      date: format(values.date, "MMM d, yyyy"),
      scout: values.scout,
      rating: values.rating,
      title: values.title,
      keyStrengths: values.keyStrengths,
      areasForDevelopment: values.areasForDevelopment,
      currentAbility: values.currentAbility,
      potentialAbility: values.potentialAbility,
      teamFit: values.teamFit,
    };
    onReportSubmit(newReport);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground border-border">
      <DialogHeader>
        <DialogTitle className="text-2xl">Create New Scout Report for {player.name}</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Fill in the details for the new scouting report.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Report Title</FormLabel>
                <FormControl>
                  <Input className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="scout"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Scout Name</FormLabel>
                <FormControl>
                  <Input className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-muted-foreground">Report Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-input border-border text-foreground hover:bg-accent",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover border-border text-popover-foreground" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Overall Rating (1-10)</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentAbility"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Current Ability (1-10)</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="potentialAbility"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Potential Ability (1-10)</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teamFit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Team Fit (1-10)</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="keyStrengths"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Key Strengths</FormLabel>
                <FormControl>
                  <Textarea className="bg-input border-border text-foreground min-h-[80px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="areasForDevelopment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Areas for Development</FormLabel>
                <FormControl>
                  <Textarea className="bg-input border-border text-foreground min-h-[80px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Submit Report</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ScoutReportForm;