import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Articles from './pages/Articles'
import Community from './pages/Community'
import Profile from './pages/Profile'
import SignupModal from './components/SignupModal'
import { SignupModalProvider } from './context/SignupModalContext'

export default function App() {
  return (
    <SignupModalProvider>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
        <SignupModal />
      </div>
    </SignupModalProvider>
  )
}
