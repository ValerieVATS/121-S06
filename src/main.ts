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
};

// --- DOM (built once, updated in place) ------------------------------------

const heading = document.createElement("h1");
heading.textContent = "Star Forge";

const stardustDisplay = document.createElement("p");
stardustDisplay.className = "resource";
stardustDisplay.textContent = "0 stardust";

const forgeButton = document.createElement("button");
forgeButton.className = "forge";
forgeButton.textContent = "Strike the star";
forgeButton.addEventListener("click", () => {
  state.stardust += 1;
});

app.append(heading, stardustDisplay, forgeButton);

// --- Main loop ---------------------------------------------------------------
// Rendering runs every frame, but the simulation only changes when the
// player acts. Later increments will pass real elapsed time here.

let lastStardust = -1;

function frame() {
  if (state.stardust !== lastStardust) {
    stardustDisplay.textContent = `${Math.floor(state.stardust)} stardust`;
    lastStardust = state.stardust;
  }
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
