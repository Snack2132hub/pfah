/**
 * Web Audio 8-bit Retro Synthesizer
 * Generates classic chiptune sound effects and melodies procedurally.
 */

class RetroAudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmInterval: number | null = null;
  private bgmPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.bgmPlaying) {
      this.stopBGM();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Jump sound: rapid square wave pitch sweep upward
  public playJump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // AudioContext could be blocked until interaction
    }
  }

  // Shuttlecock collect: 2-tone bright coin chime
  public playCollectShuttlecock() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [
        { freq: 987.77, start: 0, dur: 0.08 }, // B5
        { freq: 1318.51, start: 0.08, dur: 0.2 }, // E6
      ].forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(note.freq, now + note.start);

        gain.gain.setValueAtTime(0.15, now + note.start);
        gain.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.start);
        osc.stop(now + note.start + note.dur);
      });
    } catch {
      // Ignore
    }
  }

  // Manga book collect: 4-step powerup chime
  public playCollectManga() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const start = now + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.12);
      });
    } catch {
      // Ignore
    }
  }

  // Block punch
  public playBlockHit() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  // Victory Birthday Fanfare: 8-bit Happy Birthday melody!
  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // Happy Birthday Melody in C Major
      // Notes: G4 G4 A4 G4 C5 B4 | G4 G4 A4 G4 D5 C5
      const notes: { freq: number; dur: number }[] = [
        { freq: 392.0, dur: 0.25 }, // G4
        { freq: 392.0, dur: 0.25 }, // G4
        { freq: 440.0, dur: 0.5 },  // A4
        { freq: 392.0, dur: 0.5 },  // G4
        { freq: 523.25, dur: 0.5 }, // C5
        { freq: 493.88, dur: 0.9 }, // B4
        { freq: 0, dur: 0.15 },     // rest
        { freq: 392.0, dur: 0.25 }, // G4
        { freq: 392.0, dur: 0.25 }, // G4
        { freq: 440.0, dur: 0.5 },  // A4
        { freq: 392.0, dur: 0.5 },  // G4
        { freq: 587.33, dur: 0.5 }, // D5
        { freq: 523.25, dur: 1.0 }, // C5
        { freq: 0, dur: 0.2 },      // rest
        { freq: 392.0, dur: 0.25 }, // G4
        { freq: 392.0, dur: 0.25 }, // G4
        { freq: 783.99, dur: 0.5 }, // G5
        { freq: 659.25, dur: 0.5 }, // E5
        { freq: 523.25, dur: 0.5 }, // C5
        { freq: 493.88, dur: 0.5 }, // B4
        { freq: 440.0, dur: 0.8 },  // A4
        { freq: 0, dur: 0.15 },     // rest
        { freq: 698.46, dur: 0.3 }, // F5
        { freq: 698.46, dur: 0.3 }, // F5
        { freq: 659.25, dur: 0.5 }, // E5
        { freq: 523.25, dur: 0.5 }, // C5
        { freq: 587.33, dur: 0.5 }, // D5
        { freq: 523.25, dur: 1.4 }, // C5 (triumphant hold)
      ];

      let elapsed = 0;
      const now = this.ctx.currentTime + 0.05;

      notes.forEach((item) => {
        if (!this.ctx) return;
        if (item.freq > 0) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(item.freq, now + elapsed);

          gain.gain.setValueAtTime(0.18, now + elapsed);
          gain.gain.exponentialRampToValueAtTime(0.01, now + elapsed + item.dur * 0.95);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + elapsed);
          osc.stop(now + elapsed + item.dur);
        }
        elapsed += item.dur;
      });
    } catch {
      // Ignore
    }
  }

  // Cheerful looping chiptune BGM
  public startBGM() {
    if (this.isMuted || this.bgmPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.bgmPlaying = true;
    const pattern = [
      261.63, 329.63, 392.0, 523.25,
      392.0, 329.63, 349.23, 440.0,
      392.0, 329.63, 261.63, 196.0,
      220.0, 261.63, 293.66, 392.0,
    ];
    let step = 0;

    const playStep = () => {
      if (!this.bgmPlaying || !this.ctx || this.isMuted) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pattern[step], now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.19);

        step = (step + 1) % pattern.length;
      } catch {
        // Ignore
      }
    };

    this.bgmInterval = window.setInterval(playStep, 220);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public isBGMActive() {
    return this.bgmPlaying;
  }
}

export const retroAudio = new RetroAudioSystem();
