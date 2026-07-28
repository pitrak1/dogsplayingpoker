import { Header } from '@/components/header/header'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Home } from '@/pages/home/home'
import { About } from '@/pages/about'
import { Login } from '@/pages/login'
import { Signup } from '@/pages/signup'
import '@/styles/global.scss'
import { Profile } from '@/pages/profile/profile'
import { ProfileEdit } from '@/pages/profile/edit/profileEdit'
import { Chats } from '@/pages/chats'
import { ChatInvites } from '@/pages/chatInvites/chatInvites'

export function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/profile/edit/:tab" element={<ProfileEdit />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/invites" element={<ChatInvites />} />
          <Route path="/invites/:tab" element={<ChatInvites />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
