/**
 * @BAUTO_REFACTOR 2026-09-28
 * @Modulo: WEB (Vercel Headless)
 * @Propósito: Microinteracciones acústicas hápticas con Web Audio API nativa (-24dB)
 * @Capa: Estética / Técnica
 * @Riesgo_Evaluado: Bajo - API nativa de audio sin assets externos (0 bytes de payload)
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Reproduce un chasquido acústico cálido y de alta fidelidad a -24dB.
 * Emula la respuesta mecánica de perillas analógicas y dispositivos de alta gama.
 */
export function playHapticClick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;

    // Frecuencia inicial y caída suave tipo perilla analógica
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.028);

    // Ganancia calibrada a -24dB (amplitud máxima ~0.063)
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Falla silenciosa si las políticas de medios del navegador bloquean el audio
  }
}

export const playHapticFeedback = playHapticClick;
export const playClickSound = playHapticClick;

/**
 * Reproduce un tono sutil ascendente para acciones de éxito o añadido a bolsa.
 */
export function playSuccessChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.085);
  } catch {
    // Falla silenciosa
  }
}
