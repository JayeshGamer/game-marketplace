// Tactical Mechanical Audio Synthesizer (Web Audio API - Zero External Assets)
// Produces 4ms-15ms microswitch clicks, mechanical relay clicks, and frequency pings.

let audioCtx = null;
let soundEnabled = true;

if (typeof window !== "undefined") {
    const saved = localStorage.getItem("vault_sound_enabled");
    if (saved !== null) {
        soundEnabled = saved === "true";
    }
}

function getAudioContext() {
    if (typeof window === "undefined") return null;
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
    }
    return audioCtx;
}

export function isSoundEnabled() {
    return soundEnabled;
}

export function toggleSound() {
    soundEnabled = !soundEnabled;
    if (typeof window !== "undefined") {
        localStorage.setItem("vault_sound_enabled", String(soundEnabled));
    }
    if (soundEnabled) {
        playMechanicalClick(1200, 0.04);
    }
    return soundEnabled;
}

// 1. Crisp Microswitch Click (buttons, links, tabs)
export function playMechanicalClick(freq = 1100, volume = 0.05) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.012);

        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.015);
    } catch {
        // Audio policy ignore
    }
}

// 2. Subtle Hover Tick (subtle high-frequency tick for list items/cards)
export function playHoverTick() {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(2400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.006);

        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.006);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.008);
    } catch {
        // Audio policy ignore
    }
}

// 3. Futuristic Uplink Chirp (add to cart, checkout, confirmation)
export function playUplinkChirp() {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.04);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch {
        // Audio policy ignore
    }
}
