import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GetPlaceImage } from '@/service/GlobalApi'

function UserTripCardItem({ trip, onDelete }) {
  const [photoUrl, setPhotoUrl] = useState()
  const [imgLoaded, setImgLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (trip?.userSelection?.location?.label)
      GetPlaceImage(trip.userSelection.location.label).then(setPhotoUrl)
  }, [trip])

  const days = Number(trip?.userSelection?.noOfDays) || 0
  const createdDate = trip?.createdAt
    ? new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  return (
    <div style={{
      background:'#141825', border: hovered ? '1px solid rgba(212,168,67,0.35)' : '1px solid #1e2436',
      borderRadius:'2px', overflow:'hidden', transition:'all 0.25s',
      transform: hovered ? 'translateY(-2px)' : 'none',
      boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.4)' : 'none'
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/view-trip/${trip?.id}`} style={{display:'block', textDecoration:'none'}}>
        <div style={{position:'relative', overflow:'hidden', height:'190px'}}>
          {!imgLoaded && <div style={{height:'100%', background:'#0d0f18'}} />}
          <img src={photoUrl || '/placeholder.jpg'} alt='Trip'
            style={{height:'100%', width:'100%', objectFit:'cover', display: imgLoaded ? 'block' : 'none', transition:'transform 0.5s', transform: hovered ? 'scale(1.05)' : 'scale(1)'}}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => { e.target.src = '/placeholder.jpg'; setImgLoaded(true) }} />
          <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(20,24,37,0.8), transparent)'}} />
          <div style={{position:'absolute', top:'10px', left:'10px'}}>
            {trip?.userSelection?.isSurpriseTrip ? (
              <span className='tag'>✦ Surprise</span>
            ) : trip?.userSelection?.persona ? (
              <span className='tag'>{trip.userSelection.persona}</span>
            ) : null}
          </div>
          <div style={{position:'absolute', top:'10px', right:'10px'}}>
            <span className='tag'>{days} Day{days !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Link>

      <div style={{padding:'1rem'}}>
        <Link to={`/view-trip/${trip?.id}`} style={{textDecoration:'none'}}>
          <h2 className='font-display' style={{fontWeight:700, fontSize:'1.1rem', color:'#ede8d8', marginBottom:'8px', letterSpacing:'-0.01em'}}>
            {trip?.userSelection?.location?.label || 'Unknown Destination'}
          </h2>
          <div style={{display:'flex', gap:'6px', flexWrap:'wrap'}}>
            {[trip?.userSelection?.budget, trip?.userSelection?.traveler].filter(Boolean).map((tag, i) => (
              <span key={i} className='tag' style={{fontSize:'0.65rem'}}>{tag}</span>
            ))}
          </div>
          {createdDate && <p style={{fontSize:'0.7rem', color:'#4a5068', marginTop:'8px'}}>Planned {createdDate}</p>}
        </Link>

        <div style={{display:'flex', gap:'6px', marginTop:'1rem', paddingTop:'0.75rem', borderTop:'1px solid #1e2436'}}>
          <Link to={`/view-trip/${trip?.id}`} style={{flex:1, textDecoration:'none'}}>
            <button style={{
              width:'100%', fontSize:'0.72rem', letterSpacing:'0.08em', textTransform:'uppercase',
              background:'rgba(212,168,67,0.08)', border:'1px solid rgba(212,168,67,0.2)', color:'#d4a843',
              padding:'8px', borderRadius:'2px', cursor:'pointer', fontFamily:'DM Sans, sans-serif'
            }}>View Trip →</button>
          </Link>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.origin + '/view-trip/' + trip?.id) }}
            style={{fontSize:'0.72rem', background:'#0d0f18', border:'1px solid #1e2436', color:'#7a8098', padding:'8px 12px', borderRadius:'2px', cursor:'pointer'}}
            title='Share'>
            ⎋
          </button>
          <button onClick={() => onDelete(trip?.id)}
            style={{fontSize:'0.72rem', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', color:'#ef4444', padding:'8px 12px', borderRadius:'2px', cursor:'pointer'}}
            title='Delete'>
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserTripCardItem
