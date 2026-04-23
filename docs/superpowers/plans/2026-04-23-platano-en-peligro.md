# Plátano en Peligro — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Phaser 3 PacMan-style arcade game where a banana escapes chorros through 3 Buenos Aires neighborhoods and reaches the subte/colectivo.

**Architecture:** Single `game.js` file with Phaser 3 Scene classes. `GameScene` is reused for all 3 levels, configured by a `LEVELS` data array. All graphics except the chorro sprite are drawn procedurally with Phaser's Graphics API — no external asset URLs.

**Tech Stack:** Phaser 3.60 (CDN), vanilla JS (ES6), no bundler, no framework.

---

## File Map

| File | Role |
|------|------|
| `index.html` | Loads Phaser from CDN, mounts canvas, starts game |
| `game.js` | All game logic: scenes, AI, graphics, level data |
| `hackathon.png` | Chorro sprite — local file, loaded by Phaser preloader |

---

### Task 1: Project scaffold — index.html + empty game.js

**Files:**
- Create: `index.html`
- Create: `game.js`

- [ ] **Step 1: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Plátano en Peligro</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
  </style>
</head>
<body>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `game.js` with Phaser config only**

```js
// game.js
const TILE = 32;
const COLS = 20;
const ROWS = 16;
const W = COLS * TILE; // 640
const H = ROWS * TILE; // 512

const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  backgroundColor: '#111',
  scene: [] // scenes added in later tasks
};

// Instantiated after all scenes are defined (Task 6)
```

- [ ] **Step 3: Verify in browser**

Open `index.html` in browser (serve with `python3 -m http.server 8080` then visit `http://localhost:8080`).
Expected: black canvas, no console errors.

- [ ] **Step 4: Commit**

```bash
git add index.html game.js
git commit -m "feat: project scaffold with Phaser 3 config"
```

---

### Task 2: Level data — LEVELS config array and tile maps

**Files:**
- Modify: `game.js`

Each level map is a 2D array of numbers:
- `0` = floor
- `1` = wall
- `2` = peso (collectible dot)
- `3` = cana power-up
- `4` = exit (subte/colectivo)
- `5` = banana spawn
- `6` = chorro spawn

- [ ] **Step 1: Add LEVELS array to `game.js`**

