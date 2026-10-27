// Background music player supporting both Web Audio synthesized acoustic romantic arpeggio
// and custom audio URL streams with zero external dependency failures.

class RomanticSynthPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private noteIndex: number = 0;
  private audioEl: HTMLAudioElement | null = null;
  private listeners: Array<(playing: boolean) => void> = [];

  // Romantic acoustic guitar & warm piano frequencies (D Major chord progression)
  // D -> F#m -> Bm -> G -> D -> A -> D
  private chords = [
    // D Major (D3, A3, D4, F#4, A4)
    [146.83, 220.0, 293.66, 369.99, 440.0],
    // F# minor (F#3, C#4, F#4, A4, C#5)
    [185.0, 277.18, 369.99, 440.0, 554.37],
    // B minor (B2, F#3, B3, D4, F#4)
    [123.47, 185.0, 246.94, 293.66, 369.99],
    // G Major (G2, D3, G3, B3, D4)
    [98.0, 146.83, 196.0, 246.94, 293.66],
    // D Major (D3, A3, D4, F#4, D5)
    [146.83, 220.0, 293.66, 369.99, 587.33],
    // A Major (A2, E3, A3, C#4, E4)
    [110.0, 164.81, 220.0, 277.18, 329.63],
    // G Major (G2, B3, D4, G4)
    [98.0, 246.94, 293.66, 392.0],
    // D Major resolution
    [146.83, 220.0, 293.66, 369.99, 440.0],
  ];

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.push(cb);
    cb(this.isPlaying);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async play(customUrl?: string) {
    if (this.isPlaying) return;

    if (customUrl && typeof Audio !== 'undefined') {
      try {
        if (!this.audioEl) {
          this.audioEl = new Audio(customUrl);
          this.audioEl.loop = true;
          this.audioEl.volume = 0.6;
        }
        await this.audioEl.play();
        this.isPlaying = true;
        this.notify();
        return;
      } catch (err) {
        console.warn('Custom audio playback failed, falling back to romantic synthesizer:', err);
      }
    }

    // Web Audio Synthesizer fallback
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }

      this.isPlaying = true;
      this.notify();
      this.startSynthesizerLoop();
    } catch (e) {
      console.warn('Web Audio playback failed:', e);
    }
  }

  public pause() {
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isPlaying = false;
    this.notify();
  }

  public toggle(customUrl?: string) {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play(customUrl);
    }
  }

  private startSynthesizerLoop() {
    if (!this.ctx) return;

    // Arpeggio step duration ~ 420ms
    const stepDuration = 420;
    let chordIdx = 0;
    let noteInChord = 0;

    const playNextNote = () => {
      if (!this.isPlaying || !this.ctx) return;

      const chord = this.chords[chordIdx];
      const freq = chord[noteInChord];

      this.playPluckNote(freq);

      noteInChord++;
      if (noteInChord >= chord.length) {
        noteInChord = 0;
        chordIdx = (chordIdx + 1) % this.chords.length;
      }
    };

    playNextNote();
    this.timerId = window.setInterval(playNextNote, stepDuration);
  }

  private playPluckNote(freq: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Create dual oscillators for warm acoustic resonance
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 1.002, now); // slight chorus detune

    // Warm low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(350, now + 1.2);

    // Pluck envelope: sharp attack, gentle romantic decay
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.7);
    osc2.stop(now + 1.7);
  }
}

export const musicPlayer = new RomanticSynthPlayer();
