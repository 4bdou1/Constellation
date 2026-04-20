import { useEffect } from 'react'
import { Howl, Howler } from 'howler'

const TRACKS = [
  '/Ayra Starr - Rush.mp3',
  '/Ruger_-_Asiwaju_Gidifans.com.mp3',
]

const VOLUME = 0.22

// Module-level singleton — survives StrictMode double-invoke
let howl: Howl | null = null
let trackIndex = 0
let playing = false

function playTrack(index: number) {
  howl?.unload()

  const sound = new Howl({
    src: [TRACKS[index]],
    volume: VOLUME,
    onend: () => {
      trackIndex = (index + 1) % TRACKS.length
      playTrack(trackIndex)
    },
    onplayerror: () => {
      sound.once('unlock', () => sound.play())
    },
  })

  howl = sound
  sound.play()
  playing = true
}

function playTrackFadeIn(index: number) {
  howl?.unload()

  const sound = new Howl({
    src: [TRACKS[index]],
    volume: 0,
    onend: () => {
      trackIndex = (index + 1) % TRACKS.length
      playTrack(trackIndex)
    },
    onplayerror: () => {
      sound.once('unlock', () => sound.play())
    },
  })

  howl = sound
  sound.play()
  sound.fade(0, VOLUME, 11000)
  playing = true
}

// Called by CountdownScreen when the countdown reaches 9
export function startMusic() {
  if (playing) return
  const H = Howler as any
  if (H?.ctx?.state === 'suspended') {
    H.ctx.resume().then(() => playTrackFadeIn(0))
  } else {
    playTrackFadeIn(0)
  }
}

export default function AudioManager() {
  useEffect(() => {
    // Unlock AudioContext on any interaction (needed for iOS/Safari)
    const onInteract = () => {
      const H = Howler as any
      if (H?.ctx?.state === 'suspended') H.ctx.resume()
    }
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart']
    events.forEach((e) => window.addEventListener(e, onInteract, { once: true, passive: true }))
    return () => {
      events.forEach((e) => window.removeEventListener(e, onInteract))
    }
  }, [])

  return null
}