```js
// Tile constants
const T = { FLOOR: 0, WALL: 1, PESO: 2, CANA: 3, EXIT: 4, SPAWN: 5, CHORRO: 6 };

const LEVELS = [
  // ── Level 1: Palermo ──────────────────────────────────────────
  {
    name: 'Palermo',
    exit: 'Subte',
    chorroCount: 2,
    chorroSpeed: 90,      // px/s
    aiInterval: 500,      // ms between BFS recalcs
    canaPowerDuration: 5000, // ms chorros flee
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
      [1,3,1,1,2,1,1,1,2,2,2,2,1,1,1,2,1,1,3,1],
      [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1],
      [1,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,2,1],
      [1,1,1,1,2,1,1,1,0,0,0,0,1,1,1,2,1,1,1,1],
      [1,1,1,1,2,1,0,0,6,0,0,6,0,0,1,2,1,1,1,1],
      [1,1,1,1,2,1,1,1,0,0,0,0,1,1,1,2,1,1,1,1],
      [1,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,2,1],
      [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
      [1,3,1,1,2,1,1,1,2,2,2,2,1,1,1,2,1,1,3,1],
      [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,4,4,2,2,2,2,2,2,2,2,1],
    ]
  },
  // ── Level 2: Once ─────────────────────────────────────────────
  {
    name: 'Once',
    exit: 'Colectivo',
    chorroCount: 3,
    chorroSpeed: 110,
    aiInterval: 350,
    canaPowerDuration: 5000,
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,2,2,1,2,2,2,2,1,1,2,2,2,2,1,2,2,2,1],
      [1,2,1,2,1,2,1,1,2,1,1,2,1,1,2,1,2,1,2,1],
      [1,2,1,2,2,2,1,1,2,2,2,2,1,1,2,2,2,1,2,1],
      [1,2,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
      [1,1,1,2,1,1,2,1,2,1,1,2,1,2,1,1,2,1,1,1],
      [1,3,2,2,1,1,2,1,0,0,0,0,1,2,1,1,2,2,3,1],
      [1,1,1,2,1,1,2,0,6,0,6,0,6,2,1,1,2,1,1,1],
      [1,2,2,2,2,2,2,0,0,0,0,0,0,2,2,2,2,2,2,1],
      [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1],
      [1,2,1,1,2,1,2,2,2,2,2,2,2,2,1,2,1,1,2,1],
      [1,2,2,2,2,2,1,1,1,1,1,1,1,1,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,1,2,2,2,2,1,1,2,1,1,1,2,1],
      [1,2,1,1,1,2,2,2,2,1,1,2,2,2,2,1,1,1,2,1],
      [1,2,2,2,2,2,2,2,2,4,4,2,2,2,2,2,2,2,2,1],
    ]
  },
  // ── Level 3: La Boca ──────────────────────────────────────────
  {
    name: 'La Boca',
    exit: 'Subte',
    chorroCount: 4,
    chorroSpeed: 130,
    aiInterval: 200,
    canaPowerDuration: 5000,
    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,5,2,1,2,2,1,2,2,1,1,2,2,1,2,2,1,2,2,1],
      [1,2,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,1,2,1],
      [1,1,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,1,1],
      [1,1,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,1,1],
      [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,1,2,1,2,1,1,2,1,2,1,1,1,1,2,1],
      [1,2,1,3,2,2,2,1,0,0,0,0,1,2,2,2,3,1,2,1],
      [1,2,1,1,1,1,2,0,6,0,6,0,6,0,2,1,1,1,2,1],
      [1,2,2,2,2,1,2,0,0,6,0,0,0,0,2,1,2,2,2,1],
      [1,1,1,2,1,1,2,1,1,1,1,1,1,2,1,1,2,1,1,1],
      [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
      [1,2,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,2,1],
      [1,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1],
      [1,1,2,1,2,1,1,1,2,1,1,2,1,1,1,2,1,2,1,1],
      [1,2,2,2,2,2,2,2,2,4,4,2,2,2,2,2,2,2,2,1],
    ]
  }
];
```

- [ ] **Step 2: Verify maps are valid JS (no syntax errors)**

```bash
node -e "const TILE=32,COLS=20,ROWS=16,W=640,H=512; $(grep -A 200 'const T = ' game.js | head -210)" 2>&1 | head -5
```
Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add game.js
git commit -m "feat: add LEVELS config with 3 tile maps"
```

---

### Task 3: Procedural sprite textures — generateTextures()

**Files:**
- Modify: `game.js`

Phaser lets you create textures from Graphics objects via `generateTexture()`. We create all textures once in a dedicated scene's `create()` and they persist across scenes.

- [ ] **Step 1: Add `generateTextures(scene)` function to `game.js`**

```js
function generateTextures(scene) {
  const g = scene.make.graphics({ x: 0, y: 0, add: false });

  // ── Banana (player) 32×32 ──
  g.clear();
  g.fillStyle(0xf5c518);
  g.fillEllipse(16, 20, 20, 26);
  g.fillStyle(0xc8a000);
  g.fillRect(14, 4, 4, 10);
  g.generateTexture('banana', TILE, TILE);

  // ── Peso (collectible dot) 32×32 ──
  g.clear();
  g.fillStyle(0x2ecc71);
  g.fillCircle(16, 16, 6);
  g.fillStyle(0x000000);
  // "$" drawn as two thin rects (cross shape approximation)
  g.fillRect(14, 10, 4, 12);
  g.fillRect(11, 12, 10, 3);
  g.fillRect(11, 17, 10, 3);
  g.generateTexture('peso', TILE, TILE);

  // ── Cana power-up 32×32 ──
  g.clear();
  g.fillStyle(0x2980b9);
  g.fillCircle(16, 16, 13);
  g.fillStyle(0xffffff);
  g.fillRect(13, 9, 3, 14);   // vertical stroke of "C"
  g.fillRect(13, 9, 9, 3);    // top of "C"
  g.fillRect(13, 20, 9, 3);   // bottom of "C"
  g.generateTexture('cana', TILE, TILE);

  // ── Chorro (enemy) frightened mode — gray version 32×32 ──
  g.clear();
  g.fillStyle(0x888888, 0.6);
  g.fillRect(4, 4, 24, 24);
  g.fillStyle(0xffffff);
  g.fillRect(9, 10, 5, 5);
  g.fillRect(18, 10, 5, 5);
  g.generateTexture('chorro-scared', TILE, TILE);

  // ── Exit tile 64×32 ──
  g.clear();
  g.fillStyle(0xf39c12);
  g.fillRect(0, 0, TILE * 2, TILE);
  g.fillStyle(0x000000);
  // "SUBTE" label rendered as a filled rect placeholder (text added in scene)
  g.generateTexture('exit', TILE * 2, TILE);

  g.destroy();
}
```

- [ ] **Step 2: Verify function is syntactically valid**

```bash
node --input-type=module <<'EOF'
import { readFileSync } from 'fs';
const src = readFileSync('game.js', 'utf8');
// Just check it parses
new Function(src);
console.log('OK');
EOF
```
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add game.js
git commit -m "feat: add generateTextures() for procedural sprites"
```

