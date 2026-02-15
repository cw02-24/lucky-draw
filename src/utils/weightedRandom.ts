export interface Prize {
  id: string;
  label: string;
  weight: number;
  color: string;
}

/**
 * Selects an item from an array based on weights.
 * Higher weight = higher probability of being selected.
 * 
 * @param items Array of items to select from
 * @param weights Array of weights corresponding to each item
 * @returns The selected item
 * @throws Error if items and weights length mismatch or if weights are invalid
 */
export function selectWeightedRandom<T>(items: T[], weights: number[]): T {
  if (items.length !== weights.length || items.length === 0) {
    throw new Error("Items and weights arrays must have the same non-zero length.");
  }

  let totalWeight = 0;
  weights.forEach(weight => {
    if (weight < 0) {
      throw new Error("Weights cannot be negative.");
    }
    totalWeight += weight;
  });

  if (totalWeight === 0) {
    throw new Error("Total weight cannot be zero. Ensure at least one item has a positive weight.");
  }

  // Generate a random number between 0 (inclusive) and totalWeight (exclusive)
  const randomNumber = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (let i = 0; i < items.length; i++) {
    cumulativeWeight += weights[i];
    if (cumulativeWeight >= randomNumber) {
      return items[i];
    }
  }

  // Fallback to the last item due to potential floating point precision issues
  return items[items.length - 1];
}
