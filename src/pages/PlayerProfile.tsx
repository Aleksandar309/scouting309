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
} from "lucide-react";
import { Player, PlayerAttribute } from "@/types/player";
import AttributeRating from "@/components/AttributeRating";
import RadarChart from "@/components/RadarChart";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ScoutReportForm from "@/components/ScoutReportForm";
import AddToShortlistDialog from '@/components/AddToShortlistDialog';
import PlayerStatistics from '@/components/PlayerStatistics';
import PlayerPitch from '@/components/PlayerPitch';
import RoleDetailsDialog from '@/components/RoleDetailsDialog';
import { FmRole, FmRoleAttribute, FmAttributeCategory } from '@/utils/fm-roles';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
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
import { mockPlayers } from './PlayerDatabase';
import FormationSelector from '@/components/FormationSelector'; // New import
import { FM_FORMATIONS, calculateFormationFit, calculateFormationOverallFit, getStarRating } from '@/utils/formations'; // New import
import { Formation, PlayerFormationFitPosition } from '@/types/formation'; // New import

// Zod schema for player attributes
const attributeSchema = z.array(z.object({
  name: z.string(),
  rating: z.coerce.number().min(1).max(10, { message: "Rating must be between 1 and 10." }),
}));

// Zod schema for editable player fields
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  team: z.string().min(2, { message: "Team must be at least 2 characters." }),
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
    overall: z.coerce.number().min(1).max(10, { message: "Overall rating must be between 1 and 10." }),
    potential: z.coerce.number().min(1).max(10, { message: "Potential rating must be between 1 and 10." }),
    brightonFit: z.coerce.number().min(1).max(10, { message: "Brighton Fit rating must be between 1 and 10." }),
    currentAbility: z.coerce.number().min(1).max(10, { message: "Current Ability must be between 1 and 10." }),
    potentialAbility: z.coerce.number().min(1).max(10, { message: "Potential Ability must be between 1 and 10." }),
    teamFit: z.coerce.number().min(1).max(10, { message: "Team Fit must be between 1 and 10." }),
  }),
  technical: attributeSchema,
  tactical: attributeSchema,
  physical: attributeSchema,
  mentalPsychology: attributeSchema,
  setPieces: attributeSchema,
  hidden: attributeSchema,
  keyStrengths: z.string().optional(),
  areasForDevelopment: z.string().optional(),
});

