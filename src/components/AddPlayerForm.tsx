"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, Foot } from "lucide-react"; // Added Trash2 and Foot icon
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_FOOTBALL_POSITIONS } from "@/utils/positions";

// Zod schema for player positions (now with rating)
const playerPositionInputSchema = z.object({
  name: z.string().min(1, { message: "Position name cannot be empty." }),
  rating: z.coerce.number().min(0).max(10, { message: "Rating must be between 0 and 10." }),
});

// Define the schema for a single attribute item
const attributeItemSchema = z.object({
  name: z.string(),
  rating: z.coerce.number().min(1).max(10, { message: "Rating must be between 1 and 10." }),
  history: z.array(z.object({
    date: z.string(),
    rating: z.number(),
    changedBy: z.string(),
    comment: z.string().optional(),
  })).optional(),
});
type AttributeFormItem = z.infer<typeof attributeItemSchema>;

// Define the schema for an array of attributes
const attributeArraySchema = z.array(attributeItemSchema);
type AttributeFormArray = z.infer<typeof attributeArraySchema>;

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  team: z.string().min(2, { message: "Team must be at least 2 characters." }),
  positionsData: z.array(playerPositionInputSchema).min(1, { message: "At least one position is required." }), // Input as array of objects
  nationality: z.string().min(2, { message: "Nationality must be at least 2 characters." }),
  age: z.coerce.number().min(1, { message: "Age must be at least 1." }),
  value: z.string().min(2, { message: "Value must be specified." }),
  footed: z.string().min(2, { message: "Footed must be specified." }),
  leftFootRating: z.coerce.number().min(1).max(10, { message: "Left Foot Rating must be between 1 and 10." }), // New field
  rightFootRating: z.coerce.number().min(1).max(10, { message: "Right Foot Rating must be between 1 and 10." }), // New field
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
  technical: attributeArraySchema,
  tactical: attributeArraySchema,
  physical: attributeArraySchema,
  mentalPsychology: attributeArraySchema,
  setPieces: attributeArraySchema,
  hidden: attributeArraySchema, // Now consistent with other attributes
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

// Helper function to assign position type based on rating
const assignPositionType = (rating: number): "natural" | "alternative" | "tertiary" | null => {
  if (rating >= 8) return "natural";
  if (rating >= 6) return "alternative";
  if (rating >= 4) return "tertiary";
  return null; // Positions with rating < 4 are not considered primary player positions
};

