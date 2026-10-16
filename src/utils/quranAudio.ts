/**
 * Resilient Quranic Audio & Acoustic Synthesis Engine
 * Attempts authentic Quranic audio playback from Islamic Network CDN (Sheikh Mishary Rashid Alafasy),
 * with automatic fallback to Arabic Web Speech synthesis and Web Audio API harmonic vocal-tract tone
 * modeling so audio feedback works 100% reliably in any sandboxed or offline browser environment.
 */

class QuranAudioController {
  private audioElement: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private stopTimer: number | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public stopAll(): void {
    if (this.stopTimer) {
      window.clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Plays full Ayah recitation from Islamic Network CDN, falling back to speech/acoustic synthesis
   */
  public playAyah(
    globalAyahNumber: number,
    arabicText: string,
    playbackRate: number,
    onStart?: () => void,
    onEnd?: () => void,
    onFallbackUsed?: (mode: 'cdn' | 'speech-synth') => void
  ): void {
    this.stopAll();
    onStart?.();

    const cdnUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = cdnUrl;
    audio.playbackRate = playbackRate;
    this.audioElement = audio;

    let handledFallback = false;

    const triggerFallback = () => {
      if (handledFallback) return;
      handledFallback = true;
      onFallbackUsed?.('speech-synth');
      this.playArabicSpeechOrHarmonic(arabicText, 210, Math.round(3200 / playbackRate), playbackRate, onEnd);
    };

    audio.onended = () => {
      if (!handledFallback) {
        onEnd?.();
      }
    };

    audio.onerror = () => {
      triggerFallback();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          onFallbackUsed?.('cdn');
        })
        .catch(() => {
          triggerFallback();
        });
    }
  }

  /**
   * Plays an individual Arabic word or phoneme with acoustic formant resonance
   */
  public playWordOrPhoneme(
    arabicText: string,
    baseFreq: number = 220,
    beats: number = 2,
    playbackRate: number = 1.0,
    onEnd?: () => void
  ): void {
    this.stopAll();
    const durationMs = Math.max(650, Math.round((beats * 520) / playbackRate));
    this.playArabicSpeechOrHarmonic(arabicText, baseFreq, durationMs, playbackRate, onEnd);
  }

  private playArabicSpeechOrHarmonic(
    arabicText: string,
    baseFreq: number,
    durationMs: number,
    playbackRate: number,
    onEnd?: () => void
  ): void {
    // Always play a gentle warm acoustic formant chime so the user gets immediate tactile audio feedback
    this.playHarmonicFormantChord(baseFreq, durationMs);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(arabicText);
        utterance.lang = 'ar-SA';
        utterance.rate = Math.min(1.2, Math.max(0.65, playbackRate * 0.85));
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const arabicVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
        if (arabicVoice) {
          utterance.voice = arabicVoice;
        }

        utterance.onend = () => {
          if (this.stopTimer) {
            window.clearTimeout(this.stopTimer);
            this.stopTimer = null;
          }
          onEnd?.();
        };

        utterance.onerror = () => {
          // Rely on timer if speech synthesis errors
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback timer handles completion
      }
    }

    this.stopTimer = window.setTimeout(() => {
      onEnd?.();
    }, durationMs);
  }

  private playHarmonicFormantChord(baseFreq: number, durationMs: number): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const durationSec = Math.min(2.8, Math.max(0.45, durationMs / 1000));

    // Fundamental + fifth + octave warm acoustic bell/reed envelope
    const harmonics = [1, 1.498, 2];
    const gains = [0.08, 0.035, 0.015];

    harmonics.forEach((mult, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * mult, now);
      // Subtle pitch inflection representing Tajweed melodic contour
      osc.frequency.exponentialRampToValueAtTime(baseFreq * mult * 1.03, now + durationSec * 0.45);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * mult * 0.99, now + durationSec);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gains[idx], now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec + 0.02);
    });
  }
}

export const quranAudio = new QuranAudioController();