type PlayerFormValues = z.infer<typeof formSchema>;

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

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the player based on the ID from the URL, re-evaluate when ID changes
  const currentPlayer = React.useMemo(() => mockPlayers.find(p => p.id === id), [id]);

  const [player, setPlayer] = useState<Player | null>(currentPlayer || null);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [isShortlistFormOpen, setIsShortlistFormOpen] = useState(false);
  const [showScoutingProfile, setShowScoutingProfile] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isRoleDetailsDialogOpen, setIsRoleDetailsDialogOpen] = useState(false);
  const [selectedPositionForRoles, setSelectedPositionForRoles] = useState<string | null>(null);
  const [selectedFmRole, setSelectedFmRole] = useState<FmRole | null>(null);

  const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null); // New state for selected formation
  const [playerFormationFit, setPlayerFormationFit] = useState<PlayerFormationFitPosition[] | null>(null); // New state for player fit in formation
  const [formationsWithFit, setFormationsWithFit] = useState<Array<Formation & { overallFit: number }>>([]); // State to hold formations with calculated fit

  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for hidden file input

  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: currentPlayer ? {
      name: currentPlayer.name,
      team: currentPlayer.team,
      nationality: currentPlayer.nationality,
      age: currentPlayer.age,
      value: currentPlayer.value,
      footed: currentPlayer.footed,
      avatarUrl: currentPlayer.avatarUrl || '',
      details: currentPlayer.details,
      scoutingProfile: currentPlayer.scoutingProfile,
      technical: currentPlayer.technical,
      tactical: currentPlayer.tactical,
      physical: currentPlayer.physical,
      mentalPsychology: currentPlayer.mentalPsychology,
      setPieces: currentPlayer.setPieces,
      hidden: currentPlayer.hidden,
      keyStrengths: currentPlayer.keyStrengths.join('\n'),
      areasForDevelopment: currentPlayer.areasForDevelopment.join('\n'),
    } : undefined,
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
        avatarUrl: currentPlayer.avatarUrl || '',
        details: currentPlayer.details,
        scoutingProfile: currentPlayer.scoutingProfile,
        technical: currentPlayer.technical,
        tactical: currentPlayer.tactical,
        physical: currentPlayer.physical,
        mentalPsychology: currentPlayer.mentalPsychology,
        setPieces: currentPlayer.setPieces,
        hidden: currentPlayer.hidden,
        keyStrengths: currentPlayer.keyStrengths.join('\n'),
        areasForDevelopment: currentPlayer.areasForDevelopment.join('\n'),
      });

      let bestFormationId: string | null = null;
      let highestFitScore = -1;
      const calculatedFormationsWithFit = FM_FORMATIONS.map(formation => {
        const fitScore = calculateFormationOverallFit(currentPlayer, formation);
        if (fitScore > highestFitScore) {
          highestFitScore = fitScore;
          bestFormationId = formation.id;
        }
        return { ...formation, overallFit: fitScore };
      });

      setFormationsWithFit(calculatedFormationsWithFit);
      setSelectedFormationId(bestFormationId);
    }
    setIsEditMode(false);
    setSelectedFmRole(null);
    // playerFormationFit will be calculated by the next useEffect
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
    return <div className="text-center text-white mt-10">Player not found.</div>;
  }

  const handleAddReport = (newReport: Player["scoutingReports"][0]) => {
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
    setPlayer((prevPlayer) => {
      if (!prevPlayer) return null;
      return {
        ...prevPlayer,
        ...values,
        keyStrengths: values.keyStrengths ? values.keyStrengths.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [],
        areasForDevelopment: values.areasForDevelopment ? values.areasForDevelopment.split('\n').map(s => s.trim()).filter(s => s.length > 0) : [],
        avatarUrl: values.avatarUrl,
        technical: values.technical,
        tactical: values.tactical,
        physical: values.physical,
        mentalPsychology: values.mentalPsychology,
        setPieces: values.setPieces,
        hidden: values.hidden,
      };
    });
    setIsEditMode(false);
  };

  const attributesForRadar = [
    ...player.technical.slice(0, 3),
    ...player.tactical.slice(0, 3),
    ...player.physical.slice(0, 3),
    ...player.mentalPsychology.slice(0, 3),
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white p-0 h-auto mb-4"
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
                            <Input className="text-3xl font-bold bg-gray-700 border-gray-600 text-white" {...field} />
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
                            <Input className="text-gray-400 bg-gray-700 border-gray-600 text-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="text-gray-400">{player.team}</p>
                  )}
                  <div className="flex items-center space-x-2 mt-1">
                    {player.positions.map((pos) => (
                      <Badge key={pos} variant="secondary" className="bg-gray-700 text-gray-200">{pos}</Badge>
                    ))}
                    {player.priorityTarget && <Badge className="bg-yellow-600 text-white">Priority Target</Badge>}
                    {player.criticalPriority && <Badge className="bg-red-600 text-white">Critical Priority</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {isEditMode ? (
                  <>
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
                          avatarUrl: currentPlayer.avatarUrl || '',
                          details: currentPlayer.details,
                          scoutingProfile: currentPlayer.scoutingProfile,
                          technical: currentPlayer.technical,
                          tactical: currentPlayer.tactical,
                          physical: currentPlayer.physical,
                          mentalPsychology: currentPlayer.mentalPsychology,
                          setPieces: currentPlayer.setPieces,
                          hidden: currentPlayer.hidden,
                          keyStrengths: currentPlayer.keyStrengths.join('\n'),
                          areasForDevelopment: currentPlayer.areasForDevelopment.join('\n'),
                        } : undefined);
                      }}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                    >
                      <XCircle className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditMode(true)}
                    className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
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
                  <ScoutReportForm player={player} onReportSubmit={handleAddReport} onClose={() => setIsReportFormOpen(false)} />
                </Dialog>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-gray-400 mb-8">
              <span className="flex items-center">
                <Flag className="mr-1 h-4 w-4" />
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem className="inline-block">
                        <FormControl>
                          <Input className="bg-gray-700 border-gray-600 text-white h-6 w-24" {...field} />
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
                <CalendarDays className="mr-1 h-4 w-4" />
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="inline-block">
                        <FormControl>
                          <Input type="number" className="bg-gray-700 border-gray-600 text-white h-6 w-16" {...field} />
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
                <Wallet className="mr-1 h-4 w-4" />
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem className="inline-block">
                        <FormControl>
                          <Input className="bg-gray-700 border-gray-600 text-white h-6 w-24" {...field} />
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
                <Goal className="mr-1 h-4 w-4" />
                {isEditMode ? (
                  <FormField
                    control={form.control}
                    name="footed"
                    render={({ field }) => (
                      <FormItem className="inline-block">
                        <FormControl>
                          <Input className="bg-gray-700 border-gray-600 text-white h-6 w-28" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    player.footed
                  )}
                </span>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Player Details Card */}
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Player Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-300">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex items-center">
                        <Maximize className="mr-2 h-4 w-4 text-gray-500" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.height"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-gray-700 border-gray-600 text-white h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-white">{player.details.height}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Weight className="mr-2 h-4 w-4 text-gray-500" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.weight"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-gray-700 border-gray-600 text-white h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-white">{player.details.weight}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Trophy className="mr-2 h-4 w-4 text-gray-500" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.league"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-gray-700 border-gray-600 text-white h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-white">{player.details.league}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.contractExpiry"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-gray-700 border-gray-600 text-white h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-white">{player.details.contractExpiry}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4 text-gray-500" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.wageDemands"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-gray-700 border-gray-600 text-white h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-white">{player.details.wageDemands}</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4 text-gray-500" />
                        {isEditMode ? (
                          <FormField
                            control={form.control}
                            name="details.agent"
                            render={({ field }) => (
                              <FormItem className="inline-block">
                                <FormControl>
                                  <Input className="bg-gray-700 border-gray-600 text-white h-6 w-24" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
                          <span className="font-medium text-white">{player.details.agent}</span>
                        )}
                      </div>
                    </div>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="details.notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Notes</FormLabel>
                            <FormControl>
                              <Textarea className="bg-gray-700 border-gray-600 text-white min-h-[80px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="text-sm mt-4 border-t border-gray-700 pt-3">{player.details.notes}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Player Pitch Card */}
                <Card className="bg-gray-800 border-gray-700 text-white">
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
                    <PlayerPitch
                      positionsData={playerFormationFit ? undefined : player.positionsData}
                      formationPositions={playerFormationFit || undefined}
                      onPositionClick={handlePositionClick}
                    />
                  </CardContent>
                </Card>

                {/* Scouting Profile / Statistics Card (now only Radar Chart) */}
                <Card className="bg-gray-800 border-gray-700 text-white col-span-1 md:col-span-1 lg:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {showScoutingProfile ? "Attribute Radar" : "Player Statistics"}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowScoutingProfile(!showScoutingProfile)}
                      className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
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
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><User className="mr-2 h-5 w-5" /> Technical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="technical"
                        render={() => (
                          <FormItem>
                            {player.technical.map((attr, index) => (
                              <FormField
                                key={attr.name}
                                control={form.control}
                                name={`technical.${index}.rating`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <AttributeRating
                                        name={attr.name}
                                        rating={field.value}
                                        isEditable={true}
                                        onRatingChange={(newRating) => field.onChange(newRating)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                          </FormItem>
                        )}
                      />
                    ) : (
                      player.technical.map((attr) => (
                        <AttributeRating
                          key={attr.name}
                          name={attr.name}
                          rating={attr.rating}
                          highlightType={getHighlightType(attr.name, "technical", selectedFmRole)}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Set Pieces Attributes Card */}
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><Target className="mr-2 h-5 w-5" /> Set Pieces</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="setPieces"
                        render={() => (
                          <FormItem>
                            {player.setPieces.map((attr, index) => (
                              <FormField
                                key={attr.name}
                                control={form.control}
                                name={`setPieces.${index}.rating`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <AttributeRating
                                        name={attr.name}
                                        rating={field.value}
                                        isEditable={true}
                                        onRatingChange={(newRating) => field.onChange(newRating)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                          </FormItem>
                        )}
                      />
                    ) : (
                      player.setPieces.map((attr) => (
                        <AttributeRating
                          key={attr.name}
                          name={attr.name}
                          rating={attr.rating}
                          highlightType={getHighlightType(attr.name, "setPieces", selectedFmRole)}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Tactical Attributes Card */}
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><MapPin className="mr-2 h-5 w-5" /> Tactical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="tactical"
                        render={() => (
                          <FormItem>
                            {player.tactical.map((attr, index) => (
                              <FormField
                                key={attr.name}
                                control={form.control}
                                name={`tactical.${index}.rating`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <AttributeRating
                                        name={attr.name}
                                        rating={field.value}
                                        isEditable={true}
                                        onRatingChange={(newRating) => field.onChange(newRating)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                          </FormItem>
                        )}
                      />
                    ) : (
                      player.tactical.map((attr) => (
                        <AttributeRating
                          key={attr.name}
                          name={attr.name}
                          rating={attr.rating}
                          highlightType={getHighlightType(attr.name, "tactical", selectedFmRole)}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Physical Attributes Card */}
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><Scale className="mr-2 h-5 w-5" /> Physical</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="physical"
                        render={() => (
                          <FormItem>
                            {player.physical.map((attr, index) => (
                              <FormField
                                key={attr.name}
                                control={form.control}
                                name={`physical.${index}.rating`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <AttributeRating
                                        name={attr.name}
                                        rating={field.value}
                                        isEditable={true}
                                        onRatingChange={(newRating) => field.onChange(newRating)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                          </FormItem>
                        )}
                      />
                    ) : (
                      player.physical.map((attr) => (
                        <AttributeRating
                          key={attr.name}
                          name={attr.name}
                          rating={attr.rating}
                          highlightType={getHighlightType(attr.name, "physical", selectedFmRole)}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Mental & Psychology Attributes Card */}
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><User className="mr-2 h-5 w-5" /> Mental & Psychology</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="mentalPsychology"
                        render={() => (
                          <FormItem>
                            {player.mentalPsychology.map((attr, index) => (
                              <FormField
                                key={attr.name}
                                control={form.control}
                                name={`mentalPsychology.${index}.rating`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <AttributeRating
                                        name={attr.name}
                                        rating={field.value}
                                        isEditable={true}
                                        onRatingChange={(newRating) => field.onChange(newRating)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                          </FormItem>
                        )}
                      />
                    ) : (
                      player.mentalPsychology.map((attr) => (
                        <AttributeRating
                          key={attr.name}
                          name={attr.name}
                          rating={attr.rating}
                          highlightType={getHighlightType(attr.name, "mentalPsychology", selectedFmRole)}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Hidden Attributes Card */}
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center"><EyeOff className="mr-2 h-5 w-5" /> Hidden Attributes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="hidden"
                        render={() => (
                          <FormItem>
                            {player.hidden.map((attr, index) => (
                              <FormField
                                key={attr.name}
                                control={form.control}
                                name={`hidden.${index}.rating`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <AttributeRating
                                        name={attr.name}
                                        rating={field.value}
                                        isEditable={true}
                                        onRatingChange={(newRating) => field.onChange(newRating)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ))}
                          </FormItem>
                        )}
                      />
                    ) : (
                      player.hidden.map((attr) => (
                        <AttributeRating
                          key={attr.name}
                          name={attr.name}
                          rating={attr.rating}
                          highlightType={getHighlightType(attr.name, "hidden", selectedFmRole)}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Key Strengths Card */}
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Key Strengths</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-300 text-sm">
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="keyStrengths"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea className="bg-gray-700 border-gray-600 text-white min-h-[100px]" {...field} />
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
                <Card className="bg-gray-800 border-gray-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Areas for Development</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-gray-300 text-sm">
                    {isEditMode ? (
                      <FormField
                        control={form.control}
                        name="areasForDevelopment"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea className="bg-gray-700 border-gray-600 text-white min-h-[100px]" {...field} />
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
                <Card className="bg-gray-800 border-gray-700 text-white">
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
                              <FormLabel className="text-gray-300">Current Ability</FormLabel>
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
                              <FormLabel className="text-gray-300">Potential Ability</FormLabel>
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
                              <FormLabel className="text-gray-300">Team Fit</FormLabel>
                              <FormControl>
                                <Input type="number" className="bg-gray-700 border-gray-600 text-white" {...field} />
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
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Scouting Reports Card */}
                <Card className="bg-gray-800 border-gray-700 text-white col-span-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Scouting Reports ({player.scoutingReports.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      {player.scoutingReports.map((report) => (
                        <AccordionItem key={report.id} value={report.id} className="border-gray-700">
                          <AccordionTrigger className="flex items-center justify-between p-3 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                            <div className="flex flex-col items-start">
                              <p className="font-medium text-white">{report.title}</p>
                              <p className="text-xs text-gray-400">{report.date} • {report.scout}</p>
                            </div>
                            <Badge className="bg-blue-500 text-white">{report.rating}</Badge>
                          </AccordionTrigger>
                          <AccordionContent className="p-4 bg-gray-700 rounded-b-md text-gray-300 space-y-2">
                            {report.keyStrengths && (
                              <div>
                                <h4 className="font-semibold text-white mb-1">Key Strengths:</h4>
                                <p className="text-sm">{report.keyStrengths}</p>
                              </div>
                            )}
                            {report.areasForDevelopment && (
                              <div>
                                <h4 className="font-semibold text-white mb-1">Areas for Development:</h4>
                                <p className="text-sm">{report.areasForDevelopment}</p>
                              </div>
                            )}
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
      </div>
    );
  };

export default PlayerProfile;