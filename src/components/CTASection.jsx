import React from 'react'
import { useSignupModal } from '../context/SignupModalContext'

export default function CTASection(){
  const { openModal } = useSignupModal()
  return (
    <section className="container" style={{padding:'2.5rem 0'}}>
      <div className="card" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
        <div>
          <h3>Ready to get started?</h3>
          <p className="lead">Join the Free Medical community and access helpful resources today.</p>
        </div>
        <div>
          <button type="button" className="btn btn-primary" onClick={() => openModal()}>Create account</button>
        </div>
      </div>
    </section>
  )
}
