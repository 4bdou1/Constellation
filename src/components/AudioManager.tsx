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
    html5: true,
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

export default function AudioManager() {
  useEffect(() => {
    if (playing) return

    playTrack(0)

    const onInteract = () => {
      if (!playing) playTrack(trackIndex)
      if ((Howler as any).ctx?.state === 'suspended') {
        ;(Howler as any).ctx.resume()
      }
    }
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => window.addEventListener(e, onInteract, { once: true, passive: true }))

    return () => {
      events.forEach(e => window.removeEventListener(e, onInteract))
    }
  }, [])

  return null
}
