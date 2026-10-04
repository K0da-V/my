// Web Audio API synthesizer for realistic phone call sound effects:
// 1. Calling ringback tone (standard dual-frequency 440Hz + 480Hz cadence)
// 2. Reconnecting pulse tone (soft rapid 520Hz + 660Hz double-beep)
// 3. Call hangup / disconnected tone (descending three-tone chime / busy cadence)

class CallAudioManager {
  private ctx: AudioContext | null = null;
  private loopTimer: number | null = null;
  private activeOscillators: OscillatorNode[] = [];

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public stopAll() {
    if (this.loopTimer !== null) {
      window.clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.activeOscillators = [];
  }

  // Ringback tone when calling someone ("tuuuu... tuuuu...")
  public startCallingTone() {
    this.stopAll();
    const playBurst = () => {
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const duration = 1.15;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      // Standard warm phone ringback frequencies (425Hz + 450Hz)
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(425, now);
      osc2.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
      gain.gain.setValueAtTime(0.08, now + duration - 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);

      this.activeOscillators.push(osc1, osc2);
    };

    playBurst();
    this.loopTimer = window.setInterval(playBurst, 3000);
  }

  // Reconnecting tone when connection drops or is re-establishing ("bip-bip... bip-bip...")
  public startReconnectingTone() {
    this.stopAll();
    const playReconnectBeep = () => {
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [0, 0.22].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(idx === 0 ? 540 : 680, now + offset);

        gain.gain.setValueAtTime(0.001, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.07, now + offset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.15);
        this.activeOscillators.push(osc);
      });
    };

    playReconnectBeep();
    this.loopTimer = window.setInterval(playReconnectBeep, 1600);
  }

  // Soft confirmation chime when call connects
  public playConnectedTone() {
    this.stopAll();
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25]; // C5 -> E5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);

      gain.gain.setValueAtTime(0.001, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.24);
    });
  }

  // Disconnecting / Hang-up sound ("tu-tu-tu" descending end-call tone)
  public playHangupTone() {
    this.stopAll();
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [480, 420, 340];
    notes.forEach((freq, index) => {
      const start = now + index * 0.18;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
      gain.gain.setValueAtTime(0.09, start + 0.11);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.16);
    });
  }
}

export const callAudio = new CallAudioManager();
