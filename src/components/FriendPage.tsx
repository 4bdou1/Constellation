import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { friends } from '../data/friends'
import { PresentVideo } from './VideoPlayer'
import InfiniteVideoGallery from '@/components/ui/3d-gallery-photography'

const MEMORY_VIDEOS = [
  '/1B773CEE-268A-4681-B22D-0BB14DCE5396.mp4',
  '/46B86D21-1FEB-477D-BF58-753C5801B1D2.mp4',
  '/546605D4-2D49-47B5-8CA0-118C135FDB6E.mp4',
  '/547303CB-5961-4E1D-9551-E0C535593B92.mp4',
  '/6F8C27F3-ED5C-4803-B8A5-0DD50D891A02.mp4',
  '/7391C462-4E23-4584-8D23-7542444B77FE.mp4',
]

function ArrowLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 4L7 10L12.5 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function FriendPage() {
  const { friendId } = useParams()
  const navigate = useNavigate()

  const friend = friends.find((f) => f.id === friendId)

  useEffect(() => {
    if (!friend) return
    const visited = JSON.parse(localStorage.getItem('visitedFriends') || '[]')
    if (!visited.includes(friend.id)) {
      localStorage.setItem('visitedFriends', JSON.stringify([...visited, friend.id]))
    }
  }, [friend])

  if (!friend) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-sans text-warm-gold/70 mb-6">Friend not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-full border border-warm-gold/40 text-warm-gold font-sans text-sm hover:border-warm-gold/80 transition-colors"
          >
            Back to Constellation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ── 3-D memory tunnel filling the entire viewport ── */}
      <div className="fixed inset-0 z-0">
        <InfiniteVideoGallery
          videos={MEMORY_VIDEOS}
          className="h-full w-full"
        />
      </div>

      {/* ── Subtle vignette so the centre card reads cleanly ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* ── Friend-colour tint from top corner ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 40% 35% at 72% 20%, ${friend.color}18, transparent 70%)`,
        }}
      />

      {/* ── Back button ── */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-30 flex items-center gap-2 font-sans text-sm text-warm-gold/70 hover:text-warm-gold transition-colors duration-200 group"
        aria-label="Back"
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200">
          <ArrowLeft />
        </span>
        Back to Constellation
      </motion.button>

      {/* ── Centre card: present video + quote ── */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 pointer-events-none">
        {/* Present video card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="pointer-events-auto w-full"
          style={{ maxWidth: '340px', maxHeight: 'calc(100vh - 180px)' }}
        >
          {/* Frosted backdrop */}
          <div
            className="rounded-2xl p-1"
            style={{
              background: 'rgba(10,14,39,0.45)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${friend.color}33`,
              boxShadow: `0 0 60px rgba(0,0,0,0.5), 0 0 30px ${friend.color}22`,
            }}
          >
            <PresentVideo
              src={friend.videos.present}
              friendName={friend.name}
              naturalAspect={friend.id === 'tajira'}
              objectPosition={friend.id === 'aicha' ? 'top' : 'center'}
            />
          </div>
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-center font-sans italic text-sm sm:text-base md:text-lg leading-relaxed mt-4 sm:mt-8 max-w-sm pointer-events-none"
          style={{ color: '#fff8e7bb' }}
        >
          "{friend.quote}"
        </motion.blockquote>

        {/* Memories label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 font-sans text-xs uppercase tracking-widest pointer-events-none"
          style={{ color: `${friend.color}66` }}
        >
          Memories flowing around you
        </motion.p>
      </div>
    </div>
  )
}
