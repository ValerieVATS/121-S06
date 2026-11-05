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
import { GENERATORS, UPGRADES } from "./game/definitions.ts";
import {
  buyGenerator,
  buyUpgrade,
  clickYield,
  createInitialState,
  dustPerSecond,
  generatorCost,
  generatorYield,
  ownedCount,
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

// One button per one-time upgrade; hidden once purchased.
const upgradeButtons = UPGRADES.map((def) => {
  const button = document.createElement("button");
  button.className = "buy upgrade";
  button.addEventListener("click", () => buyUpgrade(state, def));
  return { def, button };
});

const generatorSection = document.createElement("h2");
generatorSection.textContent = "Machines";

const upgradeSection = document.createElement("h2");
upgradeSection.textContent = "Research";

app.append(
  heading,
  stardustDisplay,
  rateDisplay,
  forgeButton,
  generatorSection,
  ...generatorButtons.map((g) => g.button),
  upgradeSection,
  ...upgradeButtons.map((u) => u.button),
);

// --- Main loop ---------------------------------------------------------------
// The simulation is driven by both a display-rate loop (rAF) and a timer
// that keeps firing when the tab is hidden — or never paints at all, as in
// embedded or automated browsers. Because tick() consumes real elapsed
// time, double-driving is harmless: each tick covers the interval since
// the previous one, so production depends only on wall-clock time.

let lastShownStardust = -1;

function update() {
  tick(state, performance.now());

  const perClick = clickYield(state);
  forgeButton.textContent = perClick === 1
    ? "Strike the star"
    : `Strike the star (+${perClick} per strike)`;

  for (const { def, button } of generatorButtons) {
    const cost = generatorCost(state, def);
    const count = ownedCount(state, def);
    const yieldPerUnit = generatorYield(state, def);
    button.textContent = count > 0
      ? `${def.name} ×${count} (+${yieldPerUnit}/sec each) — ${cost} stardust`
      : `${def.name} (+${yieldPerUnit}/sec) — ${cost} stardust`;
    button.title = def.flavor;
    button.disabled = state.stardust < cost;
  }

  for (const { def, button } of upgradeButtons) {
    if (state.upgrades[def.id]) {
      button.hidden = true;
      continue;
    }
    button.hidden = false;
    button.textContent = `${def.name} — ${def.cost} stardust`;
    button.title = def.flavor;
    button.disabled = state.stardust < def.cost;
  }

  rateDisplay.textContent = `${
    dustPerSecond(state)
  } stardust / second (surface winds + machines)`;

  // Skip the text write when the floored value has not changed.
  const floored = Math.floor(state.stardust);
  if (floored !== lastShownStardust) {
    stardustDisplay.textContent = `${floored} stardust`;
    lastShownStardust = floored;
  }
}

function displayLoop() {
  update();
  requestAnimationFrame(displayLoop);
}

displayLoop();
setInterval(update, 250);
