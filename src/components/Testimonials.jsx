import React from 'react'

export default function Testimonials(){
  return (
    <section className="container" style={{padding:'3rem 0'}}>
      <h2>What people say</h2>
      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <p>"This site helped me find a doctor quickly and easily."</p>
          <small>- Anna</small>
        </div>
        <div className="card">
          <p>"Great resources — the guides are easy to understand."</p>
          <small>- Mark</small>
        </div>
      </div>
    </section>
  )
}
