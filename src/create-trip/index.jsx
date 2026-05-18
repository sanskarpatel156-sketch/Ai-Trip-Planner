import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { chatSession } from '@/service/AIModel'
import { db } from '@/service/firebaseConfig'
import { doc, setDoc } from "firebase/firestore"
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList, TripPersonas } from '@/constants/options'
import { useNavigate, useLocation } from 'react-router-dom'

function CreateTrip() {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [interests, setInterests] = useState('')
  const [destination, setDestination] = useState('')
  const [fromLocation, setFromLocation] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.destination) {
      setDestination(location.state.destination)
      setFormData(prev => ({ ...prev, location: { label: location.state.destination } }))
    }
  }, [])

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onGenerateTrip = async () => {
    const user = localStorage.getItem('user')
    if (!user) { toast.error("Please login first"); return }
    if (!fromLocation) { toast.error("Please enter where you are traveling FROM"); return }
    if (!formData?.location || !formData?.noOfDays || !formData?.budget || !formData?.traveler) {
      toast.error("Please fill all details"); return
    }
    if (Number(formData?.noOfDays) > 10) { toast.error("Max 10 days allowed"); return }

    setLoading(true)
    toast.loading("AI is crafting your perfect trip... ✨")

    const FINAL_PROMPT = AI_PROMPT
      .replaceAll('{fromLocation}', fromLocation)
      .replaceAll('{location}', formData?.location?.label || formData?.location)
      .replaceAll('{totalDays}', formData?.noOfDays)
      .replaceAll('{traveler}', formData?.traveler)
      .replaceAll('{budget}', formData?.budget)
      .replaceAll('{persona}', formData?.persona || 'General')
      .replaceAll('{interests}', interests || 'None specified')

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT)
      const tripText = result?.response?.text()
      let cleanJson = tripText
      const codeBlock = tripText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlock) cleanJson = codeBlock[1]
      else { const m = tripText.match(/\{[\s\S]*\}/); if (m) cleanJson = m[0] }
      const parsed = JSON.parse(cleanJson)
      await SaveAiTrip(parsed)
    } catch (error) {
      console.error("Error:", error)
      toast.dismiss()
      toast.error("Could not generate trip. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const SaveAiTrip = async (parsedData) => {
    const docId = Date.now().toString()
    const user = JSON.parse(localStorage.getItem('user'))
    const normalizedTripData =
      parsedData?.hotels && parsedData?.itinerary ? parsedData :
      parsedData?.tripData?.hotels ? parsedData.tripData : parsedData

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: { ...formData, interests, fromLocation },
      tripData: normalizedTripData,
      userEmail: user?.email,
      id: docId,
      createdAt: new Date().toISOString(),
    })
    toast.dismiss()
    toast.success("Trip Generated Successfully! 🎉")
    navigate('/view-trip/' + docId)
  }

  return (
    <div style={{minHeight:'100vh', background:'#0a0c12', paddingBottom:'4rem'}}>
      <div className='grid-lines' style={{padding:'5rem 2rem 0', maxWidth:'720px', margin:'0 auto'}}>

        <div style={{textAlign:'center', marginBottom:'3rem'}}>
          <span className='tag'>AI Powered</span>
          <h2 className='font-display' style={{fontWeight:700, fontSize:'2.5rem', marginTop:'1rem', letterSpacing:'-0.02em', color:'#ede8d8'}}>
            Plan Your Dream Trip
          </h2>
          <p style={{marginTop:'0.75rem', color:'#7a8098', fontSize:'0.9rem'}}>Answer a few questions — get a full itinerary in seconds</p>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>

          {/* Route */}
          <div className='card-dark' style={{borderRadius:'4px', padding:'1.75rem'}}>
            <h2 className='font-display' style={{fontWeight:600, fontSize:'1.1rem', marginBottom:'0.25rem', color:'#ede8d8'}}>Journey Route</h2>
            <p style={{color:'#7a8098', fontSize:'0.8rem', marginBottom:'1.25rem'}}>Where you're starting from helps AI calculate travel cost & time</p>
            <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
              <div>
                <label style={{fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#7a8098', display:'block', marginBottom:'6px'}}>Traveling From</label>
                <input placeholder='Mumbai, Delhi, Bangalore…' type='text' value={fromLocation}
                  style={{width:'100%', padding:'10px 14px', background:'#0a0c12', border:'1px solid #1e2436', color:'#ede8d8', borderRadius:'2px', fontSize:'0.9rem', outline:'none', fontFamily:'DM Sans, sans-serif', boxSizing:'border-box'}}
                  onFocus={e=>{e.target.style.borderColor='rgba(212,168,67,0.4)'}}
                  onBlur={e=>{e.target.style.borderColor='#1e2436'}}
                  onChange={(e) => setFromLocation(e.target.value)} />
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'12px', padding:'0 2px'}}>
                <div style={{flex:1, height:'1px', background:'#1e2436'}} />
                <span style={{color:'#d4a843', fontSize:'0.75rem', letterSpacing:'0.1em'}}>TO</span>
                <div style={{flex:1, height:'1px', background:'#1e2436'}} />
              </div>
              <div>
                <label style={{fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:'#7a8098', display:'block', marginBottom:'6px'}}>Destination</label>
                <input placeholder='Paris, Bali, Goa…' type='text' value={destination}
                  style={{width:'100%', padding:'10px 14px', background:'#0a0c12', border:'1px solid #1e2436', color:'#ede8d8', borderRadius:'2px', fontSize:'0.9rem', outline:'none', fontFamily:'DM Sans, sans-serif', boxSizing:'border-box'}}
                  onFocus={e=>{e.target.style.borderColor='rgba(212,168,67,0.4)'}}
                  onBlur={e=>{e.target.style.borderColor='#1e2436'}}
                  onChange={(e) => { setDestination(e.target.value); handleInputChange('location', { label: e.target.value }) }} />
              </div>
            </div>
            {fromLocation && destination && (
              <div style={{marginTop:'1rem', padding:'10px 14px', background:'rgba(212,168,67,0.06)', border:'1px solid rgba(212,168,67,0.15)', borderRadius:'2px', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:'8px', color:'#7a8098'}}>
                <span style={{color:'#d4a843'}}>{fromLocation}</span>
                <span>→</span>
                <span style={{color:'#d4a843'}}>{destination}</span>
                <span style={{marginLeft:'auto', fontSize:'0.7rem'}}>AI will map travel options</span>
              </div>
            )}
          </div>

          {/* Days */}
          <div className='card-dark' style={{borderRadius:'4px', padding:'1.75rem'}}>
            <h2 className='font-display' style={{fontWeight:600, fontSize:'1.1rem', marginBottom:'0.25rem', color:'#ede8d8'}}>Duration</h2>
            <p style={{color:'#7a8098', fontSize:'0.8rem', marginBottom:'1.25rem'}}>Maximum 10 days per trip</p>
            <input placeholder='e.g. 3' type='number' min='1' max='10'
              style={{width:'100%', padding:'10px 14px', background:'#0a0c12', border:'1px solid #1e2436', color:'#ede8d8', borderRadius:'2px', fontSize:'0.9rem', outline:'none', fontFamily:'DM Sans, sans-serif', boxSizing:'border-box'}}
              onFocus={e=>{e.target.style.borderColor='rgba(212,168,67,0.4)'}}
              onBlur={e=>{e.target.style.borderColor='#1e2436'}}
              onChange={(e) => handleInputChange('noOfDays', e.target.value)} />
          </div>

          {/* Persona */}
          <div className='card-dark' style={{borderRadius:'4px', padding:'1.75rem'}}>
            <h2 className='font-display' style={{fontWeight:600, fontSize:'1.1rem', marginBottom:'0.25rem', color:'#ede8d8'}}>Travel Style</h2>
            <p style={{color:'#7a8098', fontSize:'0.8rem', marginBottom:'1.25rem'}}>AI tailors activities to your vibe</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'0.75rem'}}>
              {TripPersonas.map((item) => (
                <div key={item.id} onClick={() => handleInputChange('persona', item.title)}
                  style={{
                    padding:'1rem', border: formData?.persona === item.title ? '1px solid rgba(212,168,67,0.5)' : '1px solid #1e2436',
                    background: formData?.persona === item.title ? 'rgba(212,168,67,0.06)' : '#0a0c12',
                    borderRadius:'2px', cursor:'pointer', transition:'all 0.2s'
                  }}>
                  <div style={{fontSize:'1.5rem'}}>{item.icon}</div>
                  <div style={{fontWeight:600, fontSize:'0.85rem', marginTop:'6px', color:'#ede8d8'}}>{item.title}</div>
                  <div style={{fontSize:'0.72rem', color:'#7a8098', marginTop:'2px'}}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className='card-dark' style={{borderRadius:'4px', padding:'1.75rem'}}>
            <h2 className='font-display' style={{fontWeight:600, fontSize:'1.1rem', marginBottom:'0.25rem', color:'#ede8d8'}}>Budget</h2>
            <p style={{color:'#7a8098', fontSize:'0.8rem', marginBottom:'1.25rem'}}>Helps AI recommend the right hotels & activities</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'0.75rem'}}>
              {SelectBudgetOptions.map((item) => (
                <div key={item.id} onClick={() => handleInputChange('budget', item.title)}
                  style={{
                    padding:'1.25rem', border: formData?.budget === item.title ? '1px solid rgba(212,168,67,0.5)' : '1px solid #1e2436',
                    background: formData?.budget === item.title ? 'rgba(212,168,67,0.06)' : '#0a0c12',
                    borderRadius:'2px', cursor:'pointer', transition:'all 0.2s', textAlign:'center'
                  }}>
                  <div style={{fontSize:'1.75rem'}}>{item.icon}</div>
                  <div style={{fontWeight:600, marginTop:'8px', color:'#ede8d8', fontSize:'0.9rem'}}>{item.title}</div>
                  <div style={{fontSize:'0.72rem', color:'#7a8098', marginTop:'2px'}}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Travelers */}
          <div className='card-dark' style={{borderRadius:'4px', padding:'1.75rem'}}>
            <h2 className='font-display' style={{fontWeight:600, fontSize:'1.1rem', marginBottom:'0.25rem', color:'#ede8d8'}}>Travelers</h2>
            <p style={{color:'#7a8098', fontSize:'0.8rem', marginBottom:'1.25rem'}}>AI tailors activities to your group</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'0.75rem'}}>
              {SelectTravelesList.map((item) => (
                <div key={item.id} onClick={() => handleInputChange('traveler', item.people)}
                  style={{
                    padding:'1rem', border: formData?.traveler === item.people ? '1px solid rgba(212,168,67,0.5)' : '1px solid #1e2436',
                    background: formData?.traveler === item.people ? 'rgba(212,168,67,0.06)' : '#0a0c12',
                    borderRadius:'2px', cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', gap:'12px'
                  }}>
                  <span style={{fontSize:'1.5rem'}}>{item.icon}</span>
                  <div>
                    <div style={{fontWeight:600, fontSize:'0.85rem', color:'#ede8d8'}}>{item.title}</div>
                    <div style={{fontSize:'0.72rem', color:'#7a8098'}}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className='card-dark' style={{borderRadius:'4px', padding:'1.75rem'}}>
            <h2 className='font-display' style={{fontWeight:600, fontSize:'1.1rem', marginBottom:'0.25rem', color:'#ede8d8'}}>Special Requests</h2>
            <p style={{color:'#7a8098', fontSize:'0.8rem', marginBottom:'1.25rem'}}>e.g. "I have a 5 year old", "vegetarian only", "wheelchair accessible"</p>
            <textarea placeholder='Tell us anything special…' rows={3} value={interests}
              style={{width:'100%', padding:'10px 14px', background:'#0a0c12', border:'1px solid #1e2436', color:'#ede8d8', borderRadius:'2px', fontSize:'0.9rem', outline:'none', fontFamily:'DM Sans, sans-serif', resize:'none', boxSizing:'border-box'}}
              onFocus={e=>{e.target.style.borderColor='rgba(212,168,67,0.4)'}}
              onBlur={e=>{e.target.style.borderColor='#1e2436'}}
              onChange={(e) => setInterests(e.target.value)} />
          </div>

        </div>

        {/* Generate Button */}
        <div style={{margin:'3rem 0', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px'}}>
          <button disabled={loading} onClick={onGenerateTrip} className='btn-gold'
            style={{padding:'14px 60px', borderRadius:'2px', fontSize:'0.8rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, display:'flex', alignItems:'center', gap:'10px'}}>
            {loading ? (
              <>
                <svg style={{width:'16px', height:'16px', animation:'spin 1s linear infinite'}} viewBox='0 0 24 24' fill='none'>
                  <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
                  <circle style={{opacity:0.25}} cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                  <path style={{opacity:0.75}} fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
                </svg>
                AI is Planning Your Trip…
              </>
            ) : 'Generate My Trip'}
          </button>
          <p style={{color:'#4a5068', fontSize:'0.75rem'}}>Powered by Google Gemini AI · Takes ~15 seconds</p>
        </div>

      </div>
    </div>
  )
}

export default CreateTrip
