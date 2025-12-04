import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CalendarDays,
  Flag,
  Goal,
  MapPin,
  Scale,
  User,
  Wallet,
  Plus,
  BarChart2,
  Radar,
  ChevronLeft,
  Maximize,
  Weight,
  Trophy,
  DollarSign,
  Briefcase,
  Target,
  EyeOff,
  Gauge,
  Edit,
  Save,
  XCircle,
  Camera,
  History,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { Player, PlayerAttribute, AttributeHistoryEntry, PlayerPosition } from "@/types/player";
import AttributeRating from "@/components/AttributeRating";
import RadarChart from "@/components/RadarChart";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ScoutReportForm from "@/components/ScoutReportForm";
import AddToShortlistDialog from '@/components/AddToShortlistDialog';
import PlayerStatistics from '@/components/PlayerStatistics';
import PlayerPitch from '@/components/PlayerPitch';
import RoleDetailsDialog from '@/components/RoleDetailsDialog';
import AttributeHistoryDialog from '@/components/AttributeHistoryDialog';
import { FmRole, FmRoleAttribute, FmAttributeCategory, getAttributesByCategory } from '@/utils/fm-roles';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import FormationSelector from '@/components/FormationSelector';
import { FM_FORMATIONS, calculateFormationFit, calculateFormationOverallFit, getStarRating } from '@/utils/formations';
import { Formation, PlayerFormationFitPosition } from '@/types/formation';
import { ALL_ATTRIBUTE_NAMES, CATEGORIZED_ATTRIBUTES } from '@/utils/player-attributes';
import { toast } from 'sonner';
import { Scout } from '@/types/scout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_FOOTBALL_POSITIONS } from "@/utils/positions";

// Zod schema for player attributes
const attributeSchema = z.array(z.object({
  name: z.string(),
  rating: z.coerce.number().min(1).max(10, { message: "Rating must be between 1 and 10." }),
  history: z.array(z.object({
    date: z.string(),
    rating: z.number(),
    changedBy: z.string(),
    comment: z.string().optional(),
  })).optional(),
}));

// Zod schema for player positions input (name and rating)
const playerPositionInputSchema = z.object({
  name: z.string().min(1, { message: "Position name cannot be empty." }),
  rating: z.coerce.number().min(0).max(10, { message: "Rating must be between 0 and 10." }),
});

// Zod schema for editable player fields
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  team: z.string().min(2, { message: "Team must be at least 2 characters." }),
  nationality: z.string().min(2, { message: "Nationality must be at least 2 characters." }),
  age: z.coerce.number().min(1, { message: "Age must be at least 1." }),
  value: z.string().min(2, { message: "Value must be specified." }),
  footed: z.string().min(2, { message: "Footed must be specified." }),
  lastEdited: z.string().optional(),
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
  positionsData: z.array(playerPositionInputSchema).min(1, { message: "At least one position is required." }),
  technical: attributeSchema,
  tactical: attributeSchema,
  physical: attributeSchema,
  mentalPsychology: attributeSchema,
  setPieces: attributeSchema,
  hidden: z.array(z.object({ name: z.string(), rating: z.coerce.number().min(1).max(10) })),
  keyStrengths: z.string().optional(),
  areasForDevelopment: z.string().optional(),
  changedByScout: z.string().optional(),
});

type PlayerFormValues = z.infer<typeof formSchema>;

interface PlayerProfileProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  scouts: Scout[];
}

// Helper function to assign position type based on rating
const assignPositionType = (rating: number): "natural" | "alternative" | "tertiary" | null => {
  if (rating >= 8) return "natural";
  if (rating >= 6) return "alternative";
  if (rating >= 4) return "tertiary";
  return null;
};

// Helper to get highlight type for an attribute
const getHighlightType = (
  attributeName: string,
  category: FmAttributeCategory,
  selectedRole: FmRole | null
): 'primary' | 'secondary' | 'tertiary' | null => {
  if (!selectedRole) return null;

  const roleAttr = selectedRole.attributes.find(
    (attr) => attr.name === attributeName && attr.category === category
  );

  if (roleAttr) {
    if (roleAttr.weight === 3) return 'primary';
    if (roleAttr.weight === 2) return 'secondary';
    if (roleAttr.weight === 1) return 'tertiary';
  }
  return null;
};

