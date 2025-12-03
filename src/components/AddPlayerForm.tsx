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
import { Player, PlayerAttribute, PlayerPosition } from "@/types/player";
import { CATEGORIZED_ATTRIBUTES, createDefaultPlayerAttributes } from "@/utils/player-attributes";
import AttributeRating from "./AttributeRating";

// Zod schema for player attributes
const attributeSchema = z.object({
  name: z.string(),
  rating: z.coerce.number().min(1).max(10, { message: "Rating must be between 1 and 10." }),
});

// Zod schema for player positions (simplified for initial input)
const playerPositionSchema = z.object({
  name: z.string().min(1, { message: "Position name cannot be empty." }),
  type: z.enum(["natural", "alternative", "tertiary"]),
  rating: z.coerce.number().min(1).max(10, { message: "Rating must be between 1 and 10." }),
});

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  team: z.string().min(2, { message: "Team must be at least 2 characters." }),
  positions: z.string().min(1, { message: "At least one position is required (comma-separated)." }), // Input as string
  nationality: z.string().min(2, { message: "Nationality must be at least 2 characters." }),
  age: z.coerce.number().min(1, { message: "Age must be at least 1." }),
  value: z.string().min(2, { message: "Value must be specified." }),
  footed: z.string().min(2, { message: "Footed must be specified." }),
  avatarUrl: z.string().optional(),
  details: z.object({
    height: z.string().min(2, { message: "Height must be specified." }),
    weight: z.string().min(2, { message: "Weight must be specified." }),
    league: z.string().min(2, { message: "League must be specified." }),
    contractExpiry: z.string().min(2, { message: "Contract expiry must be specified." }),
    wageDemands: z.string().min(2, { message: "Wage demands must be specified." }),
    agent: z.string().min(2, { message: "Agent must be specified." }),
    notes: z.string().optional(),
  }),
  scoutingProfile: z.object({
    currentAbility: z.coerce.number().min(1).max(10, { message: "Current Ability must be between 1 and 10." }),
    potentialAbility: z.coerce.number().min(1).max(10, { message: "Potential Ability must be between 1 and 10." }),
    teamFit: z.coerce.number().min(1).max(10, { message: "Team Fit must be between 1 and 10." }),
  }),
  technical: z.array(attributeSchema),
  tactical: z.array(attributeSchema),
  physical: z.array(attributeSchema),
  mentalPsychology: z.array(attributeSchema),
  setPieces: z.array(attributeSchema),
  hidden: z.array(attributeSchema),
  keyStrengths: z.string().optional(),
  areasForDevelopment: z.string().optional(),
  priorityTarget: z.boolean().default(false),
  criticalPriority: z.boolean().default(false),
});

type AddPlayerFormValues = z.infer<typeof formSchema>;

