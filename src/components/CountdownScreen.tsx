import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CounterLoading from '@/components/ui/counter-loader'
import { SomethingSpecialEffect } from '@/components/ui/apple-hello-effect'
import { startMusic } from './AudioManager'

const MEMORY_VIDEOS = [
  '/1B773CEE-268A-4681-B22D-0BB14DCE5396.mp4',
  '/46B86D21-1FEB-477D-BF58-753C5801B1D2.mp4',
  '/546605D4-2D49-47B5-8CA0-118C135FDB6E.mp4',
  '/547303CB-5961-4E1D-9551-E0C535593B92.mp4',
  '/6F8C27F3-ED5C-4803-B8A5-0DD50D891A02.mp4',
  '/7391C462-4E23-4584-8D23-7542444B77FE.mp4',
]

interface CountdownScreenProps {
  onDone: () => void
}

export default function CountdownScreen({ onDone }: CountdownScreenProps) {
  const [phase, setPhase] = useState<'tap' | 'counting'>('tap')
  const [count, setCount] = useState(18)
  const [exiting, setExiting] = useState(false)
  const videoEls = useRef<HTMLVideoElement[]>([])

  // Preload FriendPage videos silently the moment this screen mounts
  useEffect(() => {
    const els: HTMLVideoElement[] = []
    MEMORY_VIDEOS.forEach((src) => {
      const v = document.createElement('video')
      v.preload = 'auto'
      v.muted = true
      v.playsInline = true
      v.src = src
      els.push(v)
    })
    videoEls.current = els
    return () => {
      els.forEach((v) => { v.src = '' })
    }
  }, [])

  // Countdown tick
  useEffect(() => {
    if (phase !== 'counting') return

    if (count === 0) {
      setExiting(true)
      setTimeout(onDone, 900)
      return
    }

    if (count === 11) {
      startMusic()
    }

    const t = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, phase, onDone])

  const handleTap = useCallback(() => {
    if (phase !== 'tap') return
    // Pre-warm AudioContext on first user gesture (required by browsers)
    const H = (window as any).Howler
    if (H?.ctx?.state === 'suspended') H.ctx.resume()
    setPhase('counting')
  }, [phase])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="countdown"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: 'easeInOut' } }}
          onClick={handleTap}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
          style={{ background: '#000000' }}
        >
          {/* Soft radial glow that pulses on low counts */}
          {phase === 'counting' && count <= 5 && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,216,155,0.12), transparent 70%)',
              }}
            />
          )}

          <AnimatePresence mode="wait">
            {phase === 'tap' ? (
              /* ── TAP TO BEGIN ── */
              <motion.div
                key="tap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                className="absolute flex flex-col items-center gap-7"
              >
                <SomethingSpecialEffect
                  speed={1.1}
                  style={{ color: '#ffd89b', filter: 'drop-shadow(0 0 30px rgba(255,216,155,0.35))' }}
                />

                <motion.p
                  animate={{ opacity: [0.25, 0.7, 0.25] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,216,155,0.5)',
                    fontFamily: 'sans-serif',
                  }}
                >
                  Tap anywhere to begin
                </motion.p>
              </motion.div>
            ) : (
              /* ── COUNTING ── */
              <motion.div
                key="counting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                className="absolute flex flex-col items-center gap-3"
              >
                <motion.p
                  animate={{ opacity: count <= 5 ? [0.5, 1, 0.5] : 0.4 }}
                  transition={{ duration: 1, repeat: count <= 5 ? Infinity : 0 }}
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: count <= 5 ? '#ffd89b' : 'rgba(255,216,155,0.35)',
                    fontFamily: 'sans-serif',
                    transition: 'color 0.5s ease',
                  }}
                >
                  {count <= 5 ? "Almost there..." : "Preparing your gift"}
                </motion.p>

                <CounterLoading count={count} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
