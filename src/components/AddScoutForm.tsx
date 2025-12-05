"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { PlusCircle, Trash2 } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Scout } from "@/types/scout";
import { SCOUT_ATTRIBUTE_CATEGORIES } from "@/types/scout-attributes";

// Define schema for a single attribute (name and rating)
const attributeSchema = z.object({
  name: z.string(),
  rating: z.coerce.number().min(1).max(10, { message: "Rating must be between 1 and 10." }),
});

// Define schema for the entire form
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(5, { message: "Phone number is too short." }).optional().or(z.literal('')),
  avatarUrl: z.string().url({ message: "Invalid URL." }).optional().or(z.literal('')),
  scoutingAttributes: z.object({
    analysingData: z.coerce.number().min(1).max(10),
    judgingPlayerAbility: z.coerce.number().min(1).max(10),
    judgingPlayerPotential: z.coerce.number().min(1).max(10),
    judgingStaffAbility: z.coerce.number().min(1).max(10),
    judgingStaffPotential: z.coerce.number().min(1).max(10),
    negotiating: z.coerce.number().min(1).max(10),
    tacticalKnowledge: z.coerce.number().min(1).max(10),
  }),
  mentalAttributes: z.object({
    adaptability: z.coerce.number().min(1).max(10),
    authority: z.coerce.number().min(1).max(10),
    determination: z.coerce.number().min(1).max(10),
    motivating: z.coerce.number().min(1).max(10),
    peopleManagement: z.coerce.number().min(1).max(10),
    ambition: z.coerce.number().min(1).max(10),
    loyalty: z.coerce.number().min(1).max(10),
    pressure: z.coerce.number().min(1).max(10),
    professionalism: z.coerce.number().min(1).max(10),
    temperament: z.coerce.number().min(1).max(10),
    controversy: z.coerce.number().min(1).max(10),
  }),
  preferredJobs: z.array(z.string()).optional(),
  newPreferredJob: z.string().optional(), // Temporary field for adding new jobs
});

type AddScoutFormValues = z.infer<typeof formSchema>;

interface AddScoutFormProps {
  onAddScout: (newScout: Scout) => void;
  onClose: () => void;
}

const AddScoutForm: React.FC<AddScoutFormProps> = ({ onAddScout, onClose }) => {
  const form = useForm<AddScoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
      avatarUrl: "",
      scoutingAttributes: {
        analysingData: 5,
        judgingPlayerAbility: 5,
        judgingPlayerPotential: 5,
        judgingStaffAbility: 5,
        judgingStaffPotential: 5,
        negotiating: 5,
        tacticalKnowledge: 5,
      },
      mentalAttributes: {
        adaptability: 5,
        authority: 5,
        determination: 5,
        motivating: 5,
        peopleManagement: 5,
        ambition: 5,
        loyalty: 5,
        pressure: 5,
        professionalism: 5,
        temperament: 5,
        controversy: 5,
      },
      preferredJobs: [],
      newPreferredJob: "",
    },
  });

  const { fields: preferredJobsFields, append: appendPreferredJob, remove: removePreferredJob } = useFieldArray({
    control: form.control,
    name: "preferredJobs",
  });

  const onSubmit = (values: AddScoutFormValues) => {
    const newScout: Scout = {
      id: `scout-${Date.now()}`,
      name: values.name,
      role: values.role,
      email: values.email,
      phone: values.phone || "",
      activePlayers: 0, // Default for new scout
      lastReportDate: new Date().toISOString().split('T')[0], // Current date
      avatarUrl: values.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${values.name.charAt(0)}`,
      scoutingAttributes: values.scoutingAttributes,
      mentalAttributes: values.mentalAttributes,
      preferredJobs: values.preferredJobs || [],
    };
    onAddScout(newScout);
    toast.success(`Scout ${newScout.name} added successfully!`);
    onClose();
  };

  const handleAddPreferredJob = () => {
    const newJob = form.getValues("newPreferredJob")?.trim();
    if (newJob && !preferredJobsFields.some(job => job.value === newJob)) {
      appendPreferredJob({ id: newJob, value: newJob }); // Append with id and value for FieldArray
      form.setValue("newPreferredJob", ""); // Clear input after adding
    } else if (newJob) {
      toast.info(`Preferred job "${newJob}" already exists.`);
    }
  };

  const renderAttributeSection = (
    category: "scouting" | "mental",
    title: string,
    attributes: string[]
  ) => {
    const attributeData = form.watch(
      `${category}Attributes`
    ) as Scout["scoutingAttributes"] | Scout["mentalAttributes"];

    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {attributes.map((attrName) => {
          const key = attrName.replace(/\s/g, '').charAt(0).toLowerCase() + attrName.replace(/\s/g, '').slice(1);
          const rating = (attributeData as any)[key];

          return (
            <FormField
              key={attrName}
              control={form.control}
              name={`${category}Attributes.${key}` as keyof AddScoutFormValues}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="text-muted-foreground w-1/2">{attrName}</FormLabel>
                  <FormControl className="w-1/2">
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      className="bg-input border-border text-foreground text-sm text-center h-8"
                      {...field}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        field.onChange(isNaN(value) ? 0 : value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
      </div>
    );
  };

  return (
    <DialogContent className="sm:max-w-[800px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add New Scout</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Fill in the details to add a new scout to your team.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Role</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="bg-input border-border text-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-muted-foreground">Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Preferred Jobs */}
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-bold text-foreground mb-2">Preferred Jobs</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {preferredJobsFields.map((item, index) => (
                <Badge key={item.id} variant="secondary" className="bg-muted text-muted-foreground flex items-center gap-1">
                  {item.value}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removePreferredJob(index)}
                    className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="newPreferredJob"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Add new preferred job"
                        className="bg-input border-border text-foreground"
                        {...field}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddPreferredJob();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={handleAddPreferredJob} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </div>

          {/* Attributes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
            <h2 className="text-xl font-bold text-foreground md:col-span-2 mb-2">Attributes (1-10)</h2>
            {renderAttributeSection("scouting", "Scouting Attributes", SCOUT_ATTRIBUTE_CATEGORIES.scouting)}
            {renderAttributeSection("mental", "Mental Attributes", SCOUT_ATTRIBUTE_CATEGORIES.mental)}
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Scout
            </Button>
            <Button variant="outline" onClick={onClose} className="bg-muted border-border text-muted-foreground hover:bg-accent">
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddScoutForm;