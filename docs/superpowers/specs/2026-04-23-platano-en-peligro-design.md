# Plátano en Peligro — Design Spec

**Date:** 2026-04-23
**Hackathon:** Platanus
**Constraint:** ≤50KB game code, no external assets, Phaser 3 via CDN

---

## Concept

PacMan-style maze game set in Buenos Aires. The player controls a banana (🍌) that must collect pesos scattered across the map while evading chorros (thieves). Grabbing a "cana" (police) power-up temporarily reverses the chase. Reaching the subte/colectivo exit wins the level.

---

## Core Loop

1. Banana spawns at starting position
2. Player navigates the maze collecting pesos (dots)
3. 2–4 chorros chase the banana using BFS pathfinding
4. Player picks up a "cana" power-up → chorros flee for 5 seconds
5. Player reaches the subte/colectivo exit → level complete
6. If a chorro touches the banana → lose 1 life (3 lives total)
7. 0 lives → Game Over (restart current level)

Score: +10 per peso collected. Bonus +500 on level complete.

---

## Levels

### Level 1 — Palermo
- Open maze, few dead ends
- 2 chorros, slow speed
- 3 cana power-ups on the map
- Exit: Subte entrance

### Level 2 — Once
- More walls, narrower corridors
- 3 chorros, medium speed
- 2 cana power-ups
- Exit: Colectivo stop

### Level 3 — La Boca
- Dense labyrinth, many dead ends
- 4 chorros, fast speed
- 1 cana power-up
- Exit: Subte entrance

---

## Characters & Graphics

All graphics are either procedural (Phaser Graphics API) or loaded from local files. No external URLs.

| Character | Visual | Source |
|-----------|--------|--------|
| Banana (player) | Yellow ellipse with slight curve, drawn in code | Phaser Graphics |
| Chorro (enemy) | hackathon.png scaled to 32×32px | Local file |
| Cana (power-up) | Blue circle with white "C" | Phaser Graphics |
| Peso (collectible) | Small green circle with "$" | Phaser Graphics |
| Walls | Dark tile rectangles | Phaser Graphics |
| Floor | Dark background | CSS/Phaser |

When cana power-up is active: chorros turn gray/transparent and reverse direction.

---

## AI — Chorro Pathfinding

Simple BFS (breadth-first search) on the tile grid, recalculated every 500ms. This keeps code size small while producing competent enemy movement. At higher levels, recalculation frequency increases (Level 2: 350ms, Level 3: 200ms).

---

## Screens / Scene Flow

```
Menu Scene
  ↓ (press Start)
Level 1 Scene (Palermo)
  ↓ (reach exit)
Level 2 Scene (Once)
  ↓ (reach exit)
Level 3 Scene (La Boca)
  ↓ (reach exit)
Win Scene ("¡Llegaste al subte!")

Any level → 0 lives → GameOver Scene → restart level
```

HUD (shown during gameplay): Lives | Score | Level name | "CANA!" flash when power-up active

---

## Project Structure

```
juego-hackathon/
  index.html        ← loads Phaser 3 from CDN, mounts game
  game.js           ← all game logic (~30–40KB)
  hackathon.png     ← chorro sprite (local asset)
```

`game.js` contains:
- `MenuScene`
- `GameScene` (reused for all 3 levels, configured by level data)
- `WinScene`
- `GameOverScene`
- `LEVELS` config array (map layout, enemy count, speed, power-up count per level)
- `EnemyAI` class (BFS pathfinding)
- `drawSprites()` helper (procedural graphics for banana, peso, cana, walls)

---

## Size Budget (50KB game code)

| File | Estimated size |
|------|---------------|
| index.html | ~0.5KB |
| game.js | ~35–40KB |
| hackathon.png | not counted (asset, not code) |
| **Total code** | **~40KB** ✅ |

Phaser 3 loaded from CDN — does not count toward the 50KB limit.

---

## Out of Scope

- Sound/music (adds KB, no external assets rule complicates it)
- Mobile/touch controls (hackathon likely desktop)
- Online leaderboard
- More than 3 levels
