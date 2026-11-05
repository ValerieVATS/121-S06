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
  {
    id: "lens",
    name: "Gravity lens",
    flavor: "Bends the star's light into a denser dust stream.",
    baseCost: 120,
    costGrowth: 1.15,
    dustPerSecond: 6,
  },
  {
    id: "press",
    name: "Neutron press",
    flavor: "Squeezes matter until it can't hold its dust anymore.",
    baseCost: 2400,
    costGrowth: 1.15,
    dustPerSecond: 40,
  },
];

/**
 * One-time upgrades. Each multiplies the yield of its target: either the
 * click ("click") or one generator id. Buying is permanent.
 */
export interface UpgradeDef {
  id: string;
  name: string;
  flavor: string;
  cost: number;
  target: string;
  multiplier: number;
}

export const UPGRADES: UpgradeDef[] = [
  {
    id: "hammer",
    name: "Reinforced hammer",
    flavor: "Strike deeper; every tap rings loose twice the dust.",
    cost: 50,
    target: "click",
    multiplier: 2,
  },
  {
    id: "coils",
    name: "Superconductive coils",
    flavor: "Furnaces run hot and never let a grain escape.",
    cost: 200,
    target: "furnace",
    multiplier: 2,
  },
  {
    id: "alignment",
    name: "Lens alignment ritual",
    flavor: "Every lens folds its stream perfectly onto the forge.",
    cost: 1500,
    target: "lens",
    multiplier: 3,
  },
];

/** Stardust per second the star sheds on its own, before any generators. */
export const SURFACE_WINDS_RATE = 0.5;

/** Stardust gained per click on the star. */
export const CLICK_YIELD = 1;