interface AddPlayerFormProps {
  onAddPlayer: (player: Player) => void;
  onClose: () => void;
}

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAddPlayer, onClose }) => {
  const form = useForm<AddPlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      team: "",
      positions: "",
      nationality: "",
      age: 18,
      value: "€1M",
      footed: "Right Footed",
      avatarUrl: "",
      details: {
        height: "180 cm",
        weight: "75 kg",
        league: "Unknown",
        contractExpiry: format(new Date(), "MMM yyyy"),
        wageDemands: "10k/week",
        agent: "N/A",
        notes: "",
      },
      scoutingProfile: {
        currentAbility: 5,
        potentialAbility: 7,
        teamFit: 5,
      },
      technical: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.technical),
      tactical: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.tactical),
      physical: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.physical),
      mentalPsychology: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.mentalPsychology),
      setPieces: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.setPieces),
      hidden: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.hidden, 10), // Hidden attributes often have higher scale
      keyStrengths: "",
      areasForDevelopment: "",
      priorityTarget: false,
      criticalPriority: false,
    },
  });

  const onSubmit = (values: AddPlayerFormValues) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`, // Simple unique ID
      name: values.name,
      team: values.team,
      positions: values.positions.split(',').map(p => p.trim()).filter(p => p.length > 0),
      positionsData: values.positions.split(',').map(p => p.trim()).filter(p => p.length > 0).map(posName => ({
        name: posName,
        type: "natural", // Default to natural for simplicity in add form
        rating: 7, // Default rating
      })),
      priorityTarget: values.priorityTarget,
      criticalPriority: values.criticalPriority,
      nationality: values.nationality,
      age: values.age,
      value: values.value,
      footed: values.footed,
      lastEdited: new Date().toISOString(),
      avatarUrl: values.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${values.name.charAt(0)}`,
      details: values.details,
      scoutingProfile: values.scoutingProfile,
      technical: values.technical,
      tactical: values.tactical,
      physical: values.physical,
      mentalPsychology: values.mentalPsychology,
      setPieces: values.setPieces,
      hidden: values.hidden,
      keyStrengths: values.keyStrengths ? values.keyStrengths.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [],
      areasForDevelopment: values.areasForDevelopment ? values.areasForDevelopment.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [],
      scoutingReports: [], // New players start with no reports
    };
    onAddPlayer(newPlayer);
    toast.success(`Player ${newPlayer.name} added successfully!`);
    onClose();
  };

  const renderAttributeSection = (
    categoryName: keyof typeof CATEGORIZED_ATTRIBUTES,
    label: string,
    fieldArrayName: "technical" | "tactical" | "physical" | "mentalPsychology" | "setPieces" | "hidden"
  ) => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-200">{label}</h3>
      {form.watch(fieldArrayName).map((attr, index) => (
        <FormField
          key={attr.name}
          control={form.control}
          name={`${fieldArrayName}.${index}.rating`}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-gray-300 w-1/2">{attr.name}</FormLabel>
              <FormControl className="w-1/2">
                <Input
                  type="number"
                  min="1"
                  max="10"
                  className="bg-gray-700 border-gray-600 text-white text-sm text-center h-8"
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
      ))}
    </div>
  );

  return (
    <DialogContent className="sm:max-w-[800px] bg-gray-800 text-white border-gray-700 max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add New Player</DialogTitle>
        <DialogDescription className="text-gray-400">
          Fill in the details to add a new player to the database.
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
                  <FormLabel className="text-gray-300">Player Name</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Team</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Nationality</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Age</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Value</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Footed</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="positions"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-300">Positions (comma-separated, e.g., ST, CAM)</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
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
                  <FormLabel className="text-gray-300">Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Scouting Profile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-bold text-white md:col-span-3 mb-2">Scouting Profile</h2>
            <FormField
              control={form.control}
              name="scoutingProfile.currentAbility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Current Ability (1-10)</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scoutingProfile.potentialAbility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Potential Ability (1-10)</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scoutingProfile.teamFit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Team Fit (1-10)</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Player Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-bold text-white md:col-span-2 mb-2">Player Details</h2>
            <FormField
              control={form.control}
              name="details.height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Height</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Weight</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.league"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">League</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.contractExpiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Contract Expiry</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.wageDemands"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Wage Demands</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.agent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Agent</FormLabel>
                  <FormControl>
                    <Input className="bg-gray-700 border-gray-600 text-white" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details.notes"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-gray-300">Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea className="bg-gray-700 border-gray-600 text-white min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Attributes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-gray-700 pt-6">
            <h2 className="text-xl font-bold text-white md:col-span-full mb-2">Attributes (1-10)</h2>
            {renderAttributeSection("technical", "Technical", "technical")}
            {renderAttributeSection("tactical", "Tactical", "tactical")}
            {renderAttributeSection("physical", "Physical", "physical")}
            {renderAttributeSection("mentalPsychology", "Mental & Psychology", "mentalPsychology")}
            {renderAttributeSection("setPieces", "Set Pieces", "setPieces")}
            {renderAttributeSection("hidden", "Hidden (1-20)", "hidden")}
          </div>

          {/* Strengths & Development */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-700 pt-6">
            <FormField
              control={form.control}
              name="keyStrengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Key Strengths (one per line)</FormLabel>
                  <FormControl>
                    <Textarea className="bg-gray-700 border-gray-600 text-white min-h-[100px]" {...field} />
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
                  <FormLabel className="text-gray-300">Areas for Development (one per line)</FormLabel>
                  <FormControl>
                    <Textarea className="bg-gray-700 border-gray-600 text-white min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Player
            </Button>
            <Button variant="outline" onClick={onClose} className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddPlayerForm;