/*
 * Star Forge — D1
 *
 * You are a forge-mind tending a dying star. Every tap strikes a spark of
 * stardust from its surface; furnaces fuse that dust into matter on their
 * own, so the forge keeps working while you rest.
 *
 * This file is only DOM wiring. The numbers live in game/state.ts and the
 * content lives in game/definitions.ts.
 */

import "./style.css";
import { GENERATORS } from "./game/definitions.ts";
import {
  buyGenerator,
  createInitialState,
  dustPerSecond,
  generatorCost,
  strike,
  tick,
} from "./game/state.ts";

const app = document.querySelector<HTMLElement>("#app")!;

const state = createInitialState();

// --- DOM (built once, updated in place) ------------------------------------

const heading = document.createElement("h1");
heading.textContent = "Star Forge";

const stardustDisplay = document.createElement("p");
stardustDisplay.className = "resource";

const rateDisplay = document.createElement("p");
rateDisplay.className = "rate";

const forgeButton = document.createElement("button");
forgeButton.className = "forge";
forgeButton.textContent = "Strike the star";
forgeButton.addEventListener("click", () => strike(state));

// One buy button per generator definition — the loop is the same for all.
const generatorButtons = GENERATORS.map((def) => {
  const button = document.createElement("button");
  button.className = "buy";
  button.addEventListener("click", () => buyGenerator(state, def));
  return { def, button };
});

app.append(
  heading,
  stardustDisplay,
  rateDisplay,
  forgeButton,
  ...generatorButtons.map((g) => g.button),
);

// --- Main loop -------------------------------------------------------------

let lastShownStardust = -1;

function frame() {
  tick(state, performance.now());

  rateDisplay.textContent = `${
    dustPerSecond(state)
  } stardust / second (surface winds + generators)`;

  for (const { def, button } of generatorButtons) {
    const cost = generatorCost(state, def);
    button.textContent =
      `${def.name} (+${def.dustPerSecond}/sec) — ${cost} stardust`;
    button.title = def.flavor;
    button.disabled = state.stardust < cost;
  }

  // Skip the text write when the floored value has not changed.
  const floored = Math.floor(state.stardust);
  if (floored !== lastShownStardust) {
    stardustDisplay.textContent = `${floored} stardust`;
    lastShownStardust = floored;
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
