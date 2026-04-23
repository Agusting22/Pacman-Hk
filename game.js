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