---

### Task 4: BootScene — preload chorro image + generate textures

**Files:**
- Modify: `game.js`

`BootScene` runs first: preloads `hackathon.png`, calls `generateTextures()`, then starts `MenuScene`.

- [ ] **Step 1: Add BootScene to `game.js`**

```js
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.image('chorro', 'hackathon.png');
  }

  create() {
    generateTextures(this);
    this.scene.start('Menu');
  }
}
```

- [ ] **Step 2: Verify `hackathon.png` is in the project root**

```bash
ls -lh hackathon.png
```
Expected: file exists, some KB in size.

If missing, copy it:
```bash
cp /home/agusg/Descargas/hackathon.png ./hackathon.png
```

- [ ] **Step 3: Commit**

```bash
git add game.js hackathon.png
git commit -m "feat: add BootScene with chorro preload and texture generation"
```

---

### Task 5: MenuScene

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add MenuScene to `game.js`**

```js
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    const cx = W / 2, cy = H / 2;

    // Background
    this.add.rectangle(cx, cy, W, H, 0x111111);

    // Banana sprite centered
    this.add.image(cx, cy - 80, 'banana').setScale(3);

    // Title
    this.add.text(cx, cy - 20, '🍌 PLÁTANO EN PELIGRO', {
      fontSize: '28px', fill: '#f5c518', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 20, 'Escapá del chorro. Llegá al subte.', {
      fontSize: '14px', fill: '#aaaaaa', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5);

    // Blinking "PRESS SPACE" prompt
    const prompt = this.add.text(cx, cy + 80, 'PRESIONÁ ESPACIO', {
      fontSize: '18px', fill: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0,
      duration: 600,
      yoyo: true,
      repeat: -1
    });

    // Hackathon branding
    this.add.text(cx, H - 24, 'Platanus Hackathon 2026', {
      fontSize: '11px', fill: '#555555', fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Input
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Game', { levelIndex: 0, score: 0, lives: 3 });
    });
  }
}
```

- [ ] **Step 2: Add Phaser game instantiation (temporary, scenes will grow)**

At the bottom of `game.js`, add:

```js
config.scene = [BootScene, MenuScene];
new Phaser.Game(config);
```

- [ ] **Step 3: Test in browser**

Open `http://localhost:8080`. Expected: banana image centered, title text, blinking SPACE prompt. Pressing Space should produce a console error about missing 'Game' scene — that's expected for now.

- [ ] **Step 4: Commit**

```bash
git add game.js
git commit -m "feat: add MenuScene with title and start prompt"
```

---

### Task 6: EnemyAI — BFS pathfinding class

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add EnemyAI class to `game.js` (before scene definitions)**

