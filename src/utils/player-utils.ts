"use client";

import { Player } from '@/types/player';
import { FmAttributeCategory, getAttributesByCategory } from './fm-roles';

/**
 * Calculates the average rating for a given category of attributes.
 * @param player The player object.
 * @param category The attribute category (e.g., 'technical', 'physical').
 * @param attributeNames Optional array of specific attribute names to include. If not provided, all attributes in the category are used.
 * @returns The average rating for the specified attributes, or 0 if no attributes are found.
 */
const getAverageAttributeRating = (
  player: Player,
  category: FmAttributeCategory,
  attributeNames?: string[]
): number => {
  const attributes = getAttributesByCategory(player, category);
  const filteredAttributes = attributeNames
    ? attributes.filter(attr => attributeNames.includes(attr.name))
    : attributes;

  if (filteredAttributes.length === 0) {
    return 0;
  }

  const totalRating = filteredAttributes.reduce((sum, attr) => sum + attr.rating, 0);
  return totalRating / filteredAttributes.length;
};

/**
 * Calculates the Overall Modern Rating (OMR) for a player.
 * This metric is a weighted average of key attributes important in modern football.
 *
 * Weights:
 * - Core Technical: 3 (First Touch, Passing Range, Technique, Dribbling)
 * - Core Tactical: 3 (Decision Making, Game Intelligence, Vision, Off-Ball Movement)
 * - Core Physical: 2 (Pace, Acceleration, Stamina, Agility)
 * - Core Mental: 2 (Composure, Work Rate, Teamwork, Determination)
 *
 * @param player The player object.
 * @returns The calculated OMR (0-10 scale).
 */
export const calculateOverallModernRating = (player: Player): number => {
  // Define key attributes for each category
  const coreTechnicalAttrs = ["First Touch", "Passing Range", "Technique", "Dribbling"];
  const coreTacticalAttrs = ["Decision Making", "Game Intelligence", "Vision", "Off-Ball Movement"];
  const corePhysicalAttrs = ["Pace", "Acceleration", "Stamina", "Agility"];
  const coreMentalAttrs = ["Composure", "Work Rate", "Teamwork", "Determination"];

  // Calculate average for each core category
  const avgTechnical = getAverageAttributeRating(player, "technical", coreTechnicalAttrs);
  const avgTactical = getAverageAttributeRating(player, "tactical", coreTacticalAttrs);
  const avgPhysical = getAverageAttributeRating(player, "physical", corePhysicalAttrs);
  const avgMental = getAverageAttributeRating(player, "mentalPsychology", coreMentalAttrs);

  // Define weights for each category average
  const weights = {
    technical: 3,
    tactical: 3,
    physical: 2,
    mental: 2,
  };

  const totalWeightedScore =
    (avgTechnical * weights.technical) +
    (avgTactical * weights.tactical) +
    (avgPhysical * weights.physical) +
    (avgMental * weights.mental);

  const totalWeight = weights.technical + weights.tactical + weights.physical + weights.mental;

  if (totalWeight === 0) return 0;

  // Return OMR, rounded to one decimal place
  return parseFloat((totalWeightedScore / totalWeight).toFixed(1));
};