import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function FriendNode({ friend, visited, index }: { friend: any; visited: boolean; index: number }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const size = 110 // px, desktop — mobile handled via scale

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 * index, type: 'spring', stiffness: 200, damping: 18 }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        // Center the node itself
        marginLeft: `${friend.position.x - size / 2}px`,
        marginTop: `${friend.position.y - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <motion.button
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={() => navigate(`/friend/${friend.id}`)}
        className="relative w-full h-full rounded-full cursor-pointer flex items-center justify-center focus:outline-none"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${friend.color}cc, ${friend.color}55)`,
          border: `2px solid ${friend.color}88`,
          '--node-color': friend.color,
        }}
        whileHover={{
          scale: 1.15,
          boxShadow: `0 0 28px ${friend.color}cc, 0 0 56px ${friend.color}55`,
        }}
        whileTap={{ scale: 0.95 }}
        animate={
          !hovered
            ? {
                boxShadow: [
                  `0 0 12px ${friend.color}66`,
                  `0 0 22px ${friend.color}aa`,
                  `0 0 12px ${friend.color}66`,
                ],
              }
            : {}
        }
        transition={!hovered ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
        aria-label={`Visit ${friend.name}`}
      >
        {/* Initials or letter */}
        <span
          className="font-serif text-xl font-medium select-none"
          style={{ color: friend.color, textShadow: `0 0 10px ${friend.color}` }}
        >
          {friend.name[0]}
        </span>

        {/* Visited checkmark */}
        {visited && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: friend.color }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="#0a0e27" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </motion.button>

      {/* Name tooltip */}
      <motion.div
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
        transition={{ duration: 0.2 }}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ top: `${size + 10}px`, whiteSpace: 'nowrap' }}
        aria-hidden="true"
      >
        <span
          className="font-sans text-sm font-medium px-3 py-1 rounded-full"
          style={{
            background: 'rgba(10,14,39,0.85)',
            border: `1px solid ${friend.color}66`,
            color: '#fff8e7',
            backdropFilter: 'blur(8px)',
          }}
        >
          {friend.name}
        </span>
      </motion.div>
    </motion.div>
  )
}
