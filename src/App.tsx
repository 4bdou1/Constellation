import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { StarsBackground } from '@/components/ui/stars'
import AudioManager from './components/AudioManager'
import CountdownScreen from './components/CountdownScreen'

const Landing = lazy(() => import('./components/Landing'))
const Constellation = lazy(() => import('./components/Constellation'))
const FriendPage = lazy(() => import('./components/FriendPage'))
const Finale = lazy(() => import('./components/Finale'))

export default function App() {
  const [countdownDone, setCountdownDone] = useState(false)

  return (
    <BrowserRouter>
      <StarsBackground className="fixed inset-0 -z-10" />
      <AudioManager />

      {/* Countdown overlay — sits on top of everything until done */}
      <AnimatePresence>
        {!countdownDone && (
          <CountdownScreen onDone={() => setCountdownDone(true)} />
        )}
      </AnimatePresence>

      <Suspense>
        <Routes>
          <Route path="/" element={<Landing countdownDone={countdownDone} />} />
          <Route path="/constellation" element={<Constellation />} />
          <Route path="/friend/:friendId" element={<FriendPage />} />
          <Route path="/finale" element={<Finale />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
