/**
 * Generator definitions: the data that describes everything the player can
 * buy. Adding a new generator means adding an entry here — no new code.
 */

export interface GeneratorDef {
  /** Stable identifier used by the save state and DOM. */
  id: string;
  /** Name shown on the buy button. */
  name: string;
  /** One-line flavor text explaining what it does to the star. */
  flavor: string;
  /** Cost of the first purchase, in stardust. */
  baseCost: number;
  /** Cost multiplier applied per unit already owned (geometric scaling). */
  costGrowth: number;
  /** Stardust produced per second, per unit owned. */
  dustPerSecond: number;
}

export const GENERATORS: GeneratorDef[] = [
  {
    id: "furnace",
    name: "Fusion furnace",
    flavor: "Fuses loose dust back into matter.",
    baseCost: 10,
    costGrowth: 1.15,
    dustPerSecond: 1,
  },
];

/** Stardust per second the star sheds on its own, before any generators. */
export const SURFACE_WINDS_RATE = 0.5;

/** Stardust gained per click on the star. */
export const CLICK_YIELD = 1;
