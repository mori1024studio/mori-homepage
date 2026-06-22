/* ── shared/particles.js ──────────────────────────────────────
   Mori 品牌粒子引擎（2D Canvas，輕量版）
   用法：在 </body> 前引入此檔，然後呼叫：
     MoriParticles.init('quiz')      // 測驗頁
     MoriParticles.init('article')   // 文章頁
     MoriParticles.init('homepage')  // 首頁補充星塵（Three.js 已有球體）
   ──────────────────────────────────────────────────────────── */

const MoriParticles = (() => {

  /* ── 三組預設參數 ── */
  const PRESETS = {
    homepage: {
      count: 7500, size: 0.3, speed: 2,   alpha: 1,   spread: 1,
      primary: '#C4A96A', secondary: '#FFFFFF', mix: 0.3,
      fog: 0.6, glow: 0.35, mode: 'float'
    },
    quiz: {
      count: 200,  size: 4,   speed: 2,   alpha: 1,   spread: 2,
      primary: '#C4A96A', secondary: '#FFFFFF', mix: 0.3,
      fog: 0.6, glow: 0.35, mode: 'float'
    },
    article: {
      count: 200,  size: 4,   speed: 2,   alpha: 1,   spread: 2,
      primary: '#C4A96A', secondary: '#FFFFFF', mix: 0.5,
      fog: 0.6, glow: 0.35, mode: 'float'
    }
  };

  let canvas, ctx, particles = [], raf, W, H, S = {};

  /* ── 工具 ── */
  function hexToRgb(hex) {
    return {
      r: parseInt(hex.slice(1,3),16),
      g: parseInt(hex.slice(3,5),16),
      b: parseInt(hex.slice(5,7),16)
    };
  }
  function mixColor(c1, c2, t) {
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t)
    };
  }

  /* ── 粒子生成 ── */
  function makeParticle(init) {
    const x = init ? Math.random() * W : (Math.random() < .5 ? -10 : W + 10);
    const y = init ? Math.random() * H : Math.random() * H;
    return {
      x: init ? W/2 + (x - W/2) * S.spread : x,
      y: init ? H/2 + (y - H/2) * S.spread : y,
      vx: (Math.random() - .5) * S.speed * 0.4,
      vy: S.mode === 'ground'
            ? -(Math.random() * S.speed * 0.8)
            : (Math.random() - .5) * S.speed * 0.3,
      size:  (0.4 + Math.random() * 0.8) * S.size,
      alpha: 0.1 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      freq:  0.003 + Math.random() * 0.008,
      mix:   Math.random()
    };
  }

  function initParticles() {
    particles = Array.from({ length: S.count }, () => makeParticle(true));
  }

  /* ── 調整視窗 ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  }

  /* ── 渲染循環 ── */
  let frame = 0;
  function draw() {
    raf = requestAnimationFrame(draw);
    frame++;
    ctx.clearRect(0, 0, W, H);

    /* 中心光暈 */
    if (S.glow > 0) {
      const g = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.min(W,H) * 0.55);
      g.addColorStop(0, `rgba(196,169,106,${S.glow * 0.18})`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }

    /* 頂部霧氣 */
    if (S.fog > 0) {
      const f = ctx.createLinearGradient(0, 0, 0, H * 0.5);
      f.addColorStop(0, `rgba(196,169,106,${S.fog * 0.06})`);
      f.addColorStop(1, 'transparent');
      ctx.fillStyle = f; ctx.fillRect(0, 0, W, H);
    }

    const c1 = hexToRgb(S.primary);
    const c2 = hexToRgb(S.secondary);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const drift = S.mode === 'drift' ? Math.sin(frame * .008 + p.phase) * 0.3 : 0;
      p.x += p.vx + drift;
      p.y += p.vy;
      if (S.mode === 'burst') { p.vx *= .995; p.vy *= .995; }

      /* 回收越界粒子 */
      if (p.x < -20 || p.x > W+20 || p.y < -20 || p.y > H+20) {
        particles[i] = makeParticle(false);
        continue;
      }

      const flicker = 0.65 + 0.35 * Math.sin(frame * p.freq * 60 + p.phase);
      const a = S.alpha * p.alpha * flicker;
      const col = mixColor(c1, c2, p.mix * S.mix);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * .5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${a})`;
      ctx.fill();
    }

    /* 暗邊遮罩 */
    const v = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*.28, W/2, H/2, Math.min(W,H)*.75);
    v.addColorStop(0, 'transparent');
    v.addColorStop(1, 'rgba(4,3,2,0.72)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
  }

  /* ── 公開 API ── */
  return {
    init(preset, overrides = {}) {
      const base = typeof preset === 'string' ? PRESETS[preset] : preset;
      if (!base) { console.warn('[MoriParticles] 未知 preset:', preset); return; }
      S = { ...base, ...overrides };

      /* 建立 canvas（若頁面已有 #particle-canvas 則複用） */
      canvas = document.getElementById('particle-canvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        Object.assign(canvas.style, {
          position: 'fixed', top: '0', left: '0',
          width: '100%', height: '100%',
          zIndex: '1', pointerEvents: 'none'
        });
        document.body.insertBefore(canvas, document.body.firstChild);
      }
      ctx = canvas.getContext('2d');

      resize();
      window.addEventListener('resize', resize);
      if (raf) cancelAnimationFrame(raf);
      draw();
    },

    stop() {
      if (raf) cancelAnimationFrame(raf);
    },

    /* 覆蓋參數（不重建粒子）*/
    set(overrides) {
      Object.assign(S, overrides);
    }
  };
})();
