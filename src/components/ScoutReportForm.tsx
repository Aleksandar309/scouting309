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
    message: "Rating must be between 1 and 10.",
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
      keyStrengths: values.keyStrengths, // Added
      areasForDevelopment: values.areasForDevelopment, // Added
    };
    onReportSubmit(newReport);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-gray-800 text-white border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-2xl">Create New Scout Report for {player.name}</DialogTitle>
        <DialogDescription className="text-gray-400">
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
                <FormLabel className="text-gray-300">Report Title</FormLabel>
                <FormControl>
                  <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
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
                <FormLabel className="text-gray-300">Scout Name</FormLabel>
                <FormControl>
                  <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
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
                <FormLabel className="text-gray-300">Report Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
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
                  <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700 text-white" align="start">
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
                <FormLabel className="text-gray-300">Overall Rating (1-10)</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-gray-700 border-gray-600 text-white" {...field} />
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
                <FormLabel className="text-gray-300">Key Strengths</FormLabel>
                <FormControl>
                  <Textarea className="bg-gray-700 border-gray-600 text-white min-h-[80px]" {...field} />
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
                <FormLabel className="text-gray-300">Areas for Development</FormLabel>
                <FormControl>
                  <Textarea className="bg-gray-700 border-gray-600 text-white min-h-[80px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Submit Report</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ScoutReportForm;