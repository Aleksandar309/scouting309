"use client";

import React from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Player } from '@/types/player';
import { FmRole, getRolesForPosition, calculateRoleCompatibility } from '@/utils/fm-roles';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RoleDetailsDialogProps {
  player: Player;
  positionType: string;
  onClose: () => void;
  onRoleSelect: (role: FmRole | null) => void; // Callback to highlight attributes
  selectedRole: FmRole | null;
}

const RoleDetailsDialog: React.FC<RoleDetailsDialogProps> = ({
  player,
  positionType,
  onClose,
  onRoleSelect,
  selectedRole,
}) => {
  const roles = getRolesForPosition(positionType);

  if (!roles || roles.length === 0) {
    return (
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Roles for {positionType}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            No specific Football Manager roles defined for this position yet.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-center">
          <Button onClick={onClose} className="bg-primary hover:bg-primary/90 text-primary-foreground">Close</Button>
        </div>
      </DialogContent>
    );
  }

  // Calculate compatibility for each role and then sort them
  const sortedRoles = roles
    .map((role) => ({
      role,
      compatibility: calculateRoleCompatibility(player, role),
    }))
    .sort((a, b) => b.compatibility - a.compatibility); // Sort in descending order

  return (
    <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground border-border max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">Roles for {positionType}</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Select a role to see {player.name}'s compatibility and highlight key attributes.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        {sortedRoles.map(({ role, compatibility }) => {
          const isSelected = selectedRole?.name === role.name;

          return (
            <div
              key={role.name}
              className={cn(
                "p-4 border rounded-md cursor-pointer transition-all duration-200",
                "bg-muted border-border hover:bg-accent",
                isSelected ? "ring-2 ring-blue-500 border-blue-500" : ""
              )}
              onClick={() => onRoleSelect(isSelected ? null : role)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-foreground">{role.name}</h3>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    compatibility >= 80 ? "bg-green-600 text-white" :
                    compatibility >= 60 ? "bg-yellow-600 text-white" :
                    "bg-red-600 text-white"
                  )}
                >
                  {compatibility}%
                </span>
              </div>
              <p className="text-muted-foreground mb-2">{role.description}</p>
              {isSelected && (
                <div className="mt-3">
                  <h4 className="font-medium text-blue-300 mb-1">Key Attributes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.attributes.map((attr, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "px-2 py-1 rounded-full text-xs",
                          attr.weight === 3 ? "bg-blue-500 text-white" : // Primary
                          attr.weight === 2 ? "bg-purple-500 text-white" : // Secondary
                          "bg-gray-500 text-white" // Tertiary
                        )}
                      >
                        {attr.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-end">
        <Button onClick={onClose} className="bg-muted hover:bg-accent text-muted-foreground">Close</Button>
      </div>
    </DialogContent>
  );
};

export default RoleDetailsDialog;