import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc"
import axios from 'axios'
import { Link, useLocation } from 'react-router-dom'

function Header() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [openDialog, setOpenDialog] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const login = useGoogleLogin({
    onSuccess: (res) => GetUserProfile(res),
    onError: (error) => console.log(error)
  })

  if (location.pathname === '/surprise-me') return null

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
      headers: { Authorization: `Bearer ${tokenInfo.access_token}`, Accept: 'application/json' }
    }).then((resp) => {
      localStorage.setItem('user', JSON.stringify(resp.data))
      setOpenDialog(false)
      window.location.reload()
    }).catch(console.error)
  }

  const navLinkStyle = (path) => ({
    fontSize: '0.72rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontWeight: 500,
    color: location.pathname === path ? '#d4a843' : '#7a8098',
    transition: 'color 0.2s',
    textDecoration: 'none',
  })

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      height: '60px',
      background: scrolled ? 'rgba(10,12,18,0.95)' : 'rgba(10,12,18,0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(212,168,67,0.12)' : 'rgba(30,36,54,0.6)'}`,
      transition: 'all 0.3s',
    }}>

      {/* Logo */}
      <Link to='/' style={{display:'flex', alignItems:'center', gap:'10px', textDecoration:'none'}}>
        <div style={{
          width:'28px', height:'28px',
          border:'1px solid rgba(212,168,67,0.5)',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#d4a843', fontSize:'0.75rem', fontFamily:'Playfair Display, serif', fontWeight:700
        }}>T</div>
        <span style={{
          fontFamily:'Playfair Display, serif',
          fontWeight:700, fontSize:'1.1rem',
          background:'linear-gradient(135deg, #c9913a, #e8c055)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'
        }}>TripAI</span>
      </Link>

      {/* Nav */}
      <nav style={{display:'flex', alignItems:'center', gap:'2rem'}}>
        <Link to='/' style={navLinkStyle('/')}>Home</Link>
        <Link to='/create-trip' style={navLinkStyle('/create-trip')}>Plan Trip</Link>
        <Link to='/surprise-me' style={{...navLinkStyle('/surprise-me'), color: location.pathname === '/surprise-me' ? '#d4a843' : '#7a8098'}}>
          ✦ Surprise
        </Link>
        {user && (
          <Link to='/my-trips' style={navLinkStyle('/my-trips')}>My Trips</Link>
        )}
      </nav>

      {/* Auth */}
      <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
        {user ? (
          <>
            <Link to='/create-trip'>
              <button className='btn-gold' style={{padding:'8px 20px', borderRadius:'2px', fontSize:'0.7rem'}}>
                + New Trip
              </button>
            </Link>
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} alt='' style={{
                  width:'32px', height:'32px', borderRadius:'50%',
                  border:'1px solid rgba(212,168,67,0.4)', cursor:'pointer'
                }} />
              </PopoverTrigger>
              <PopoverContent style={{
                width:'180px', background:'#141825', border:'1px solid #1e2436',
                borderRadius:'4px', padding:'8px 0'
              }}>
                <div style={{display:'flex', flexDirection:'column'}}>
                  <div style={{padding:'8px 14px', borderBottom:'1px solid #1e2436', marginBottom:'4px'}}>
                    <p style={{fontWeight:600, fontSize:'0.8rem', color:'#ede8d8'}}>{user?.name}</p>
                    <p style={{fontSize:'0.7rem', color:'#7a8098'}}>{user?.email}</p>
                  </div>
                  <Link to='/my-trips' style={{
                    padding:'8px 14px', fontSize:'0.78rem', color:'#7a8098',
                    display:'block', textDecoration:'none', transition:'color 0.2s',
                  }}
                    onMouseEnter={e=>e.target.style.color='#d4a843'}
                    onMouseLeave={e=>e.target.style.color='#7a8098'}
                  >My Trips</Link>
                  <Link to='/surprise-me' style={{
                    padding:'8px 14px', fontSize:'0.78rem', color:'#7a8098',
                    display:'block', textDecoration:'none', transition:'color 0.2s',
                  }}
                    onMouseEnter={e=>e.target.style.color='#d4a843'}
                    onMouseLeave={e=>e.target.style.color='#7a8098'}
                  >✦ Surprise Me</Link>
                  <div style={{
                    padding:'8px 14px', fontSize:'0.78rem', color:'#7a8098',
                    cursor:'pointer', transition:'color 0.2s',
                    borderTop:'1px solid #1e2436', marginTop:'4px'
                  }}
                    onMouseEnter={e=>e.target.style.color='#ef4444'}
                    onMouseLeave={e=>e.target.style.color='#7a8098'}
                    onClick={() => { googleLogout(); localStorage.clear(); window.location.href = '/' }}
                  >Logout</div>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <button className='btn-ghost-gold' onClick={() => setOpenDialog(true)}
            style={{padding:'8px 20px', borderRadius:'2px'}}>
            Sign In
          </button>
        )}
      </div>

      {/* Login Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent style={{background:'#141825', border:'1px solid #1e2436', borderRadius:'4px'}}>
          <DialogHeader>
            <DialogDescription>
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', gap:'20px', padding:'24px 16px'}}>
                <div style={{
                  width:'44px', height:'44px',
                  border:'1px solid rgba(212,168,67,0.5)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#d4a843', fontFamily:'Playfair Display, serif', fontWeight:700, fontSize:'1.2rem'
                }}>T</div>
                <div>
                  <h2 style={{fontFamily:'Playfair Display, serif', fontWeight:700, fontSize:'1.4rem', color:'#ede8d8', marginBottom:'8px'}}>
                    Welcome to TripAI
                  </h2>
                  <p style={{color:'#7a8098', fontSize:'0.85rem'}}>Sign in to save and access your AI-generated trips</p>
                </div>
                <button onClick={login} style={{
                  width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px',
                  background:'transparent', border:'1px solid #1e2436', color:'#ede8d8',
                  padding:'12px', borderRadius:'2px', cursor:'pointer', fontSize:'0.85rem',
                  transition:'border-color 0.2s, background 0.2s'
                }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(212,168,67,0.4)'; e.currentTarget.style.background='rgba(212,168,67,0.04)'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='#1e2436'; e.currentTarget.style.background='transparent'}}
                >
                  <FcGoogle size={20} /> Continue with Google
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Header
