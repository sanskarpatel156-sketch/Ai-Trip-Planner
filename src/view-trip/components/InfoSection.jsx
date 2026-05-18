import React, { useEffect, useState } from "react"
import { GetPlaceImage } from "@/service/GlobalApi"
import DownloadPDF from "./DownloadPDF"

function InfoSection({ trip }) {
  const [mainImage, setMainImage] = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [weather, setWeather] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!trip?.userSelection?.location?.label) return
    setImgLoaded(false)
    GetPlaceImage(trip.userSelection.location.label).then(setMainImage)
    fetchWeather(trip.userSelection.location.label)
  }, [trip])

  const fetchWeather = async (city) => {
    try {
      const key = import.meta.env.VITE_OPENWEATHER_KEY
      if (!key || key === 'your_free_key_here') return
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`)
      const data = await res.json()
      if (data?.main) setWeather(data)
    } catch {}
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const days = Number(trip?.userSelection?.noOfDays) || 0
  const summary = trip?.tripData?.tripSummary

  return (
    <div>
      {/* Hero Image */}
      <div style={{position:'relative', borderRadius:'2px', overflow:'hidden', height:'380px'}}>
        {!imgLoaded && <div style={{height:'100%', width:'100%', background:'#141825', animation:'pulse 1.5s infinite'}} />}
        <img
          src={mainImage || "/placeholder.jpg"}
          alt="Trip"
          style={{height:'100%', width:'100%', objectFit:'cover', display: imgLoaded ? 'block' : 'none'}}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.target.src = "/placeholder.jpg"; setImgLoaded(true) }}
        />
        <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(10,12,18,0.85) 0%, rgba(10,12,18,0.2) 50%, transparent 100%)'}} />

        {/* Title overlay */}
        <div style={{position:'absolute', bottom:'1.75rem', left:'1.75rem'}}>
          <h1 className='font-display' style={{fontWeight:700, fontSize:'2.5rem', color:'#ede8d8', textShadow:'0 2px 12px rgba(0,0,0,0.5)', textTransform:'capitalize', letterSpacing:'-0.02em'}}>
            {trip?.userSelection?.location?.label}
          </h1>
          <div style={{display:'flex', gap:'8px', marginTop:'8px', flexWrap:'wrap'}}>
            {[
              `${days} Day${days !== 1 ? 's' : ''}`,
              `${trip?.userSelection?.budget} Budget`,
              trip?.userSelection?.traveler,
              trip?.userSelection?.persona,
            ].filter(Boolean).map((tag, i) => (
              <span key={i} className='tag' style={{background:'rgba(10,12,18,0.5)', backdropFilter:'blur(8px)'}}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{position:'absolute', top:'1rem', right:'1rem', display:'flex', gap:'8px'}}>
          <button onClick={handleShare}
            style={{background:'rgba(10,12,18,0.7)', backdropFilter:'blur(8px)', border:'1px solid rgba(212,168,67,0.2)', color:'#d4a843', padding:'8px 16px', borderRadius:'2px', fontSize:'0.72rem', letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer'}}>
            {copied ? '✓ Copied' : 'Share'}
          </button>
          <DownloadPDF trip={trip} />
        </div>

        {/* Weather */}
        {weather && (
          <div style={{position:'absolute', top:'1rem', left:'1rem', background:'rgba(10,12,18,0.7)', backdropFilter:'blur(8px)', border:'1px solid #1e2436', padding:'6px 14px', borderRadius:'2px', fontSize:'0.78rem', color:'#ede8d8', display:'flex', alignItems:'center', gap:'6px'}}>
            {Math.round(weather.main.temp)}°C · {weather.weather[0]?.description}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {summary && (
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'0.75rem', marginTop:'1rem'}}>
          {[
            {label:'Best Time', value:summary.bestTimeToVisit, col:'#d4a843'},
            {label:'Currency', value:summary.currency, col:'#6db07a'},
            {label:'Language', value:summary.language, col:'#8b7ed8'},
            {label:'Est. Cost', value:summary.totalEstimatedCost, col:'#d4a843'},
          ].filter(x=>x.value).map((item, i) => (
            <div key={i} style={{background:'#141825', border:'1px solid #1e2436', borderRadius:'2px', padding:'1rem'}}>
              <p style={{fontSize:'0.65rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#4a5068', marginBottom:'4px'}}>{item.label}</p>
              <p style={{fontWeight:600, color:item.col, fontSize:'0.9rem'}}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Info */}
      {(summary?.emergencyNumber || summary?.nearestHospital) && (
        <div style={{marginTop:'0.75rem', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'2px', padding:'1rem', display:'flex', gap:'12px', alignItems:'flex-start'}}>
          <span style={{color:'#ef4444', fontSize:'1.1rem'}}>⚠</span>
          <div>
            <p style={{fontWeight:600, color:'#ef4444', fontSize:'0.8rem', marginBottom:'4px'}}>Emergency Info</p>
            {summary.emergencyNumber && <p style={{fontSize:'0.8rem', color:'#f87171'}}>Emergency: {summary.emergencyNumber}</p>}
            {summary.nearestHospital && <p style={{fontSize:'0.8rem', color:'#f87171'}}>{summary.nearestHospital}</p>}
          </div>
        </div>
      )}

      {/* Local Tips */}
      {trip?.tripData?.localTips?.length > 0 && (
        <div style={{marginTop:'0.75rem', background:'rgba(212,168,67,0.04)', border:'1px solid rgba(212,168,67,0.15)', borderRadius:'2px', padding:'1rem'}}>
          <p style={{fontWeight:600, color:'#d4a843', fontSize:'0.8rem', marginBottom:'8px'}}>◈ Local Tips</p>
          <ul style={{listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:'4px'}}>
            {trip.tripData.localTips.map((tip, i) => (
              <li key={i} style={{fontSize:'0.8rem', color:'#7a8098', paddingLeft:'12px', borderLeft:'1px solid rgba(212,168,67,0.2)'}}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Transport Tips */}
      {trip?.tripData?.transportationTips && (
        <div style={{marginTop:'0.75rem', background:'#141825', border:'1px solid #1e2436', borderRadius:'2px', padding:'1rem'}}>
          <p style={{fontWeight:600, color:'#ede8d8', fontSize:'0.8rem', marginBottom:'4px'}}>Getting Around</p>
          <p style={{fontSize:'0.8rem', color:'#7a8098'}}>{trip.tripData.transportationTips}</p>
        </div>
      )}
    </div>
  )
}

export default InfoSection
