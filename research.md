# Research Findings: Lucky Draw Algorithms and Web Implementations

This document summarizes research on common lucky draw algorithms, particularly focusing on randomization and weighting, and explores potential web-based implementations using React and Vite.

## Core Algorithm/Logic: Weighted Random Selection

The most common and flexible algorithm for implementing lucky draws, especially when different prizes have different probabilities of being won, is **Weighted Random Selection**.

### Concept
Each item (prize) in the draw is assigned a "weight" or a numerical value that represents its relative probability of being chosen. A higher weight indicates a greater chance of being selected.

### Implementation Steps (Basic Weighted Random Algorithm)

1.  **Calculate Total Weight**: Sum all individual weights assigned to each item in the draw pool.
2.  **Generate Random Number**: Generate a random floating-point number within the range of `[0, totalWeight)` (from zero inclusive, up to but not including the total weight). Most programming languages' random functions (e.g., `Math.random()` in JavaScript) provide numbers between 0 and 1, so this needs to be scaled by the `totalWeight`.
3.  **Determine Winner**: Iterate through the items in the draw pool. For each item, add its weight to a `cumulativeWeight` counter. The first item for which the `cumulativeWeight` *exceeds or equals* the `randomNumber` generated in step 2 is the winning item.

### Illustrative Code Snippet (TypeScript/JavaScript)

```typescript
function selectWeightedRandom<T>(items: T[], weights: number[]): T {
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
      return items[i]; // This item is selected
    }
  }

  // Fallback: This line should ideally not be reached if totalWeight is calculated correctly
  // and randomNumber is within [0, totalWeight).
  return items[items.length - 1]; // Return the last item as a safeguard (should be handled by error)
}

// Example Usage:
// const prizes = ["10% Off", "Free Shipping", "Try Again", "20% Off"];
// const probabilities = [30, 20, 40, 10]; // Sum is 100
// const winner = selectWeightedRandom(prizes, probabilities);
// console.log("Winner:", winner);
```

### Variations

*   **Dynamic Weighting**: Probabilities (weights) can be adjusted in real-time based on various factors, such as the number of remaining prizes of a certain type, time limits for a promotion, or to enforce a certain distribution over time (e.g., ensuring rare prizes don't appear too frequently in a short period, or guaranteeing a win after N attempts). This requires recalculating weights before each draw.
*   **Advanced Algorithms (e.g., Alias Method)**: For scenarios with a very large number of items and extremely frequent draws where performance is critical, algorithms like the Alias Method can be used. These offer O(1) selection time after an initial O(N) or O(N log N) setup. However, they are more complex to implement and generally overkill for typical web-based lucky draws.

## Library Recommendations (React/Vite)

For web-based implementations, particularly for creating interactive "spin the wheel" UIs, leveraging existing React components is highly recommended to handle complex animations, canvas rendering, and user interactions.

*   **`ts-spin-wheel` (GitHub: Sivamani-18/SpinWheel)**:
    *   **Description**: A robust, customizable, and responsive React Spin Wheel Component built with TypeScript. It provides a comprehensive solution for the visual aspect of a lucky draw.
    *   **Key Features**:
        *   Customizable wheel sectors (labels, colors, text).
        *   Smooth easing animations.
        *   Optional audio feedback during spin.
        *   Modal pop-up for displaying the winning result.
        *   Full TypeScript support.
        *   Easily styleable (e.g., with Tailwind CSS or custom CSS).
    *   **Integration Approach**:
        1.  Install the library (`npm install ts-spin-wheel` or `yarn add ts-spin-wheel`).
        2.  Define your prize data (sectors) including labels, colors, etc.
        3.  Implement your weighted random selection algorithm (as described above) to determine the winning prize *before* the wheel starts spinning.
        4.  Use a `useRef` hook to get a reference to the `SpinWheel` component.
        5.  Call a method like `wheelRef.current.spin()` and provide the index or identifier of the pre-determined winning sector.
        6.  Utilize the `onSpinEnd` callback to trigger actions (e.g., showing the result modal) once the animation finishes.

## Implementation Gotchas

*   **True Randomness vs. Pseudo-randomness**: JavaScript's `Math.random()` generates pseudo-random numbers. While sufficient for most casual lucky draws, for high-stakes or cryptographically secure applications, server-side generation using a more robust (cryptographically secure) random number generator is critical.
*   **Perceived Fairness**: Users might perceive unfairness even if the algorithm is technically correct. Consider strategies to enhance perceived fairness, such as:
    *   Clearly communicating probabilities.
    *   Implementing "pity timers" (guaranteeing a rare win after X losses).
    *   Dynamically adjusting weights over time to ensure a smoother distribution of prizes, especially if prizes are limited.
*   **UI/Algorithm Synchronization**: It is crucial that the visual spin animation of the wheel lands precisely on the prize determined by your back-end algorithm. The winning prize should be calculated *before* the animation starts, and the animation should be configured to stop at that specific prize's segment.
*   **Vite Integration**: React components generally integrate well with Vite. Ensure any library-specific CSS or asset imports are correctly handled by Vite's build process.
*   **Accessibility**: Ensure the lucky draw interface is accessible to users with disabilities. This includes proper semantic HTML, keyboard navigation support, and clear visual/auditory feedback.
