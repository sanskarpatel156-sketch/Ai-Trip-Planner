import React from "react"
import HotelCardItem from "./HotelCardItem"

function Hotels({ trip }) {
  const hotels = trip?.tripData?.hotels
  return (
    <div style={{marginTop:'2.5rem'}}>
      <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'4px'}}>
        <div className='divider' style={{flex:1}} />
        <span className='tag'>Accommodation</span>
        <div className='divider' style={{flex:1}} />
      </div>
      <h2 className='font-display' style={{fontWeight:700, fontSize:'1.6rem', textAlign:'center', marginTop:'1rem', marginBottom:'0.25rem', letterSpacing:'-0.02em', color:'#ede8d8'}}>
        Hotel Recommendations
      </h2>
      <p style={{color:'#7a8098', fontSize:'0.8rem', textAlign:'center', marginBottom:'1.5rem'}}>Click any hotel to open in Google Maps</p>
      {!hotels || hotels.length === 0 ? (
        <p style={{color:'#7a8098', background:'#141825', border:'1px solid #1e2436', borderRadius:'2px', padding:'2rem', textAlign:'center', fontSize:'0.85rem'}}>No hotel data available.</p>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'1rem'}}>
          {hotels.map((hotel, i) => <HotelCardItem key={i} hotel={hotel} />)}
        </div>
      )}
    </div>
  )
}

export default Hotels
