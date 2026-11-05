# Star Forge

A small incremental game for CMPM 121 D1. You are a forge-mind tending a
dying star: strike it for stardust, buy machines that fuse dust for you,
and research upgrades that change how everything grows. The forge keeps
working while you are away, and your progress survives a page reload.

Play it at the GitHub Pages URL of this repository (deployed automatically
by `.github/workflows/deploy.yml` on every push to `main`).

## How the theme drives the mechanics

- **Striking the star** is the basic action: one tap, one unit of stardust.
- **The surface winds** shed stardust on their own, so time itself is a
  resource — the game grows even when you do nothing.
- **Machines** (furnace, gravity lens, neutron press) convert that dust
  back into more dust, at geometrically rising costs, so the early game is
  about clicks and the late game is about automation.
- **Research upgrades** multiply a single target — your strikes, or one
  machine type — which creates moments where an old machine suddenly
  becomes worth buying again.

## Where the code lives

| File                      | Responsibility                                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.ts`             | DOM wiring only: build buttons, render state every update, hook input                                                               |
| `src/game/state.ts`       | The simulation: the `GameState` type and every function that changes it (`tick`, `strike`, `buyGenerator`, `buyUpgrade`, save/load) |
| `src/game/definitions.ts` | The content: generators and upgrades as plain data                                                                                  |

The split is deliberate: the simulation never touches the DOM, and the
DOM never does arithmetic. Rendering runs from both a `requestAnimationFrame`
loop and a 250 ms timer, so the game keeps working when the tab is hidden
or never paints; `tick()` consumes real elapsed time, so double-driving is
harmless and production depends only on wall-clock time.

### Adding content

New machines and upgrades require **no new code paths**:

1. Add an entry to `GENERATORS` or `UPGRADES` in `src/game/definitions.ts`.
2. Done — the buy buttons, costs, rates, and tooltips are generated from
   the data.

Costs follow `baseCost × costGrowth ^ owned`; production is
`dustPerSecond × owned × (purchased multipliers for that target)`.

### Known limits (future work)

- Absences longer than the 60 s per-tick cap are not back-filled; offline
  progress would need a saved timestamp.
- Numbers are formatted ad hoc; large values will want suffix notation.
- One save slot, keyed `star-forge-save-v1`; bump the version and migrate
  if the state shape ever changes.

## Development

Requires [Deno](https://deno.com). Common tasks (see `deno.json`):

```sh
deno task setup   # one-time: install the git pre-commit hook
deno task dev     # dev server
deno task ci      # fmt + lint + typecheck + production build
```

Commits in this repository carry an `Assisted-by:` trailer describing which
AI agent helped author them (see `AGENTS.md`).

## Credits

Tooling adapted from the [CMPM 121 Fall 2026 S01 starter](https://github.com/ucsc-cmpm-121-f26/s01-starter/tree/8974888efb6537be82e8eb069db139ea885039da), which has no explicit repository license. No new license is assigned to that material. The D1 scaffold and original SVG were authored with OpenAI GPT-6 Astra assistance. Dependencies retain their respective licenses.
