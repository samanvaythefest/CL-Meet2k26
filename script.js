/**
 * SAMANVAY 2027 — CL MEET | MET GALA COUTURE SCRIPT
 * Award-Level Creative Development, Paparazzi Flash Engine & 3-Step Accreditation
 */
import { submitDelegation } from './src/services/googleSheets.js';
import { SHUTTER_AUDIO_BASE64 } from './assets/audio/shutterBase64.js';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. PAPARAZZI FLASH ENGINE (REUSABLE STANDALONE MODULE)
     ========================================================================== */
  const Paparazzi = (() => {
    const canvas = document.getElementById('paparazzi-canvas');
    if (!canvas) return { fire: () => {}, burst: () => {}, ambient: () => {} };

    const ctx = canvas.getContext('2d');
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    let flashes = [];
    let isRunning = false;
    let ambientTimer = null;
    let isAmbientOn = false;
    let soundEnabled = true;
    let audioCtx = null;
    let lastCameraTimes = {};
    let fullScreenFlashesInLastSec = 0;
    let lastSecTimestamp = performance.now();

    // Configuration & Tuning HUD state
    const config = {
      intensity: 1.0,
      burstRate: 140, // ms between bursts
      spikeLength: 1.0,
      effectsMode: localStorage.getItem('samanvay_flash_mode') || 'full', // 'full' or 'reduced'
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // 360-Degree Comprehensive Press Pit & Paparazzi Matrix (All Sides & Corners of the Whole Web)
    const allSidesCameras = [
      // 1. TOP EDGE (Balcony & High Risers)
      { id: 'top-1', xRatio: 0.08, yRatio: 0.07, zone: 'top' },
      { id: 'top-2', xRatio: 0.22, yRatio: 0.05, zone: 'top' },
      { id: 'top-3', xRatio: 0.36, yRatio: 0.08, zone: 'top' },
      { id: 'top-4', xRatio: 0.50, yRatio: 0.04, zone: 'top' },
      { id: 'top-5', xRatio: 0.64, yRatio: 0.08, zone: 'top' },
      { id: 'top-6', xRatio: 0.78, yRatio: 0.05, zone: 'top' },
      { id: 'top-7', xRatio: 0.92, yRatio: 0.07, zone: 'top' },

      // 2. LEFT FLANK (Red Carpet Left Stanchions / Media Wall)
      { id: 'left-1', xRatio: 0.04, yRatio: 0.16, zone: 'left' },
      { id: 'left-2', xRatio: 0.07, yRatio: 0.30, zone: 'left' },
      { id: 'left-3', xRatio: 0.03, yRatio: 0.46, zone: 'left' },
      { id: 'left-4', xRatio: 0.08, yRatio: 0.60, zone: 'left' },
      { id: 'left-5', xRatio: 0.04, yRatio: 0.74, zone: 'left' },
      { id: 'left-6', xRatio: 0.07, yRatio: 0.86, zone: 'left' },

      // 3. RIGHT FLANK (Red Carpet Right Stanchions / Media Wall)
      { id: 'right-1', xRatio: 0.96, yRatio: 0.16, zone: 'right' },
      { id: 'right-2', xRatio: 0.93, yRatio: 0.30, zone: 'right' },
      { id: 'right-3', xRatio: 0.97, yRatio: 0.46, zone: 'right' },
      { id: 'right-4', xRatio: 0.92, yRatio: 0.60, zone: 'right' },
      { id: 'right-5', xRatio: 0.96, yRatio: 0.74, zone: 'right' },
      { id: 'right-6', xRatio: 0.93, yRatio: 0.86, zone: 'right' },

      // 4. BOTTOM EDGE (Front Press Pit Silhouette)
      { id: 'bottom-1', xRatio: 0.10, yRatio: 0.93, zone: 'bottom' },
      { id: 'bottom-2', xRatio: 0.24, yRatio: 0.90, zone: 'bottom' },
      { id: 'bottom-3', xRatio: 0.38, yRatio: 0.94, zone: 'bottom' },
      { id: 'bottom-4', xRatio: 0.50, yRatio: 0.88, zone: 'bottom' },
      { id: 'bottom-5', xRatio: 0.62, yRatio: 0.94, zone: 'bottom' },
      { id: 'bottom-6', xRatio: 0.76, yRatio: 0.90, zone: 'bottom' },
      { id: 'bottom-7', xRatio: 0.90, yRatio: 0.93, zone: 'bottom' },

      // 5. INNER CORNERS / MID PERIPHERY (Surrounding the central summons stage)
      { id: 'inner-tl', xRatio: 0.18, yRatio: 0.22, zone: 'corner' },
      { id: 'inner-tr', xRatio: 0.82, yRatio: 0.22, zone: 'corner' },
      { id: 'inner-ml', xRatio: 0.14, yRatio: 0.52, zone: 'corner' },
      { id: 'inner-mr', xRatio: 0.86, yRatio: 0.52, zone: 'corner' },
      { id: 'inner-bl', xRatio: 0.18, yRatio: 0.78, zone: 'corner' },
      { id: 'inner-br', xRatio: 0.82, yRatio: 0.78, zone: 'corner' }
    ];

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    }
    window.addEventListener('resize', resize);
    resize();

    /* ==========================================================================
       AUTHENTIC CAMERA SNAPSHOT SHUTTER AUDIO ENGINE (REAL RECORDING)
       ========================================================================== */
    let shutterAudioBuffer = null;
    let isDecodingAudio = false;

    // High-performance HTML5 Audio Pool for immediate zero-latency fallback
    const HTML5_POOL_SIZE = 8;
    const html5ShutterPool = [];
    for (let i = 0; i < HTML5_POOL_SIZE; i++) {
      const audio = new Audio(SHUTTER_AUDIO_BASE64);
      audio.preload = 'auto';
      html5ShutterPool.push(audio);
    }
    let html5PoolIndex = 0;

    function initAudio() {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) {
          audioCtx = new AudioClass();
        }
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Decode actual camera shutter audio buffer for WebAudio
      if (audioCtx && !shutterAudioBuffer && !isDecodingAudio) {
        isDecodingAudio = true;
        try {
          const base64Data = SHUTTER_AUDIO_BASE64.split(',')[1];
          const binaryStr = window.atob(base64Data);
          const len = binaryStr.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          audioCtx.decodeAudioData(
            bytes.buffer.slice(0),
            (decoded) => {
              shutterAudioBuffer = decoded;
              isDecodingAudio = false;
            },
            () => {
              isDecodingAudio = false;
            }
          );
        } catch (e) {
          isDecodingAudio = false;
        }
      }
    }

    function playShutterSound(xRatio = 0.5, hero = false) {
      if (!soundEnabled) return;

      // 1. WebAudio high-precision route (Stereo panning, micro-pitch variations)
      if (audioCtx && audioCtx.state === 'running' && shutterAudioBuffer) {
        try {
          const now = audioCtx.currentTime;
          const source = audioCtx.createBufferSource();
          source.buffer = shutterAudioBuffer;

          // Organic natural pitch shift between cameras in the press pit
          const pitch = hero ? 0.98 : (0.95 + Math.random() * 0.10);
          source.playbackRate.setValueAtTime(pitch, now);

          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(hero ? 0.65 : 0.42, now);

          if (audioCtx.createStereoPanner) {
            const panner = audioCtx.createStereoPanner();
            panner.pan.setValueAtTime(Math.max(-0.85, Math.min(0.85, (xRatio - 0.5) * 1.8)), now);
            source.connect(panner).connect(gain).connect(audioCtx.destination);
          } else {
            source.connect(gain).connect(audioCtx.destination);
          }

          source.start(now);
          return;
        } catch (e) {
          // Fall through to HTML5 audio pool
        }
      }

      // 2. Real Snapshot HTML5 Audio pool fallback
      try {
        const sound = html5ShutterPool[html5PoolIndex];
        html5PoolIndex = (html5PoolIndex + 1) % HTML5_POOL_SIZE;
        if (sound) {
          sound.currentTime = 0;
          sound.volume = hero ? 0.65 : 0.42;
          sound.play().catch(() => {});
        }
      } catch (e) {
        // Autoplay policy fallback
      }
    }

    // Piecewise intensity curve from Section 2.1:
    // 0 > 0.00 | 12 > 1.00 (attack) | 40 > 0.90 | 90 > 0.45 | 180 > 0.18 | 320 > 0.06 | 600 > 0.00
    function getFlashIntensity(tMs) {
      if (tMs <= 0) return 0;
      if (tMs < 12) return tMs / 12;
      if (tMs < 40) return 1.0 - ((tMs - 12) / 28) * 0.10;
      if (tMs < 90) return 0.90 - ((tMs - 40) / 50) * 0.45;
      if (tMs < 180) return 0.45 - ((tMs - 90) / 90) * 0.27;
      if (tMs < 320) return 0.18 - ((tMs - 180) / 140) * 0.12;
      if (tMs < 600) return 0.06 * (1.0 - (tMs - 320) / 280);
      return 0;
    }

    /* Single RequestAnimationFrame Loop */
    function animate(now) {
      if (!flashes.length) {
        ctx.clearRect(0, 0, width, height);
        isRunning = false;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const cx = width / 2;
      const cy = height / 2;

      // Retain active flashes
      flashes = flashes.filter(flash => {
        const elapsed = now - flash.startTime;
        if (elapsed > flash.duration) return false;

        const intensity = getFlashIntensity(elapsed) * flash.power * config.intensity;
        if (intensity <= 0.001) return true;

        const { x, y, hero, spikeAngles, spikeScale, ghostDiscs } = flash;

        // a) Core: tiny pure-white hot spot with bloom ring
        const coreRadius = (hero ? 18 : 10) * flash.power;
        const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, coreRadius);
        coreGrad.addColorStop(0, `rgba(255, 255, 255, ${Math.min(1, intensity * 1.2)})`);
        coreGrad.addColorStop(0.4, `rgba(255, 255, 255, ${Math.min(1, intensity * 0.85)})`);
        coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(x, y, coreRadius, 0, Math.PI * 2);
        ctx.fill();

        // b) Halo: Xenon color (5500K: white > warm #FFF3DC > cool #DCE8FF at 8% rim)
        const haloRadius = (hero ? 360 : 220) * flash.power;
        const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, haloRadius);
        haloGrad.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.95})`);
        haloGrad.addColorStop(0.25, `rgba(255, 243, 220, ${intensity * 0.7})`);
        haloGrad.addColorStop(0.7, `rgba(220, 232, 255, ${intensity * 0.25})`);
        haloGrad.addColorStop(1, 'rgba(220, 232, 255, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
        ctx.fill();

        // c) Starburst: 6 to 8 thin diffraction spikes at random rotation
        const spikeLen = (hero ? height * 0.24 : height * 0.14) * config.spikeLength * spikeScale;
        ctx.lineWidth = hero ? 2.2 : 1.4;
        spikeAngles.forEach(angle => {
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const x1 = x - cos * spikeLen;
          const y1 = y - sin * spikeLen;
          const x2 = x + cos * spikeLen;
          const y2 = y + sin * spikeLen;

          const spikeGrad = ctx.createLinearGradient(x1, y1, x2, y2);
          spikeGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          spikeGrad.addColorStop(0.45, `rgba(255, 243, 220, ${intensity * 0.85})`);
          spikeGrad.addColorStop(0.5, `rgba(255, 255, 255, ${intensity})`);
          spikeGrad.addColorStop(0.55, `rgba(220, 232, 255, ${intensity * 0.85})`);
          spikeGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.strokeStyle = spikeGrad;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        });

        // d) Lens Ghosts: 2 to 3 aperture discs along vector through center
        ghostDiscs.forEach(ghost => {
          const gx = x + (cx - x) * ghost.pos;
          const gy = y + (cy - y) * ghost.pos;
          const gr = ghost.radius * flash.power;

          const ghostGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
          ghostGrad.addColorStop(0, `rgba(220, 235, 255, ${intensity * 0.15})`);
          ghostGrad.addColorStop(0.8, `rgba(255, 215, 140, ${intensity * 0.08})`);
          ghostGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = ghostGrad;
          ctx.beginPath();
          ctx.arc(gx, gy, gr, 0, Math.PI * 2);
          ctx.fill();
        });

        // e) Veiling Glare: low-contrast soft wash lifting blacks for ~150ms
        if (elapsed < 160) {
          const glareAlpha = (1 - elapsed / 160) * 0.08 * flash.power * (hero ? 1.5 : 1);
          ctx.fillStyle = `rgba(255, 250, 240, ${glareAlpha})`;
          ctx.fillRect(0, 0, width, height);
        }

        // f) Afterimage: from 60ms, dim blurred greenish-purple blotch fading over 900ms
        if (elapsed > 60 && elapsed < 960) {
          const afterAlpha = (1 - (elapsed - 60) / 900) * 0.09;
          const afterGrad = ctx.createRadialGradient(x, y, 0, x, y, 70);
          afterGrad.addColorStop(0, `rgba(42, 75, 58, ${afterAlpha})`);
          afterGrad.addColorStop(1, 'rgba(42, 75, 58, 0)');
          ctx.fillStyle = afterGrad;
          ctx.beginPath();
          ctx.arc(x, y, 70, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      });

      requestAnimationFrame(animate);
    }

    function fire({ x, y, power = 1.0, hero = false, side, isAmbient = false } = {}) {
      // Respect Reduced Motion & Safety Settings
      if (config.prefersReducedMotion || config.effectsMode === 'reduced') {
        power = Math.min(power, 0.4);
      }

      // Photosensitivity WCAG 2.3.1 Guard: Cap full-screen flashes to max 3 per second
      const now = performance.now();
      if (now - lastSecTimestamp > 1000) {
        fullScreenFlashesInLastSec = 0;
        lastSecTimestamp = now;
      }
      if (hero) {
        if (fullScreenFlashesInLastSec >= 3) {
          hero = false;
          power = 0.5;
        } else {
          fullScreenFlashesInLastSec++;
        }
      }

      // If specific (x, y) not given, pick intelligently across sides of the whole web
      let xRatio = 0.5;
      if (x === undefined || y === undefined) {
        let candidates = allSidesCameras;
        if (side) {
          candidates = allSidesCameras.filter(c => c.zone === side);
          if (!candidates.length) candidates = allSidesCameras;
        }

        const cam = candidates[Math.floor(Math.random() * candidates.length)];
        x = cam.xRatio * width + (Math.random() * 40 - 20);
        y = cam.yRatio * height + (Math.random() * 30 - 15);
        xRatio = cam.xRatio;
      } else {
        xRatio = x / width;
      }

      // Shutter Sound: ONLY played during envelope opening bursts and deliberate interactions.
      // Ambient background flashes are 100% silent so users can read and fill forms undisturbed.
      if (!isAmbient) {
        playShutterSound(xRatio, hero);
      }

      // Starburst angles (6-8 spikes at random rotation)
      const spikeCount = hero ? 8 : 6;
      const baseAngle = Math.random() * Math.PI;
      const spikeAngles = [];
      for (let i = 0; i < spikeCount; i++) {
        spikeAngles.push(baseAngle + (i * Math.PI) / spikeCount + (Math.random() * 0.1 - 0.05));
      }

      // Anamorphic lens ghost reflections directed toward center
      const ghostDiscs = [
        { pos: 0.35 + Math.random() * 0.1, radius: 25 + Math.random() * 15 },
        { pos: 0.65 + Math.random() * 0.15, radius: 45 + Math.random() * 20 }
      ];

      flashes.push({
        x,
        y,
        power,
        hero,
        startTime: performance.now(),
        duration: hero ? 780 : 620,
        spikeAngles,
        spikeScale: 1.0,
        ghostDiscs
      });

      // Quick ambient flash flare on hero flash
      if (hero) {
        const ambFlash = document.getElementById('camera-flash');
        if (ambFlash) {
          gsap.timeline()
            .to(ambFlash, { opacity: 0.18, duration: 0.04, ease: 'power2.in' })
            .to(ambFlash, { opacity: 0, duration: 0.22, ease: 'power2.out' });
        }
      }

      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(animate);
      }
    }

    // Distribute the flashes systematically across ALL sides of the whole web
    function burst(count = 14, durationMs = 2800) {
      // Alternating sequence ensuring consecutive flashes hit opposing sides:
      // Top -> Bottom -> Left -> Right -> Corner -> Top -> Right -> Bottom -> Left -> etc.
      const sideCycle = ['top', 'bottom', 'left', 'right', 'corner', 'top', 'right', 'bottom', 'left', 'corner'];

      for (let i = 0; i < count; i++) {
        const delay = (i / count) * (durationMs - 220) + (Math.random() * 80 - 40);
        const isHero = i === count - 1 || (count > 8 && (i === Math.floor(count * 0.35) || i === Math.floor(count * 0.7)));
        const targetSide = sideCycle[i % sideCycle.length];

        setTimeout(() => {
          fire({
            side: targetSide,
            power: isHero ? (1.35 + Math.random() * 0.35) : (0.65 + Math.random() * 0.5),
            hero: isHero
          });
        }, Math.max(0, delay));
      }
    }

    // Ambient mode: strictly minimum, soft, and 100% silent across the page
    function ambient(on = true) {
      isAmbientOn = on;
      if (ambientTimer) {
        clearTimeout(ambientTimer);
        ambientTimer = null;
      }
      if (!on) return;

      function scheduleNextAmbient() {
        if (!isAmbientOn || document.hidden) return;
        // User requested: "Keep it Very Very Minimum and Keep a Very low Sound AFteer or Do not Keep the Sound"
        // Silent and sparse (every 45s to 75s) with soft flare
        const interval = 45000 + Math.random() * 30000;
        const sides = ['top', 'bottom', 'left', 'right'];
        const chosenSide = sides[Math.floor(Math.random() * sides.length)];

        ambientTimer = setTimeout(() => {
          if (isAmbientOn && !document.hidden) {
            fire({
              side: chosenSide,
              power: 0.35 + Math.random() * 0.25,
              hero: false,
              isAmbient: true // Guarantees zero shutter sound
            });
            scheduleNextAmbient();
          }
        }, interval);
      }
      scheduleNextAmbient();
    }

    // Pause ambient flashing when browser tab is inactive
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (ambientTimer) clearTimeout(ambientTimer);
      } else if (isAmbientOn) {
        ambient(true);
      }
    });

    return {
      fire,
      burst,
      ambient,
      init: () => {
        // Attach user gesture listeners anywhere to unlock audio context & pre-decode real shutter audio
        const unlock = () => {
          initAudio();
          window.removeEventListener('click', unlock);
          window.removeEventListener('keydown', unlock);
          window.removeEventListener('touchstart', unlock);
          window.removeEventListener('pointerdown', unlock);
        };
        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('keydown', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });
        window.addEventListener('pointerdown', unlock, { once: true });
      },
      toggleSound: () => {
        initAudio();
        soundEnabled = !soundEnabled;
        return soundEnabled;
      },
      toggleEffects: () => {
        config.effectsMode = config.effectsMode === 'full' ? 'reduced' : 'full';
        localStorage.setItem('samanvay_flash_mode', config.effectsMode);
        return config.effectsMode;
      },
      setIntensity: (val) => { config.intensity = parseFloat(val); },
      setBurstRate: (val) => { config.burstRate = parseInt(val, 10); },
      setSpikeLength: (val) => { config.spikeLength = parseFloat(val); },
      getConfig: () => ({ ...config, soundEnabled })
    };
  })();

  Paparazzi.init();

  /* ==========================================================================
     2. CONCIERGE TOP UTILITY CONTROLS & PAPARAZZI HUD PANEL
     ========================================================================== */
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');
  const flashToggleBtn = document.getElementById('flash-toggle-btn');
  const flashModeText = document.getElementById('flash-mode-text');
  const debugToggleBtn = document.getElementById('debug-toggle-btn');
  const paparazziHud = document.getElementById('paparazzi-hud');
  const closeHudBtn = document.getElementById('close-hud-btn');

  if (soundToggleBtn) {
    if (soundIcon) soundIcon.textContent = '🔊';
    if (soundText) soundText.textContent = 'Sound On';
    soundToggleBtn.classList.add('active');

    soundToggleBtn.addEventListener('click', () => {
      const isSoundOn = Paparazzi.toggleSound();
      if (soundIcon) soundIcon.textContent = isSoundOn ? '🔊' : '🔇';
      if (soundText) soundText.textContent = isSoundOn ? 'Sound On' : 'Sound Off';
      soundToggleBtn.classList.toggle('active', isSoundOn);
    });
  }

  if (flashToggleBtn) {
    flashToggleBtn.addEventListener('click', () => {
      const mode = Paparazzi.toggleEffects();
      if (flashModeText) flashModeText.textContent = `Flash: ${mode === 'full' ? 'Full' : 'Reduced'}`;
      flashToggleBtn.classList.toggle('active', mode === 'full');
    });
  }

  if (debugToggleBtn && paparazziHud) {
    debugToggleBtn.addEventListener('click', () => {
      const isVisible = paparazziHud.style.display !== 'none';
      paparazziHud.style.display = isVisible ? 'none' : 'block';
    });
  }

  if (closeHudBtn && paparazziHud) {
    closeHudBtn.addEventListener('click', () => {
      paparazziHud.style.display = 'none';
    });
  }

  // HUD Interactive Sliders
  const hudIntensity = document.getElementById('hud-intensity');
  const valIntensity = document.getElementById('val-intensity');
  if (hudIntensity) {
    hudIntensity.addEventListener('input', (e) => {
      Paparazzi.setIntensity(e.target.value);
      if (valIntensity) valIntensity.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
    });
  }

  const hudBurstRate = document.getElementById('hud-burst-rate');
  const valBurstRate = document.getElementById('val-burst-rate');
  if (hudBurstRate) {
    hudBurstRate.addEventListener('input', (e) => {
      Paparazzi.setBurstRate(e.target.value);
      if (valBurstRate) valBurstRate.textContent = `${e.target.value}ms`;
    });
  }

  const hudSpikeLen = document.getElementById('hud-spike-len');
  const valSpikeLen = document.getElementById('val-spike-len');
  if (hudSpikeLen) {
    hudSpikeLen.addEventListener('input', (e) => {
      Paparazzi.setSpikeLength(e.target.value);
      if (valSpikeLen) valSpikeLen.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
    });
  }

  const hudFireSolo = document.getElementById('hud-fire-solo');
  if (hudFireSolo) {
    hudFireSolo.addEventListener('click', () => {
      Paparazzi.fire({ power: 1.2, hero: true });
    });
  }

  const hudFireBurst = document.getElementById('hud-fire-burst');
  if (hudFireBurst) {
    hudFireBurst.addEventListener('click', () => {
      Paparazzi.burst(8, 2200);
    });
  }

  /* ==========================================================================
     3. CUSTOM COUTURE CURSOR (DESKTOP)
     ========================================================================== */
  const cursorRing = document.getElementById('cursor-ring');
  const cursorDot = document.getElementById('cursor-dot');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  document.querySelectorAll('button, a, input, select, textarea, .envelope-3d, .evening-card').forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ==========================================================================
     4. PRELOADER: "THE MET GALA ROYAL REVEAL" (SWIFT HAUTE COUTURE UNVEILING)
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  const preloaderMedallion = document.getElementById('preloader-medallion');
  const filamentFill = document.getElementById('preloader-filament-fill');

  let preloaderDismissed = false;
  function dismissPreloader() {
    if (preloaderDismissed || !preloader || preloader.style.display === 'none') return;
    preloaderDismissed = true;
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        Paparazzi.fire({ power: 0.9, hero: false });
      }
    });
  }

  // Tap anywhere to skip instantly
  if (preloader) {
    preloader.addEventListener('click', dismissPreloader);
    preloader.addEventListener('touchend', dismissPreloader, { passive: true });
  }

  // Swift, fluid ~0.9s unveil timeline
  const preloaderTL = gsap.timeline({
    onComplete: dismissPreloader
  });

  if (preloaderMedallion) {
    preloaderTL.fromTo(preloaderMedallion,
      { scale: 0.82, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' }
    );
  }

  if (filamentFill) {
    preloaderTL.to(filamentFill, {
      width: '100%',
      duration: 0.65,
      ease: 'power2.inOut'
    }, '-=0.15');
  }

  // Settle & hold briefly before smooth fadeout
  preloaderTL.to({}, { duration: 0.2 });

  /* ==========================================================================
     5. FLOATING GOLD DUST PARTICLES CANVAS (ENVELOPE STAGE)
     ========================================================================== */
  const dustCanvas = document.getElementById('gold-dust-canvas');
  if (dustCanvas) {
    const dctx = dustCanvas.getContext('2d');
    let dw = (dustCanvas.width = window.innerWidth);
    let dh = (dustCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      dw = dustCanvas.width = window.innerWidth;
      dh = dustCanvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * dw,
      y: Math.random() * dh,
      r: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.2
    }));

    function loopDust() {
      dctx.clearRect(0, 0, dw, dh);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) p.y = dh;
        if (p.x < 0) p.x = dw;
        if (p.x > dw) p.x = 0;

        dctx.fillStyle = `rgba(223, 195, 138, ${p.opacity})`;
        dctx.beginPath();
        dctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        dctx.fill();
      });
      requestAnimationFrame(loopDust);
    }
    loopDust();
  }

  /* ==========================================================================
     6. ENVELOPE 3D REVEAL TIMELINE (AWARD-WINNING RED CARPET SEQUENCE)
     ========================================================================== */
  const envelopeStage = document.getElementById('envelope-stage');
  const envelope3D = document.getElementById('envelope-3d');
  const waxSeal = document.getElementById('wax-seal');
  const flapTop = document.getElementById('env-flap-top');
  const envRevealEmblem = document.getElementById('env-reveal-emblem');
  const invitationMain = document.getElementById('invitation-main');
  const skipEnvelopeBtn = document.getElementById('skip-envelope-btn');

  let isRevealed = false;

  function executeEnvelopeReveal() {
    if (isRevealed) return;
    isRevealed = true;

    // 0.0s: Lone distant flash & audio crack
    Paparazzi.fire({ power: 0.9, hero: false });

    const revealTL = gsap.timeline();

    // 0.6s: Seal crack & dissolve
    revealTL.to(waxSeal, {
      scale: 1.15,
      duration: 0.15,
      ease: 'power2.out'
    })
    .to(waxSeal, {
      scale: 0.7,
      opacity: 0,
      duration: 0.45,
      ease: 'power3.in',
      onComplete: () => {
        if (waxSeal) waxSeal.style.display = 'none';
      }
    });

    // 1.0s: Flap opens in true 3D perspective
    revealTL.to(flapTop, {
      rotateX: -180,
      duration: 0.9,
      ease: 'power2.inOut',
      onStart: () => {
        Paparazzi.fire({ power: 1.1, hero: false });
      }
    }, '+=0.1');

    // 1.6s: Summons card rises from pocket & cluster burst fires
    revealTL.to(envRevealEmblem, {
      y: -140,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      onStart: () => {
        Paparazzi.burst(14, 2200);
      }
    }, '-=0.3');

    // 2.4s: TRIPLE Flash & Hero Flash cross-fade into lit state
    revealTL.call(() => {
      Paparazzi.fire({ power: 1.4, hero: true });
    }, null, '+=0.3');

    // 2.8s: Envelope drops away; main invitation manifests
    revealTL.to(envelopeStage, {
      opacity: 0,
      scale: 0.96,
      duration: 0.65,
      ease: 'power2.inOut',
      onComplete: () => {
        if (envelopeStage) envelopeStage.style.display = 'none';
      }
    }, '+=0.2');

    revealTL.to(invitationMain, {
      opacity: 1,
      duration: 0.85,
      ease: 'power2.out',
      onStart: () => {
        if (invitationMain) {
          invitationMain.style.pointerEvents = 'auto';
          invitationMain.style.opacity = '1';
        }
        // Turn on sparse ambient flashes
        Paparazzi.ambient(true);
      }
    }, '-=0.4');
  }

  if (waxSeal) {
    waxSeal.addEventListener('click', executeEnvelopeReveal);
  }

  function skipToConclaveDirectly() {
    if (isRevealed) return;
    isRevealed = true;
    if (envelopeStage) envelopeStage.style.display = 'none';
    if (invitationMain) {
      invitationMain.style.opacity = '1';
      invitationMain.style.pointerEvents = 'auto';
    }
    Paparazzi.fire({ power: 1.0, hero: true });
    Paparazzi.ambient(true);
  }

  if (skipEnvelopeBtn) {
    skipEnvelopeBtn.addEventListener('click', skipToConclaveDirectly);
  }

  /* ==========================================================================
     7. 4-STEP COUTURE ACCREDITATION STEPPER & LIVE PLACE CARD REVIEW
     ========================================================================== */
  const rsvpForm = document.getElementById('rsvp-form');
  const collegeInput = document.getElementById('college_name');
  const clNameInput = document.getElementById('cl_name');
  const clPhoneInput = document.getElementById('cl_phone');
  const aclNameInput = document.getElementById('acl_name');
  const aclPhoneInput = document.getElementById('acl_phone');
  const clPhotoInput = document.getElementById('cl_photo');
  const aclPhotoInput = document.getElementById('acl_photo');
  const clPhotoDropzone = document.getElementById('cl-photo-dropzone');
  const aclPhotoDropzone = document.getElementById('acl-photo-dropzone');
  const clFileName = document.getElementById('cl-file-name');
  const aclFileName = document.getElementById('acl-file-name');
  const honeypotInput = document.getElementById('institution_secret');

  const stepPane1 = document.getElementById('step-pane-1');
  const stepPane2 = document.getElementById('step-pane-2');
  const stepPane3 = document.getElementById('step-pane-3');
  const stepPane4 = document.getElementById('step-pane-4');

  const stepNode1 = document.getElementById('step-node-1');
  const stepNode2 = document.getElementById('step-node-2');
  const stepNode3 = document.getElementById('step-node-3');
  const stepNode4 = document.getElementById('step-node-4');

  const btnToStep2 = document.getElementById('btn-to-step-2');
  const btnBackToStep1 = document.getElementById('btn-back-to-step-1');
  const btnToStep3 = document.getElementById('btn-to-step-3');
  const btnBackToStep2 = document.getElementById('btn-back-to-step-2');
  const btnToStep4 = document.getElementById('btn-to-step-4');
  const btnBackToStep3 = document.getElementById('btn-back-to-step-3');

  const pcPreviewCollege = document.getElementById('pc-preview-college');
  const pcPreviewCl = document.getElementById('pc-preview-cl');
  const pcPreviewClPhone = document.getElementById('pc-preview-cl-phone');
  const pcPreviewAcl = document.getElementById('pc-preview-acl');
  const pcPreviewAclPhone = document.getElementById('pc-preview-acl-phone');

  function setError(fieldId, msg) {
    const errSpan = document.getElementById(`err-${fieldId}`);
    const input = document.getElementById(fieldId);
    if (errSpan) errSpan.textContent = msg;
    if (input) input.classList.add('input-error');
  }

  function clearError(fieldId) {
    const errSpan = document.getElementById(`err-${fieldId}`);
    const input = document.getElementById(fieldId);
    if (errSpan) errSpan.textContent = '';
    if (input) input.classList.remove('input-error');
  }

  function showStep(stepIndex) {
    [stepPane1, stepPane2, stepPane3, stepPane4].forEach((pane, idx) => {
      if (pane) pane.style.display = idx + 1 === stepIndex ? 'block' : 'none';
    });
    [stepNode1, stepNode2, stepNode3, stepNode4].forEach((node, idx) => {
      if (node) {
        node.classList.remove('active', 'completed');
        if (idx + 1 === stepIndex) node.classList.add('active');
        else if (idx + 1 < stepIndex) node.classList.add('completed');
      }
    });

    const mobileBanner = document.getElementById('mobile-step-banner');
    const stepLabels = [
      'Step 1 of 4: Institution Accreditation',
      'Step 2 of 4: Contingent Leader (CL)',
      'Step 3 of 4: Assistant Leader (ACL)',
      'Step 4 of 4: Review & Place Card'
    ];
    if (mobileBanner && stepLabels[stepIndex - 1]) {
      mobileBanner.textContent = stepLabels[stepIndex - 1];
    }
  }

  // Live Place Card Synchronization
  function updatePlaceCard() {
    if (pcPreviewCollege && collegeInput) {
      pcPreviewCollege.textContent = collegeInput.value.trim() || "Collegiate Delegation";
    }
    if (pcPreviewCl && clNameInput) {
      pcPreviewCl.textContent = clNameInput.value.trim() || "Chief Delegate (CL)";
    }
    if (pcPreviewClPhone && clPhoneInput) {
      pcPreviewClPhone.textContent = clPhoneInput.value ? `+91 ${clPhoneInput.value.trim()}` : "+91 —";
    }
    if (pcPreviewAcl && aclNameInput) {
      pcPreviewAcl.textContent = aclNameInput.value.trim() || "Associate Delegate (ACL)";
    }
    if (pcPreviewAclPhone && aclPhoneInput) {
      pcPreviewAclPhone.textContent = aclPhoneInput.value ? `+91 ${aclPhoneInput.value.trim()}` : "+91 —";
    }
  }

  [collegeInput, clNameInput, clPhoneInput, aclNameInput, aclPhoneInput].forEach(inp => {
    if (inp) inp.addEventListener('input', updatePlaceCard);
  });

  // Optional ID Card Photo Upload Listeners
  if (clPhotoInput && clPhotoDropzone && clFileName) {
    clPhotoInput.addEventListener('change', () => {
      const file = clPhotoInput.files && clPhotoInput.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError('cl_photo', 'File size exceeds 5MB limit.');
          clPhotoInput.value = '';
          clPhotoDropzone.classList.remove('has-file');
          clFileName.textContent = 'Click to choose or drag ID card photo (Max 5MB)';
          return;
        }
        clearError('cl_photo');
        clPhotoDropzone.classList.add('has-file');
        clFileName.textContent = `✓ ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
      } else {
        clPhotoDropzone.classList.remove('has-file');
        clFileName.textContent = 'Click to choose or drag ID card photo (Max 5MB • JPG, PNG, WebP)';
      }
    });
  }

  if (aclPhotoInput && aclPhotoDropzone && aclFileName) {
    aclPhotoInput.addEventListener('change', () => {
      const file = aclPhotoInput.files && aclPhotoInput.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError('acl_photo', 'File size exceeds 5MB limit.');
          aclPhotoInput.value = '';
          aclPhotoDropzone.classList.remove('has-file');
          aclFileName.textContent = 'Click to choose or drag ID card photo (Max 5MB)';
          return;
        }
        clearError('acl_photo');
        aclPhotoDropzone.classList.add('has-file');
        aclFileName.textContent = `✓ ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
      } else {
        aclPhotoDropzone.classList.remove('has-file');
        aclFileName.textContent = 'Click to choose or drag ID card photo (Max 5MB • JPG, PNG, WebP)';
      }
    });
  }

  // Step 1 Validation -> Next
  if (btnToStep2) {
    btnToStep2.addEventListener('click', () => {
      const val = collegeInput ? collegeInput.value.trim() : '';
      if (!val || val.length < 3) {
        setError('college_name', 'Please select or enter your institution name (minimum 3 letters).');
        return;
      }
      clearError('college_name');
      showStep(2);
      if (clNameInput) clNameInput.focus();
    });
  }

  if (btnBackToStep1) {
    btnBackToStep1.addEventListener('click', () => showStep(1));
  }

  // Step 2 Validation -> Next
  if (btnToStep3) {
    btnToStep3.addEventListener('click', () => {
      let valid = true;
      const clName = clNameInput ? clNameInput.value.trim() : '';
      const clPhone = clPhoneInput ? clPhoneInput.value.replace(/\D/g, '') : '';

      if (!clName || clName.length < 2) {
        setError('cl_name', 'Please enter Contingent Leader’s full name.');
        valid = false;
      } else {
        clearError('cl_name');
      }

      if (!clPhone || !/^[6-9]\d{9}$/.test(clPhone)) {
        setError('cl_phone', 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
        valid = false;
      } else {
        clearError('cl_phone');
      }

      if (valid) {
        showStep(3);
        if (aclNameInput) aclNameInput.focus();
      }
    });
  }

  if (btnBackToStep2) {
    btnBackToStep2.addEventListener('click', () => showStep(2));
  }

  // Step 3 Validation -> Review
  if (btnToStep4) {
    btnToStep4.addEventListener('click', () => {
      let valid = true;
      const aclName = aclNameInput ? aclNameInput.value.trim() : '';
      const aclPhone = aclPhoneInput ? aclPhoneInput.value.replace(/\D/g, '') : '';
      const clPhone = clPhoneInput ? clPhoneInput.value.replace(/\D/g, '') : '';

      if (!aclName || aclName.length < 2) {
        setError('acl_name', 'Please enter Assistant Contingent Leader’s full name.');
        valid = false;
      } else {
        clearError('acl_name');
      }

      if (!aclPhone || !/^[6-9]\d{9}$/.test(aclPhone)) {
        setError('acl_phone', 'Enter a valid 10-digit mobile number.');
        valid = false;
      } else if (aclPhone === clPhone) {
        setError('acl_phone', 'CL and ACL contact numbers must be distinct for accreditation.');
        valid = false;
      } else {
        clearError('acl_phone');
      }

      if (valid) {
        updatePlaceCard();
        showStep(4);
        // Hero Flash fires on Place Card Reveal
        Paparazzi.fire({ power: 1.3, hero: true });
      }
    });
  }

  if (btnBackToStep3) {
    btnBackToStep3.addEventListener('click', () => showStep(3));
  }

  /* Form Submission & 3D Ticket Flip */
  const rsvpFlipper = document.getElementById('rsvp-card-flipper');
  const submitBtn = document.getElementById('submit-rsvp-btn');
  const globalError = document.getElementById('form-global-error');

  const ticketRefId = document.getElementById('ticket-ref-id');
  const ticketCollegeDisplay = document.getElementById('ticket-college-display');
  const ticketClDisplay = document.getElementById('ticket-cl-display');
  const ticketClPhoneDisplay = document.getElementById('ticket-cl-phone-display');
  const ticketAclDisplay = document.getElementById('ticket-acl-display');
  const ticketAclPhoneDisplay = document.getElementById('ticket-acl-phone-display');

  let currentDelegationData = null;

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (globalError) {
        globalError.style.display = 'none';
        globalError.textContent = '';
      }

      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }
      if (btnBackToStep3) {
        btnBackToStep3.disabled = true;
      }

      const college = collegeInput ? collegeInput.value.trim() : '';
      const clName = clNameInput ? clNameInput.value.trim() : '';
      const clPhone = clPhoneInput ? clPhoneInput.value.trim() : '';
      const aclName = aclNameInput ? aclNameInput.value.trim() : '';
      const aclPhone = aclPhoneInput ? aclPhoneInput.value.trim() : '';
      const clPhotoFile = clPhotoInput && clPhotoInput.files && clPhotoInput.files[0] ? clPhotoInput.files[0] : null;
      const aclPhotoFile = aclPhotoInput && aclPhotoInput.files && aclPhotoInput.files[0] ? aclPhotoInput.files[0] : null;
      const institutionSecret = honeypotInput ? honeypotInput.value : '';

      try {
        const result = await submitDelegation({
          college,
          clName,
          clPhone,
          aclName,
          aclPhone,
          clPhotoFile,
          aclPhotoFile,
          institutionSecret
        });

        // 1. Handle Duplicate Registration Gracefully
        if (result.status === 'duplicate') {
          if (globalError) {
            globalError.className = 'form-global-error warning font-quicksand';
            globalError.innerHTML = `<strong>✦ Delegation Already Accredited:</strong> ${result.message}<br><button type="button" id="btn-view-existing-ticket" class="font-quicksand" style="margin-top:0.8rem;padding:0.45rem 1.2rem;border-radius:4px;background:#C9A24B;color:#150A10;font-weight:700;font-size:0.82rem;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.4rem;">✦ View Issued VIP Pass &amp; Credentials →</button>`;
            globalError.style.display = 'block';
            globalError.scrollIntoView({ behavior: 'smooth', block: 'center' });

            const viewBtn = document.getElementById('btn-view-existing-ticket');
            if (viewBtn) {
              viewBtn.addEventListener('click', () => {
                const refId = result.refId || 'METGALA-VIP-CL-042';
                currentDelegationData = { college, clName, clPhone, aclName, aclPhone, refId };
                if (ticketRefId) ticketRefId.textContent = refId;
                if (ticketCollegeDisplay) ticketCollegeDisplay.textContent = college;
                if (ticketClDisplay) ticketClDisplay.textContent = clName;
                if (ticketClPhoneDisplay) ticketClPhoneDisplay.textContent = `+91 ${clPhone}`;
                if (ticketAclDisplay) ticketAclDisplay.textContent = aclName;
                if (ticketAclPhoneDisplay) ticketAclPhoneDisplay.textContent = `+91 ${aclPhone}`;
                if (rsvpFlipper) {
                  rsvpFlipper.classList.add('flipped');
                  const rsvpSection = document.getElementById('rsvp-section');
                  if (rsvpSection) rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              });
            }
          }
          return;
        }

        // 2. Handle Confirmed Successful Registration
        const refId = result.refId;
        currentDelegationData = { college, clName, clPhone, aclName, aclPhone, refId };

        // Populate Shining Golden Ticket Back
        if (ticketRefId) ticketRefId.textContent = refId;
        if (ticketCollegeDisplay) ticketCollegeDisplay.textContent = college;
        if (ticketClDisplay) ticketClDisplay.textContent = clName;
        if (ticketClPhoneDisplay) ticketClPhoneDisplay.textContent = `+91 ${clPhone}`;
        if (ticketAclDisplay) ticketAclDisplay.textContent = aclName;
        if (ticketAclPhoneDisplay) ticketAclPhoneDisplay.textContent = `+91 ${aclPhone}`;

        // 3D Flip
        if (rsvpFlipper) {
          rsvpFlipper.classList.add('flipped');
          const rsvpSection = document.getElementById('rsvp-section');
          if (rsvpSection) {
            rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        // Confetti & Hero Paparazzi Barrage
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#C9A24B', '#DFC38A', '#5A0F1A', '#FFF3DC']
          });
        }
        Paparazzi.burst(18, 2800);

        // Reset Form & File Previews
        rsvpForm.reset();
        if (clPhotoDropzone) clPhotoDropzone.classList.remove('has-file');
        if (aclPhotoDropzone) aclPhotoDropzone.classList.remove('has-file');
        if (clFileName) clFileName.textContent = 'Click to choose or drag ID card photo (Max 5MB • JPG, PNG, WebP)';
        if (aclFileName) aclFileName.textContent = 'Click to choose or drag ID card photo (Max 5MB • JPG, PNG, WebP)';

      } catch (err) {
        // 3. Handle Failure: display clear error, preserve all entered data
        if (globalError) {
          globalError.className = 'form-global-error font-quicksand';
          globalError.textContent = `Accreditation could not be submitted: ${err.message}. Your entered information is preserved. Please retry.`;
          globalError.style.display = 'block';
          globalError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } finally {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }
        if (btnBackToStep3) {
          btnBackToStep3.disabled = false;
        }
      }
    });
  }

  /* ==========================================================================
     8. PASS ACTIONS: DOWNLOAD PNG, ADD TO CALENDAR, WHATSAPP SHARE
     ========================================================================== */
  const downloadPngBtn = document.getElementById('download-pass-png-btn');
  const downloadIcsBtn = document.getElementById('download-ics-btn');
  const shareWhatsAppBtn = document.getElementById('share-whatsapp-btn');
  // Canvas High-Res VIP Pass Generator with Official Samanvay & TSPDC Emblems
  if (downloadPngBtn) {
    downloadPngBtn.addEventListener('click', async () => {
      if (!currentDelegationData) return;

      const offscreen = document.createElement('canvas');
      offscreen.width = 1200;
      offscreen.height = 675;
      const octx = offscreen.getContext('2d');
      if (!octx) return;

      // Background Obsidian & Velvet Radial Gradient
      const bgGrad = octx.createRadialGradient(600, 337, 50, 600, 337, 650);
      bgGrad.addColorStop(0, '#26121E');
      bgGrad.addColorStop(0.5, '#120A12');
      bgGrad.addColorStop(1, '#060406');
      octx.fillStyle = bgGrad;
      octx.fillRect(0, 0, 1200, 675);

      // Outer & Inner Gold Hairline Borders
      octx.strokeStyle = '#C9A24B';
      octx.lineWidth = 3;
      octx.strokeRect(28, 28, 1144, 619);
      octx.lineWidth = 1;
      octx.strokeStyle = 'rgba(255, 243, 220, 0.45)';
      octx.strokeRect(38, 38, 1124, 599);

      // Helper to asynchronously load image assets for high-res drawing
      const loadImage = (src) => new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

      const [samanvayImg, tspdcImg] = await Promise.all([
        loadImage('assets/samanvay-official-logo.jpg'),
        loadImage('assets/tspdc-crest-vertical.png')
      ]);

      // Draw Official Samanvay Emblem (Top-Left, Enlarged & Luxury Bezel)
      if (samanvayImg) {
        octx.save();
        octx.beginPath();
        octx.arc(140, 120, 60, 0, Math.PI * 2);
        octx.closePath();
        octx.clip();
        octx.drawImage(samanvayImg, 80, 60, 120, 120);
        octx.restore();

        octx.strokeStyle = '#DFC38A';
        octx.lineWidth = 3;
        octx.beginPath();
        octx.arc(140, 120, 60, 0, Math.PI * 2);
        octx.stroke();
      }

      // Draw Official TSPDC Shield Crest (Top-Right, Enlarged & Proportional)
      if (tspdcImg) {
        octx.drawImage(tspdcImg, 1000, 60, 120, 120);
      }

      // Center Header: Streamlined Luxury Typography (Green Element Removed)
      octx.textAlign = 'center';
      octx.fillStyle = '#DFC38A';
      octx.font = '700 13px "Montserrat", sans-serif';
      octx.fillText('THAKUR SPECIALIZED DEGREE COLLEGE PRESENTS', 600, 74);

      // Met Gala Title
      octx.fillStyle = '#FFFFFF';
      octx.font = '700 44px "Cormorant Garamond", Georgia, serif';
      octx.fillText('SAMANVAY 2026–2027', 600, 122);

      octx.fillStyle = '#DFC38A';
      octx.font = '700 16px "Montserrat", sans-serif';
      octx.fillText("CL MEET • CONTINGENT LEADERS' CONCLAVE", 600, 154);

      // Credential Reference Box in Center Header
      octx.fillStyle = 'rgba(8, 5, 7, 0.9)';
      octx.fillRect(410, 172, 380, 36);
      octx.strokeStyle = 'rgba(201, 162, 75, 0.7)';
      octx.lineWidth = 1.5;
      octx.strokeRect(410, 172, 380, 36);

      octx.fillStyle = '#FFFFFF';
      octx.font = 'bold 15px "Cinzel", "Cormorant Garamond", serif';
      octx.fillText(`CREDENTIAL REF: ${currentDelegationData.refId}`, 600, 196);

      // Gold Hairline Divider
      octx.strokeStyle = 'rgba(201, 162, 75, 0.5)';
      octx.lineWidth = 1;
      octx.beginPath();
      octx.moveTo(220, 235);
      octx.lineTo(980, 235);
      octx.stroke();

      // Accredited College / Institution
      octx.fillStyle = '#FFF3DC';
      octx.font = 'bold 36px "Cormorant Garamond", Georgia, serif';
      octx.fillText(currentDelegationData.college, 600, 275);

      // Delegation Columns Box
      octx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      octx.fillRect(80, 315, 1040, 145);
      octx.strokeStyle = 'rgba(201, 162, 75, 0.3)';
      octx.strokeRect(80, 315, 1040, 145);

      // Contingent Leader (CL)
      octx.textAlign = 'left';
      octx.fillStyle = '#DFC38A';
      octx.font = '700 16px "Montserrat", sans-serif';
      octx.fillText('CONTINGENT LEADER (CL)', 130, 360);
      octx.fillStyle = '#FFFFFF';
      octx.font = 'bold 28px "Montserrat", sans-serif';
      octx.fillText(currentDelegationData.clName, 130, 400);
      octx.fillStyle = '#C8BFB0';
      octx.font = '500 19px "Montserrat", sans-serif';
      octx.fillText(`+91 ${currentDelegationData.clPhone}`, 130, 432);

      // Vertical Divider
      octx.strokeStyle = 'rgba(201, 162, 75, 0.35)';
      octx.beginPath();
      octx.moveTo(600, 335);
      octx.lineTo(600, 440);
      octx.stroke();

      // Assistant Contingent Leader (ACL)
      octx.fillStyle = '#DFC38A';
      octx.font = '700 16px "Montserrat", sans-serif';
      octx.fillText('ASSISTANT LEADER (ACL)', 650, 360);
      octx.fillStyle = '#FFFFFF';
      octx.font = 'bold 28px "Montserrat", sans-serif';
      octx.fillText(currentDelegationData.aclName, 650, 400);
      octx.fillStyle = '#C8BFB0';
      octx.font = '500 19px "Montserrat", sans-serif';
      octx.fillText(`+91 ${currentDelegationData.aclPhone}`, 650, 432);

      // Logistics & Mandates Strip
      octx.textAlign = 'center';
      octx.fillStyle = '#DFC38A';
      octx.font = 'bold 20px "Cinzel", "Cormorant Garamond", serif';
      octx.fillText('OFFICIAL VIP ACCREDITATION  •  ENTITLEMENT: 2 VIP PASSES', 600, 505);

      octx.fillStyle = '#F4EDE0';
      octx.font = '600 15px "Montserrat", sans-serif';
      octx.fillText('SARTORIAL CODE: Elegant Met Gala Themed Outfit (Mandatory)', 600, 538);

      octx.fillStyle = '#A89F90';
      octx.font = '500 14px "Montserrat", sans-serif';
      octx.fillText('Ground Floor Seminar Hall, Thakur Specialized Degree College (TSPDC), Kandivali (West), Mumbai', 600, 568);

      // Trigger Instant High-Res Download
      const link = document.createElement('a');
      link.download = `SAMANVAY-2027-VIP-PASS-${currentDelegationData.refId}.png`;
      link.href = offscreen.toDataURL('image/png');
      link.click();
    });
  }

  // Add to Calendar (.ics)
  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', () => {
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Samanvay 2027 Met Gala//CL Meet//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:samanvay-2027-cl-meet@tspdc.in',
        'DTSTAMP:20261105T000000Z',
        'SUMMARY:SAMANVAY 2027 — Met Gala CL Meet',
        'DESCRIPTION:Official VIP Contingent Accreditation for Samanvay 2027 Met Gala Soirée at Thakur Specialized Degree College.',
        'LOCATION:Ground Floor Seminar Hall, Thakur Specialized Degree College, Kandivali (West), Mumbai',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Samanvay-2027-CL-Meet.ics';
      link.click();
    });
  }

  // WhatsApp Share (Cleaned of specific dates)
  if (shareWhatsAppBtn) {
    shareWhatsAppBtn.addEventListener('click', () => {
      if (!currentDelegationData) return;
      const text = encodeURIComponent(
        `🏛️ *SAMANVAY 2027: THE MET GALA — CL MEET*\n` +
        `Accreditation Confirmed for *${currentDelegationData.college}*!\n\n` +
        `✦ *Credential Ref:* ${currentDelegationData.refId}\n` +
        `✦ *Contingent Leader:* ${currentDelegationData.clName}\n` +
        `✦ *Assistant Leader:* ${currentDelegationData.aclName}\n\n` +
        `👔 *Dress Code:* Elegant Met Gala Themed Outfit (Mandatory)\n` +
        `📍 *Venue:* Ground Floor Seminar Hall, Thakur Specialized Degree College, Kandivali (W), Mumbai\n` +
        `🎫 *Entitlement:* 2 Official VIP Passes\n\n` +
        `Presented by Thakur Specialized Degree College.`
      );
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    });
  }

});
