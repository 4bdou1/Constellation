import { useRef, useState, useEffect, useCallback } from 'react'
import TypingEffect from '@/components/ui/typing-effect'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RadialScrollGallery } from '@/components/ui/portfolio-and-image-gallery'
import { CircularGallery } from '@/components/ui/circular-gallery'
import { ContainerTextScroll } from '@/components/ui/container-text-scroll'
import { ParticleTextEffect } from '@/components/ui/particle-text-effect'
import { friends } from '../data/friends'
import { Check } from 'lucide-react'

function tweenVol(target: number, ms = 800) {
  const H = (window as any).Howler
  if (!H) return
  const from = H.volume()
  const t0 = performance.now()
  const tick = () => {
    const t = Math.min((performance.now() - t0) / ms, 1)
    const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    H.volume(from + (target - from) * e)
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

function StrVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  const onPlay = useCallback(() => tweenVol(0, 600), [])
  const onPause = useCallback(() => tweenVol(1, 800), [])

  // Auto-play when scrolled into view, pause when scrolled away
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.4 },
    )
    obs.observe(video)
    return () => obs.disconnect()
  }, [])

  return (
    <ContainerTextScroll>
      <video
        ref={videoRef}
        src="/STR.mp4"
        loop
        playsInline
        preload="metadata"
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onPause}
        className="w-full h-full object-cover"
      />
    </ContainerTextScroll>
  )
}

const MESSAGE = `You carry so much, even when no one sees it. So let me carry something for you tonight - these voices, these faces, these moments that refuse to fade.  I brought it all back for you, sweetheart. Not to stay in the past, but to remind you what's still waiting in the future.  Welcome to what I call the constellation.`

