import React from 'react'
import Hero from '../components/Hero'
import Testimonials from '../components/Testimonials'
import CTASection from '../components/CTASection'

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="features container" id="features">
        <h2>Our Services</h2>
        <p className="lead">Quality medical resources and community-driven support.</p>
        <div className="grid">
          <div className="card">
            <h3>Find Doctors</h3>
            <p>Search and connect with certified professionals in your area.</p>
          </div>
          <div className="card">
            <h3>Medical Articles</h3>
            <p>Evidence-based articles and guides written by experts.</p>
          </div>
          <div className="card">
            <h3>Community Forum</h3>
            <p>Ask questions and receive answers from the community.</p>
          </div>
        </div>
      </section>

      <Testimonials />

      <CTASection />
    </div>
  )
}