const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAddPlayer, onClose }) => {
  const form = useForm<AddPlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      team: "",
      positionsData: [{ name: "", rating: 7 }], // Default to one empty position input
      nationality: "",
      age: 18,
      value: "€1M",
      footed: "Right Footed",
      leftFootRating: 7, // Default rating
      rightFootRating: 7, // Default rating
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
      technical: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.technical) as AttributeFormArray,
      tactical: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.tactical) as AttributeFormArray,
      physical: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.physical) as AttributeFormArray,
      mentalPsychology: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.mentalPsychology) as AttributeFormArray,
      setPieces: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.setPieces) as AttributeFormArray,
      hidden: createDefaultPlayerAttributes(CATEGORIZED_ATTRIBUTES.hidden, 5) as AttributeFormArray, // Default hidden rating to 5, max 10
      keyStrengths: "",
      areasForDevelopment: "",
      priorityTarget: false,
      criticalPriority: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "positionsData",
  });

  const onSubmit = (values: AddPlayerFormValues) => {
    const processedPositionsData: PlayerPosition[] = [];
    const generalPositions: string[] = [];

    values.positionsData.forEach(posInput => {
      const type = assignPositionType(posInput.rating);
      if (type) {
        processedPositionsData.push({
          name: posInput.name.toUpperCase(), // Standardize position names
          type: type,
          rating: posInput.rating,
        });
        generalPositions.push(posInput.name.toUpperCase());
      }
    });

    if (processedPositionsData.length === 0) {
      toast.error("At least one position with a rating of 4 or higher is required.");
      return;
    }

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: values.name,
      team: values.team,
      positions: generalPositions, // Derived from processedPositionsData
      positionsData: processedPositionsData,
      priorityTarget: values.priorityTarget,
      criticalPriority: values.criticalPriority,
      nationality: values.nationality,
      age: values.age,
      value: values.value,
      footed: values.footed,
      leftFootRating: values.leftFootRating,
      rightFootRating: values.rightFootRating,
      lastEdited: new Date().toISOString(),
      avatarUrl: values.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${values.name.charAt(0)}`,
      details: values.details as Player['details'], // Explicitly cast
      scoutingProfile: values.scoutingProfile as Player['scoutingProfile'], // Explicitly cast
      technical: values.technical as PlayerAttribute[], // Explicitly cast
      tactical: values.tactical as PlayerAttribute[], // Explicitly cast
      physical: values.physical as PlayerAttribute[], // Explicitly cast
      mentalPsychology: values.mentalPsychology as PlayerAttribute[], // Explicitly cast
      setPieces: values.setPieces as PlayerAttribute[], // Explicitly cast
      hidden: values.hidden as PlayerAttribute[], // Explicitly cast
      keyStrengths: values.keyStrengths ? values.keyStrengths.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [],
      areasForDevelopment: values.areasForDevelopment ? values.areasForDevelopment.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [],
      scoutingReports: [],
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
      <h3 className="text-lg font-semibold text-foreground">{label}</h3>
      {form.watch(fieldArrayName).map((attr, index) => (
        <FormField
          key={attr.name}
          control={form.control}
          name={`${fieldArrayName}.${index}.rating`}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-muted-foreground w-1/2">{attr.name}</FormLabel>
              <FormControl className="w-1/2">
                <Input
                  type="number"
                  min="1"
                  max="10" // Max 10 for all attributes
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
      ))}
    </div>
  );

  return (
    <DialogContent className="sm:max-w-[800px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add New Player</DialogTitle>
        <DialogDescription className="text-muted-foreground">
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
                  <FormLabel className="text-muted-foreground">Player Name</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Team</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Nationality</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Age</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Value</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Footed</FormLabel>
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

          {/* Footedness Ratings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-6">
            <h2 className="text-xl font-bold text-foreground md:col-span-2 mb-2 flex items-center">
              <Foot className="mr-2 h-5 w-5" /> Footedness Ratings (1-10)
            </h2>
            <FormField
              control={form.control}
              name="leftFootRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Left Foot Rating</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-input border-border text-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rightFootRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Right Foot Rating</FormLabel>
                  <FormControl>
                    <Input type="number" className="bg-input border-border text-foreground" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Positions Data */}
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-bold text-foreground mb-2">Player Positions (Rating 0-10)</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enter each position and its rating. (Natural: 8-10, Alternative: 6-7, Tertiary: 4-5)
            </p>
            <div className="space-y-3">
              {fields.map((item, index) => (
                <div key={item.id} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`positionsData.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className={cn(index !== 0 && "sr-only")}>Position Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-input border-border text-foreground">
                              <SelectValue placeholder="Select Position" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover border-border text-popover-foreground">
                            {ALL_FOOTBALL_POSITIONS.map((pos) => (
                              <SelectItem key={pos} value={pos}>
                                {pos}
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
                    name={`positionsData.${index}.rating`}
                    render={({ field }) => (
                      <FormItem className="w-24">
                        <FormLabel className={cn(index !== 0 && "sr-only")}>Rating</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="10" className="bg-input border-border text-foreground text-center" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "", rating: 7 })}
                className="w-full bg-muted border-border text-muted-foreground hover:bg-accent"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Position
              </Button>
              <FormMessage>{form.formState.errors.positionsData?.message}</FormMessage>
            </div>
          </div>

          {/* Scouting Profile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border pt-6">
            <h2 className="text-xl font-bold text-foreground md:col-span-3 mb-2">Scouting Profile</h2>
            <FormField
              control={form.control}
              name="scoutingProfile.currentAbility"
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
              name="scoutingProfile.potentialAbility"
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
              name="scoutingProfile.teamFit"
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
          </div>

          {/* Player Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-6">
            <h2 className="text-xl font-bold text-foreground md:col-span-2 mb-2">Player Details</h2>
            <FormField
              control={form.control}
              name="details.height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Height</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Weight</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">League</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Contract Expiry</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Wage Demands</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Agent</FormLabel>
                  <FormControl>
                    <Input className="bg-input border-border text-foreground" {...field} />
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
                  <FormLabel className="text-muted-foreground">Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea className="bg-input border-border text-foreground min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Attributes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-border pt-6">
            <h2 className="text-xl font-bold text-foreground md:col-span-full mb-2">Attributes (1-10)</h2>
            {renderAttributeSection("technical", "Technical", "technical")}
            {renderAttributeSection("tactical", "Tactical", "tactical")}
            {renderAttributeSection("physical", "Physical", "physical")}
            {renderAttributeSection("mentalPsychology", "Mental & Psychology", "mentalPsychology")}
            {renderAttributeSection("setPieces", "Set Pieces", "setPieces")}
            {renderAttributeSection("hidden", "Hidden (1-10)", "hidden")}
          </div>

          {/* Strengths & Development */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-6">
            <FormField
              control={form.control}
              name="keyStrengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Key Strengths (one per line)</FormLabel>
                  <FormControl>
                    <Textarea className="bg-input border-border text-foreground min-h-[100px]" {...field} />
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
                  <FormLabel className="text-muted-foreground">Areas for Development (one per line)</FormLabel>
                  <FormControl>
                    <Textarea className="bg-input border-border text-foreground min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Player
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

export default AddPlayerForm;