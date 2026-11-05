/**
 * The simulation: all game numbers live in GameState, and every rule that
 * changes them is a pure-ish function here. The DOM layer reads state and
 * calls these; it never does arithmetic of its own.
 */

import {
  CLICK_YIELD,
  type GeneratorDef,
  GENERATORS,
  SURFACE_WINDS_RATE,
  UPGRADES,
} from "./definitions.ts";

export interface GameState {
  stardust: number;
  /** Owned count per generator id. */
  owned: Record<string, number>;
  /** Purchased upgrade ids. */
  upgrades: Record<string, boolean>;
  /** Timestamp of the last simulation tick, from performance.now(). */
  lastTick: number;
}

export function createInitialState(): GameState {
  return {
    stardust: 0,
    owned: {},
    upgrades: {},
    lastTick: performance.now(),
  };
}

export function ownedCount(state: GameState, def: GeneratorDef): number {
  return state.owned[def.id] ?? 0;
}

/** Cost of the next unit of a generator, given how many are owned. */
export function generatorCost(state: GameState, def: GeneratorDef): number {
  return Math.ceil(def.baseCost * def.costGrowth ** ownedCount(state, def));
}

/** Product of every purchased upgrade that targets the given id. */
export function multiplierFor(state: GameState, target: string): number {
  let m = 1;
  for (const up of UPGRADES) {
    if (up.target === target && state.upgrades[up.id]) m *= up.multiplier;
  }
  return m;
}

/** Stardust gained per click, after click upgrades. */
export function clickYield(state: GameState): number {
  return CLICK_YIELD * multiplierFor(state, "click");
}

/** Stardust one generator unit produces, after its upgrades. */
export function generatorYield(state: GameState, def: GeneratorDef): number {
  return def.dustPerSecond * multiplierFor(state, def.id);
}

/** Total stardust per second: surface winds plus every owned generator. */
export function dustPerSecond(state: GameState): number {
  let rate = SURFACE_WINDS_RATE;
  for (const def of GENERATORS) {
    rate += generatorYield(state, def) * ownedCount(state, def);
  }
  return rate;
}

export function strike(state: GameState): void {
  state.stardust += clickYield(state);
}

/**
 * Advance the simulation by however much time actually elapsed, in seconds.
 * Production depends only on dt, so growth is identical at any frame rate.
 * dt is capped so an overnight absence does not one-shot the game.
 */
export function tick(state: GameState, now: number): void {
  const MAX_TICK_SECONDS = 60;
  const dt = Math.min((now - state.lastTick) / 1000, MAX_TICK_SECONDS);
  state.lastTick = now;
  state.stardust += dustPerSecond(state) * dt;
}

/** Spend stardust to add one unit of a generator. Returns true if bought. */
export function buyGenerator(state: GameState, def: GeneratorDef): boolean {
  const cost = generatorCost(state, def);
  if (state.stardust < cost) return false;
  state.stardust -= cost;
  state.owned[def.id] = ownedCount(state, def) + 1;
  return true;
}

/** Spend stardust on a one-time upgrade. Returns true if bought. */
export function buyUpgrade(
  state: GameState,
  def: (typeof UPGRADES)[number],
): boolean {
  if (state.upgrades[def.id] || state.stardust < def.cost) return false;
  state.stardust -= def.cost;
  state.upgrades[def.id] = true;
  return true;
}
