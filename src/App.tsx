import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { StarsBackground } from '@/components/ui/stars'
import AudioManager from './components/AudioManager'

const Landing = lazy(() => import('./components/Landing'))
const Constellation = lazy(() => import('./components/Constellation'))
const FriendPage = lazy(() => import('./components/FriendPage'))
const Finale = lazy(() => import('./components/Finale'))

export default function App() {
  return (
    <BrowserRouter>
      <StarsBackground className="fixed inset-0 -z-10" />
      <AudioManager />
      <Suspense>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/constellation" element={<Constellation />} />
          <Route path="/friend/:friendId" element={<FriendPage />} />
          <Route path="/finale" element={<Finale />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
