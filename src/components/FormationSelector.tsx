"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Formation } from '@/types/formation';

interface FormationSelectorProps {
  formations: Formation[];
  selectedFormationId: string | null;
  onSelectFormation: (formationId: string) => void;
}

const FormationSelector: React.FC<FormationSelectorProps> = ({
  formations,
  selectedFormationId,
  onSelectFormation,
}) => {
  return (
    <Select value={selectedFormationId || ""} onValueChange={onSelectFormation}>
      <SelectTrigger className="w-[180px] bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
        <SelectValue placeholder="Select Formation" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700 text-white">
        {formations.map((formation) => (
          <SelectItem key={formation.id} value={formation.id}>
            {formation.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FormationSelector;