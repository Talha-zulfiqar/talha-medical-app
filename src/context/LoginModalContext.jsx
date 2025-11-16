import React, { createContext, useContext, useState, useCallback } from 'react'

const LoginModalContext = createContext(null)

export function LoginModalProvider({ children }){
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])
  return (
    <LoginModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
    </LoginModalContext.Provider>
  )
}

export function useLoginModal(){
  const ctx = useContext(LoginModalContext)
  if (!ctx) throw new Error('useLoginModal must be used inside LoginModalProvider')
  return ctx
}

export default LoginModalContext
