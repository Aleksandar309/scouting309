"use client";

import React, { useState, useEffect } from 'react';
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Player } from '@/types/player';
import { ShadowTeam, ShadowTeamPlayer } from '@/types/shadow-team';
import { FM_FORMATIONS } from '@/utils/formations';
import { toast } from 'sonner';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from "@/components/ui/input"; // Dodato: Import Input komponenta

const formSchema = z.object({
  teamId: z.string().min(1, { message: "Please select a Shadow Team." }),
  positionName: z.string().min(1, { message: "Please select a position." }),
  playerId: z.string().min(1, { message: "Please select a player." }),
  note: z.string().optional(),
});

interface AddPlayerToShadowTeamDialogProps {
  players: Player[];
  shadowTeams: ShadowTeam[];
  onAddPlayer: (teamId: string, positionName: string, player: ShadowTeamPlayer) => void;
  onClose: () => void;
  initialPlayerId?: string; // Optional: if opened from player profile
  initialPositionName?: string; // Optional: if opened from ShadowPitch
  initialTeamId?: string; // Optional: if opened from ShadowPitch and a team is already selected
}

const AddPlayerToShadowTeamDialog: React.FC<AddPlayerToShadowTeamDialogProps> = ({
  players,
  shadowTeams,
  onAddPlayer,
  onClose,
  initialPlayerId,
  initialPositionName,
  initialTeamId,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamId: initialTeamId || "",
      positionName: initialPositionName || "",
      playerId: initialPlayerId || "",
      note: "",
    },
  });

  const selectedTeamId = form.watch("teamId");
  const selectedPlayerId = form.watch("playerId");
  const selectedPosition = form.watch("positionName");

  const currentTeam = shadowTeams.find(t => t.id === selectedTeamId);
  const currentFormation = currentTeam ? FM_FORMATIONS.find(f => f.id === currentTeam.formationId) : null;
  const availablePositions = currentFormation ? currentFormation.positions.map(p => p.name) : [];

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  // State for player search command
  const [openPlayerCommand, setOpenPlayerCommand] = useState(false);
  const [playerSearchValue, setPlayerSearchValue] = useState(selectedPlayer?.name || "");

  useEffect(() => {
    if (initialPlayerId) {
      const player = players.find(p => p.id === initialPlayerId);
      if (player) {
        form.setValue("playerId", initialPlayerId);
        setPlayerSearchValue(player.name);
      }
    }
  }, [initialPlayerId, players, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const playerToAdd = players.find(p => p.id === values.playerId);
    if (!playerToAdd) {
      toast.error("Selected player not found.");
      return;
    }

    const teamToUpdate = shadowTeams.find(t => t.id === values.teamId);
    if (!teamToUpdate) {
      toast.error("Selected team not found.");
      return;
    }

    // Check if player is already in this specific position
    const playersInTargetPosition = teamToUpdate.playersByPosition[values.positionName] || [];
    if (playersInTargetPosition.some(p => p.id === playerToAdd.id)) {
      toast.info(`${playerToAdd.name} is already assigned to ${values.positionName} in ${teamToUpdate.name}.`);
      onClose();
      return;
    }

    const shadowTeamPlayer: ShadowTeamPlayer = {
      id: playerToAdd.id,
      name: playerToAdd.name,
      avatarUrl: playerToAdd.avatarUrl,
      age: playerToAdd.age,
      currentAbility: playerToAdd.scoutingProfile.currentAbility,
      potentialAbility: playerToAdd.scoutingProfile.potentialAbility,
      position: values.positionName, // The specific formation position
      note: values.note,
    };

    onAddPlayer(values.teamId, values.positionName, shadowTeamPlayer);
    toast.success(`${playerToAdd.name} added to ${values.positionName} in ${teamToUpdate.name}!`);
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add Player to Shadow Team</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Select a team, position, and player to add.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Select Shadow Team */}
          <FormField
            control={form.control}
            name="teamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Shadow Team</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("positionName", ""); // Reset position when team changes
                }} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    {shadowTeams.length === 0 ? (
                      <SelectItem value="no-teams" disabled>No teams created yet</SelectItem>
                    ) : (
                      shadowTeams.map(team => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name} ({FM_FORMATIONS.find(f => f.id === team.formationId)?.name || 'N/A'})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Position */}
          <FormField
            control={form.control}
            name="positionName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Position</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedTeamId}>
                  <FormControl>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover border-border text-popover-foreground">
                    {availablePositions.length === 0 ? (
                      <SelectItem value="no-positions" disabled>Select a team first</SelectItem>
                    ) : (
                      availablePositions.map(pos => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Select Player (with search) */}
          <FormField
            control={form.control}
            name="playerId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-muted-foreground">Player</FormLabel>
                <Popover open={openPlayerCommand} onOpenChange={setOpenPlayerCommand}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between bg-input border-border text-foreground",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? players.find((player) => player.id === field.value)?.name
                          : "Select player"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-popover border-border text-popover-foreground">
                    <Command>
                      <CommandInput
                        placeholder="Search player..."
                        value={playerSearchValue}
                        onValueChange={setPlayerSearchValue}
                      />
                      <CommandList>
                        <CommandEmpty>No player found.</CommandEmpty>
                        <CommandGroup>
                          {players
                            .filter(player =>
                              player.name.toLowerCase().includes(playerSearchValue.toLowerCase())
                            )
                            .map((player) => (
                              <CommandItem
                                value={player.name}
                                key={player.id}
                                onSelect={() => {
                                  form.setValue("playerId", player.id);
                                  setPlayerSearchValue(player.name);
                                  setOpenPlayerCommand(false);
                                }}
                                className="cursor-pointer hover:bg-accent"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    player.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {player.name} ({player.team})
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Note (Optional) */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Note (Optional)</FormLabel>
                <FormControl>
                  <Input className="bg-input border-border text-foreground" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="mt-4">
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Add Player
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddPlayerToShadowTeamDialog;