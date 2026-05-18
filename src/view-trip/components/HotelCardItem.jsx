import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GetPlaceImage } from '@/service/GlobalApi'

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (hotel) { setImgLoaded(false); GetPlaceImage(hotel?.hotelName).then(setPhotoUrl) }
  }, [hotel])

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel?.hotelName + " " + hotel?.hotelAddress)}`

  return (
    <Link to={googleMapsUrl} target='_blank' style={{textDecoration:'none'}}>
      <div style={{
        background:'#141825', border: hovered ? '1px solid rgba(212,168,67,0.4)' : '1px solid #1e2436',
        borderRadius:'2px', overflow:'hidden', cursor:'pointer',
        transition:'all 0.25s', transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.4)' : 'none'
      }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{position:'relative', overflow:'hidden', height:'160px'}}>
          {!imgLoaded && <div style={{height:'100%', background:'#0d0f18'}} />}
          <img src={photoUrl || '/placeholder.jpg'}
            style={{height:'100%', width:'100%', objectFit:'cover', display: imgLoaded ? 'block' : 'none', transition:'transform 0.5s', transform: hovered ? 'scale(1.06)' : 'scale(1)'}}
            alt={hotel?.hotelName}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.target.src = '/placeholder.jpg'; setImgLoaded(true) }} />
          <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(20,24,37,0.8), transparent)'}} />
          <span style={{position:'absolute', top:'8px', right:'8px', background:'rgba(10,12,18,0.8)', backdropFilter:'blur(8px)', border:'1px solid rgba(212,168,67,0.2)', color:'#d4a843', padding:'3px 10px', borderRadius:'2px', fontSize:'0.65rem', letterSpacing:'0.08em', textTransform:'uppercase'}}>
            Maps →
          </span>
        </div>
        <div style={{padding:'1rem'}}>
          <h2 style={{fontWeight:600, fontSize:'0.9rem', color:'#ede8d8', marginBottom:'4px'}}>{hotel?.hotelName}</h2>
          <p style={{fontSize:'0.72rem', color:'#7a8098', marginBottom:'8px'}}>{hotel?.hotelAddress}</p>
          {hotel?.description && <p style={{fontSize:'0.72rem', color:'#4a5068', marginBottom:'8px', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'}}>{hotel.description}</p>}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'8px', borderTop:'1px solid #1e2436'}}>
            <span style={{fontWeight:600, color:'#d4a843', fontSize:'0.8rem'}}>{hotel?.price}</span>
            <span style={{fontSize:'0.78rem', color:'#7a8098'}}>★ {hotel?.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default HotelCardItem