```js
class EnemyAI {
  /**
   * @param {number[][]} map - tile grid (T.WALL = impassable)
   * @param {number} cols
   * @param {number} rows
   */
  constructor(map, cols, rows) {
    this.map = map;
    this.cols = cols;
    this.rows = rows;
  }

  /**
   * Returns next [col, row] step toward target, or null if already there.
   * @param {number} fromCol
   * @param {number} fromRow
   * @param {number} toCol
   * @param {number} toRow
   * @param {boolean} flee - if true, move AWAY from target
   */
  nextStep(fromCol, fromRow, toCol, toRow, flee = false) {
    if (fromCol === toCol && fromRow === toRow) return null;

    const goal = flee ? this._fleeTarget(fromCol, fromRow, toCol, toRow) : [toCol, toRow];
    const path = this._bfs(fromCol, fromRow, goal[0], goal[1]);
    if (!path || path.length < 2) return null;
    return path[1]; // first step after origin
  }

  _bfs(sc, sr, tc, tr) {
    const key = (c, r) => `${c},${r}`;
    const queue = [[sc, sr]];
    const visited = new Set([key(sc, sr)]);
    const parent = new Map();

    while (queue.length) {
      const [c, r] = queue.shift();
      if (c === tc && r === tr) {
        // Reconstruct path
        const path = [];
        let cur = key(c, r);
        while (cur) {
          const [pc, pr] = cur.split(',').map(Number);
          path.unshift([pc, pr]);
          cur = parent.get(cur);
        }
        return path;
      }
      for (const [dc, dr] of [[0,-1],[0,1],[-1,0],[1,0]]) {
        const nc = c + dc, nr = r + dr;
        const k = key(nc, nr);
        if (nc >= 0 && nc < this.cols && nr >= 0 && nr < this.rows
            && this.map[nr][nc] !== T.WALL && !visited.has(k)) {
          visited.add(k);
          parent.set(k, key(c, r));
          queue.push([nc, nr]);
        }
      }
    }
    return null; // no path
  }

  /** Pick the tile farthest from the player using BFS distances */
  _fleeTarget(fc, fr, pc, pr) {
    const key = (c, r) => `${c},${r}`;
    const dist = new Map();
    const queue = [[pc, pr, 0]];
    dist.set(key(pc, pr), 0);

    while (queue.length) {
      const [c, r, d] = queue.shift();
      for (const [dc, dr] of [[0,-1],[0,1],[-1,0],[1,0]]) {
        const nc = c + dc, nr = r + dr;
        const k = key(nc, nr);
        if (nc >= 0 && nc < this.cols && nr >= 0 && nr < this.rows
            && this.map[nr][nc] !== T.WALL && !dist.has(k)) {
          dist.set(k, d + 1);
          queue.push([nc, nr, d + 1]);
        }
      }
    }

    // Find reachable tile farthest from player within 8 tiles of chorro
    let best = null, bestDist = -1;
    for (const [k, d] of dist.entries()) {
      const [c, r] = k.split(',').map(Number);
      const chorroD = Math.abs(c - fc) + Math.abs(r - fr);
      if (chorroD <= 8 && d > bestDist) { bestDist = d; best = [c, r]; }
    }
    return best || [fc, fr];
  }
}
```

- [ ] **Step 2: Verify BFS logic with a simple node test**

```bash
node -e "
const T = { FLOOR:0, WALL:1, PESO:2, CANA:3, EXIT:4, SPAWN:5, CHORRO:6 };
$(cat game.js | grep -A 80 'class EnemyAI')
const map = [
  [1,1,1,1,1],
  [1,0,0,0,1],
  [1,0,1,0,1],
  [1,0,0,0,1],
  [1,1,1,1,1],
];
const ai = new EnemyAI(map, 5, 5);
const step = ai.nextStep(1,1, 3,3, false);
console.log('Next step:', JSON.stringify(step)); // should be [1,2] or [2,1]
"
```
Expected: `Next step: [1,2]` or `Next step: [2,1]` (first step toward bottom-right).

- [ ] **Step 3: Commit**

```bash
git add game.js
git commit -m "feat: add EnemyAI BFS pathfinding class"
```

---

### Task 7: GameScene — map rendering

**Files:**
- Modify: `game.js`

`GameScene` receives `{ levelIndex, score, lives }` in its `init()` data.