function FlipCard({ onContinue }: { onContinue: () => void }) {
  const [flipped, setFlipped] = useState(false)
  const [showContinue, setShowContinue] = useState(false)

  const handleFlip = () => {
    if (flipped) return
    setFlipped(true)
    setTimeout(() => setShowContinue(true), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Card */}
      <div
        onClick={handleFlip}
        className="cursor-pointer"
        style={{ width: 'min(600px, 90vw)', perspective: '1200px' }}
        role="button"
        aria-label="Flip card to reveal message"
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '300px',
            height: 'min(400px, 60vw)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ── Front ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: 'rgba(26,31,58,0.80)',
              border: '1px solid #ffd89b',
              borderRadius: '16px',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            {/* Star icon */}
            <motion.div
              animate={{
                filter: [
                  'drop-shadow(0 0 6px #ffd89b88)',
                  'drop-shadow(0 0 18px #ffd89b)',
                  'drop-shadow(0 0 6px #ffd89b88)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path
                  d="M20 2 L22.9 13.1 L34 13.1 L25.1 19.9 L28 31 L20 24.2 L12 31 L14.9 19.9 L6 13.1 L17.1 13.1 Z"
                  fill="#ffd89b"
                />
              </svg>
            </motion.div>

            {/* Front text */}
            <motion.p
              animate={{
                boxShadow: [
                  '0 0 20px rgba(255,216,155,0)',
                  '0 0 40px rgba(255,216,155,0.15)',
                  '0 0 20px rgba(255,216,155,0)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '24px',
                color: '#ffd89b',
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              A message for you
            </motion.p>

            <p style={{ fontSize: '11px', color: 'rgba(255,248,231,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
              Click to open
            </p>
          </div>

          {/* ── Back ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'rgba(26,31,58,0.88)',
              border: '1px solid #ffd89b',
              borderRadius: '16px',
              padding: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p
              style={{
                fontFamily: "'Inter', 'DM Sans', sans-serif",
                fontSize: '18px',
                color: '#fff8e7',
                lineHeight: 1.8,
                textAlign: 'center',
              }}
            >
              {MESSAGE}
            </p>
          </div>
        </div>
      </div>

      {/* Quote — fades in 2s after flip */}
      <AnimatePresence>
        {showContinue && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="flex flex-col items-center gap-3 cursor-pointer"
            onClick={onContinue}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(18px, 2.5vw, 26px)',
                fontStyle: 'italic',
                color: '#fff8e7cc',
                textAlign: 'center',
                lineHeight: 1.5,
                maxWidth: '420px',
              }}
            >
              "Distance is just a test of how far love can travel."
            </p>
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: '11px', color: 'rgba(255,216,155,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'sans-serif' }}
            >
              scroll to explore
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


export default function Landing({ countdownDone = false }: { countdownDone?: boolean }) {
  const navigate = useNavigate()
  const galleryRef = useRef<HTMLDivElement>(null)
  const particleRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Restore scroll position when returning from a friend page
  useEffect(() => {
    const saved = sessionStorage.getItem('landingScrollY')
    if (saved) {
      window.scrollTo({ top: parseInt(saved, 10), behavior: 'instant' })
      sessionStorage.removeItem('landingScrollY')
    }
  }, [])

  const navigateToFriend = (id: string) => {
    sessionStorage.setItem('landingScrollY', String(window.scrollY))
    navigate(`/friend/${id}`)
  }

  // Fade music out completely when the particle quote section is reached
  useEffect(() => {
    const el = particleRef.current
    if (!el) return
    let faded = false
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !faded) {
          faded = true
          tweenVol(0, 4000)
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="text-[#fff8e7]">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">

        <motion.div
          className="relative z-10 flex flex-col items-center text-center px-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.35 } },
          }}
        >
          {/* Heading */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}
            className="mb-4"
          >
            <TypingEffect
              texts={['Welcome Monkey']}
              typingSpeed={90}
              rotationInterval={999999}
              trigger={countdownDone}
              className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium leading-tight"
              style={{ color: '#ffd89b', textShadow: '0 0 40px rgba(255,216,155,0.3)' }}
            />
          </motion.div>

          {/* Flip card */}
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.7 } } }}
          >
            <FlipCard onContinue={scrollToGallery} />
          </motion.div>
        </motion.div>
      </div>

      {/* Gallery Section */}
      <div ref={galleryRef} className="relative z-10 py-12 sm:py-32">
        {/* Header */}
        <div className="text-center mb-0 px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl sm:text-6xl text-[#ffd89b] mb-6"
          >
            The Hearts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans text-[#fff8e7] max-w-lg mx-auto italic text-lg"
          >
            {isMobile ? 'Tap a card to discover each soul.' : 'Scroll further to find the voices that still echo in your heart'}
          </motion.p>
        </div>

        {isMobile ? (
          <CircularGallery
            items={friends.map(f => ({ id: f.id, name: f.name, quote: f.quote, photo: f.photo, color: f.color }))}
            onItemClick={(id) => navigateToFriend(id)}
          />
        ) : (
          <RadialScrollGallery
            baseRadius={460}
            mobileRadius={240}
            scrollDuration={2500}
            visiblePercentage={45}
            onItemSelect={(index) => navigateToFriend(friends[index].id)}
          >
            {(hoveredIndex) =>
              friends.map((friend, index) => {
                const isActive = hoveredIndex === index;
                return (
                  <div
                    key={index}
                    className={`
                      w-[180px] h-[260px] sm:w-[240px] sm:h-[320px]
                      rounded-2xl border p-8 flex flex-col justify-between items-start
                      transition-all duration-500 shadow-xl overflow-hidden relative
                      ${isActive
                        ? 'border-[#ffd89b] text-[#ffd89b] scale-100 shadow-[0_0_40px_rgba(255,216,155,0.2)]'
                        : 'border-white/10 text-[#fff8e7]/30 scale-90 opacity-40'
                      }
                    `}
                  >
                    {friend.photo ? (
                      <img
                        src={friend.photo}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: isActive ? 0.45 : 0.2 }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ background: isActive ? 'rgba(26,31,58,0.85)' : 'rgba(10,14,39,0.7)' }}
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.2) 100%)' }}
                    />
                    <div className="relative w-full flex justify-end items-start z-10">
                      {isActive && (
                        <motion.div layoutId="active-check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check className="w-6 h-6 text-[#ffd89b]" />
                        </motion.div>
                      )}
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-3xl font-serif font-medium mb-3 tracking-tight">{friend.name}</h3>
                      <p className={`text-xs leading-relaxed line-clamp-4 font-sans ${isActive ? 'text-[#fff8e7]/80' : 'text-[#fff8e7]/30'}`}>
                        {friend.quote}
                      </p>
                    </div>
                  </div>
                );
              })
            }
          </RadialScrollGallery>
        )}
      </div>

      {/* STR video section */}
      <div className="relative z-10 px-4">
        <StrVideoSection />
      </div>

      {/* Closing message */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center px-6 pb-32 pt-8 max-w-2xl mx-auto"
      >
        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-16 w-full max-w-xs">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,216,155,0.3))' }} />
          <svg width="14" height="14" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M20 2 L22.9 13.1 L34 13.1 L25.1 19.9 L28 31 L20 24.2 L12 31 L14.9 19.9 L6 13.1 L17.1 13.1 Z" fill="#ffd89b" opacity="0.6" />
          </svg>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,216,155,0.3))' }} />
        </div>

        {/* Message paragraphs */}
        {[
          "These are the beautiful souls we grew with, the ones who made every moment feel like it mattered.",
          "And sweetheart, this isn't the last time we see their faces — together, as I promised you, we'll meet every single one of them again. We'll laugh, we'll reminisce, we'll create new memories that'll sit right beside the old ones.",
          "Making it happen isn't just a hope, it's a plan. Bi idhnillah, we'll bring everyone together again.",
          "And yes, I also can't wait to show off my incredible wife to them all over again.",
        ].map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.18 }}
            className="font-serif text-lg sm:text-xl leading-relaxed mb-7 last:mb-0"
            style={{ color: i === 2 ? '#ffd89b' : '#fff8e7cc' }}
          >
            {para}
          </motion.p>
        ))}

        {/* Signature */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-14 font-serif italic text-base"
          style={{ color: '#ffd89b99' }}
        >
          Made with love by your husband ♥
        </motion.p>
      </motion.div>

      {/* Particle quote section */}
      <motion.div
        ref={particleRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.4 }}
        className="relative z-10 w-full pb-24"
      >
        <ParticleTextEffect
          words={[
            "If I had to choose",
            "one view forever,",
            "it would be you",
            "smiling",
            "I",
            "LOVE",
            "YOU",
            "ANAGHIM",
          ]}
        />
      </motion.div>
    </div>
  )
}
