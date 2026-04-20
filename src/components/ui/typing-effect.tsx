'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
function cn(...inputs: any[]) { return twMerge(clsx(inputs)) }

interface TypingEffectProps {
  texts?: string[]
  className?: string
  style?: React.CSSProperties
  rotationInterval?: number
  typingSpeed?: number
  trigger?: boolean  // typing only starts when this flips to true
}

const DEMO = ['Design', 'Development', 'Marketing']

// persists across remounts so typing never replays in the same session
const completedTexts = new Set<string>()

export const TypingEffect = ({
  texts = DEMO,
  className,
  style,
  rotationInterval = 3000,
  typingSpeed = 150,
  trigger = true,
}: TypingEffectProps) => {
  const key = texts.join('|')
  const alreadyDone = completedTexts.has(key)

  const [displayedText, setDisplayedText] = useState(alreadyDone ? texts[texts.length - 1] : '')
  const [currentTextIndex, setCurrentTextIndex] = useState(alreadyDone ? texts.length - 1 : 0)
  const [charIndex, setCharIndex] = useState(alreadyDone ? texts[texts.length - 1].length : 0)
  const [done, setDone] = useState(alreadyDone)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentText = texts[currentTextIndex % texts.length]
  const isLastText = currentTextIndex === texts.length - 1

  useEffect(() => {
    if (!trigger || done) return

    if (charIndex < currentText.length) {
      const t = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText.charAt(charIndex))
        setCharIndex(charIndex + 1)
      }, typingSpeed)
      return () => clearTimeout(t)
    } else if (isLastText) {
      setDone(true)
      completedTexts.add(key)
    } else {
      const t = setTimeout(() => {
        setDisplayedText('')
        setCharIndex(0)
        setCurrentTextIndex((prev) => (prev + 1) % texts.length)
      }, rotationInterval)
      return () => clearTimeout(t)
    }
  }, [trigger, charIndex, currentText, done])

  return (
    <div
      ref={containerRef}
      style={style}
      className={cn(
        'relative inline-flex items-center justify-center text-center text-4xl font-bold',
        className
      )}
    >
      {displayedText}
      {!done && trigger && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
          className={cn('ml-1 h-[1em] w-1 rounded-sm bg-current')}
        />
      )}
    </div>
  )
}

export default TypingEffect
