import { Header } from '@/components/header/header'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Home } from '@/pages/home/home'
import { About } from '@/pages/about'
import { Login } from '@/pages/login'
import { Signup } from '@/pages/signup'
import '@/styles/global.scss'
import { Profile } from '@/pages/profile/profile'
import { ProfileEdit } from '@/pages/profile/edit/profileEdit'
import { Chats } from '@/pages/chats/chats'
import { ChatInvites } from '@/pages/chatInvites/chatInvites'
import { RequireAuth } from './components/requireAuth'
import { ScrollToHash } from './components/scrollToHash'
import { Privacy } from './pages/privacy'

export function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:username" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/profile/edit" element={<RequireAuth><ProfileEdit /></RequireAuth>} />
          <Route path="/profile/edit/:tab" element={<RequireAuth><ProfileEdit /></RequireAuth>} />
          <Route path="/chats" element={<RequireAuth><Chats /></RequireAuth>} />
          <Route path="/chats/:id" element={<RequireAuth><Chats /></RequireAuth>} />
          <Route path="/invites" element={<RequireAuth><ChatInvites /></RequireAuth>} />
          <Route path="/invites/:tab" element={<RequireAuth><ChatInvites /></RequireAuth>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
