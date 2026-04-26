// ═══════════════════════════════════════════════════════════════════════════
// PLÁTANO EN PELIGRO — Platanus Hackathon 2026
// ═══════════════════════════════════════════════════════════════════════════

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const TILE = 32;
const COLS = 20;
const ROWS = 16;
const W = COLS * TILE; // 640
const H = ROWS * TILE; // 512
const FONT = "'Press Start 2P', monospace";

const T = { FLOOR: 0, WALL: 1, PESO: 2, CANA: 3, EXIT: 4, SPAWN: 5, CHORRO: 6 };

const PALETTE = {
  bg: 0x0b0e14,
  wall: 0x2c3e50,
  wallEdge: 0x1a252f,
  banana: 0xf5c518,
  bananaDark: 0xc8a000,
  peso: 0x2ecc71,
  cana: 0x2980b9,
  canaLight: 0xecf0f1,
  chorro: 0xe74c3c,
  chorroScared: 0x3498db,
  chorroEyes: 0xffffff,
  exitLocked: 0x555555,
  exitOpen: 0xf39c12,
  hudBg: 0x000000,
  textPrimary: '#ffffff',
  textAccent: '#f5c518',
  textDim: '#888888',
  textDanger: '#e74c3c',
  textPeso: '#2ecc71',
  textCana: '#2980b9'
};

const LEVELS = [
  { name: 'Palermo', exit: 'Subte', chorroCount: 2, chorroSpeed: 90, aiInterval: 500, canaPowerDuration: 5000, map: [
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
  ]},
  { name: 'Once', exit: 'Colectivo', chorroCount: 3, chorroSpeed: 110, aiInterval: 350, canaPowerDuration: 5000, map: [
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
  ]},
  { name: 'La Boca', exit: 'Subte', chorroCount: 4, chorroSpeed: 110, aiInterval: 320, canaPowerDuration: 6000, map: [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,5,2,1,2,2,1,2,2,1,1,2,2,1,2,2,1,2,2,1],
    [1,2,2,1,2,1,1,2,1,1,1,1,2,1,1,2,1,2,2,1],
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
  ]}
];

// ─── STORE ──────────────────────────────────────────────────────────────────
// Cache síncrono respaldado por window.platanusArcadeStorage (async).
// Persiste high score / mute / CRT en el arcade, con fallback a localStorage
// para testing local cuando no hay puente del cabinet.
const Store = {
  _cache: {},
  _api: null,
  _keys: ['pp.highscore', 'pp.mute', 'pp.crt', 'pp.np'],
  async init(){
    this._api = (typeof window !== 'undefined' && window.platanusArcadeStorage) || null;
    for (const k of this._keys) {
      let v = null;
      if (this._api) {
        try { const r = await this._api.get(k); if (r && r.found) v = r.value; } catch {}
      } else {
        try { const raw = localStorage.getItem(k); if (raw != null) v = raw; } catch {}
      }
      if (v != null) this._cache[k] = v;
    }
  },
  _get(k, d){ return k in this._cache ? this._cache[k] : d; },
  _set(k, v){
    this._cache[k] = v;
    if (this._api) { try { this._api.set(k, v); } catch {} }
    else { try { localStorage.setItem(k, v); } catch {} }
  },
  getHighScore(){ return parseInt(this._get('pp.highscore','0'), 10) || 0; },
  setHighScore(n){ if (n > this.getHighScore()) this._set('pp.highscore', String(n)); },
  getMuted(){ return this._get('pp.mute','0') === '1'; },
  setMuted(b){ this._set('pp.mute', b ? '1' : '0'); },
  getCRT(){ return this._get('pp.crt','1') === '1'; },
  setCRT(b){ this._set('pp.crt', b ? '1' : '0'); },
  getNumPlayers(){ const n = parseInt(this._get('pp.np','1'), 10); return n === 2 ? 2 : 1; },
  setNumPlayers(n){ this._set('pp.np', n === 2 ? '2' : '1'); }
};

// ─── AUDIO ──────────────────────────────────────────────────────────────────
const Audio = {
  _ctx: null, _master: null, _musicTimer: null, _musicIdx: 0,
  init(){
    if (this._ctx) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this._ctx = new Ctx();
      this._master = this._ctx.createGain();
      this._master.gain.value = 0.35;
      this._master.connect(this._ctx.destination);
    } catch {}
  },
  resume(){
    this.init();
    if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume().catch(()=>{});
  },
  _env(osc, g, t, dur, vol){
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.start(t); osc.stop(t + dur + 0.02);
  },
  _beep(f, dur, type='square', vol=0.15){
    this.init(); if (!this._ctx) return;
    const t = this._ctx.currentTime;
    const o = this._ctx.createOscillator();
    const g = this._ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    o.connect(g); g.connect(this._master);
    this._env(o, g, t, dur, vol);
  },
  _slide(f1, f2, dur, type='square', vol=0.15){
    this.init(); if (!this._ctx) return;
    const t = this._ctx.currentTime;
    const o = this._ctx.createOscillator();
    const g = this._ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f1, t);
    o.frequency.linearRampToValueAtTime(f2, t + dur);
    o.connect(g); g.connect(this._master);
    this._env(o, g, t, dur, vol);
  },
  _noise(dur, vol=0.2){
    this.init(); if (!this._ctx) return;
    const t = this._ctx.currentTime;
    const size = Math.max(1, Math.floor(this._ctx.sampleRate * dur));
    const buf = this._ctx.createBuffer(1, size, this._ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < size; i++) d[i] = (Math.random()*2 - 1) * (1 - i/size);
    const src = this._ctx.createBufferSource();
    src.buffer = buf;
    const g = this._ctx.createGain();
    g.gain.value = vol;
    src.connect(g); g.connect(this._master);
    src.start(t);
  },
  sfx(name){
    switch(name){
      case 'pickup': this._slide(440, 880, 0.07, 'square', 0.12); break;
      case 'cana':
        this._beep(523, 0.09, 'square', 0.14);
        setTimeout(()=>this._beep(659, 0.09, 'square', 0.14), 90);
        setTimeout(()=>this._beep(784, 0.16, 'square', 0.14), 180);
        break;
      case 'death':
        this._slide(400, 80, 0.4, 'sawtooth', 0.2);
        this._noise(0.25, 0.15);
        break;
      case 'eat': this._slide(600, 1000, 0.12, 'triangle', 0.18); break;
      case 'levelup':
        [523, 659, 784, 1047].forEach((f,i)=>setTimeout(()=>this._beep(f, 0.12, 'square', 0.15), i*100));
        break;
      case 'win':
        [523, 659, 784, 1047, 1319, 1568].forEach((f,i)=>setTimeout(()=>this._beep(f, 0.16, 'square', 0.17), i*130));
        break;
      case 'menu': this._beep(700, 0.04, 'square', 0.1); break;
      case 'countdown_tick': this._beep(800, 0.08, 'square', 0.13); break;
      case 'countdown_go': this._beep(1200, 0.22, 'square', 0.17); break;
      case 'unlock':
        this._beep(600, 0.1, 'square', 0.14);
        setTimeout(()=>this._beep(900, 0.15, 'square', 0.14), 80);
        setTimeout(()=>this._beep(1200, 0.2, 'square', 0.14), 180);
        break;
    }
  },
  musicStart(){
    if (Store.getMuted()) return;
    if (this._musicTimer) return;
    this.init(); if (!this._ctx) return;
    const bass = [110, 110, 98, 98, 147, 147, 110, 98];
    const lead = [330, 415, 392, 330, 294, 349, 392, 440];
    const step = 340;
    this._musicIdx = 0;
    const tick = () => {
      if (Store.getMuted() || !this._musicTimer) return;
      const i = this._musicIdx % 8;
      this._beep(bass[i], step * 0.0007, 'sawtooth', 0.05);
      this._beep(lead[i], step * 0.0005, 'square', 0.035);
      this._musicIdx++;
    };
    this._musicTimer = setInterval(tick, step);
    tick();
  },
  musicStop(){
    if (this._musicTimer) { clearInterval(this._musicTimer); this._musicTimer = null; }
  },
  toggleMute(){
    const m = !Store.getMuted();
    Store.setMuted(m);
    if (m) this.musicStop(); else this.musicStart();
    return m;
  }
};

