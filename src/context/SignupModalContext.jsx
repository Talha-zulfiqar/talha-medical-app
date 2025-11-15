import React, { createContext, useContext, useState, useCallback } from 'react'

const SignupModalContext = createContext(null)

export function SignupModalProvider({ children }){
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])
  return (
    <SignupModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
    </SignupModalContext.Provider>
  )
}

export function useSignupModal(){
  const ctx = useContext(SignupModalContext)
  if (!ctx) throw new Error('useSignupModal must be used inside SignupModalProvider')
  return ctx
}

export default SignupModalContext