// Helper function to calculate the average rating for an attribute, considering its history
const getDisplayedAttributeRating = (attribute: PlayerAttribute, isEditMode: boolean): number => {
  if (isEditMode) {
    return attribute.rating;
  }

  const allRatings = (attribute.history || []).map(entry => entry.rating);
  if (attribute.rating !== undefined) {
    allRatings.push(attribute.rating);
  }

  if (allRatings.length === 0) {
    return 0;
  }

  const sum = allRatings.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / allRatings.length);
};

const PlayerProfile: React.FC<PlayerProfileProps> = ({ players, setPlayers, scouts }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the player based on the ID from the URL, re-evaluate when ID or players change
  const currentPlayer = React.useMemo(() => players.find(p => p.id === id), [id, players]);

  const [player, setPlayer] = useState<Player | null>(currentPlayer || null);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [isShortlistFormOpen, setIsShortlistFormOpen] = useState(false);
  const [showScoutingProfile, setShowScoutingProfile] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isRoleDetailsDialogOpen, setIsRoleDetailsDialogOpen] = useState(false);
  const [selectedPositionForRoles, setSelectedPositionForRoles] = useState<string | null>(null);
  const [selectedFmRole, setSelectedFmRole] = useState<FmRole | null>(null);

  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedHistoryAttribute, setSelectedHistoryAttribute] = useState<{ name: string; category: FmAttributeCategory } | null>(null);

  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
  const [playerFormationFit, setPlayerFormationFit] = useState<PlayerFormationFitPosition[] | null>(null);
  const [formationsWithFit, setFormationsWithFit] = useState<Array<Formation & { overallFit: number }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: currentPlayer ? {
      name: currentPlayer.name,
      team: currentPlayer.team,
      nationality: currentPlayer.nationality,
      age: currentPlayer.age,
      value: currentPlayer.value,
      footed: currentPlayer.footed,
      lastEdited: currentPlayer.lastEdited || '',
      avatarUrl: currentPlayer.avatarUrl || '',
      details: currentPlayer.details,
      scoutingProfile: currentPlayer.scoutingProfile,
      positionsData: currentPlayer.positionsData.map(p => ({ name: p.name, rating: p.rating })),
      technical: currentPlayer.technical,
      tactical: currentPlayer.tactical,
      physical: currentPlayer.physical,
      mentalPsychology: currentPlayer.mentalPsychology,
      setPieces: currentPlayer.setPieces,
      hidden: currentPlayer.hidden,
      keyStrengths: currentPlayer.keyStrengths.join('\n'),
      areasForDevelopment: currentPlayer.areasForDevelopment.join('\n'),
      changedByScout: "",
    } : undefined,
  });

  const { fields: positionFields, append: appendPosition, remove: removePosition } = useFieldArray({
    control: form.control,
    name: "positionsData",
  });

  // Effect to update player state and form defaults when the currentPlayer object changes
  React.useEffect(() => {
    setPlayer(currentPlayer || null);
    if (currentPlayer) {
      form.reset({
        name: currentPlayer.name,
        team: currentPlayer.team,
        nationality: currentPlayer.nationality,
        age: currentPlayer.age,
        value: currentPlayer.value,
        footed: currentPlayer.footed,
        lastEdited: currentPlayer.lastEdited || '',
        avatarUrl: currentPlayer.avatarUrl || '',
        details: currentPlayer.details,
        scoutingProfile: currentPlayer.scoutingProfile,
        positionsData: currentPlayer.positionsData.map(p => ({ name: p.name, rating: p.rating })),
        technical: currentPlayer.technical,
        tactical: currentPlayer.tactical,
        physical: currentPlayer.physical,
        mentalPsychology: currentPlayer.mentalPsychology,
        setPieces: currentPlayer.setPieces,
        hidden: currentPlayer.hidden,
        keyStrengths: currentPlayer.keyStrengths.join('\n'),
        areasForDevelopment: currentPlayer.areasForDevelopment.join('\n'),
        changedByScout: "",
      });

      // Calculate and sort formations by overall fit
      const calculatedFormationsWithFit = FM_FORMATIONS.map(formation => {
        const fitScore = calculateFormationOverallFit(currentPlayer, formation);
        return { ...formation, overallFit: fitScore };
      }).sort((a, b) => b.overallFit - a.overallFit);

      setFormationsWithFit(calculatedFormationsWithFit);

      // Set the selected formation to the best fitting one by default
      if (calculatedFormationsWithFit.length > 0) {
        setSelectedFormationId(calculatedFormationsWithFit[0].id);
      } else {
        setSelectedFormationId(null);
      }
    }
    setIsEditMode(false);
    setSelectedFmRole(null);
  }, [currentPlayer, form]);

  // Effect to calculate formation fit when selectedFormationId or player changes
  React.useEffect(() => {
    if (selectedFormationId && player) {
      const formation = FM_FORMATIONS.find(f => f.id === selectedFormationId);
      if (formation) {
        setPlayerFormationFit(calculateFormationFit(player, formation));
      }
    } else {
      setPlayerFormationFit(null);
    }
  }, [selectedFormationId, player]);


  if (!player) {
    return <div className="text-center text-foreground mt-10">Player not found.</div>;
  }

  const handleAddReport = (newReport: Player["scoutingReports"][0]) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) =>
        p.id === player.id
          ? { ...p, scoutingReports: [...p.scoutingReports, newReport] }
          : p
      )
    );
    setPlayer((prevPlayer) => {
      if (!prevPlayer) return null;
      return {
        ...prevPlayer,
        scoutingReports: [...prevPlayer.scoutingReports, newReport],
      };
    });
  };

  const handlePositionClick = (positionType: string) => {
    setSelectedPositionForRoles(positionType);
    setIsRoleDetailsDialogOpen(true);
    setSelectedFmRole(null);
  };

  const handleRoleSelect = (role: FmRole | null) => {
    setSelectedFmRole(role);
  };

  const handleAttributeHistoryClick = (attributeName: string, category: FmAttributeCategory) => {
    setSelectedHistoryAttribute({ name: attributeName, category });
    setIsHistoryDialogOpen(true);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: PlayerFormValues) => {
    if (!currentPlayer) return;

    const changedByScoutName = values.changedByScout || "User Edit";

    const processedPositionsData: PlayerPosition[] = [];
    const generalPositions: string[] = [];

    values.positionsData.forEach(posInput => {
      const type = assignPositionType(posInput.rating);
      if (type) {
        processedPositionsData.push({
          name: posInput.name.toUpperCase(),
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

    const updatedPlayer: Player = {
      ...player,
      ...values,
      positions: generalPositions,
      positionsData: processedPositionsData,
      keyStrengths: values.keyStrengths ? values.keyStrengths.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [],
      areasForDevelopment: values.areasForDevelopment ? values.areasForDevelopment.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [],
      avatarUrl: values.avatarUrl,
      lastEdited: new Date().toISOString(),
    };

    // Function to compare and update attribute history
    const updateAttributeHistory = (
      currentAttrs: PlayerAttribute[],
      newAttrs: PlayerAttribute[],
      category: FmAttributeCategory
    ): PlayerAttribute[] => {
      return newAttrs.map(newAttr => {
        const currentAttr = currentAttrs.find(attr => attr.name === newAttr.name);
        if (currentAttr && currentAttr.rating !== newAttr.rating) {
          const newHistoryEntry: AttributeHistoryEntry = {
            date: new Date().toISOString(),
            rating: newAttr.rating,
            changedBy: changedByScoutName,
            comment: `Rating changed from ${currentAttr.rating} to ${newAttr.rating}.`,
          };
          return {
            ...newAttr,
            history: [...(currentAttr.history || []), newHistoryEntry],
          };
        }
        return { ...newAttr, history: currentAttr?.history || [] };
      });
    };

    updatedPlayer.technical = updateAttributeHistory(currentPlayer.technical, values.technical, "technical");
    updatedPlayer.tactical = updateAttributeHistory(currentPlayer.tactical, values.tactical, "tactical");
    updatedPlayer.physical = updateAttributeHistory(currentPlayer.physical, values.physical, "physical");
    updatedPlayer.mentalPsychology = updateAttributeHistory(currentPlayer.mentalPsychology, values.mentalPsychology, "mentalPsychology");
    updatedPlayer.setPieces = updateAttributeHistory(currentPlayer.setPieces, values.setPieces, "setPieces");
    updatedPlayer.hidden = updateAttributeHistory(currentPlayer.hidden, values.hidden, "hidden");


    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p))
    );
    setPlayer(updatedPlayer);
    setIsEditMode(false);
    toast.success("Player profile updated successfully!");
  };

  const attributesForRadar = [
    ...player.technical.slice(0, 3),
    ...player.tactical.slice(0, 3),
    ...player.physical.slice(0, 3),
    ...player.mentalPsychology.slice(0, 3),
  ];

  const renderAttributeSection = (
    categoryName: FmAttributeCategory,
    label: string,
    fieldArrayName: "technical" | "tactical" | "physical" | "mentalPsychology" | "setPieces" | "hidden"
  ) => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">{label}</h3>
      {form.watch(fieldArrayName).map((attr, index) => (
        <div key={attr.name}>
          {isEditMode ? (
            <FormField
              control={form.control}
              name={`${fieldArrayName}.${index}.rating`}
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className="text-muted-foreground w-1/2">{attr.name}</FormLabel>
                  <FormControl className="w-1/2">
                    <Input
                      type="number"
                      min="1"
                      max={fieldArrayName === "hidden" ? "10" : "10"}
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
          ) : (
            <AttributeRating
              name={attr.name}
              rating={getDisplayedAttributeRating(attr, isEditMode)}
              highlightType={getHighlightType(attr.name, categoryName, selectedFmRole)}
              onViewHistory={handleAttributeHistoryClick}
              attributeCategory={categoryName}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Calculate average scouting profile metrics from reports
  const calculateAverageScoutingProfile = () => {
    const reports = player?.scoutingReports || [];
    if (reports.length === 0) {
      return { avgCurrentAbility: 0, avgPotentialAbility: 0, avgTeamFit: 0 };
    }

    let totalCurrentAbility = 0;
    let totalPotentialAbility = 0;
    let totalTeamFit = 0;
    let count = 0;

    reports.forEach(report => {
      if (report.currentAbility !== undefined) totalCurrentAbility += report.currentAbility;
      if (report.potentialAbility !== undefined) totalPotentialAbility += report.potentialAbility;
      if (report.teamFit !== undefined) totalTeamFit += report.teamFit;
      count++;
    });

    return {
      avgCurrentAbility: count > 0 ? Math.round(totalCurrentAbility / count) : 0,
      avgPotentialAbility: count > 0 ? Math.round(totalPotentialAbility / count) : 0,
      avgTeamFit: count > 0 ? Math.round(totalTeamFit / count) : 0,
    };
  };

  const { avgCurrentAbility, avgPotentialAbility, avgTeamFit } = calculateAverageScoutingProfile();


  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground p-0 h-auto mb-4"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                {/* Avatar/Initial Display */}
                <div className="relative w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mr-4 overflow-hidden bg-blue-600">
                  {isEditMode ? (
                    <>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer hover:bg-opacity-70 transition-opacity"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-8 w-8" />
                      </div>
                      {form.watch('avatarUrl') ? (
                        <img src={form.watch('avatarUrl')} alt="Player Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white">{player.name.charAt(0)}</span>
                      )}
                    </>
                  ) : (
                    player.avatarUrl ? (
                      <img src={player.avatarUrl} alt="Player Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white">{player.name.charAt(0)}</span>
                    )
                  )}
                </div>
                <div>
                  {isEditMode ? (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input className="text-3xl font-bold bg-input border-border text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <h1 className="text-3xl font-bold">{player.name}</h1>
                  )}
                  {isEditMode ? (
                    <FormField
                      control={form.control}
                      name="team"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input className="text-muted-foreground bg-input border-border text-foreground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="text-muted-foreground">{player.team}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    {player.positions.map((pos) => (
                      <Badge key={pos} variant="secondary" className="bg-muted text-muted-foreground">{pos}</Badge>
                    ))}
                    {player.priorityTarget && <Badge className="bg-yellow-600 text-white">Priority Target</Badge>}
                    {player.criticalPriority && <Badge className="bg-red-600 text-white">Critical Priority</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditMode ? (
                  <>
                    <FormField
                      control={form.control}
                      name="changedByScout"
                      render={({ field }) => (
                        <FormItem className="w-[150px]">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-input border-border text-foreground">
                                <SelectValue placeholder="Changed by..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-popover border-border text-popover-foreground">
                              {scouts.map((scout) => (
                                <SelectItem key={scout.id} value={scout.name}>
                                  {scout.name}
                                </SelectItem>
                              ))}
                              <SelectItem value="User Edit">User Edit</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditMode(false);
                        form.reset(currentPlayer ? {
                          name: currentPlayer.name,
                          team: currentPlayer.team,
                          nationality: currentPlayer.nationality,
                          age: currentPlayer.age,
                          value: currentPlayer.value,
                          footed: currentPlayer.footed,
                          lastEdited: currentPlayer.lastEdited || '',
                          avatarUrl: currentPlayer.avatarUrl || '',
                          details: currentPlayer.details,
                          scoutingProfile: currentPlayer.scoutingProfile,
                          positionsData: currentPlayer.positionsData.map(p => ({ name: p.name, rating: p.rating })),
                          technical: currentPlayer.technical,
                          tactical: currentPlayer.tactical,
                          physical: currentPlayer.physical,
                          mentalPsychology: currentPlayer.mentalPsychology,
                          setPieces: currentPlayer.setPieces,
                          hidden: currentPlayer.hidden,
                          keyStrengths: currentPlayer.keyStrengths.join('\n'),
                          areasForDevelopment: currentPlayer.areasForDevelopment.join('\n'),
                          changedByScout: "",
                        } : undefined);
                      }}
                      className="bg-card border-border text-foreground hover:bg-accent"
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMode(true)}
                    className="bg-card text-foreground border-border hover:bg-accent"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                )}
                <Dialog open={isShortlistFormOpen} onOpenChange={setIsShortlistFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Shortlist
                    </Button>
                  </DialogTrigger>
                  <AddToShortlistDialog player={player} onClose={() => setIsShortlistFormOpen(false)} />
                </Dialog>
                <Dialog open={isReportFormOpen} onOpenChange={setIsReportFormOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">New Report</Button>
                  </DialogTrigger>
                  <ScoutReportForm player={player} onReportSubmit={handleAddReport} onClose={() => setIsReportFormOpen(false)} scouts={scouts} />
                </Dialog>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-muted-foreground mb-8">
              <span className="flex items-center">
                <Flag className="mr-1 h-4 w-4 text-muted-foreground" />
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem className="inline-block">
                        <FormControl>
                          <Input className="bg-input border-border text-foreground h-6 w-24" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  player.nationality
                )}
              </span>
              <span className="flex items-center">
                <CalendarDays className="mr-1 h-4 w-4 text-muted-foreground" />
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="inline-block">
                        <FormControl>
                          <Input type="number" className="bg-input border-border text-foreground h-6 w-16" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  `${player.age} years old`
                )}
              </span>
              <span className="flex items-center">
                <Wallet className="mr-1 h-4 w-4 text-muted-foreground" />
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem className="inline-block">
                        <FormControl>
                          <Input className="bg-input border-border text-foreground h-6 w-24" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  player.value
                )}
              </span>
              <span className="flex items-center">
                <Goal className="mr-1 h-4 w-4 text-muted-foreground" />
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="footed"
                    render={({ field }) => (
                      <FormItem className="inline-block">
                        <FormControl>
                          <Input className="bg-input border-border text-foreground h-6 w-28" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    player.footed
                  )}
                </span>
                {player.lastEdited && (
                  <span className="flex items-center ml-4 text-xs text-muted-foreground">
                    <History className="mr-1 h-3 w-3" />
                    Last Edited: {new Date(player.lastEdited).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Player Details Card */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Player Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-muted-foreground">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex items-center">
                        <Maximize className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.height"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-input border-border text-foreground h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-foreground">{player.details.height}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Weight className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.weight"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-input border-border text-foreground h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-foreground">{player.details.weight}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Trophy className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.league"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-input border-border text-foreground h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-foreground">{player.details.league}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.contractExpiry"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-input border-border text-foreground h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-foreground">{player.details.contractExpiry}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.wageDemands"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-input border-border text-foreground h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-foreground">{player.details.wageDemands}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.agent"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-input border-border text-foreground h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-foreground">{player.details.agent}</span>
                        )}
                      </div>
                    </div>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="details.notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-muted-foreground">Notes</FormLabel>
                            <FormControl>
                              <Textarea className="bg-input border-border text-foreground min-h-[80px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      player.details.notes && (
                        <Accordion type="single" collapsible className="w-full mt-4 border-t border-border pt-3">
                          <AccordionItem value="player-notes" className="border-b-0">
                            <AccordionTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground">
                              View Player Biography
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">
                              {player.details.notes}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )
                    )}
                  </CardContent>
                </Card>

                {/* Player Positions Card */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Player Positions</CardTitle>
                    <FormationSelector
                      formations={formationsWithFit}
                      selectedFormationId={selectedFormationId}
                      onSelectFormation={setSelectedFormationId}
                      getStarRating={getStarRating}
                    />
                  </CardHeader>
                  <CardContent className="flex items-start justify-center h-full p-4">
                    {isEditMode ? (
                      <div className="w-full space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Enter each position and its rating. (Natural: 8-10, Alternative: 6-7, Tertiary: 4-5)
                        </p>
                        {positionFields.map((item, index) => (
                          <div key={item.id} className="flex items-center gap-2">
                            <FormField
                              control={form.control}
                              name={`positionsData.${index}.name`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel className="sr-only">Position Name</FormLabel>
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
                                  <FormLabel className="sr-only">Rating</FormLabel>
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
                              onClick={() => removePosition(index)}
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => appendPosition({ name: "", rating: 7 })}
                          className="w-full bg-muted border-border text-muted-foreground hover:bg-accent"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" /> Add Another Position
                        </Button>
                        <FormMessage>{form.formState.errors.positionsData?.message}</FormMessage>
                      </div>
                    ) : (
                      <PlayerPitch
                        positionsData={playerFormationFit ? undefined : player.positionsData}
                        formationPositions={playerFormationFit || undefined}
                        onPositionClick={handlePositionClick}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Scouting Profile / Statistics Card (now only Radar Chart) */}
                <Card className="bg-card border-border text-card-foreground col-span-1 md:col-span-1 lg:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {showScoutingProfile ? "Attribute Radar" : "Player Statistics"}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowScoutingProfile(!showScoutingProfile)}
                      className="bg-muted border-border text-muted-foreground hover:bg-accent"
                    >
                      {showScoutingProfile ? (
                        <>
                          <BarChart2 className="mr-2 h-4 w-4" /> View Statistics
                        </>
                      ) : (
                        <>
                          <Radar className="mr-2 h-4 w-4" /> View Radar
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  {showScoutingProfile ? (
                    <CardContent className="flex items-start justify-center h-full p-4">
                      <RadarChart playerAttributes={attributesForRadar} />
                    </CardContent>
                  ) : (
                    <PlayerStatistics />
                  )}
                </Card>

                {/* Technical Attributes Card */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><User className="mr-2 h-5 w-5" /> Technical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderAttributeSection("technical", "Technical", "technical")}
                  </CardContent>
                </Card>

                {/* Tactical Attributes Card (now before Set Pieces) */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><MapPin className="mr-2 h-5 w-5" /> Tactical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderAttributeSection("tactical", "Tactical", "tactical")}
                  </CardContent>
                </Card>

                {/* Set Pieces Attributes Card (now after Tactical) */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><Target className="mr-2 h-5 w-5" /> Set Pieces</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderAttributeSection("setPieces", "Set Pieces", "setPieces")}
                  </CardContent>
                </Card>

                {/* Physical Attributes Card */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><Scale className="mr-2 h-5 w-5" /> Physical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderAttributeSection("physical", "Physical", "physical")}
                  </CardContent>
                </Card>

                {/* Mental & Psychology Attributes Card */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><User className="mr-2 h-5 w-5" /> Mental & Psychology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderAttributeSection("mentalPsychology", "Mental & Psychology", "mentalPsychology")}
                  </CardContent>
                </Card>

                {/* Hidden Attributes Card */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><EyeOff className="mr-2 h-5 w-5" /> Hidden Attributes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderAttributeSection("hidden", "Hidden (1-10)", "hidden")}
                  </CardContent>
                </Card>

                {/* Key Strengths Card */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Key Strengths</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground text-sm">
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="keyStrengths"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea className="bg-input border-border text-foreground min-h-[100px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      player.keyStrengths.map((strength, index) => (
                        <p key={index}>• {strength}</p>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Areas for Development Card */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Areas for Development</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-muted-foreground text-sm">
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="areasForDevelopment"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea className="bg-input border-border text-foreground min-h-[100px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      player.areasForDevelopment.map((area, index) => (
                        <p key={index}>• {area}</p>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Overview Card */}
                <Card className="bg-card border-border text-card-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><Gauge className="mr-2 h-5 w-5" /> Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <>
                        <FormField
                          control={form.control}
                          name="scoutingProfile.currentAbility"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-muted-foreground">Current Ability</FormLabel>
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
                              <FormLabel className="text-muted-foreground">Potential Ability</FormLabel>
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
                              <FormLabel className="text-muted-foreground">Team Fit</FormLabel>
                              <FormControl>
                                <Input type="number" className="bg-input border-border text-foreground" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    ) : (
                      <>
                        <AttributeRating name="Current Ability" rating={player.scoutingProfile.currentAbility} />
                        <AttributeRating name="Potential Ability" rating={player.scoutingProfile.potentialAbility} />
                        <AttributeRating name="Team Fit" rating={player.scoutingProfile.teamFit} />
                        {player.scoutingReports.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-border space-y-2">
                            <h4 className="text-md font-semibold text-foreground">Average from Reports:</h4>
                            <AttributeRating name="Avg. Current Ability" rating={avgCurrentAbility} />
                            <AttributeRating name="Avg. Potential Ability" rating={avgPotentialAbility} />
                            <AttributeRating name="Avg. Team Fit" rating={avgTeamFit} />
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Scouting Reports Card */}
                <Card className="bg-card border-border text-card-foreground col-span-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Scouting Reports ({player.scoutingReports.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {player.scoutingReports.map((report) => (
                        <AccordionItem key={report.id} value={report.id} className="border-border">
                          <AccordionTrigger className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-accent transition-colors">
                            <div className="flex flex-col items-start">
                              <p className="font-medium text-foreground">{report.title}</p>
                              <p className="text-xs text-muted-foreground">{report.date} • {report.scout}</p>
                            </div>
                            <Badge className="bg-blue-500 text-white">{report.rating}</Badge>
                          </AccordionTrigger>
                          <AccordionContent className="p-4 bg-muted rounded-b-md text-muted-foreground space-y-2">
                            {report.keyStrengths && (
                              <div>
                                <h4 className="font-semibold text-foreground mb-1">Key Strengths:</h4>
                                <p className="text-sm">{report.keyStrengths}</p>
                              </div>
                            )}
                            {report.areasForDevelopment && (
                              <div>
                                <h4 className="font-semibold text-foreground mb-1">Areas for Development:</h4>
                                <p className="text-sm">{report.areasForDevelopment}</p>
                              </div>
                            )}
                            <div className="mt-3 pt-3 border-t border-border space-y-1">
                              <h4 className="font-semibold text-foreground mb-1">Reported Abilities:</h4>
                              {report.currentAbility !== undefined && <p className="text-sm">Current Ability: {report.currentAbility}</p>}
                              {report.potentialAbility !== undefined && <p className="text-sm">Potential Ability: {report.potentialAbility}</p>}
                              {report.teamFit !== undefined && <p className="text-sm">Team Fit: {report.teamFit}</p>}
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 mt-2">
                              Sign Immediately <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </form>
          </Form>
        </div>

        {/* Role Details Dialog */}
        <Dialog open={isRoleDetailsDialogOpen} onOpenChange={setIsRoleDetailsDialogOpen}>
          {selectedPositionForRoles && (
            <RoleDetailsDialog
              player={player}
              positionType={selectedPositionForRoles}
              onClose={() => {
                setIsRoleDetailsDialogOpen(false);
                setSelectedPositionForRoles(null);
                setSelectedFmRole(null);
              }}
              onRoleSelect={handleRoleSelect}
              selectedRole={selectedFmRole}
            />
          )}
        </Dialog>

        {/* Attribute History Dialog */}
        <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
          {selectedHistoryAttribute && player && (
            <AttributeHistoryDialog
              player={player}
              attributeName={selectedHistoryAttribute.name}
              attributeCategory={selectedHistoryAttribute.category}
              onClose={() => {
                setIsHistoryDialogOpen(false);
                setSelectedHistoryAttribute(null);
              }}
              scouts={scouts}
            />
          )}
        </Dialog>
      </div>
    );
  };

export default PlayerProfile;