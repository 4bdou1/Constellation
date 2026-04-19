import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const MESSAGE = `These are the beautiful souls we grew with, the ones who made every moment feel like it mattered.

And sweetheart, this isn't the last time we see their faces — together, as I promised you, we'll meet every single one of them again. We'll laugh, we'll reminisce, we'll create new memories that'll sit right beside the old ones.

Making it happen isn't just a hope, it's a plan. Bi idhnillah, we'll bring everyone together again.

And yes, I also can't wait to show off my incredible wife to them all over again.`

export default function Finale() {
  const navigate = useNavigate()

  // Guard: redirect if not all friends visited
  useEffect(() => {
    const visited = JSON.parse(localStorage.getItem('visitedFriends') || '[]')
    if (visited.length < 6) {
      navigate('/constellation', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* Warm centre glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,216,155,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Star icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <path
              d="M24 3 L27.5 16.5 L41 16.5 L30 25 L33.5 38.5 L24 30 L14.5 38.5 L18 25 L7 16.5 L20.5 16.5 Z"
              fill="#ffd89b"
              style={{ filter: 'drop-shadow(0 0 12px #ffd89b)' }}
            />
          </svg>
        </motion.div>

        {/* Message card */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-2xl rounded-2xl p-8 sm:p-12"
          style={{
            background: 'rgba(26, 31, 58, 0.75)',
            border: '1px solid rgba(255,216,155,0.25)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 60px rgba(255,216,155,0.06), 0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {MESSAGE.split('\n\n').map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.25 }}
              className="font-sans text-base sm:text-lg leading-8 text-soft-cream/90 mb-6 last:mb-0"
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.article>

        {/* Signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="mt-8 font-serif italic text-sm"
          style={{ color: '#ffd89b' }}
        >
          Made with love by your husband ♥
        </motion.p>

        {/* Back link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          onClick={() => navigate('/constellation')}
          className="mt-10 font-sans text-xs text-warm-gold/40 hover:text-warm-gold/70 transition-colors duration-200 tracking-widest uppercase"
        >
          ← Back to Constellation
        </motion.button>
      </div>
    </div>
  )
}
