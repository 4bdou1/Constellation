import { motionValue } from 'framer-motion'

export const beatStore = {
  bass: motionValue(0),
  mid: motionValue(0),
  treble: motionValue(0),
  overall: motionValue(0),
  kick: motionValue(0),
}

let rafId: number | null = null
let analyser: AnalyserNode | null = null
let dataArray: Uint8Array | null = null
let prevBass = 0

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  beatStore.bass.set(0)
  beatStore.mid.set(0)
  beatStore.treble.set(0)
  beatStore.overall.set(0)
  beatStore.kick.set(0)
}

function startLoop() {
  if (!analyser || !dataArray) return
  const tick = () => {
    analyser!.getByteFrequencyData(dataArray as any)
    const len = dataArray!.length

    // Focus bass tightly on kick/sub-bass (first ~5% of bins ≈ 0–550 Hz at 44 kHz)
    const bassEnd = Math.max(2, Math.floor(len * 0.05))
    const midEnd  = Math.floor(len * 0.45)

    let bassSum = 0, midSum = 0, trebleSum = 0
    for (let i = 0; i < bassEnd; i++) bassSum += dataArray![i]
    for (let i = bassEnd; i < midEnd; i++) midSum += dataArray![i]
    for (let i = midEnd; i < len; i++) trebleSum += dataArray![i]

    // Boost bass sensitivity — these bins are loud, so normalise more aggressively
    const bass    = Math.min(1, (bassSum / (bassEnd * 255)) * 2.2)
    const mid     = midSum / ((midEnd - bassEnd) * 255)
    const treble  = trebleSum / ((len - midEnd) * 255)
    const overall = bass * 0.6 + mid * 0.3 + treble * 0.1

    const delta = bass - prevBass
    prevBass = bass
    const kick = delta > 0.055 ? Math.min(1, delta * 7) : Math.max(0, beatStore.kick.get() * 0.78)

    beatStore.bass.set(bass)
    beatStore.mid.set(mid)
    beatStore.treble.set(treble)
    beatStore.overall.set(overall)
    beatStore.kick.set(kick)

    rafId = requestAnimationFrame(tick)
  }
  rafId = requestAnimationFrame(tick)
}

export function attachAnalyser(ctx: AudioContext, source: AudioNode) {
  if (analyser) return
  analyser = ctx.createAnalyser()
  analyser.fftSize = 256
  analyser.smoothingTimeConstant = 0.48
  dataArray = new Uint8Array(analyser.frequencyBinCount)
  source.connect(analyser)
  startLoop()
}

export function suspendAnalyser() {
  stopLoop()
}

export function resumeAnalyser() {
  if (analyser && rafId === null) startLoop()
}
