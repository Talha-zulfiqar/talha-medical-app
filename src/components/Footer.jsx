import React from 'react'

export default function Footer(){
  return (
    <footer className="site-footer" style={{borderTop:'1px solid rgba(15,23,42,0.04)'}}>
      <div className="container">
        <div style={{display:'flex',flexDirection:'column'}}>
          <strong>Free Medical</strong>
          <small>Trusted medical resources</small>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <span>© {new Date().getFullYear()} Free Medical</span>
        </div>
      </div>
    </footer>
  )
}