- [ ] **Step 1: Add GameScene skeleton + `buildMap()` to `game.js`**

```js
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init(data) {
    this.levelIndex = data.levelIndex ?? 0;
    this.score = data.score ?? 0;
    this.lives = data.lives ?? 3;
    this.level = LEVELS[this.levelIndex];
    // Deep-copy the map so we can mutate it (eat pesos)
    this.mapData = this.level.map.map(row => [...row]);
  }

  preload() {} // assets already loaded in BootScene

  create() {
    this.buildMap();
    this.buildHUD();
    this.spawnPlayer();
    this.spawnEnemies();
    this.setupInput();
    this.scheduleAI();
  }

  buildMap() {
    this.wallGroup = this.physics.add.staticGroup();
    this.pesoGroup = this.physics.add.staticGroup();
    this.canaGroup = this.physics.add.staticGroup();
    this.exitGroup = this.physics.add.staticGroup();
    this.pesoCount = 0;
    this.chorroSpawns = [];
    this.playerSpawn = { col: 1, row: 1 };

    const g = this.add.graphics();

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * TILE + TILE / 2;
        const y = r * TILE + TILE / 2;
        const tile = this.mapData[r][c];

        if (tile === T.WALL) {
          // Draw wall tile
          g.fillStyle(0x2c3e50);
          g.fillRect(c * TILE, r * TILE, TILE, TILE);
          g.lineStyle(1, 0x1a252f);
          g.strokeRect(c * TILE, r * TILE, TILE, TILE);
          // Invisible static body for collision
          const wall = this.add.rectangle(x, y, TILE, TILE, 0x2c3e50);
          this.physics.add.existing(wall, true);
          this.wallGroup.add(wall);
        } else if (tile === T.PESO) {
          const dot = this.physics.add.image(x, y, 'peso').setScale(0.5);
          this.pesoGroup.add(dot);
          this.pesoCount++;
        } else if (tile === T.CANA) {
          const cana = this.physics.add.image(x, y, 'cana').setScale(0.8);
          this.canaGroup.add(cana);
        } else if (tile === T.EXIT) {
          const ex = this.add.rectangle(x, y, TILE, TILE, 0xf39c12);
          this.physics.add.existing(ex, true);
          this.exitGroup.add(ex);
        } else if (tile === T.SPAWN) {
          this.playerSpawn = { col: c, row: r };
        } else if (tile === T.CHORRO) {
          this.chorroSpawns.push({ col: c, row: r });
        }
      }
    }
  }
  // Remaining methods added in subsequent tasks
}
```

- [ ] **Step 2: Update scene list at bottom of `game.js`**

```js
config.scene = [BootScene, MenuScene, GameScene];
new Phaser.Game(config);
```

- [ ] **Step 3: Test in browser**

Press Space on menu. Expected: a dark maze with green peso dots visible, orange exit tiles at bottom center, walls rendered. Console errors about missing methods (`buildHUD`, `spawnPlayer`, etc.) are expected — add temporary stubs if Phaser crashes:

```js
buildHUD() {}
spawnPlayer() {}
spawnEnemies() {}
setupInput() {}
scheduleAI() {}
```

- [ ] **Step 4: Commit**

```bash
git add game.js
git commit -m "feat: GameScene map rendering with wall/peso/cana/exit groups"
```

---

### Task 8: GameScene — player (banana) movement

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add `spawnPlayer()`, `setupInput()`, and `update()` to `GameScene`**

