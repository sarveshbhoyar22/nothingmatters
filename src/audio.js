// Ambient Audio Generator for "nothingmatter."
// Synthesizes an authentic morning outdoor soundscape:
// - Gentle morning wind rustling through scrub trees & leaves
// - Distant singing songbirds and chirps
// Built purely with Web Audio API - no external audio files required!

class TrailSoundscape {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.windNode = null;
    this.masterGain = null;
    this.birdTimer = null;
    this.listeners = [];
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  // Create pinkish wind noise via buffer and bandpass filters
  startWind() {
    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to simulate soft morning breeze in high grass
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // Subtle LFO to make breeze swell gently
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);
    noise.start();

    this.windNode = noise;
  }

  // Synthesize realistic morning bird chirps
  playBirdChirp() {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 2600 + Math.random() * 900;
    osc.type = 'sine';

    // Frequency chirping modulation
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(baseFreq - 300, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 400, now + 0.18);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.24);

    // Occasional double chirp
    if (Math.random() > 0.4) {
      setTimeout(() => {
        if (!this.isPlaying) return;
        const now2 = this.ctx.currentTime;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(baseFreq + 150, now2);
        osc2.frequency.exponentialRampToValueAtTime(baseFreq + 700, now2 + 0.07);
        gain2.gain.setValueAtTime(0, now2);
        gain2.gain.linearRampToValueAtTime(0.03, now2 + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, now2 + 0.18);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now2);
        osc2.stop(now2 + 0.2);
      }, 160);
    }

    // Schedule next chirp randomly between 3 to 8 seconds
    const nextInterval = 3000 + Math.random() * 5000;
    this.birdTimer = setTimeout(() => this.playBirdChirp(), nextInterval);
  }

  toggle() {
    this.init();

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      // Fade out
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
      clearTimeout(this.birdTimer);
      setTimeout(() => {
        this.isPlaying = false;
        this.notify();
      }, 1200);
    } else {
      // Start
      this.startWind();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 1.5);
      this.isPlaying = true;
      this.notify();
      this.playBirdChirp();
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.isPlaying);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.isPlaying));
  }
}

export const soundscape = new TrailSoundscape();
