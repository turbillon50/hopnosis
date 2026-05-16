/* ============================================================
   HypnosAudio — motor de audio generativo
   Genera binaural beats + pads ambientales con Web Audio API.
   No requiere archivos de audio externos: 100% sintetizado.
   ============================================================ */

export const HypnosAudio = (() => {
  /** Estado interno */
  const state = {
    ctx: null,
    master: null,
    nodes: null,         // { left, right, panL, panR, pad, padFilter, noise, noiseFilter }
    playing: false,
    session: null,       // sesión actual
    startedAt: 0,        // ctx.currentTime cuando inició / reanudó
    offset: 0,           // segundos consumidos antes del último start
    volume: 0.7,
    rafId: null,
    listeners: new Set(),
  };

  /** Notifica subscriptores con el estado ligero */
  function emit(type, payload = {}) {
    state.listeners.forEach((cb) => {
      try { cb({ type, ...payload, ...snapshot() }); } catch (e) { /* noop */ }
    });
  }

  function snapshot() {
    return {
      playing: state.playing,
      session: state.session,
      currentTime: getCurrentTime(),
      duration: state.session ? state.session.duration : 0,
      volume: state.volume,
    };
  }

  function ensureCtx() {
    if (state.ctx) return state.ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    state.ctx = new Ctx();
    state.master = state.ctx.createGain();
    state.master.gain.value = state.volume;
    state.master.connect(state.ctx.destination);
    return state.ctx;
  }

  /** Construye el árbol de audio para una sesión */
  function buildGraph(session) {
    const ctx = ensureCtx();
    const now = ctx.currentTime;

    // --- Binaural beats (oídos opuestos) ---
    const carrier = session.carrier;            // p.ej. 220 Hz
    const beat    = session.beat;               // p.ej. 6 Hz (theta)
    const left  = ctx.createOscillator();
    const right = ctx.createOscillator();
    left.type = 'sine';  right.type = 'sine';
    left.frequency.value  = carrier;
    right.frequency.value = carrier + beat;

    const panL = ctx.createStereoPanner(); panL.pan.value = -1;
    const panR = ctx.createStereoPanner(); panR.pan.value =  1;

    const beatGain = ctx.createGain();
    beatGain.gain.value = 0;

    left.connect(panL).connect(beatGain);
    right.connect(panR).connect(beatGain);
    beatGain.connect(state.master);

    // Fade in suave
    beatGain.gain.linearRampToValueAtTime(0.18, now + 4);

    left.start(now); right.start(now);

    // --- Pad ambiental: acordes lentos (3 osciladores afinados) ---
    const padBase = session.padRoot || 110; // A2
    const padIntervals = session.padIntervals || [1, 1.5, 1.8]; // raíz, 5ta, ~tercera mayor

    const padOscs = padIntervals.map((mult) => {
      const o = ctx.createOscillator();
      o.type = mult === 1 ? 'sine' : 'triangle';
      o.frequency.value = padBase * mult;
      // LFO de afinación para "respirar"
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.08 + Math.random() * 0.05;
      lfoGain.gain.value = 0.5; // ± 0.5 Hz
      lfo.connect(lfoGain).connect(o.frequency);
      lfo.start(now);
      return o;
    });

    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 900;
    padFilter.Q.value = 0.7;

    const padGain = ctx.createGain();
    padGain.gain.value = 0;
    padGain.gain.linearRampToValueAtTime(session.padLevel ?? 0.12, now + 6);

    padOscs.forEach((o) => { o.connect(padFilter); o.start(now); });
    padFilter.connect(padGain).connect(state.master);

    // --- Ruido rosa filtrado: ambiente "viento estelar" ---
    const noise = ctx.createBufferSource();
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + white*0.0555179;
      b1 = 0.99332*b1 + white*0.0750759;
      b2 = 0.96900*b2 + white*0.1538520;
      b3 = 0.86650*b3 + white*0.3104856;
      b4 = 0.55000*b4 + white*0.5329522;
      b5 = -0.7616*b5 - white*0.0168980;
      data[i] = (b0+b1+b2+b3+b4+b5+b6+white*0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    noise.buffer = noiseBuf;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 600;
    noiseFilter.Q.value = 0.6;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0;
    noiseGain.gain.linearRampToValueAtTime(session.noiseLevel ?? 0.04, now + 8);

    noise.connect(noiseFilter).connect(noiseGain).connect(state.master);
    noise.start(now);

    state.nodes = {
      left, right, panL, panR, beatGain,
      padOscs, padFilter, padGain,
      noise, noiseFilter, noiseGain,
    };
  }

  function destroyGraph(fadeMs = 600) {
    if (!state.nodes) return;
    const ctx = state.ctx;
    const t = ctx.currentTime;
    const n = state.nodes;
    const fade = fadeMs / 1000;

    try { n.beatGain.gain.cancelScheduledValues(t); n.beatGain.gain.linearRampToValueAtTime(0, t + fade); } catch {}
    try { n.padGain.gain.cancelScheduledValues(t);  n.padGain.gain.linearRampToValueAtTime(0, t + fade); } catch {}
    try { n.noiseGain.gain.cancelScheduledValues(t);n.noiseGain.gain.linearRampToValueAtTime(0, t + fade); } catch {}

    const nodes = state.nodes;
    state.nodes = null;
    setTimeout(() => {
      try { nodes.left.stop(); nodes.right.stop(); } catch {}
      try { nodes.padOscs.forEach((o) => o.stop()); } catch {}
      try { nodes.noise.stop(); } catch {}
    }, fadeMs + 50);
  }

  function tick() {
    if (!state.playing || !state.session) return;
    const t = getCurrentTime();
    if (t >= state.session.duration) {
      // fin de sesión
      pause();
      state.offset = 0;
      emit('ended');
      return;
    }
    emit('tick');
    state.rafId = requestAnimationFrame(tick);
  }

  /** Devuelve el tiempo "consumido" de la sesión actual en segundos */
  function getCurrentTime() {
    if (!state.session) return 0;
    if (state.playing) {
      return Math.min(state.session.duration, state.offset + (state.ctx.currentTime - state.startedAt));
    }
    return state.offset;
  }

  // -------------------- API pública --------------------------

  async function play(session) {
    const ctx = ensureCtx();
    if (ctx.state === 'suspended') await ctx.resume();

    // Cambio de sesión
    if (!state.session || state.session.id !== session.id) {
      destroyGraph(400);
      state.session = session;
      state.offset = 0;
    }

    if (state.playing) return;

    buildGraph(state.session);
    state.startedAt = ctx.currentTime;
    state.playing = true;

    emit('play');
    state.rafId = requestAnimationFrame(tick);
  }

  function pause() {
    if (!state.playing) return;
    state.offset = getCurrentTime();
    state.playing = false;
    destroyGraph(450);
    cancelAnimationFrame(state.rafId);
    emit('pause');
  }

  function toggle(session) {
    if (state.playing) pause();
    else if (session || state.session) play(session || state.session);
  }

  function seek(seconds) {
    if (!state.session) return;
    const wasPlaying = state.playing;
    if (wasPlaying) {
      destroyGraph(120);
      cancelAnimationFrame(state.rafId);
      state.playing = false;
    }
    state.offset = Math.max(0, Math.min(state.session.duration, seconds));
    if (wasPlaying) {
      setTimeout(() => play(state.session), 130);
    } else {
      emit('seek');
    }
  }

  function stop() {
    destroyGraph(300);
    cancelAnimationFrame(state.rafId);
    state.playing = false;
    state.session = null;
    state.offset = 0;
    emit('stop');
  }

  function setVolume(v) {
    state.volume = Math.max(0, Math.min(1, v));
    if (state.master) {
      const t = state.ctx.currentTime;
      state.master.gain.cancelScheduledValues(t);
      state.master.gain.linearRampToValueAtTime(state.volume, t + 0.1);
    }
    emit('volume');
  }

  function subscribe(cb) {
    state.listeners.add(cb);
    return () => state.listeners.delete(cb);
  }

  function getState() { return snapshot(); }

  return { play, pause, toggle, seek, stop, setVolume, subscribe, getState };
})();