```js
spawnPlayer() {
  const x = this.playerSpawn.col * TILE + TILE / 2;
  const y = this.playerSpawn.row * TILE + TILE / 2;
  this.player = this.physics.add.image(x, y, 'banana');
  this.player.setCollideWorldBounds(true);
  this.physics.add.collider(this.player, this.wallGroup);

  // Collect pesos
  this.physics.add.overlap(this.player, this.pesoGroup, (player, peso) => {
    peso.destroy();
    this.pesoCount--;
    this.score += 10;
    this.updateHUD();
  });

  // Collect cana power-up
  this.physics.add.overlap(this.player, this.canaGroup, (player, cana) => {
    cana.destroy();
    this.activateCana();
  });

  // Reach exit
  this.physics.add.overlap(this.player, this.exitGroup, () => {
    this.levelComplete();
  });
}

setupInput() {
  this.cursors = this.input.keyboard.createCursorKeys();
  this.wasd = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D
  });
  this._moveDir = { x: 0, y: 0 };
}

update() {
  if (!this.player || !this.player.active) return;

  const speed = 120;
  let vx = 0, vy = 0;

  if (this.cursors.left.isDown || this.wasd.left.isDown)  vx = -speed;
  if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;
  if (this.cursors.up.isDown || this.wasd.up.isDown)      vy = -speed;
  if (this.cursors.down.isDown || this.wasd.down.isDown)  vy = speed;

  // Normalize diagonal
  if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

  this.player.setVelocity(vx, vy);

  // Rotate banana to face direction
  if (vx !== 0 || vy !== 0) {
    this.player.setRotation(Math.atan2(vy, vx) + Math.PI / 2);
  }
}
```

- [ ] **Step 2: Test in browser**

Arrow keys / WASD should move the banana. Expected: banana moves, collides with walls, eats peso dots (they disappear), score increments (even if HUD isn't built yet — no crash).

- [ ] **Step 3: Commit**

```bash
git add game.js
git commit -m "feat: banana player movement, peso collection, exit overlap"
```

---

### Task 9: GameScene — HUD

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add `buildHUD()` and `updateHUD()` to `GameScene`**

```js
buildHUD() {
  // Semi-transparent HUD bar at top
  this.add.rectangle(W / 2, 12, W, 24, 0x000000, 0.7).setScrollFactor(0).setDepth(10);

  this.hudLives = this.add.text(8, 4, '', {
    fontSize: '14px', fill: '#e74c3c', fontFamily: 'monospace'
  }).setScrollFactor(0).setDepth(11);

  this.hudScore = this.add.text(W / 2, 4, '', {
    fontSize: '14px', fill: '#2ecc71', fontFamily: 'monospace'
  }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(11);

  this.hudLevel = this.add.text(W - 8, 4, '', {
    fontSize: '14px', fill: '#f39c12', fontFamily: 'monospace'
  }).setOrigin(1, 0).setScrollFactor(0).setDepth(11);

  this.hudCana = this.add.text(W / 2, H / 2 - 40, '¡CANA!', {
    fontSize: '36px', fill: '#2980b9', fontFamily: 'monospace', stroke: '#000', strokeThickness: 4
  }).setOrigin(0.5).setScrollFactor(0).setDepth(12).setVisible(false);

  this.updateHUD();
}

updateHUD() {
  this.hudLives.setText('♥'.repeat(this.lives));
  this.hudScore.setText(`$ ${this.score}`);
  this.hudLevel.setText(this.level.name.toUpperCase());
}
```

- [ ] **Step 2: Test in browser**

Expected: lives hearts, score, and level name visible at top. "¡CANA!" text invisible until power-up triggered.

- [ ] **Step 3: Commit**

```bash
git add game.js
git commit -m "feat: HUD with lives, score, level name"
```

---

### Task 10: GameScene — chorros (enemy spawning + AI movement)

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add `spawnEnemies()`, `scheduleAI()`, `moveEnemies()` to `GameScene`**

```js
spawnEnemies() {
  this.chorros = [];
  this.ai = new EnemyAI(this.mapData, COLS, ROWS);
  this.canaActive = false;

  const spawns = this.chorroSpawns.slice(0, this.level.chorroCount);
  spawns.forEach((spawn) => {
    const x = spawn.col * TILE + TILE / 2;
    const y = spawn.row * TILE + TILE / 2;
    const chorro = this.physics.add.image(x, y, 'chorro')
      .setDisplaySize(TILE, TILE);
    this.physics.add.collider(chorro, this.wallGroup);

    // Touch player → lose life
    this.physics.add.overlap(chorro, this.player, () => {
      if (this.canaActive) return; // immune while cana active
      this.loseLife();
    });

    this.chorros.push(chorro);
  });
}

scheduleAI() {
  this.aiTimer = this.time.addEvent({
    delay: this.level.aiInterval,
    callback: this.moveEnemies,
    callbackScope: this,
    loop: true
  });
}

moveEnemies() {
  if (!this.player || !this.player.active) return;

  const px = Math.floor(this.player.x / TILE);
  const py = Math.floor(this.player.y / TILE);

  this.chorros.forEach(chorro => {
    if (!chorro.active) return;
    const cx = Math.floor(chorro.x / TILE);
    const cy = Math.floor(chorro.y / TILE);
    const step = this.ai.nextStep(cx, cy, px, py, this.canaActive);
    if (!step) return;

    const [nc, nr] = step;
    const tx = nc * TILE + TILE / 2;
    const ty = nr * TILE + TILE / 2;
    const speed = this.level.chorroSpeed;
    const dx = tx - chorro.x;
    const dy = ty - chorro.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 2) {
      chorro.setVelocity((dx / dist) * speed, (dy / dist) * speed);
    } else {
      chorro.setVelocity(0, 0);
      chorro.setPosition(tx, ty);
    }
  });
}
```

- [ ] **Step 2: Test in browser**

Expected: chorros appear and pathfind toward the banana. They may clip through walls slightly — this is a known limitation of velocity-based movement on a tile grid and is acceptable for the hackathon.

- [ ] **Step 3: Commit**

```bash
git add game.js
git commit -m "feat: chorro enemy spawning and BFS-driven movement"
```

---

### Task 11: GameScene — cana power-up, lose life, level transitions

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add `activateCana()`, `loseLife()`, `levelComplete()` to `GameScene`**

```js
activateCana() {
  this.canaActive = true;

  // Swap chorro textures to scared version
  this.chorros.forEach(c => c.setTexture('chorro-scared'));

  // Flash HUD message
  this.hudCana.setVisible(true);
  this.tweens.add({
    targets: this.hudCana,
    alpha: 0,
    duration: 400,
    yoyo: true,
    repeat: 4,
    onComplete: () => this.hudCana.setVisible(false).setAlpha(1)
  });

  // Restore after duration
  this.time.delayedCall(this.level.canaPowerDuration, () => {
    this.canaActive = false;
    this.chorros.forEach(c => { if (c.active) c.setTexture('chorro'); });
  });
}

loseLife() {
  if (this._invincible) return;
  this._invincible = true;
  this.lives--;
  this.updateHUD();

  if (this.lives <= 0) {
    this.scene.start('GameOver', { levelIndex: this.levelIndex });
    return;
  }

  // Blink player, reset position
  this.tweens.add({
    targets: this.player,
    alpha: 0,
    duration: 150,
    yoyo: true,
    repeat: 5,
    onComplete: () => {
      this.player.setAlpha(1);
      this.player.setPosition(
        this.playerSpawn.col * TILE + TILE / 2,
        this.playerSpawn.row * TILE + TILE / 2
      );
      this._invincible = false;
    }
  });
}

levelComplete() {
  if (this._transitioning) return;
  this._transitioning = true;
  this.score += 500;

  const next = this.levelIndex + 1;
  this.aiTimer.remove();

  this.cameras.main.flash(500, 245, 176, 65);
  this.time.delayedCall(600, () => {
    if (next < LEVELS.length) {
      this.scene.start('Game', { levelIndex: next, score: this.score, lives: this.lives });
    } else {
      this.scene.start('Win', { score: this.score });
    }
  });
}
```

- [ ] **Step 2: Test all transitions in browser**

- Touch chorro → life lost, player blinks and resets
- Collect cana → chorros turn gray, flee for 5s, restore after
- Reach exit tiles → flash + advance to next level (or Win if level 3)
- Lose all lives → GameOver scene (will 404 until next task)

- [ ] **Step 3: Commit**

```bash
git add game.js
git commit -m "feat: cana power-up, lose life logic, level complete transitions"
```

---

### Task 12: GameOverScene and WinScene

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add GameOverScene to `game.js`**

```js
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) {
    this.levelIndex = data.levelIndex ?? 0;
  }

  create() {
    const cx = W / 2, cy = H / 2;
    this.add.rectangle(cx, cy, W, H, 0x1a0000);

    this.add.text(cx, cy - 60, '¡TE AFANARON!', {
      fontSize: '42px', fill: '#e74c3c', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(cx, cy, 'El chorro se llevó todo.', {
      fontSize: '16px', fill: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(0.5);

    const prompt = this.add.text(cx, cy + 70, 'ESPACIO para reintentar', {
      fontSize: '16px', fill: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.tweens.add({ targets: prompt, alpha: 0, duration: 600, yoyo: true, repeat: -1 });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Game', { levelIndex: this.levelIndex, score: 0, lives: 3 });
    });
  }
}
```

- [ ] **Step 2: Add WinScene to `game.js`**

```js
class WinScene extends Phaser.Scene {
  constructor() { super('Win'); }

  init(data) {
    this.finalScore = data.score ?? 0;
  }

  create() {
    const cx = W / 2, cy = H / 2;
    this.add.rectangle(cx, cy, W, H, 0x001a00);

    this.add.image(cx, cy - 90, 'banana').setScale(4);

    this.add.text(cx, cy - 20, '¡LLEGASTE AL SUBTE!', {
      fontSize: '32px', fill: '#2ecc71', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 30, `Puntaje final: $${this.finalScore}`, {
      fontSize: '22px', fill: '#f5c518', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 70, 'Salvaste los pesos. Por ahora.', {
      fontSize: '13px', fill: '#888888', fontFamily: 'monospace', fontStyle: 'italic'
    }).setOrigin(0.5);

    const prompt = this.add.text(cx, cy + 120, 'ESPACIO para jugar de nuevo', {
      fontSize: '15px', fill: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.tweens.add({ targets: prompt, alpha: 0, duration: 600, yoyo: true, repeat: -1 });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Menu');
    });
  }
}
```

- [ ] **Step 3: Register all scenes at bottom of `game.js`**

Replace the existing `config.scene` line:

```js
config.scene = [BootScene, MenuScene, GameScene, GameOverScene, WinScene];
new Phaser.Game(config);
```

- [ ] **Step 4: Full playthrough test**

Play through all 3 levels. Verify:
- Menu → Level 1 (Palermo) → Level 2 (Once) → Level 3 (La Boca) → Win screen
- Losing all lives shows GameOver, restarting level works
- Score carries across levels
- Lives carry across levels

- [ ] **Step 5: Commit**

```bash
git add game.js
git commit -m "feat: GameOverScene and WinScene, full scene flow complete"
```

---

### Task 13: Size audit and polish

**Files:**
- Modify: `game.js`, `index.html`

- [ ] **Step 1: Check file sizes**

```bash
wc -c game.js index.html
```
Expected: combined under 51200 bytes (50KB). If over, identify the largest functions and minify variable names in the map data arrays.

- [ ] **Step 2: Quick minification if needed**

If `game.js` is over 48KB, remove comments and blank lines:

```bash
# Check size without comments/blanks
grep -v '^\s*//' game.js | grep -v '^\s*$' | wc -c
```

If still tight, shorten map data with a helper:
```js
// Replace long T.WALL references with numbers directly — already done in LEVELS maps
```

- [ ] **Step 3: Test on a clean browser reload (no cache)**

```bash
# Hard reload in browser: Ctrl+Shift+R
```
Verify no missing asset errors, no console errors, full game playable.

- [ ] **Step 4: Final commit**

```bash
git add game.js index.html
git commit -m "chore: size audit and final polish"
```

---

### Task 14: Copy chorro image to project and verify submission package

**Files:**
- `hackathon.png` (already copied in Task 4)

- [ ] **Step 1: Verify project root contains all needed files**

```bash
ls -lh index.html game.js hackathon.png
```
Expected: all 3 files present.

- [ ] **Step 2: Zip for submission**

```bash
zip -r platano-en-peligro.zip index.html game.js hackathon.png
ls -lh platano-en-peligro.zip
```

- [ ] **Step 3: Final commit**

```bash
git add platano-en-peligro.zip
git commit -m "chore: add submission zip"
```
