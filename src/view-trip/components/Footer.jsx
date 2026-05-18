import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <div style={{marginTop:'3rem', borderTop:'1px solid #1e2436', paddingTop:'2rem', paddingBottom:'2rem'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          <div style={{width:'26px', height:'26px', border:'1px solid rgba(212,168,67,0.5)', display:'flex', alignItems:'center', justifyContent:'center', color:'#d4a843', fontFamily:'Playfair Display, serif', fontWeight:700, fontSize:'0.8rem'}}>T</div>
          <span style={{fontFamily:'Playfair Display, serif', fontWeight:700, background:'linear-gradient(135deg, #c9913a, #e8c055)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>TripAI</span>
        </div>
        <p style={{color:'#4a5068', fontSize:'0.78rem'}}>AI-powered travel planning — sharper than any travel agent</p>
        <Link to='/create-trip' style={{textDecoration:'none'}}>
          <button className='btn-ghost-gold' style={{padding:'8px 20px', borderRadius:'2px', fontSize:'0.72rem'}}>
            Plan Another Trip →
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Footer
