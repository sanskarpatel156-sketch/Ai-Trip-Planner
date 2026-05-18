import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const destinations = ['Kyoto', 'Santorini', 'Marrakech', 'Queenstown', 'Havana', 'Reykjavik', 'Udaipur', 'Lisbon']

const stats = [
  { number: '10K+', label: 'Trips Planned' },
  { number: '150+', label: 'Destinations' },
  { number: '4.9', label: 'User Rating' },
  { number: 'AI', label: 'Powered' },
]

const features = [
  { icon: '◈', title: 'AI Itinerary', desc: 'Day-by-day plans crafted by Google Gemini — not generic templates' },
  { icon: '◇', title: 'Surprise Mode', desc: 'Let AI select a trending destination and orchestrate everything for you' },
  { icon: '◆', title: 'Budget Mapping', desc: 'Exact cost breakdown across hotels, food, transport & sightseeing' },
  { icon: '◉', title: 'Trip Personas', desc: 'Adventure, Romantic, Foodie, Photography — AI tailors to your style' },
  { icon: '◎', title: 'Live Weather', desc: 'Real-time conditions at your destination so you pack right' },
  { icon: '◍', title: 'Share Instantly', desc: 'Send your full itinerary to friends via a single link — always free' },
]

function Hero() {
  const [currentDest, setCurrentDest] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDest(prev => (prev + 1) % destinations.length)
      setAnimKey(k => k + 1)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='min-h-screen grid-lines' style={{background:'#0a0c12'}}>

      {/* Hero */}
      <section className='relative flex flex-col items-center justify-center px-6 md:px-20 pt-28 pb-24 text-center overflow-hidden'>
        {/* Radial glow */}
        <div style={{
          position:'absolute', top:'30%', left:'50%', transform:'translate(-50%,-50%)',
          width:'700px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(ellipse, rgba(212,168,67,0.07) 0%, transparent 70%)',
          pointerEvents:'none'
        }} />

        <div className='tag anim-fade-up mb-8'>AI-Powered · Free Forever</div>

        <h1 className='font-display font-bold text-5xl md:text-7xl leading-none max-w-4xl anim-fade-up anim-delay-1' style={{letterSpacing:'-0.02em'}}>
          Journey to{' '}
          <span key={animKey} className='text-gold' style={{
            animation: 'destIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
            display:'inline-block'
          }}>
            {destinations[currentDest]}
          </span>
          <br />
          <span style={{color:'#ede8d8'}}>in 30 seconds.</span>
        </h1>

        <p className='mt-7 text-lg max-w-xl anim-fade-up anim-delay-2' style={{color:'#7a8098', lineHeight:'1.7', fontWeight:300}}>
          Our AI composes personalized itineraries, curates hotel stays, 
          forecasts budgets, and packs your list — sharper than any travel agent.
        </p>

        <div className='flex flex-col sm:flex-row gap-3 mt-10 anim-fade-up anim-delay-3'>
          <Link to='/create-trip'>
            <button className='btn-gold px-9 py-3.5 rounded-sm' style={{fontSize:'0.75rem'}}>
              Plan My Trip
            </button>
          </Link>
          <Link to='/surprise-me'>
            <button className='btn-ghost-gold px-9 py-3.5 rounded-sm'>
              ✦ Surprise Me
            </button>
          </Link>
        </div>

        <p className='mt-4 text-xs anim-fade-up anim-delay-4' style={{color:'#4a5068'}}>
          Surprise Me — AI selects a trending destination & plans everything automatically
        </p>

        {/* Stats */}
        <div className='grid grid-cols-4 gap-12 mt-20 anim-fade-up anim-delay-4'>
          {stats.map((stat, i) => (
            <div key={i} className='text-center'>
              <div className='font-display text-3xl font-bold text-gold'>{stat.number}</div>
              <div className='text-xs mt-1 uppercase tracking-widest' style={{color:'#4a5068'}}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className='divider mx-20' />

      {/* Features */}
      <section className='py-24 px-6 md:px-20'>
        <div className='max-w-5xl mx-auto'>
          <div className='flex items-center gap-4 mb-3'>
            <div className='divider flex-1' />
            <span className='tag'>Capabilities</span>
            <div className='divider flex-1' />
          </div>
          <h2 className='font-display text-4xl font-bold text-center mt-6 mb-2' style={{letterSpacing:'-0.02em'}}>
            Everything a great trip needs
          </h2>
          <p className='text-center mb-14' style={{color:'#7a8098', fontSize:'0.9rem'}}>AI superpowers where others offer copy-pasted templates</p>

          <div className='grid md:grid-cols-3 gap-5'>
            {features.map((f, i) => (
              <div key={i} className='card-dark rounded-sm p-7'>
                <div className='text-xl mb-4' style={{color:'#d4a843'}}>{f.icon}</div>
                <h3 className='font-display font-semibold text-lg mb-2' style={{color:'#ede8d8'}}>{f.title}</h3>
                <p style={{color:'#7a8098', fontSize:'0.85rem', lineHeight:'1.7'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className='divider mx-20' />

      {/* Surprise section */}
      <section className='py-24 px-6 md:px-20' style={{background:'#0d0f18'}}>
        <div className='max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16'>
          <div style={{flexShrink:0}}>
            <div className='font-display text-9xl' style={{
              background:'linear-gradient(135deg,#c9913a,#e8c055)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              lineHeight:1
            }}>✦</div>
          </div>
          <div>
            <span className='tag'>New Feature</span>
            <h2 className='font-display text-4xl font-bold mt-4 mb-4' style={{letterSpacing:'-0.02em', lineHeight:'1.1'}}>
              Can't decide<br />where to go?
            </h2>
            <p style={{color:'#7a8098', fontSize:'0.9rem', lineHeight:'1.8', marginBottom:'1.5rem'}}>
              Hit <em style={{color:'#d4a843', fontStyle:'normal', fontWeight:500}}>Surprise Me</em> and our AI will spin through 15 trending global destinations, 
              pick one, and instantly generate a complete trip plan — hotels, itinerary, 
              budget, packing list — everything. Zero decisions needed.
            </p>
            <div className='flex flex-wrap gap-2 mb-8'>
              {['Bali', 'Manali', 'Paris', 'Goa', 'Udaipur', '+10 more'].map((d, i) => (
                <span key={i} className='tag'>{d}</span>
              ))}
            </div>
            <Link to='/surprise-me'>
              <button className='btn-gold px-8 py-3.5 rounded-sm'>
                Try Surprise Me →
              </button>
            </Link>
          </div>
        </div>
      </section>

      <div className='divider mx-20' />

      {/* CTA */}
      <section className='py-24 px-6 text-center' style={{background:'#0a0c12'}}>
        <div style={{
          maxWidth:'36rem', margin:'0 auto',
          background:'linear-gradient(135deg, rgba(212,168,67,0.06), rgba(212,168,67,0.02))',
          border:'1px solid rgba(212,168,67,0.15)',
          borderRadius:'4px',
          padding:'3.5rem 2rem'
        }}>
          <div className='font-display text-5xl mb-6' style={{color:'rgba(212,168,67,0.3)'}}>◈</div>
          <h2 className='font-display text-3xl font-bold mb-3' style={{letterSpacing:'-0.02em'}}>
            Your next adventure<br />starts here.
          </h2>
          <p className='mb-10' style={{color:'#7a8098', fontSize:'0.875rem'}}>
            Join thousands of travellers using AI to plan smarter, richer trips.
          </p>
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Link to='/create-trip'>
              <button className='btn-gold px-10 py-3.5 rounded-sm'>Plan My Trip</button>
            </Link>
            <Link to='/surprise-me'>
              <button className='btn-ghost-gold px-10 py-3.5 rounded-sm'>✦ Surprise Me</button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Hero
