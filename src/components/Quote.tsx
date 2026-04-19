import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { constellationQuotes } from '../data/quotes'

export default function FloatingQuotes() {
  const [activeIndex, setActiveIndex] = useState(0)

  // Cycle quotes every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % constellationQuotes.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-live="polite" aria-atomic="true">
      <AnimatePresence mode="wait">
        <motion.p
          key={activeIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.55, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.2 }}
          className="absolute font-sans italic text-sm sm:text-base text-warm-gold text-center px-6 max-w-xs sm:max-w-sm"
          style={{
            bottom: '18%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          "{constellationQuotes[activeIndex]}"
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
