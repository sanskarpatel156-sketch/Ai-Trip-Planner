import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/service/firebaseConfig"
import InfoSection from "../components/InfoSection"
import SurpriseBanner from "../components/SurpriseBanner"
import TravelFromInfo from "../components/TravelFromInfo"
import Hotels from "../components/Hotels"
import PlacesToVisit from "../components/PlacesToVisit"
import BudgetBreakdown from "../components/BudgetBreakdown"
import PackingList from "../components/PackingList"
import Footer from "../components/Footer"

function extractTripData(raw) {
  if (!raw) return null
  if (raw.hotels && raw.itinerary) return raw
  if (raw.tripData?.hotels && raw.tripData?.itinerary) return raw.tripData
  if (raw.tripData?.tripData?.hotels) return raw.tripData.tripData
  if (typeof raw.tripData === "string") {
    try { return extractTripData(JSON.parse(raw.tripData)) } catch { return null }
  }
  return null
}

function Viewtrip() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => { GetTripData() }, [])

  const GetTripData = async () => {
    try {
      const docSnap = await getDoc(doc(db, "AITrips", tripId))
      if (docSnap.exists()) {
        const data = docSnap.data()
        setTrip({ ...data, tripData: extractTripData(data.tripData ?? data) })
      } else setError(true)
    } catch (err) { console.error(err); setError(true) }
  }

  if (error) return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4'>
      <div className='text-6xl'>😕</div>
      <h2 className='text-xl font-bold text-gray-600'>Trip not found</h2>
      <a href='/' className='text-orange-500 underline'>Go back home</a>
    </div>
  )

  if (!trip) return (
    <div className='p-10 max-w-5xl mx-auto'>
      <div className='h-[380px] bg-gray-200 animate-pulse rounded-2xl mb-6' />
      <div className='grid grid-cols-4 gap-4 mb-6'>
        {[1,2,3,4].map(i => <div key={i} className='h-20 bg-gray-200 animate-pulse rounded-xl' />)}
      </div>
      <div className='grid grid-cols-3 gap-4'>
        {[1,2,3].map(i => <div key={i} className='h-52 bg-gray-200 animate-pulse rounded-2xl' />)}
      </div>
    </div>
  )

  return (
    <div className='max-w-5xl mx-auto px-5 md:px-10 py-8'>
      <InfoSection trip={trip} />
      <SurpriseBanner trip={trip} />
      <TravelFromInfo trip={trip} />
      <BudgetBreakdown trip={trip} />
      <Hotels trip={trip} />
      <PlacesToVisit trip={trip} />
      <PackingList trip={trip} />
      <Footer />
    </div>
  )
}

export default Viewtrip