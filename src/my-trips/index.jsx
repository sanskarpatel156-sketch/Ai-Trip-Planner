import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore"
import { db } from '@/service/firebaseConfig'
import UserTripCardItem from './components/UserTripCardItem'
import { toast } from 'sonner'

function MyTrips() {
  const navigate = useNavigate()
  const [userTrips, setUserTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { GetUserTrips() }, [])

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (!user) { navigate('/'); return }
    setLoading(true)
    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email))
    const querySnapshot = await getDocs(q)
    const trips = []
    querySnapshot.forEach((d) => trips.push(d.data()))
    trips.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    setUserTrips(trips)
    setLoading(false)
  }

  const handleDelete = async (tripId) => {
    if (!window.confirm('Delete this trip?')) return
    await deleteDoc(doc(db, 'AITrips', tripId))
    setUserTrips(prev => prev.filter(t => t.id !== tripId))
    toast.success('Trip deleted')
  }

    return(
    <div style={{minHeight:'100vh', background:'#0a0c12', padding:'2rem'}}>
      <div style={{maxWidth:'1100px', margin:'0 auto', paddingTop:'3rem'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2.5rem'}}>
          <div>
            <span className='tag' style={{marginBottom:'8px', display:'inline-block'}}>Your Journeys</span>
            <h2 className='font-display' style={{fontWeight:700, fontSize:'2rem', letterSpacing:'-0.02em', color:'#ede8d8', marginTop:'8px'}}>My Trips</h2>
          </div>
          <button onClick={() => navigate('/create-trip')} className='btn-gold' style={{padding:'10px 24px', borderRadius:'2px'}}>
            + New Trip
          </button>
        </div>

        {loading ? (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem'}}>
            {[1,2,3,4,5,6].map(i => <div key={i} style={{height:'280px', background:'#141825', borderRadius:'2px', border:'1px solid #1e2436'}} />)}
          </div>
        ) : userTrips.length === 0 ? (
          <div style={{textAlign:'center', padding:'5rem 0'}}>
            <div className='font-display' style={{fontSize:'4rem', color:'rgba(212,168,67,0.2)', marginBottom:'1.5rem'}}>◈</div>
            <h3 className='font-display' style={{fontWeight:700, fontSize:'1.4rem', color:'#ede8d8'}}>No trips yet</h3>
            <p style={{color:'#7a8098', marginTop:'8px', marginBottom:'2rem', fontSize:'0.85rem'}}>Plan your first AI-powered adventure</p>
            <button onClick={() => navigate('/create-trip')} className='btn-gold' style={{padding:'12px 32px', borderRadius:'2px'}}>
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem'}}>
            {userTrips.map((trip, index) => (
              <UserTripCardItem trip={trip} key={index} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
    )
}

export default MyTrips
