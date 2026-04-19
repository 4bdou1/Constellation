import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function PlayIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="rgba(10,14,39,0.7)" />
      <path d="M13 10.5L23 16L13 21.5V10.5Z" fill="#ffd89b" />
    </svg>
  )
}

function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="w-8 h-8 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: '#ffd89b',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Smoothly ramp Howler's global volume to avoid jarring cuts
function tweenMusicVolume(target: number, ms = 700) {
  const H = (window as any).Howler
  if (!H) return
  const from = H.volume()
  const start = performance.now()
  const tick = () => {
    const t = Math.min((performance.now() - start) / ms, 1)
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    H.volume(from + (target - from) * eased)
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

// Present video — autoplays with audio; ducks background music while playing
export function PresentVideo({ src, friendName, naturalAspect = false, objectPosition = 'center' }: { src: string; friendName: string; naturalAspect?: boolean; objectPosition?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Restore music when leaving the page
  useEffect(() => {
    return () => { tweenMusicVolume(0.22, 900) }
  }, [])

  return (
    <div
      className={naturalAspect ? 'w-full relative' : 'video-vertical w-full relative'}
      style={{ maxWidth: '360px', maxHeight: 'calc(100vh - 220px)', margin: '0 auto', overflow: 'hidden' }}
    >
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-midnight-blue rounded-xl">
          <Spinner />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-midnight-blue rounded-xl gap-2 p-4">
          <span className="text-star-glow text-3xl">✦</span>
          <p className="text-warm-gold/70 text-sm text-center font-sans">
            Video coming soon
          </p>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover rounded-xl"
          style={{ objectPosition }}
          onLoadedData={() => setLoading(false)}
          onError={() => { setError(true); setLoading(false) }}
          onPlay={() => tweenMusicVolume(0)}
          onPause={() => tweenMusicVolume(0.22)}
          onEnded={() => tweenMusicVolume(0.22)}
          aria-label={`Present video of ${friendName}`}
        />
      )}
    </div>
  )
}

// Past video — click to play, smaller thumbnail
export function PastVideo({ src, index, activeIndex, onPlay }: { src: string; index: number; activeIndex: number | null; onPlay: (index: number | null) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const isActive = activeIndex === index

  useEffect(() => {
    if (!videoRef.current) return
    if (isActive) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isActive])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="video-vertical relative cursor-pointer rounded-xl overflow-hidden"
      style={{ maxWidth: '150px', flex: '1 1 140px' }}
      onClick={() => onPlay(isActive ? null : index)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onPlay(isActive ? null : index)}
      aria-label={`Past memory ${index + 1}`}
    >
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-midnight-blue">
          <Spinner />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-midnight-blue p-2">
          <span className="text-star-glow text-lg">✦</span>
          <p className="text-warm-gold/50 text-xs text-center font-sans mt-1">Coming soon</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            loop
            className="w-full h-full object-cover"
            onLoadedData={() => setLoading(false)}
            onError={() => { setError(true); setLoading(false) }}
          />
          {!isActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-colors duration-200">
              <PlayIcon />
            </div>
          )}
          {isActive && (
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 2px rgba(255,216,155,0.7)' }}
            />
          )}
        </>
      )}
    </motion.div>
  )
}
