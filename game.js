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
  physics: { default: 'arcade', arcade: { debug: false } },
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

class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init(data) {
    this.levelIndex = data.levelIndex ?? 0;
    this.score = data.score ?? 0;
    this.lives = data.lives ?? 3;
    this.level = LEVELS[this.levelIndex];
    this.mapData = this.level.map.map(row => [...row]);
  }

  preload() {}

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
          g.fillStyle(0x2c3e50);
          g.fillRect(c * TILE, r * TILE, TILE, TILE);
          g.lineStyle(1, 0x1a252f);
          g.strokeRect(c * TILE, r * TILE, TILE, TILE);
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

  buildHUD() {
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

  spawnPlayer() {
    const x = this.playerSpawn.col * TILE + TILE / 2;
    const y = this.playerSpawn.row * TILE + TILE / 2;
    this.player = this.physics.add.image(x, y, 'banana');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.wallGroup);

    this.physics.add.overlap(this.player, this.pesoGroup, (player, peso) => {
      peso.destroy();
      this.pesoCount--;
      this.score += 10;
      this.updateHUD();
    });

    this.physics.add.overlap(this.player, this.canaGroup, (player, cana) => {
      cana.destroy();
      this.activateCana();
    });

    this.physics.add.overlap(this.player, this.exitGroup, () => {
      this.levelComplete();
    });
  }

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

      this.physics.add.overlap(chorro, this.player, () => {
        if (this.canaActive) return;
        this.loseLife();
      });

      this.chorros.push(chorro);
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

  activateCana() {
    this.canaActive = true;

    this.chorros.forEach(c => c.setTexture('chorro-scared'));

    this.hudCana.setVisible(true);
    this.tweens.add({
      targets: this.hudCana,
      alpha: 0,
      duration: 400,
      yoyo: true,
      repeat: 4,
      onComplete: () => this.hudCana.setVisible(false).setAlpha(1)
    });

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

  update() {
    if (!this.player || !this.player.active) return;

    const speed = 120;
    let vx = 0, vy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown)  vx = -speed;
    if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;
    if (this.cursors.up.isDown || this.wasd.up.isDown)      vy = -speed;
    if (this.cursors.down.isDown || this.wasd.down.isDown)  vy = speed;

    if (vx !== 0 && vy !== 0) { vx *= 0.707; vy *= 0.707; }

    this.player.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      this.player.setRotation(Math.atan2(vy, vx) + Math.PI / 2);
    }
  }
}

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

config.scene = [BootScene, MenuScene, GameScene, GameOverScene, WinScene];
new Phaser.Game(config);
