/*
 * Star Forge — D1
 *
 * You are a forge-mind tending a dying star. Every tap strikes a spark of
 * stardust from its surface; furnaces fuse that dust into matter on their
 * own, so the forge keeps working while you rest.
 */

import "./style.css";

const app = document.querySelector<HTMLElement>("#app")!;

// --- State -----------------------------------------------------------------
// The single source of truth for the simulation. Rendering reads from this;
// input writes to it. Nothing else is allowed to keep game numbers.

const state = {
  stardust: 0,
  // Stardust per second shed by the star's surface winds. The player does
  // not control this yet — it exists so time itself is part of the loop.
  dustPerSecond: 0.5,
  // Timestamp of the last simulation tick, from performance.now().
  lastTick: performance.now(),
};

// --- DOM (built once, updated in place) ------------------------------------

const heading = document.createElement("h1");
heading.textContent = "Star Forge";

const stardustDisplay = document.createElement("p");
stardustDisplay.className = "resource";
stardustDisplay.textContent = "0 stardust";

const rateDisplay = document.createElement("p");
rateDisplay.className = "rate";
rateDisplay.textContent = "0.5 stardust / second (surface winds)";

const forgeButton = document.createElement("button");
forgeButton.className = "forge";
forgeButton.textContent = "Strike the star";
forgeButton.addEventListener("click", () => {
  state.stardust += 1;
});

app.append(heading, stardustDisplay, rateDisplay, forgeButton);

// --- Simulation --------------------------------------------------------------
// One tick advances the simulation by however much time actually elapsed.
// Because production is computed from dt, the game grows identically at
// 30, 60, or 144 fps — and awards the dust that piled up while the tab
// was hidden (capped so an overnight absence does not one-shot the game).

const MAX_TICK_SECONDS = 60;

function tick() {
  const now = performance.now();
  const dt = Math.min((now - state.lastTick) / 1000, MAX_TICK_SECONDS);
  state.lastTick = now;
  state.stardust += state.dustPerSecond * dt;
}

// --- Main loop -------------------------------------------------------------

let lastStardust = -1;

function frame() {
  tick();
  if (state.stardust !== lastStardust) {
    stardustDisplay.textContent = `${Math.floor(state.stardust)} stardust`;
    lastStardust = state.stardust;
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