// ─── VFX ────────────────────────────────────────────────────────────────────
const VFX = {
  shake(scene, preset='medium'){
    const p = { light: [80, 0.004], medium: [180, 0.008], heavy: [360, 0.015] }[preset] || [180, 0.008];
    scene.cameras.main.shake(p[0], p[1]);
  },
  flashText(scene, text, x, y, opts={}){
    const t = scene.add.text(x, y, text, {
      fontFamily: FONT,
      fontSize: opts.size || '12px',
      color: opts.color || PALETTE.textPrimary,
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(60);
    scene.tweens.add({
      targets: t,
      y: y - (opts.rise || 24),
      alpha: 0,
      duration: opts.duration || 700,
      onComplete: () => t.destroy()
    });
    return t;
  },
  spawnParticles(scene, x, y, color, count=5){
    for (let i = 0; i < count; i++){
      const p = scene.add.rectangle(x, y, 3, 3, color).setDepth(25);
      const ang = Math.random() * Math.PI * 2;
      const spd = 28 + Math.random() * 36;
      scene.tweens.add({
        targets: p,
        x: x + Math.cos(ang) * spd,
        y: y + Math.sin(ang) * spd,
        alpha: 0,
        duration: 260 + Math.random() * 120,
        onComplete: () => p.destroy()
      });
    }
  },
  createCRT(scene){
    if (!scene.textures.exists('crt_lines')){
      const g = scene.make.graphics({x:0,y:0,add:false});
      g.fillStyle(0x000000, 0);
      g.fillRect(0, 0, 2, 2);
      g.fillStyle(0x000000, 0.28);
      g.fillRect(0, 1, 2, 1);
      g.generateTexture('crt_lines', 2, 2);
      g.destroy();
    }
    const scanlines = scene.add.tileSprite(W/2, H/2, W, H, 'crt_lines')
      .setDepth(100).setScrollFactor(0);
    const v = scene.add.graphics().setDepth(101).setScrollFactor(0);
    for (let i = 0; i < 12; i++){
      v.fillStyle(0x000000, 0.035);
      v.fillRect(0, 0, W, i * 3);
      v.fillRect(0, H - i * 3, W, i * 3);
      v.fillRect(0, 0, i * 3, H);
      v.fillRect(W - i * 3, 0, i * 3, H);
    }
    const on = Store.getCRT();
    scanlines.setVisible(on);
    v.setVisible(on);
    scene._crt = { scanlines, vignette: v };
    return scene._crt;
  },
  toggleCRT(scene){
    const on = !Store.getCRT();
    Store.setCRT(on);
    if (scene._crt){
      scene._crt.scanlines.setVisible(on);
      scene._crt.vignette.setVisible(on);
    }
    return on;
  }
};

// ─── PIXELART ───────────────────────────────────────────────────────────────
function generateTextures(scene){
  const g = scene.make.graphics({x:0,y:0,add:false});

  // Banana 32×32 — forma de media luna con cara
  g.clear();
  const BAN = PALETTE.banana;
  const BAND = PALETTE.bananaDark;
  const BANL = 0xfff099;      // highlight amarillo claro
  const BANS = 0x6b4a15;      // cabito marrón
  const BANS2 = 0x3d2808;     // cabito oscuro

  // Cabito (stem) arriba-derecha
  g.fillStyle(BANS2);
  g.fillRect(20, 2, 2, 2);
  g.fillStyle(BANS);
  g.fillRect(19, 3, 4, 2);
  g.fillRect(18, 5, 5, 1);

  // Cuerpo curvado (crescent) — franjas horizontales que dibujan una "C" inclinada
  g.fillStyle(BAN);
  g.fillRect(14, 6, 7, 2);
  g.fillRect(11, 8, 10, 2);
  g.fillRect(9, 10, 11, 2);
  g.fillRect(7, 12, 11, 2);
  g.fillRect(6, 14, 11, 2);
  g.fillRect(5, 16, 11, 2);
  g.fillRect(6, 18, 11, 2);
  g.fillRect(7, 20, 11, 2);
  g.fillRect(9, 22, 10, 2);
  g.fillRect(12, 24, 8, 1);
  g.fillRect(15, 25, 5, 1);
  g.fillRect(18, 26, 3, 1);

  // Sombra curva inferior/derecha (da volumen)
  g.fillStyle(BAND);
  g.fillRect(17, 10, 3, 1);
  g.fillRect(15, 12, 3, 1);
  g.fillRect(13, 14, 4, 1);
  g.fillRect(12, 16, 4, 1);
  g.fillRect(13, 18, 4, 1);
  g.fillRect(14, 20, 4, 1);
  g.fillRect(16, 22, 3, 1);
  // Puntita final (marrón)
  g.fillStyle(BANS);
  g.fillRect(19, 25, 2, 1);
  g.fillRect(20, 26, 1, 1);

  // Highlight superior/izquierda
  g.fillStyle(BANL);
  g.fillRect(12, 8, 3, 1);
  g.fillRect(10, 10, 3, 1);
  g.fillRect(8, 12, 3, 1);
  g.fillRect(7, 14, 2, 1);
  g.fillRect(6, 16, 2, 1);
  g.fillRect(7, 18, 2, 1);
  g.fillRect(8, 20, 2, 1);
  g.fillRect(10, 22, 2, 1);

  // Carita (en la parte más ancha, centro aproximado)
  g.fillStyle(0x000000);
  g.fillRect(9, 15, 2, 2);    // ojo izq
  g.fillRect(13, 15, 2, 2);   // ojo der
  g.fillRect(10, 19, 4, 1);   // boca (sonrisa)
  g.fillRect(11, 20, 2, 1);

  g.generateTexture('banana', 32, 32);

  // Peso 16×16
  g.clear();
  g.fillStyle(PALETTE.peso);
  g.fillCircle(8, 8, 7);
  g.fillStyle(0x145a32);
  g.fillCircle(8, 8, 5);
  g.fillStyle(PALETTE.peso);
  g.fillRect(7, 4, 2, 8);
  g.fillStyle(0x000000);
  g.fillRect(5, 5, 6, 2);
  g.fillRect(5, 9, 6, 2);
  g.fillRect(7, 4, 2, 8);
  g.generateTexture('peso', 16, 16);

  // Cana (gorra policía) 24×24
  g.clear();
  g.fillStyle(PALETTE.cana);
  g.fillRect(3, 7, 18, 9);    // cap body
  g.fillRect(1, 14, 22, 5);   // visor
  g.fillStyle(0x1b4f72);
  g.fillRect(1, 18, 22, 1);
  g.fillStyle(PALETTE.canaLight);
  g.fillRect(10, 9, 4, 4);    // badge
  g.fillStyle(PALETTE.cana);
  g.fillRect(11, 10, 2, 2);
  g.generateTexture('cana', 24, 24);

  // Heart 16×16
  g.clear();
  g.fillStyle(0xe74c3c);
  g.fillRect(3, 4, 3, 2);
  g.fillRect(10, 4, 3, 2);
  g.fillRect(2, 6, 12, 3);
  g.fillRect(3, 9, 10, 2);
  g.fillRect(4, 11, 8, 1);
  g.fillRect(5, 12, 6, 1);
  g.fillRect(6, 13, 4, 1);
  g.fillRect(7, 14, 2, 1);
  g.fillStyle(0xffffff);
  g.fillRect(4, 6, 2, 1);
  g.generateTexture('heart', 16, 16);

  // Chorro 24×24 — inspirado en la foto: gorra blanca, lentes negros, campera azul/blanca, fierro
  const drawChorro = (bodyBlue, accentWhite, skin, capColor) => {
    g.clear();
    // Gorra (visera hacia atrás)
    g.fillStyle(capColor);
    g.fillRect(7, 1, 10, 1);
    g.fillRect(6, 2, 12, 1);
    g.fillRect(5, 3, 14, 3);
    // Sombra/banda gorra
    g.fillStyle(0x7f8c8d);
    g.fillRect(5, 6, 14, 1);
    // Cara
    g.fillStyle(skin);
    g.fillRect(7, 7, 10, 5);
    g.fillRect(6, 8, 1, 3); // oreja izq
    g.fillRect(17, 8, 1, 3); // oreja der
    // Lentes negros (barra continua)
    g.fillStyle(0x0a0a0a);
    g.fillRect(7, 8, 10, 2);
    g.fillStyle(0x2c2c2c);
    g.fillRect(8, 8, 1, 1); // reflejo lente
    g.fillRect(13, 8, 1, 1);
    // Boca
    g.fillStyle(0x5d3a1a);
    g.fillRect(10, 11, 4, 1);
    // Cuello
    g.fillStyle(skin);
    g.fillRect(10, 12, 4, 1);
    // Campera base (azul)
    g.fillStyle(bodyBlue);
    g.fillRect(3, 13, 18, 9);
    // Stripes blancas laterales estilo tracksuit
    g.fillStyle(accentWhite);
    g.fillRect(3, 13, 2, 8);
    g.fillRect(19, 13, 2, 8);
    // Cierre central
    g.fillStyle(0x0d2850);
    g.fillRect(11, 13, 2, 9);
    // Detalle pecho (logo tipo swoosh)
    g.fillStyle(accentWhite);
    g.fillRect(14, 15, 3, 1);
    g.fillRect(15, 16, 2, 1);
    // Mano izquierda sosteniendo fierro
    g.fillStyle(skin);
    g.fillRect(1, 13, 2, 2);
    // Fierro (revólver apuntado arriba)
    g.fillStyle(0x1a1a1a);
    g.fillRect(0, 8, 2, 5);    // caño
    g.fillRect(0, 13, 3, 2);   // cuerpo
    g.fillRect(1, 15, 2, 2);   // empuñadura
    // Mano derecha apuntando al pecho
    g.fillStyle(skin);
    g.fillRect(20, 15, 2, 2);
    // Pantalones / piernas
    g.fillStyle(0x1a1a1a);
    g.fillRect(5, 22, 5, 2);
    g.fillRect(14, 22, 5, 2);
  };

  drawChorro(0x1a4c80, 0xffffff, 0xd4a574, 0xffffff);
  g.generateTexture('chorro', 24, 24);

  // Chorro asustado 24×24 — mismo diseño pero en tonos azulados + cara asustada
  drawChorro(0x2980b9, 0xaed6f1, 0xaed6f1, 0xd6eaf8);
  // Sobrescribir lentes → ojos asustados grandes blancos
  g.fillStyle(0xffffff);
  g.fillRect(7, 7, 4, 4);
  g.fillRect(13, 7, 4, 4);
  g.fillStyle(0x1a1a1a);
  g.fillRect(8, 8, 2, 2);
  g.fillRect(14, 8, 2, 2);
  // Boca zigzag asustado
  g.fillStyle(0x1a1a1a);
  g.fillRect(8, 11, 2, 1);
  g.fillRect(10, 10, 2, 1);
  g.fillRect(12, 11, 2, 1);
  g.fillRect(14, 10, 2, 1);
  g.generateTexture('chorro-scared', 24, 24);

  // Chorro eaten — solo ojos flotando
  g.clear();
  g.fillStyle(0xffffff);
  g.fillRect(5, 9, 5, 6);
  g.fillRect(14, 9, 5, 6);
  g.fillStyle(0x1a4c80);
  g.fillRect(7, 11, 2, 2);
  g.fillRect(16, 11, 2, 2);
  g.generateTexture('chorro-eyes', 24, 24);

  // Exit locked 32×32 (rejas)
  g.clear();
  g.fillStyle(PALETTE.exitLocked);
  g.fillRect(0, 0, 32, 32);
  g.fillStyle(0x222222);
  g.fillRect(0, 0, 32, 3);
  g.fillRect(0, 29, 32, 3);
  g.fillStyle(0x111111);
  for (let x = 3; x < 30; x += 5) g.fillRect(x, 3, 2, 26);
  g.generateTexture('exit-locked', 32, 32);

  // Exit open 32×32 (brillante)
  g.clear();
  g.fillStyle(PALETTE.exitOpen);
  g.fillRect(0, 0, 32, 32);
  g.fillStyle(0xfff2c0);
  g.fillRect(0, 0, 32, 3);
  g.fillRect(0, 29, 32, 3);
  g.fillStyle(0xffffff);
  g.fillRect(4, 10, 24, 3);
  g.fillRect(4, 19, 24, 3);
  g.fillStyle(PALETTE.exitOpen);
  g.fillRect(4, 13, 24, 1);
  g.fillRect(4, 18, 24, 1);
  g.generateTexture('exit-open', 32, 32);

  g.destroy();
}

// ─── AI ─────────────────────────────────────────────────────────────────────
class EnemyAI {
  constructor(map, cols, rows){
    this.map = map; this.cols = cols; this.rows = rows;
  }
  // Línea de visión: misma fila o columna, sin paredes entre medio, hasta maxDist tiles
  hasLOS(ec, er, pc, pr, maxDist=9){
    if (er === pr){
      const d = Math.abs(ec - pc); if (d > maxDist) return false;
      const minC = Math.min(ec,pc)+1, maxC = Math.max(ec,pc);
      for (let c = minC; c < maxC; c++) if (this.map[er][c] === T.WALL) return false;
      return true;
    }
    if (ec === pc){
      const d = Math.abs(er - pr); if (d > maxDist) return false;
      const minR = Math.min(er,pr)+1, maxR = Math.max(er,pr);
      for (let r = minR; r < maxR; r++) if (this.map[r][ec] === T.WALL) return false;
      return true;
    }
    return false;
  }
  // Vagabundeo: continúa en la misma dirección con prob. 0.65, gira al llegar a intersección
  nextStepWander(fc, fr, prevDir){
    const DIRS = [[0,-1],[0,1],[-1,0],[1,0]];
    const valid = DIRS.filter(([dc,dr]) => {
      const nc=fc+dc, nr=fr+dr;
      return nc>=0&&nc<this.cols&&nr>=0&&nr<this.rows&&this.map[nr][nc]!==T.WALL;
    });
    if (!valid.length) return null;
    const noRev = prevDir
      ? valid.filter(([dc,dr]) => !(dc===-prevDir[0]&&dr===-prevDir[1]))
      : valid;
    const pool = noRev.length ? noRev : valid;
    // continuar recto si es posible y la suerte lo dicta
    if (prevDir){
      const straight = valid.find(([dc,dr]) => dc===prevDir[0]&&dr===prevDir[1]);
      if (straight && Math.random() < 0.65) return [fc+straight[0], fr+straight[1]];
    }
    const [dc,dr] = pool[Math.floor(Math.random()*pool.length)];
    return [fc+dc, fr+dr];
  }
  nextStep(fc, fr, tc, tr, flee=false){
    if (fc === tc && fr === tr) return null;
    const goal = flee ? this._fleeTarget(fc, fr, tc, tr) : [tc, tr];
    const path = this._bfs(fc, fr, goal[0], goal[1]);
    if (!path || path.length < 2) return null;
    return path[1];
  }
  _bfs(sc, sr, tc, tr){
    const key = (c, r) => `${c},${r}`;
    const queue = [[sc, sr]];
    const visited = new Set([key(sc, sr)]);
    const parent = new Map();
    while (queue.length){
      const [c, r] = queue.shift();
      if (c === tc && r === tr){
        const path = [];
        let cur = key(c, r);
        while (cur){
          const [pc, pr] = cur.split(',').map(Number);
          path.unshift([pc, pr]);
          cur = parent.get(cur);
        }
        return path;
      }
      for (const [dc, dr] of [[0,-1],[0,1],[-1,0],[1,0]]){
        const nc = c + dc, nr = r + dr;
        const k = key(nc, nr);
        if (nc >= 0 && nc < this.cols && nr >= 0 && nr < this.rows
            && this.map[nr][nc] !== T.WALL && !visited.has(k)){
          visited.add(k);
          parent.set(k, key(c, r));
          queue.push([nc, nr]);
        }
      }
    }
    return null;
  }
  _fleeTarget(fc, fr, pc, pr){
    const key = (c, r) => `${c},${r}`;
    const dist = new Map();
    const queue = [[pc, pr, 0]];
    dist.set(key(pc, pr), 0);
    while (queue.length){
      const [c, r, d] = queue.shift();
      for (const [dc, dr] of [[0,-1],[0,1],[-1,0],[1,0]]){
        const nc = c + dc, nr = r + dr;
        const k = key(nc, nr);
        if (nc >= 0 && nc < this.cols && nr >= 0 && nr < this.rows
            && this.map[nr][nc] !== T.WALL && !dist.has(k)){
          dist.set(k, d + 1);
          queue.push([nc, nr, d + 1]);
        }
      }
    }
    let best = null, bestDist = -1;
    for (const [k, d] of dist.entries()){
      const [c, r] = k.split(',').map(Number);
      const chorroD = Math.abs(c - fc) + Math.abs(r - fr);
      if (chorroD <= 8 && d > bestDist){ bestDist = d; best = [c, r]; }
    }
    return best || [fc, fr];
  }
}

// ─── SCENES ─────────────────────────────────────────────────────────────────

// Global key bindings (M, C) se suscriben por escena
function bindGlobalKeys(scene){
  scene.input.keyboard.on('keydown-M', () => {
    const m = Audio.toggleMute();
    VFX.flashText(scene, m ? 'MUTE ON' : 'MUTE OFF', W/2, H/2, { color: PALETTE.textAccent, size: '14px' });
  });
  scene.input.keyboard.on('keydown-C', () => {
    const on = VFX.toggleCRT(scene);
    VFX.flashText(scene, on ? 'CRT ON' : 'CRT OFF', W/2, H/2, { color: PALETTE.textAccent, size: '14px' });
  });
}

class BootScene extends Phaser.Scene {
  constructor(){ super('Boot'); }
  preload(){
    // loading text (en caso de que font tarde)
    this.add.text(W/2, H/2, 'CARGANDO...', {
      fontFamily: 'monospace', fontSize: '16px', color: '#ffffff'
    }).setOrigin(0.5);
    // Billete real de 1000 pesos como pickup
    this.load.image('billete', 'Billete10002023.jpg');
    // Foto del chorro (enemigo real)
    this.load.image('chorro-photo', 'hackathon.png');
  }
  create(){
    generateTextures(this);
    // Esperar fuentes antes de pasar al Menu para que el primer render esté bien
    const go = () => this.scene.start('Menu');
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(go).catch(go);
    } else {
      go();
    }
  }
}

class MenuScene extends Phaser.Scene {
  constructor(){ super('Menu'); }
  create(){
    const cx = W/2;
    this.add.rectangle(cx, H/2, W, H, PALETTE.bg);

    // Banana logo más chica para dejar espacio al menú
    this.add.image(cx, 72, 'banana').setScale(2);

    this.add.text(cx, 122, 'PLÁTANO', {
      fontFamily: FONT, fontSize: '26px', color: PALETTE.textAccent,
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(cx, 154, 'EN PELIGRO', {
      fontFamily: FONT, fontSize: '26px', color: PALETTE.textAccent,
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(cx, 186, `HIGH SCORE: $${Store.getHighScore()}`, {
      fontFamily: FONT, fontSize: '10px', color: PALETTE.textPeso
    }).setOrigin(0.5);

    // Opciones
    this.selIdx = 0;
    this.numPlayers = Store.getNumPlayers();
    this.options = [
      { type: 'toggle' },
      { label: 'CAMPAÑA COMPLETA',      levelIndex: 0, mode: 'campaign' },
      { label: 'NIVEL 1 — PALERMO',     levelIndex: 0, mode: 'single'   },
      { label: 'NIVEL 2 — ONCE',        levelIndex: 1, mode: 'single'   },
      { label: 'NIVEL 3 — LA BOCA',     levelIndex: 2, mode: 'single'   }
    ];
    const startY = 230;
    const gap = 32;
    this.labels = this.options.map((o, i) => {
      const t = this.add.text(cx, startY + i * gap, '', {
        fontFamily: FONT, fontSize: '13px', color: PALETTE.textPrimary
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      t.on('pointerdown', () => {
        if (o.type === 'toggle'){
          this.numPlayers = this.numPlayers === 1 ? 2 : 1;
          Store.setNumPlayers(this.numPlayers);
          this.refresh();
          Audio.sfx('menu');
        } else {
          this.launch(i);
        }
      });
      t.on('pointerover', () => { this.selIdx = i; this.refresh(); Audio.sfx('menu'); });
      return t;
    });
    this.refresh();

    this.add.text(cx, H - 64, '↑↓ ELEGIR   ENTER/ESPACIO JUGAR', {
      fontFamily: FONT, fontSize: '8px', color: PALETTE.textDim
    }).setOrigin(0.5);
    this.add.text(cx, H - 46, 'JOYSTICK MOVER  ·  START PAUSA', {
      fontFamily: FONT, fontSize: '8px', color: PALETTE.textDim
    }).setOrigin(0.5);
    this.add.text(cx, H - 12, 'Platanus Hackathon 2026', {
      fontFamily: FONT, fontSize: '7px', color: PALETTE.textDim
    }).setOrigin(0.5);

    VFX.createCRT(this);
    bindGlobalKeys(this);

    // Unlock audio on first key
    this.input.keyboard.once('keydown', () => Audio.resume());

    const n = this.options.length;
    const togglePlayers = () => {
      this.numPlayers = this.numPlayers === 1 ? 2 : 1;
      Store.setNumPlayers(this.numPlayers);
      this.refresh();
      Audio.sfx('menu');
    };
    this.input.keyboard.on('keydown-UP',    () => { this.selIdx = (this.selIdx - 1 + n) % n; this.refresh(); Audio.sfx('menu'); });
    this.input.keyboard.on('keydown-DOWN',  () => { this.selIdx = (this.selIdx + 1) % n;     this.refresh(); Audio.sfx('menu'); });
    this.input.keyboard.on('keydown-W',     () => { this.selIdx = (this.selIdx - 1 + n) % n; this.refresh(); Audio.sfx('menu'); });
    this.input.keyboard.on('keydown-S',     () => { this.selIdx = (this.selIdx + 1) % n;     this.refresh(); Audio.sfx('menu'); });
    this.input.keyboard.on('keydown-LEFT',  () => { if (this.options[this.selIdx].type === 'toggle') togglePlayers(); });
    this.input.keyboard.on('keydown-RIGHT', () => { if (this.options[this.selIdx].type === 'toggle') togglePlayers(); });
    this.input.keyboard.on('keydown-A',     () => { if (this.options[this.selIdx].type === 'toggle') togglePlayers(); });
    this.input.keyboard.on('keydown-D',     () => { if (this.options[this.selIdx].type === 'toggle') togglePlayers(); });
    this.input.keyboard.on('keydown-ENTER', () => this.launch(this.selIdx));
    this.input.keyboard.on('keydown-SPACE', () => this.launch(this.selIdx));
  }
  refresh(){
    this.labels.forEach((l, i) => {
      const o = this.options[i];
      const selected = i === this.selIdx;
      const label = o.type === 'toggle'
        ? `JUGADORES ◄ ${this.numPlayers}P ► ${this.numPlayers === 2 ? '(WASD+FLECHAS)' : '(WASD/FLECHAS)'}`
        : o.label;
      l.setColor(selected ? PALETTE.textAccent : PALETTE.textPrimary);
      l.setText((selected ? '> ' : '  ') + label + (selected ? ' <' : '  '));
    });
  }
  launch(i){
    Audio.sfx('menu');
    const o = this.options[i];
    if (o.type === 'toggle'){
      // Enter/Space en la fila de toggle: arrancamos campaña con el modo actual
      const camp = this.options.find(opt => opt.mode === 'campaign');
      if (!camp) return;
      this.scene.start('Game', {
        levelIndex: camp.levelIndex,
        score: 0, lives: 3,
        source: 'new',
        mode: camp.mode,
        numPlayers: this.numPlayers
      });
      return;
    }
    this.scene.start('Game', {
      levelIndex: o.levelIndex,
      score: 0, lives: 3,
      source: 'new',
      mode: o.mode,
      numPlayers: this.numPlayers
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor(){ super('Game'); }

  init(data){
    this.levelIndex = data.levelIndex ?? 0;
    this.score = data.score ?? 0;
    this.lives = data.lives ?? 3;
    this.source = data.source ?? 'new';
    this.mode = data.mode ?? 'campaign';  // 'campaign' | 'single'
    this.numPlayers = data.numPlayers != null
      ? (data.numPlayers === 2 ? 2 : 1)
      : Store.getNumPlayers();
    this.scoreAtLevelStart = this.score;
    this.level = LEVELS[this.levelIndex];
    this.mapData = this.level.map.map(row => [...row]);

    this.phase = 'intro';
    this._invincible = false;
    this._transitioning = false;
    this.canaActive = false;
    this.canaRemainingMs = 0;
    this.canaTimer = null;
    this.comboCount = 0;
    this.comboTimer = null;
    this.exitUnlocked = false;
    this._blockedToastAt = 0;
    this.players = [];
    this._chaseReady = false;    // gracia al comenzar el nivel
    this._graceEnd = 0;
  }

  create(){
    this.buildMap();
    this.buildHUD();
    this.spawnPlayer();
    this.spawnEnemies();
    this.setupInput();
    VFX.createCRT(this);
    bindGlobalKeys(this);

    // AI timer always running; guarded by phase inside callback
    this.aiTimer = this.time.addEvent({
      delay: this.level.aiInterval,
      callback: this.moveEnemies, callbackScope: this, loop: true
    });

    this.physics.world.pause();
    this.showIntro(() => {
      this.phase = 'playing';
      this.physics.world.resume();
      Audio.musicStart();
      this.startGrace();
    });
  }

  startGrace(){
    const total = 5000;
    this._chaseReady = false;
    this._graceEnd = this.time.now + total;
    this._graceLabel = this.add.text(W/2, 32, 'VENTAJA 5', {
      fontFamily: FONT, fontSize: '11px', color: PALETTE.textAccent,
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(50);
    this.time.delayedCall(total, () => {
      this._chaseReady = true;
      if (this._graceLabel){ this._graceLabel.destroy(); this._graceLabel = null; }
      VFX.flashText(this, '¡AHÍ VIENEN!', W/2, H/2 - 40, {
        color: PALETTE.textDanger, size: '20px', duration: 900, rise: 30
      });
      VFX.shake(this, 'light');
    });
  }

  showIntro(done){
    const cx = W/2, cy = H/2;
    const title = this.add.text(cx, cy - 40, `NIVEL ${this.levelIndex + 1}`, {
      fontFamily: FONT, fontSize: '20px', color: PALETTE.textPrimary,
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(150);
    const name = this.add.text(cx, cy + 10, this.level.name.toUpperCase(), {
      fontFamily: FONT, fontSize: '28px', color: PALETTE.textAccent,
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(150);

    this.time.delayedCall(1000, () => {
      this.tweens.add({ targets: [title, name], alpha: 0, duration: 200,
        onComplete: () => { title.destroy(); name.destroy(); }
      });
      const seq = ['3','2','1','GO'];
      seq.forEach((s, i) => {
        this.time.delayedCall(200 + i * 400, () => {
          const t = this.add.text(cx, cy, s, {
            fontFamily: FONT,
            fontSize: s === 'GO' ? '48px' : '40px',
            color: s === 'GO' ? '#2ecc71' : PALETTE.textPrimary,
            stroke: '#000', strokeThickness: 4
          }).setOrigin(0.5).setDepth(150).setScale(0.5);
          this.tweens.add({
            targets: t, alpha: 0, scale: 2.2,
            duration: 380,
            onComplete: () => t.destroy()
          });
          Audio.sfx(s === 'GO' ? 'countdown_go' : 'countdown_tick');
        });
      });
      this.time.delayedCall(200 + seq.length * 400, done);
    });
  }

  buildMap(){
    this.wallGroup = this.physics.add.staticGroup();
    this.pesoGroup = this.physics.add.staticGroup();
    this.canaGroup = this.physics.add.staticGroup();
    this.exitGroup = this.physics.add.staticGroup();
    this.pesoCount = 0;
    this.pesoTotal = 0;
    this.chorroSpawns = [];
    this.playerSpawn = { col: 1, row: 1 };

    for (let r = 0; r < ROWS; r++){
      for (let c = 0; c < COLS; c++){
        const x = c * TILE + TILE/2;
        const y = r * TILE + TILE/2;
        const tile = this.mapData[r][c];
        if (tile === T.WALL){
          const wall = this.add.rectangle(x, y, TILE, TILE, PALETTE.wall)
            .setStrokeStyle(1, PALETTE.wallEdge);
          this.physics.add.existing(wall, true);
          this.wallGroup.add(wall);
        } else if (tile === T.PESO){
          const bill = this.pesoGroup.create(x, y, 'billete');
          bill.setDisplaySize(26, 11);
          bill.refreshBody();
          // Balanceo sutil (solo ángulo para no mover el body estático)
          this.tweens.add({
            targets: bill, angle: { from: -6, to: 6 },
            duration: 900 + Math.random() * 200,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
          });
          this.pesoCount++;
          this.pesoTotal++;
        } else if (tile === T.CANA){
          const cana = this.canaGroup.create(x, y, 'cana');
          // Pulso visual para que no se vea "estática"
          this.tweens.add({
            targets: cana,
            scale: { from: 1, to: 1.2 },
            alpha: { from: 1, to: 0.85 },
            duration: 520, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
          });
        } else if (tile === T.EXIT){
          this.exitGroup.create(x, y, 'exit-locked');
        } else if (tile === T.SPAWN){
          this.playerSpawn = { col: c, row: r };
        } else if (tile === T.CHORRO){
          this.chorroSpawns.push({ col: c, row: r });
        }
      }
    }
  }

  buildHUD(){
    this.add.rectangle(W/2, 12, W, 24, PALETTE.hudBg, 0.75).setDepth(10);
    // Lives as hearts
    this.heartSprites = [];
    for (let i = 0; i < 3; i++){
      const h = this.add.image(12 + i * 18, 12, 'heart').setDepth(11);
      this.heartSprites.push(h);
    }
    this.hudScore = this.add.text(W/2, 6, '', {
      fontFamily: FONT, fontSize: '10px', color: PALETTE.textPeso
    }).setOrigin(0.5, 0).setDepth(11);
    this.hudLevel = this.add.text(W - 8, 6, '', {
      fontFamily: FONT, fontSize: '10px', color: PALETTE.textAccent
    }).setOrigin(1, 0).setDepth(11);

    // Pesos counter (bottom)
    this.add.rectangle(W/2, H - 12, W, 24, PALETTE.hudBg, 0.75).setDepth(10);
    this.hudPesos = this.add.text(8, H - 16, '', {
      fontFamily: FONT, fontSize: '9px', color: PALETTE.textPrimary
    }).setDepth(11);

    // Cana bar
    this.canaBarBg = this.add.rectangle(W/2, H - 13, 204, 10, 0x000000)
      .setStrokeStyle(1, PALETTE.cana).setDepth(11).setVisible(false);
    this.canaBar = this.add.rectangle(W/2 - 100, H - 13, 200, 8, PALETTE.cana)
      .setOrigin(0, 0.5).setDepth(12).setVisible(false);
    this.hudCanaLabel = this.add.text(W - 8, H - 17, '', {
      fontFamily: FONT, fontSize: '9px', color: PALETTE.textCana
    }).setOrigin(1, 0).setDepth(12).setVisible(false);

    this.updateHUD();
  }

  updateHUD(){
    this.heartSprites.forEach((h, i) => h.setVisible(i < this.lives));
    this.hudScore.setText(`$ ${this.score}`);
    this.hudLevel.setText(this.level.name.toUpperCase());
    this.hudPesos.setText(`PESOS ${this.pesoTotal - this.pesoCount}/${this.pesoTotal}`);
  }

  spawnPlayer(){
    const baseCol = this.playerSpawn.col;
    const baseRow = this.playerSpawn.row;
    const offsets = [[0,0]];
    if (this.numPlayers === 2){
      // P2 spawn: vecino caminable, o mismo tile si no hay
      const cands = [[1,0],[-1,0],[0,1],[0,-1]];
      let off = [0,0];
      for (const [dc,dr] of cands){
        const nc = baseCol+dc, nr = baseRow+dr;
        if (nc>=0&&nc<COLS&&nr>=0&&nr<ROWS && this.mapData[nr][nc] !== T.WALL){
          off = [dc,dr]; break;
        }
      }
      offsets.push(off);
    }

    offsets.forEach((off, idx) => {
      const col = baseCol + off[0];
      const row = baseRow + off[1];
      const x = col * TILE + TILE/2;
      const y = row * TILE + TILE/2;
      const sprite = this.physics.add.image(x, y, 'banana');
      sprite.setCollideWorldBounds(true);
      sprite.body.setSize(24, 24);
      if (idx === 1) sprite.setTint(0x9ad0ff); // P2 azulado
      this.physics.add.collider(sprite, this.wallGroup);

      const player = { sprite, dir: null, nextDir: null, spawnCol: col, spawnRow: row, idx };
      this.players.push(player);

      this.physics.add.overlap(sprite, this.pesoGroup, (s, peso) => {
        peso.destroy();
        this.pesoCount--;
        this.comboCount++;
        const mult = Math.max(1, this.comboCount);
        this.score += 10 * mult;
        if (this.comboCount >= 2){
          VFX.flashText(this, `x${this.comboCount}`, s.x, s.y - 10, {
            color: PALETTE.textAccent, size: '10px', duration: 500
          });
        }
        if (this.comboTimer) this.comboTimer.remove();
        this.comboTimer = this.time.delayedCall(500, () => this.comboCount = 0);

        VFX.spawnParticles(this, peso.x, peso.y, PALETTE.peso, 5);
        Audio.sfx('pickup');

        if (this.pesoCount === 0) this.unlockExit();
        this.updateHUD();
      });

      this.physics.add.overlap(sprite, this.canaGroup, (s, cana) => {
        cana.destroy();
        this.activateCana();
      });

      this.physics.add.overlap(sprite, this.exitGroup, () => {
        if (!this.exitUnlocked){
          if (this.time.now - this._blockedToastAt > 1400){
            this._blockedToastAt = this.time.now;
            VFX.flashText(this, `FALTAN ${this.pesoCount} PESOS`, W/2, H/2, {
              color: PALETTE.textDanger, size: '16px', duration: 1200, rise: 10
            });
            VFX.shake(this, 'light');
          }
          return;
        }
        this.levelComplete();
      });
    });

    // Alias para código legacy
    this.player = this.players[0].sprite;
  }

  spawnEnemies(){
    this.chorros = [];
    this.ai = new EnemyAI(this.mapData, COLS, ROWS);
    const spawns = this.chorroSpawns.slice(0, this.level.chorroCount);
    spawns.forEach((sp) => {
      const x = sp.col * TILE + TILE/2;
      const y = sp.row * TILE + TILE/2;
      const chorro = this.physics.add.image(x, y, 'chorro-photo').setDisplaySize(30, 30);
      chorro.body.setSize(22, 22);
      chorro.spawnCol = sp.col;
      chorro.spawnRow = sp.row;
      chorro.eaten = false;
      chorro.aiState = 'wander';    // 'wander' | 'chase'
      chorro.wanderDir = null;      // [dc,dr] del último paso
      chorro.chaseTicks = 0;        // ticks de memoria tras perder LOS
      this.physics.add.collider(chorro, this.wallGroup);
      this.players.forEach(p => {
        this.physics.add.overlap(chorro, p.sprite, () => {
          if (!this._chaseReady) return;       // gracia: no dañan
          if (chorro.eaten) return;
          if (this.canaActive) this.eatChorro(chorro);
          else this.loseLife();
        });
      });
      this.chorros.push(chorro);
    });
    // Colisión entre chorros → no se montan uno encima del otro (antes parecía que uno desaparecía)
    this.physics.add.collider(this.chorros, this.chorros);
  }

  // Cambia apariencia del chorro según su estado
  setChorroLook(c, state){
    if (state === 'eaten'){
      c.setTexture('chorro-eyes');
      c.setDisplaySize(24, 24);
      c.clearTint();
    } else {
      c.setTexture('chorro-photo');
      c.setDisplaySize(30, 30);
      if (state === 'scared') c.setTint(0x3498db);
      else c.clearTint();
    }
  }

  setupInput(){
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    // En 1P, ambos sets controlan a P1. En 2P, P1=WASD, P2=flechas.
    this.players.forEach(p => {
      if (this.numPlayers === 2){
        p.controls = p.idx === 0 ? [this.wasd] : [this.cursors];
      } else {
        p.controls = [this.wasd, this.cursors];
      }
    });
    this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    this.input.keyboard.on('keydown-P', () => this.pauseGame());
    // START1 (Enter) en el cabinet — única tecla disponible para pausar
    this.input.keyboard.on('keydown-ENTER', () => this.pauseGame());
  }

  pauseGame(){
    if (this.phase !== 'playing') return;
    this.scene.pause();
    Audio.musicStop();
    this.scene.launch('Pause', {
      levelIndex: this.levelIndex,
      scoreAtLevelStart: this.scoreAtLevelStart
    });
  }

  moveEnemies(){
    if (this.phase !== 'playing') return;
    if (!this._chaseReady) return;
    if (!this.players || !this.players.length) return;

    this.chorros.forEach(chorro => {
      if (!chorro.active || chorro.eaten) return;
      const cx = Math.floor(chorro.x / TILE);
      const cy = Math.floor(chorro.y / TILE);
      const speed = this.canaActive ? this.level.chorroSpeed * 0.6 : this.level.chorroSpeed;

      // Elegir blanco: en LOS preferí al que ve; si no, el más cercano por Manhattan
      let target = null;
      let seesAny = false;
      for (const p of this.players){
        if (!p.sprite.active) continue;
        const tc = Math.floor(p.sprite.x / TILE);
        const tr = Math.floor(p.sprite.y / TILE);
        if (this.ai.hasLOS(cx, cy, tc, tr)){ target = { c: tc, r: tr }; seesAny = true; break; }
      }
      if (!target){
        let best = Infinity;
        for (const p of this.players){
          if (!p.sprite.active) continue;
          const tc = Math.floor(p.sprite.x / TILE);
          const tr = Math.floor(p.sprite.y / TILE);
          const d = Math.abs(tc - cx) + Math.abs(tr - cy);
          if (d < best){ best = d; target = { c: tc, r: tr }; }
        }
      }
      if (!target){ chorro.setVelocity(0, 0); return; }

      let step;
      if (this.canaActive){
        chorro.aiState = 'wander';
        chorro.chaseTicks = 0;
        step = this.ai.nextStep(cx, cy, target.c, target.r, true);
      } else {
        if (seesAny){
          chorro.aiState = 'chase';
          chorro.chaseTicks = 6;
        } else if (chorro.aiState === 'chase'){
          chorro.chaseTicks--;
          if (chorro.chaseTicks <= 0){ chorro.aiState = 'wander'; chorro.wanderDir = null; }
        }

        if (chorro.aiState === 'chase'){
          step = this.ai.nextStep(cx, cy, target.c, target.r, false);
        } else {
          step = this.ai.nextStepWander(cx, cy, chorro.wanderDir);
          if (step) chorro.wanderDir = [step[0]-cx, step[1]-cy];
        }
      }

      if (!step){ chorro.setVelocity(0, 0); return; }
      const [nc, nr] = step;
      const tx = nc * TILE + TILE/2, ty = nr * TILE + TILE/2;
      const dx = tx - chorro.x, dy = ty - chorro.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d > 1) chorro.setVelocity((dx/d)*speed, (dy/d)*speed);
      else chorro.setVelocity(0, 0);
    });
  }

  activateCana(){
    if (this.canaTimer){ this.canaTimer.remove(); this.canaTimer = null; }
    this.canaActive = true;
    this.canaRemainingMs = this.level.canaPowerDuration;
    this.chorros.forEach(c => { if (!c.eaten) this.setChorroLook(c, 'scared'); });
    Audio.sfx('cana');
    VFX.flashText(this, '¡CANA!', W/2, H/2 - 80, {
      color: PALETTE.textCana, size: '22px', duration: 900, rise: 30
    });
    this.canaTimer = this.time.delayedCall(this.level.canaPowerDuration, () => {
      this.canaActive = false;
      this.canaRemainingMs = 0;
      this.canaTimer = null;
      this.chorros.forEach(c => { if (c.active && !c.eaten) this.setChorroLook(c, 'normal'); });
    });
  }

  eatChorro(chorro){
    if (chorro.eaten) return;
    chorro.eaten = true;
    this.setChorroLook(chorro, 'eaten');
    chorro.setAlpha(0.85);
    chorro.body.checkCollision.none = true;
    chorro.setVelocity(0, 0);
    this.score += 200;
    this.updateHUD();
    VFX.flashText(this, '+200', chorro.x, chorro.y, {
      color: PALETTE.textAccent, size: '14px', duration: 600
    });
    VFX.spawnParticles(this, chorro.x, chorro.y, PALETTE.chorroScared, 6);
    Audio.sfx('eat');
    this.time.delayedCall(3000, () => {
      if (!chorro.active) return;
      chorro.setPosition(chorro.spawnCol * TILE + TILE/2, chorro.spawnRow * TILE + TILE/2);
      chorro.setAlpha(1);
      chorro.body.checkCollision.none = false;
      chorro.eaten = false;
      this.setChorroLook(chorro, this.canaActive ? 'scared' : 'normal');
    });
  }

  unlockExit(){
    if (this.exitUnlocked) return;
    this.exitUnlocked = true;
    Audio.sfx('unlock');
    this.exitGroup.getChildren().forEach(ex => {
      ex.setTexture('exit-open');
      this.tweens.add({
        targets: ex, scale: { from: 1, to: 1.15 },
        duration: 260, yoyo: true, repeat: -1
      });
    });
    VFX.flashText(this, '¡SALIDA ABIERTA!', W/2, H/2, {
      color: PALETTE.textAccent, size: '18px', duration: 1200, rise: 40
    });
  }

  loseLife(){
    if (this._invincible) return;
    this._invincible = true;
    this.lives--;
    this.updateHUD();
    Audio.sfx('death');
    VFX.shake(this, 'medium');

    if (this.lives <= 0){
      this.aiTimer && this.aiTimer.remove();
      Audio.musicStop();
      this.time.delayedCall(500, () => {
        this.scene.start('GameOver', {
          levelIndex: this.levelIndex,
          score: this.score,
          scoreAtLevelStart: this.scoreAtLevelStart
        });
      });
      return;
    }

    const sprites = this.players.map(p => p.sprite);
    this.tweens.add({
      targets: sprites, alpha: 0, duration: 140, yoyo: true, repeat: 5,
      onComplete: () => {
        this.players.forEach(p => {
          p.sprite.setAlpha(1);
          p.sprite.setPosition(p.spawnCol * TILE + TILE/2, p.spawnRow * TILE + TILE/2);
          p.sprite.setVelocity(0, 0);
          p.dir = null;
          p.nextDir = null;
        });
        this.chorros.forEach(c => {
          if (!c.active) return;
          c.setPosition(c.spawnCol * TILE + TILE/2, c.spawnRow * TILE + TILE/2);
          c.setVelocity(0, 0);
          // Resetear estado 'comido' si murieron con un chorro en ese estado
          c.eaten = false;
          c.setAlpha(1);
          c.body.checkCollision.none = false;
          this.setChorroLook(c, this.canaActive ? 'scared' : 'normal');
        });
        this._invincible = false;
      }
    });
  }

  levelComplete(){
    if (this._transitioning) return;
    this._transitioning = true;
    this.phase = 'ending';
    this.score += 500;
    this.updateHUD();
    if (this.aiTimer) this.aiTimer.remove();
    // Detener enemigos y jugador
    if (this.chorros) this.chorros.forEach(c => c.active && c.setVelocity(0, 0));
    if (this.players) this.players.forEach(p => p.sprite.setVelocity(0, 0));
    Audio.musicStop();
    VFX.shake(this, 'light');

    const next = this.levelIndex + 1;
    const isWin = this.mode === 'single' || next >= LEVELS.length;
    Audio.sfx(isWin ? 'win' : 'levelup');

    this.cameras.main.flash(500, 245, 200, 70);

    // Banner "NIVEL COMPLETADO"
    const banner = this.add.text(W/2, H/2 - 20, '¡NIVEL COMPLETADO!', {
      fontFamily: FONT, fontSize: '22px', color: PALETTE.textAccent,
      stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5).setDepth(200).setScale(0.2);
    this.tweens.add({
      targets: banner, scale: 1, duration: 260, ease: 'Back.easeOut'
    });
    this.add.text(W/2, H/2 + 18, `+500 BONUS · $${this.score}`, {
      fontFamily: FONT, fontSize: '11px', color: PALETTE.textPeso,
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(200);

    this.time.delayedCall(1500, () => {
      if (isWin) {
        this.scene.start('Win', { score: this.score });
      } else {
        this.scene.start('Game', {
          levelIndex: next, score: this.score, lives: this.lives,
          source: 'next', mode: this.mode, numPlayers: this.numPlayers
        });
      }
    });
  }

  _stepPlayer(p, time){
    const sprite = p.sprite;
    if (!sprite || !sprite.active) return;
    const speed = 130;

    // ── Input → dirección pedida (cardinal, sin diagonales) ───────
    let L = false, R = false, U = false, D = false;
    for (const c of p.controls){
      if (c.left.isDown)  L = true;
      if (c.right.isDown) R = true;
      if (c.up.isDown)    U = true;
      if (c.down.isDown)  D = true;
    }
    let pressed = null;
    if (L) pressed = 'L';
    if (R) pressed = 'R';
    if (U) pressed = 'U';
    if (D) pressed = 'D';
    if (pressed) p.nextDir = pressed;

    // ── Estado actual en grilla ───────────────────────────────────
    const px = sprite.x, py = sprite.y;
    const tc = Math.floor(px / TILE);
    const tr = Math.floor(py / TILE);
    const cx = tc * TILE + TILE/2;
    const cy = tr * TILE + TILE/2;
    const ALIGN = 5;
    const alignedX = Math.abs(px - cx) < ALIGN;
    const alignedY = Math.abs(py - cy) < ALIGN;

    const inBounds = (c, r) => c >= 0 && c < COLS && r >= 0 && r < ROWS;
    const canMove = (dir) => {
      let dc = 0, dr = 0;
      if (dir === 'L') dc = -1;
      else if (dir === 'R') dc = 1;
      else if (dir === 'U') dr = -1;
      else if (dir === 'D') dr = 1;
      const nc = tc + dc, nr = tr + dr;
      return inBounds(nc, nr) && this.mapData[nr][nc] !== T.WALL;
    };

    if (p.nextDir && p.nextDir !== p.dir) {
      const n = p.nextDir;
      const isReverse =
        (n === 'L' && p.dir === 'R') ||
        (n === 'R' && p.dir === 'L') ||
        (n === 'U' && p.dir === 'D') ||
        (n === 'D' && p.dir === 'U');
      const perpOk = (n === 'L' || n === 'R') ? alignedY : alignedX;
      if ((isReverse || p.dir === null || perpOk) && canMove(n)) {
        p.dir = n;
        if (n === 'L' || n === 'R') sprite.y = cy;
        else sprite.x = cx;
      }
    }

    if (p.dir && alignedX && alignedY && !canMove(p.dir)) {
      sprite.setPosition(cx, cy);
      sprite.setVelocity(0, 0);
      p.dir = null;
    }

    let vx = 0, vy = 0;
    if (p.dir === 'L') vx = -speed;
    else if (p.dir === 'R') vx = speed;
    else if (p.dir === 'U') vy = -speed;
    else if (p.dir === 'D') vy = speed;
    sprite.setVelocity(vx, vy);

    if (p.dir === 'L') sprite.setFlipX(true);
    else if (p.dir === 'R') sprite.setFlipX(false);

    const moving = p.dir !== null;
    sprite.setRotation(moving ? Math.sin(time / 70) * 0.18 : 0);
  }

  update(time, delta){
    if (this.phase !== 'playing') {
      this.players && this.players.forEach(p => p.sprite.setVelocity(0, 0));
      return;
    }
    if (!this.players || !this.players.length) return;

    this.players.forEach(p => this._stepPlayer(p, time));

    // Countdown de ventaja en HUD
    if (this._graceLabel){
      const s = Math.max(0, Math.ceil((this._graceEnd - this.time.now) / 1000));
      this._graceLabel.setText(`VENTAJA ${s}`);
    }

    // Cana remaining + HUD bar
    if (this.canaActive){
      this.canaRemainingMs = Math.max(0, this.canaRemainingMs - delta);
      const ratio = this.canaRemainingMs / this.level.canaPowerDuration;
      this.canaBarBg.setVisible(true);
      this.canaBar.setVisible(true);
      this.canaBar.width = 200 * ratio;
      this.hudCanaLabel.setText('CANA').setVisible(true);
    } else if (this.canaBar && this.canaBar.visible){
      this.canaBar.setVisible(false);
      this.canaBarBg.setVisible(false);
      this.hudCanaLabel.setVisible(false);
    }
  }
}

class PauseScene extends Phaser.Scene {
  constructor(){ super('Pause'); }
  init(data){
    this.levelIndex = data.levelIndex ?? 0;
    this.scoreAtLevelStart = data.scoreAtLevelStart ?? 0;
    this.selIdx = 0;
    this.options = [
      { label: 'REANUDAR',  action: 'resume' },
      { label: 'REINICIAR', action: 'retry'  },
      { label: 'MENÚ',      action: 'menu'   }
    ];
  }
  create(){
    this.add.rectangle(W/2, H/2, W, H, 0x000000, 0.75).setDepth(200);
    this.add.text(W/2, H/2 - 120, 'PAUSA', {
      fontFamily: FONT, fontSize: '28px', color: PALETTE.textAccent,
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(201);

    this.labels = this.options.map((o, i) => {
      const t = this.add.text(W/2, H/2 - 30 + i * 44, '', {
        fontFamily: FONT, fontSize: '14px', color: PALETTE.textPrimary
      }).setOrigin(0.5).setDepth(201).setInteractive({ useHandCursor: true });
      t.on('pointerdown', () => this.doAction(this.options[i].action));
      t.on('pointerover', () => { this.selIdx = i; this.refresh(); Audio.sfx('menu'); });
      return t;
    });
    this.refresh();

    this.input.keyboard.on('keydown-UP',    () => { this.selIdx = (this.selIdx - 1 + 3) % 3; this.refresh(); Audio.sfx('menu'); });
    this.input.keyboard.on('keydown-DOWN',  () => { this.selIdx = (this.selIdx + 1) % 3;     this.refresh(); Audio.sfx('menu'); });
    this.input.keyboard.on('keydown-W',     () => { this.selIdx = (this.selIdx - 1 + 3) % 3; this.refresh(); Audio.sfx('menu'); });
    this.input.keyboard.on('keydown-S',     () => { this.selIdx = (this.selIdx + 1) % 3;     this.refresh(); Audio.sfx('menu'); });
    this.input.keyboard.on('keydown-ENTER', () => this.doAction(this.options[this.selIdx].action));
    this.input.keyboard.on('keydown-SPACE', () => this.doAction(this.options[this.selIdx].action));
    this.input.keyboard.on('keydown-ESC',   () => this.doAction('resume'));
  }
  refresh(){
    this.labels.forEach((l, i) => {
      const selected = i === this.selIdx;
      l.setColor(selected ? PALETTE.textAccent : PALETTE.textPrimary);
      l.setText((selected ? '> ' : '  ') + this.options[i].label);
    });
  }
  doAction(a){
    Audio.sfx('menu');
    if (a === 'resume'){
      this.scene.stop();
      this.scene.resume('Game');
      Audio.musicStart();
    } else if (a === 'retry'){
      this.scene.stop();
      this.scene.stop('Game');
      this.scene.start('Game', {
        levelIndex: this.levelIndex, score: this.scoreAtLevelStart,
        lives: 3, source: 'retry'
      });
    } else if (a === 'menu'){
      this.scene.stop();
      this.scene.stop('Game');
      this.scene.start('Menu');
    }
  }
}

class GameOverScene extends Phaser.Scene {
  constructor(){ super('GameOver'); }
  init(data){
    this.levelIndex = data.levelIndex ?? 0;
    this.score = data.score ?? 0;
    this.scoreAtLevelStart = data.scoreAtLevelStart ?? 0;
  }
  create(){
    const cx = W/2, cy = H/2;
    this.add.rectangle(cx, cy, W, H, 0x1a0000);

    const prev = Store.getHighScore();
    const isNew = this.score > prev;
    if (isNew) Store.setHighScore(this.score);

    this.add.text(cx, cy - 100, '¡TE AFANARON!', {
      fontFamily: FONT, fontSize: '28px', color: PALETTE.textDanger,
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(cx, cy - 50, 'El chorro se llevó todo.', {
      fontFamily: FONT, fontSize: '10px', color: PALETTE.textDim
    }).setOrigin(0.5);

    this.add.text(cx, cy, `PUNTAJE: $${this.score}`, {
      fontFamily: FONT, fontSize: '14px', color: PALETTE.textAccent
    }).setOrigin(0.5);

    this.add.text(cx, cy + 30, isNew ? '¡NUEVO RÉCORD!' : `Récord: $${prev}`, {
      fontFamily: FONT, fontSize: '10px',
      color: isNew ? PALETTE.textAccent : PALETTE.textDim
    }).setOrigin(0.5);

    const prompt = this.add.text(cx, cy + 90, 'ESPACIO para volver al MENÚ', {
      fontFamily: FONT, fontSize: '12px', color: PALETTE.textPrimary
    }).setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    this.add.text(cx, cy + 130, 'Empezás de cero', {
      fontFamily: FONT, fontSize: '9px', color: PALETTE.textDim
    }).setOrigin(0.5);

    VFX.createCRT(this);
    bindGlobalKeys(this);

    const toMenu = () => this.scene.start('Menu');
    this.input.keyboard.once('keydown-SPACE', toMenu);
    this.input.keyboard.once('keydown-ENTER', toMenu);
  }
}

class WinScene extends Phaser.Scene {
  constructor(){ super('Win'); }
  init(data){ this.finalScore = data.score ?? 0; }
  create(){
    const cx = W/2, cy = H/2;
    this.add.rectangle(cx, cy, W, H, 0x001a0a);

    const prev = Store.getHighScore();
    const isNew = this.finalScore > prev;
    if (isNew) Store.setHighScore(this.finalScore);

    this.add.image(cx, cy - 120, 'banana').setScale(4);

    this.add.text(cx, cy - 40, '¡LLEGASTE AL SUBTE!', {
      fontFamily: FONT, fontSize: '22px', color: PALETTE.textPeso,
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(cx, cy + 10, `PUNTAJE FINAL: $${this.finalScore}`, {
      fontFamily: FONT, fontSize: '16px', color: PALETTE.textAccent
    }).setOrigin(0.5);

    this.add.text(cx, cy + 50, isNew ? '¡NUEVO RÉCORD!' : `Récord: $${prev}`, {
      fontFamily: FONT, fontSize: '11px',
      color: isNew ? PALETTE.textAccent : PALETTE.textDim
    }).setOrigin(0.5);

    this.add.text(cx, cy + 90, 'Salvaste los pesos. Por ahora.', {
      fontFamily: FONT, fontSize: '9px', color: PALETTE.textDim
    }).setOrigin(0.5);

    const prompt = this.add.text(cx, cy + 140, 'ESPACIO para jugar de nuevo', {
      fontFamily: FONT, fontSize: '12px', color: PALETTE.textPrimary
    }).setOrigin(0.5);
    this.tweens.add({ targets: prompt, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    VFX.createCRT(this);
    bindGlobalKeys(this);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Menu'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('Menu'));

    // Confetti minimal
    for (let i = 0; i < 30; i++){
      this.time.delayedCall(i * 40, () => {
        VFX.spawnParticles(this, Math.random() * W, -10,
          [PALETTE.banana, PALETTE.peso, PALETTE.cana, PALETTE.exitOpen][i % 4], 3);
      });
    }
  }
}

// ─── GAME INIT ──────────────────────────────────────────────────────────────
// El cabinet/dev-UI monta el juego en #game-root; en local usamos #game.
// Esperamos a que el DOM esté listo antes de chequear, porque el dev UI
// dispara initGame() desde el <head> antes de parsear el <body>.
const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  width: W,
  height: H,
  backgroundColor: '#0b0e14',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [BootScene, MenuScene, GameScene, PauseScene, GameOverScene, WinScene]
};

function _bootGame(){
  // Si #game-root no existe (modo local), creamos uno de respaldo dentro de #game o body.
  if (!document.getElementById('game-root')) {
    const host = document.getElementById('game') || document.body;
    const root = document.createElement('div');
    root.id = 'game-root';
    host.appendChild(root);
  }
  Store.init().finally(() => new Phaser.Game(config));
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _bootGame, { once: true });
} else {
  _bootGame();
}
