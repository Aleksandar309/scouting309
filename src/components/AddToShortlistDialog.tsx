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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { useShortlists } from '@/context/ShortlistContext';
import { Player } from '@/types/player';
import { ShortlistItem } from '@/types/shortlist';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  shortlistId: z.string().min(1, { message: "Please select a shortlist." }).optional(),
  newShortlistName: z.string().min(3, { message: "Shortlist name must be at least 3 characters." }).optional(),
  playerId: z.string().min(1, { message: "Please select a player." }),
});

interface AddToShortlistDialogProps {
  allPlayers: Player[]; // All available players
  onClose: () => void;
  initialShortlistId?: string; // Optional: if opened from a specific shortlist
  initialPlayerId?: string; // Optional: if opened from a player profile
}

const AddToShortlistDialog: React.FC<AddToShortlistDialogProps> = ({
  allPlayers,
  onClose,
  initialShortlistId,
  initialPlayerId,
}) => {
  const { shortlists, addPlayerToShortlist, createShortlist } = useShortlists();
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shortlistId: initialShortlistId || "",
      newShortlistName: "",
      playerId: initialPlayerId || "",
    },
  });

  const selectedPlayerId = form.watch("playerId");
  const selectedShortlistId = form.watch("shortlistId");
  const newShortlistName = form.watch("newShortlistName");

  // State for player search command
  const [openPlayerCommand, setOpenPlayerCommand] = useState(false);
  const [playerSearchValue, setPlayerSearchValue] = useState("");

  useEffect(() => {
    if (initialPlayerId) {
      const player = allPlayers.find(p => p.id === initialPlayerId);
      if (player) {
        setPlayerSearchValue(player.name);
      }
    }
  }, [initialPlayerId, allPlayers]);

  const handleAddToShortlist = (values: z.infer<typeof formSchema>) => {
    const playerToAdd = allPlayers.find(p => p.id === values.playerId);
    if (!playerToAdd) {
      toast.error("Selected player not found.");
      return;
    }

    const shortlistItem: ShortlistItem = {
      id: playerToAdd.id,
      name: playerToAdd.name,
      team: playerToAdd.team,
      positions: playerToAdd.positions,
    };

    if (isCreatingNew && values.newShortlistName?.trim()) {
      createShortlist(values.newShortlistName.trim(), shortlistItem);
    } else if (values.shortlistId) {
      addPlayerToShortlist(values.shortlistId, shortlistItem);
    }
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add Player to Shortlist</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Select a player and an existing shortlist, or create a new one.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddToShortlist)} className="grid gap-4 py-4">
          {/* Player Selection */}
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
                        disabled={!!initialPlayerId} // Disable if initialPlayerId is provided
                      >
                        {field.value
                          ? allPlayers.find((player) => player.id === field.value)?.name
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
                          {allPlayers
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

          {/* Shortlist Selection / Creation */}
          {!isCreatingNew ? (
            <>
              <FormField
                control={form.control}
                name="shortlistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Shortlist</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!!initialShortlistId}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select a shortlist" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border text-popover-foreground">
                        {shortlists.length === 0 ? (
                          <SelectItem value="no-shortlists" disabled>No shortlists created yet</SelectItem>
                        ) : (
                          shortlists.map((sl) => (
                            <SelectItem key={sl.id} value={sl.id}>
                              {sl.name} ({sl.players.length})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreatingNew(true);
                  form.setValue("shortlistId", ""); // Clear selected shortlist when creating new
                }}
                className="w-full bg-muted border-border text-muted-foreground hover:bg-accent"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Shortlist
              </Button>
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="newShortlistName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">New Shortlist Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-input border-border text-foreground"
                        placeholder="e.g., Summer Targets 2025"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreatingNew(false);
                  form.setValue("newShortlistName", ""); // Clear new name when going back
                  if (initialShortlistId) {
                    form.setValue("shortlistId", initialShortlistId); // Restore initial selection
                  }
                }}
                className="w-full bg-muted border-border text-muted-foreground hover:bg-accent"
              >
                Back to Existing Shortlists
              </Button>
            </>
          )}
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={
                !selectedPlayerId ||
                (!isCreatingNew && !selectedShortlistId) ||
                (isCreatingNew && !newShortlistName?.trim())
              }
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add to Shortlist
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddToShortlistDialog;