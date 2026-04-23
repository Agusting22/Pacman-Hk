// game.js
const TILE = 32;
const COLS = 20;
const ROWS = 16;
const W = COLS * TILE; // 640
const H = ROWS * TILE; // 512

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

const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  backgroundColor: '#111',
  scene: [] // scenes added in later tasks
};

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
  g.fillRect(14, 10, 4, 12);
  g.fillRect(11, 12, 10, 3);
  g.fillRect(11, 17, 10, 3);
  g.generateTexture('peso', TILE, TILE);

  // ── Cana power-up 32×32 ──
  g.clear();
  g.fillStyle(0x2980b9);
  g.fillCircle(16, 16, 13);
  g.fillStyle(0xffffff);
  g.fillRect(13, 9, 3, 14);
  g.fillRect(13, 9, 9, 3);
  g.fillRect(13, 20, 9, 3);
  g.generateTexture('cana', TILE, TILE);

  // ── Chorro scared mode 32×32 ──
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
  g.generateTexture('exit', TILE * 2, TILE);

  g.destroy();
}

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

class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    const cx = W / 2, cy = H / 2;

    this.add.rectangle(cx, cy, W, H, 0x111111);
    this.add.image(cx, cy - 80, 'banana').setScale(3);

    this.add.text(cx, cy - 20, '🍌 PLÁTANO EN PELIGRO', {
      fontSize: '28px', fill: '#f5c518', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 20, 'Escapá del chorro. Llegá al subte.', {
      fontSize: '14px', fill: '#aaaaaa', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5);

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

    this.add.text(cx, H - 24, 'Platanus Hackathon 2026', {
      fontSize: '11px', fill: '#555555', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('Game', { levelIndex: 0, score: 0, lives: 3 });
    });
  }
}

config.scene = [BootScene, MenuScene];
new Phaser.Game(config);
