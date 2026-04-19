import { useEffect, useRef } from 'react'
import { Howl, Howler } from 'howler'

const TRACKS = [
  '/Ayra Starr - Rush.mp3',
  '/Ruger_-_Asiwaju_Gidifans.com.mp3',
]

const VOLUME = 0.22

export default function AudioManager() {
  const indexRef = useRef(0)
  const howlRef = useRef<Howl | null>(null)
  const playingRef = useRef(false)

  function playTrack(index: number) {
    howlRef.current?.unload()

    const sound = new Howl({
      src: [TRACKS[index]],
      html5: true,
      volume: VOLUME,
      onend: () => {
        const next = (index + 1) % TRACKS.length
        indexRef.current = next
        playTrack(next)
      },
      onplayerror: () => {
        // AudioContext locked — wait for interaction
        sound.once('unlock', () => sound.play())
      },
    })

    howlRef.current = sound
    sound.play()
    playingRef.current = true
  }

  useEffect(() => {
    // Try autoplay immediately
    playTrack(0)

    // Also hook into first interaction as extra safety net
    const onInteract = () => {
      if (!playingRef.current) playTrack(indexRef.current)
      // Resume suspended Web Audio context if needed
      if ((Howler as any).ctx?.state === 'suspended') {
        ;(Howler as any).ctx.resume()
      }
    }
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'touchstart', 'scroll']
    events.forEach(e => window.addEventListener(e, onInteract, { once: true, passive: true }))

    return () => {
      events.forEach(e => window.removeEventListener(e, onInteract))
      howlRef.current?.unload()
      playingRef.current = false
    }
  }, [])

  return null
}
