"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Assignment, AssignmentPriority, AssignmentStatus, Scout } from "@/types/scout";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  priority: z.enum(["P1", "P2", "P3"], { message: "Please select a priority." }),
  assignedTo: z.string().min(1, { message: "Please select a scout." }),
  dueDate: z.date({ required_error: "A due date is required." }),
});

interface AssignmentFormProps {
  onAddAssignment: (assignment: Assignment) => void;
  onClose: () => void;
  scouts: Scout[];
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ onAddAssignment, onClose, scouts }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "P2",
      assignedTo: "",
      dueDate: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const assignedScout = scouts.find(s => s.id === values.assignedTo);
    if (!assignedScout) {
      toast.error("Selected scout not found.");
      return;
    }

    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      title: values.title,
      description: values.description,
      priority: values.priority,
      assignedTo: values.assignedTo,
      assignedToName: assignedScout.name,
      dueDate: format(values.dueDate, "yyyy-MM-dd"),
      status: "Pending", // Default status for new assignments
      createdAt: new Date().toISOString(),
    };
    onAddAssignment(newAssignment);
    toast.success(`Assignment "${newAssignment.title}" created for ${newAssignment.assignedToName}!`);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Create New Assignment</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Assign a new task to one of your scouts.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Assignment Title</FormLabel>
                <FormControl>
                  <Input className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Description</FormLabel>
                <FormControl>
                  <Textarea className="bg-input border-border text-foreground min-h-[80px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Assign To Scout</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select a scout" />
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    <SelectItem value="P1">P1 - High</SelectItem>
                    <SelectItem value="P2">P2 - Medium</SelectItem>
                    <SelectItem value="P3">P3 - Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-muted-foreground">Due Date</FormLabel>
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
                      disabled={(date) => date < new Date("1900-01-01")} // Allow past dates for historical assignments
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Assignment
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AssignmentForm;