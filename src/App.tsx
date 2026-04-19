// App Entry Point
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './components/Landing'
import Constellation from './components/Constellation'
import FriendPage from './components/FriendPage'
import Finale from './components/Finale'
import { StarsBackground } from '@/components/ui/stars'
import AudioManager from './components/AudioManager'

export default function App() {
  return (
    <BrowserRouter>
      <StarsBackground className="fixed inset-0 -z-10" />
      <AudioManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/constellation" element={<Constellation />} />
        <Route path="/friend/:friendId" element={<FriendPage />} />
        <Route path="/finale" element={<Finale />} />
      </Routes>
    </BrowserRouter>
  )
}
