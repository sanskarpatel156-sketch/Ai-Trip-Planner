import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { chatSession } from '@/service/AIModel'
import { db } from '@/service/firebaseConfig'
import { doc, setDoc } from 'firebase/firestore'

const TRENDING_DESTINATIONS = [
  { name: 'Bali, Indonesia', emoji: '🌴', tag: 'Most Trending', temp: '28°C', mood: 'Beach & Culture' },
  { name: 'Santorini, Greece', emoji: '🏛️', tag: 'Most Romantic', temp: '24°C', mood: 'Romantic' },
  { name: 'Tokyo, Japan', emoji: '🗼', tag: 'Most Unique', temp: '18°C', mood: 'Culture & Food' },
  { name: 'Goa, India', emoji: '🏖️', tag: 'Best Value', temp: '30°C', mood: 'Beach Party' },
  { name: 'Dubai, UAE', emoji: '🏙️', tag: 'Most Luxurious', temp: '35°C', mood: 'Luxury' },
  { name: 'Paris, France', emoji: '🗼', tag: 'Most Classic', temp: '16°C', mood: 'Romantic' },
  { name: 'Manali, India', emoji: '🏔️', tag: 'Best Adventure', temp: '10°C', mood: 'Adventure' },
  { name: 'Maldives', emoji: '🐠', tag: 'Most Beautiful', temp: '29°C', mood: 'Luxury Beach' },
  { name: 'Rajasthan, India', emoji: '🏰', tag: 'Most Cultural', temp: '25°C', mood: 'Heritage' },
  { name: 'Singapore', emoji: '🌆', tag: 'Best for Families', temp: '31°C', mood: 'Family Fun' },
  { name: 'Udaipur, India', emoji: '🏯', tag: 'Hidden Gem', temp: '22°C', mood: 'Royal Heritage' },
  { name: 'New York, USA', emoji: '🗽', tag: 'Most Iconic', temp: '15°C', mood: 'City Explorer' },
  { name: 'Kerala, India', emoji: '🌿', tag: 'Nature Paradise', temp: '27°C', mood: 'Nature & Wellness' },
  { name: 'Istanbul, Turkey', emoji: '🕌', tag: 'Best Food Scene', temp: '20°C', mood: 'Culture & Food' },
  { name: 'Coorg, India', emoji: '☕', tag: 'Best Weekend', temp: '19°C', mood: 'Nature Escape' },
]

const RANDOM_BUDGETS = ['Cheap', 'Moderate', 'Luxury']
const RANDOM_TRAVELERS = ['1', '2 People', '3 to 5 People', '5 to 10 People']
const RANDOM_PERSONAS = ['Adventure', 'Romantic', 'Cultural', 'Foodie', 'Nature', 'Photography']
const RANDOM_DAYS = [3, 4, 5, 6, 7]
const WHEEL_ITEMS = ['🌴 Bali', '🏔️ Manali', '🗼 Paris', '🏖️ Goa', '🕌 Istanbul', '🗽 New York', '🏯 Udaipur', '🐠 Maldives']

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const SURPRISE_PROMPT = `You are an expert travel planner. Create a TRENDING and EXCITING travel plan for:
- Traveling FROM: {fromLocation}
- Destination: {location}
- Duration: {totalDays} days
- Travelers: {traveler}
- Budget: {budget}
- Trip Style: {persona}

This is a "Surprise Trip" so make it extra special with hidden gems and local secrets tourists usually miss.

Return ONLY valid JSON:
{
  "tripSummary": {
    "destination": "",
    "bestTimeToVisit": "",
    "currency": "",
    "language": "",
    "totalEstimatedCost": "",
    "emergencyNumber": "",
    "nearestHospital": "",
    "whyThisTrip": ""
  },
  "travelFromInfo": {
    "from": "",
    "to": "",
    "recommendedMode": "",
    "alternatives": [
      { "mode": "", "duration": "", "estimatedCost": "", "details": "", "bookingTip": "" }
    ],
    "totalTravelTime": "",
    "bestOption": ""
  },
  "hotels": [
    { "hotelName": "", "hotelAddress": "", "price": "", "rating": "", "description": "", "amenities": "" }
  ],
  "itinerary": [
    {
      "day": "Day 1",
      "theme": "",
      "meals": { "breakfast": "", "lunch": "", "dinner": "" },
      "plan": [
        { "time": "", "placeName": "", "placeDetails": "", "ticketPricing": "", "travelTime": "", "bestFor": "", "tips": "" }
      ]
    }
  ],
  "packingList": { "essentials": [], "clothing": [], "documents": [], "electronics": [] },
  "budgetBreakdown": {
    "travelToDestination": "", "localTransport": "", "accommodation": "",
    "food": "", "sightseeing": "", "miscellaneous": "", "total": ""
  },
  "localTips": [],
  "transportationTips": "",
  "hiddenGems": [],
  "mustTryFoods": []
}`

function SurpriseTrip() {
  const navigate = useNavigate()
  const [step, setStep] = useState('intro')
  const [fromLocation, setFromLocation] = useState('')
  const [selectedDest, setSelectedDest] = useState(null)
  const [wheelIndex, setWheelIndex] = useState(0)
  const [spinDone, setSpinDone] = useState(false)
  const [generatingMsg, setGeneratingMsg] = useState('')
  const [progress, setProgress] = useState(0)

  // Spinning wheel effect
  useEffect(() => {
    if (step !== 'spinning') return
    const dest = pick(TRENDING_DESTINATIONS)
    setSelectedDest(dest)
    let count = 0
    const maxSpins = 30 + Math.floor(Math.random() * 20)
    let delay = 80
    const spin = () => {
      setWheelIndex(prev => (prev + 1) % WHEEL_ITEMS.length)
      count++
      if (count < maxSpins) {
        delay = Math.min(delay + 8, 400)
        setTimeout(spin, delay)
      } else {
        setSpinDone(true)
        setTimeout(() => startGeneration(dest), 1200)
      }
    }
    setTimeout(spin, 100)
  }, [step])

  // Progress messages
  useEffect(() => {
    if (step !== 'generating') return
    const messages = [
      '🔍 Finding trending destinations...',
      '🏨 Selecting best hotels...',
      '🗺️ Crafting day-by-day itinerary...',
      '🍽️ Picking local restaurants...',
      '💰 Calculating budget breakdown...',
      '🎒 Preparing packing list...',
      '✨ Adding hidden gems & local tips...',
      '🎉 Finalizing your surprise trip...',
    ]
    let i = 0
    setGeneratingMsg(messages[0])
    setProgress(10)
    const interval = setInterval(() => {
      i++
      if (i < messages.length) {
        setGeneratingMsg(messages[i])
        setProgress(Math.min(10 + (i / messages.length) * 85, 95))
      }
    }, 1800)
    return () => clearInterval(interval)
  }, [step])

  const handleStart = () => {
    const user = localStorage.getItem('user')
    if (!user) { toast.error("Please login first to use Surprise Me!"); return }
    setStep('asking')
  }

  const handleFromSubmit = () => {
    if (!fromLocation.trim()) { toast.error("Please enter your city"); return }
    setSpinDone(false)
    setStep('spinning')
  }

  const startGeneration = async (dest) => {
    setStep('generating')
    const user = JSON.parse(localStorage.getItem('user'))
    const budget = pick(RANDOM_BUDGETS)
    const traveler = pick(RANDOM_TRAVELERS)
    const persona = pick(RANDOM_PERSONAS)
    const days = pick(RANDOM_DAYS)

    const FINAL_PROMPT = SURPRISE_PROMPT
      .replaceAll('{fromLocation}', fromLocation)
      .replaceAll('{location}', dest.name)
      .replaceAll('{totalDays}', days)
      .replaceAll('{traveler}', traveler)
      .replaceAll('{budget}', budget)
      .replaceAll('{persona}', persona)

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT)
      const tripText = result?.response?.text()
      let cleanJson = tripText
      const codeBlock = tripText.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlock) cleanJson = codeBlock[1]
      else { const m = tripText.match(/\{[\s\S]*\}/); if (m) cleanJson = m[0] }
      const parsed = JSON.parse(cleanJson)

      const docId = Date.now().toString()
      const normalizedTripData =
        parsed?.hotels && parsed?.itinerary ? parsed :
        parsed?.tripData?.hotels ? parsed.tripData : parsed

      await setDoc(doc(db, 'AITrips', docId), {
        userSelection: {
          location: { label: dest.name },
          noOfDays: days,
          budget,
          traveler,
          persona,
          fromLocation,
          isSurpriseTrip: true,
        },
        tripData: normalizedTripData,
        userEmail: user?.email,
        id: docId,
        createdAt: new Date().toISOString(),
      })

      setProgress(100)
      await new Promise(r => setTimeout(r, 600))
      navigate('/view-trip/' + docId)
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong. Please try again.")
      setStep('intro')
    }
  }

  // ── INTRO ─────────────────────────────────────────────────
  if (step === 'intro') return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-6'>
      <div className='max-w-lg w-full text-center text-white'>
        <div className='text-8xl mb-6 animate-bounce'>🎲</div>
        <h1 className='font-extrabold text-5xl mb-4'>Surprise Me!</h1>
        <p className='text-xl text-white/80 mb-6'>
          Let our AI pick a <b>trending destination</b> and plan the entire trip for you.
          No decisions needed — just adventure!
        </p>

        <div className='bg-white/20 backdrop-blur rounded-2xl p-4 mb-8 text-left'>
          <p className='font-bold mb-3 text-center'>🎯 AI will auto-pick everything:</p>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            {[
              '🌍 Trending Destination',
              '📅 Perfect Duration',
              '🏨 Best Hotels',
              '🗺️ Full Itinerary',
              '💰 Budget Plan',
              '🎒 Packing List',
              '🍽️ Local Food Guide',
              '✈️ Travel Options',
            ].map((item, i) => (
              <div key={i} className='flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2'>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className='text-white/60 text-sm mb-4'>We only need <b>one thing</b> from you 👇</p>

        <button onClick={handleStart}
          className='bg-white text-purple-600 font-extrabold text-xl px-12 py-4 rounded-2xl hover:scale-105 hover:shadow-2xl transition-all w-full'>
          🎲 Let's Go!
        </button>

        <button onClick={() => navigate('/create-trip')}
          className='block mx-auto mt-4 text-white/60 text-sm hover:text-white underline'>
          I'd rather plan myself →
        </button>
      </div>
    </div>
  )

  // ── ASK FROM LOCATION ─────────────────────────────────────
  if (step === 'asking') return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-6'>
      <div className='max-w-md w-full text-center text-white'>
        <div className='text-6xl mb-4'>📍</div>
        <h2 className='font-extrabold text-3xl mb-2'>Just one question!</h2>
        <p className='text-white/80 mb-8 text-lg'>
          Where are you traveling <b>from</b>?<br />We'll handle everything else.
        </p>

        <div className='bg-white rounded-2xl p-6 text-left shadow-2xl'>
          <label className='text-gray-600 font-semibold text-sm block mb-2'>Your Current City</label>
          <input
            autoFocus
            type='text'
            placeholder='Ex. Mumbai, Delhi, Pune...'
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFromSubmit()}
            className='w-full p-4 border-2 border-purple-200 rounded-xl text-gray-800 text-lg focus:border-purple-500 focus:outline-none'
          />
          <button onClick={handleFromSubmit}
            className='w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg py-4 rounded-xl hover:opacity-90 hover:scale-105 transition-all'>
            🎲 Spin the Wheel!
          </button>
        </div>

        <button onClick={() => setStep('intro')}
          className='mt-4 text-white/60 text-sm hover:text-white underline'>
          ← Back
        </button>
      </div>
    </div>
  )

  // ── SPINNING WHEEL ────────────────────────────────────────
  if (step === 'spinning') return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-6'>
      <div className='max-w-md w-full text-center text-white'>
        <h2 className='font-extrabold text-3xl mb-8'>🎰 Picking your destination...</h2>

        <div className='relative mx-auto w-64 h-64 mb-8'>
          <div className='absolute inset-0 rounded-full bg-white/20 backdrop-blur border-4 border-white/40 flex items-center justify-center'>
            {spinDone ? (
              <div className='text-center animate-bounce px-4'>
                <div className='text-5xl mb-2'>{selectedDest?.emoji}</div>
                <div className='font-extrabold text-lg'>{selectedDest?.name}</div>
                <div className='text-sm text-white/80 mt-1'>{selectedDest?.tag}</div>
              </div>
            ) : (
              <div className='text-center'>
                <div className='text-5xl mb-2'>🎲</div>
                <div className='font-bold text-lg'>{WHEEL_ITEMS[wheelIndex]}</div>
              </div>
            )}
          </div>
          {!spinDone && (
            <div className='absolute inset-0 rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin' />
          )}
        </div>

        {spinDone ? (
          <div className='animate-pulse'>
            <p className='text-xl font-bold'>✅ Destination picked!</p>
            <p className='text-white/70 mt-1'>Planning your trip to <b>{selectedDest?.name}</b>...</p>
          </div>
        ) : (
          <p className='text-white/70 text-lg animate-pulse'>
            Spinning through {TRENDING_DESTINATIONS.length} trending destinations...
          </p>
        )}
      </div>
    </div>
  )

  // ── GENERATING ────────────────────────────────────────────
  if (step === 'generating') return (
    <div className='min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-6'>
      <div className='max-w-md w-full text-center text-white'>

        <div className='text-7xl mb-6'>
          {progress < 30 ? '🔍' : progress < 60 ? '🗺️' : progress < 90 ? '✨' : '🎉'}
        </div>

        <h2 className='font-extrabold text-3xl mb-2'>AI is Planning!</h2>

        {/* Destination card */}
        <div className='bg-white/20 backdrop-blur rounded-2xl p-4 mb-6'>
          <p className='text-sm text-white/70 mb-1'>Your surprise destination</p>
          <p className='font-extrabold text-2xl'>{selectedDest?.emoji} {selectedDest?.name}</p>
          <div className='flex justify-center gap-3 mt-2 text-sm text-white/80 flex-wrap'>
            <span>🌡️ {selectedDest?.temp}</span>
            <span>•</span>
            <span>🎭 {selectedDest?.mood}</span>
            <span>•</span>
            <span>🏆 {selectedDest?.tag}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className='bg-white/20 rounded-full h-3 mb-3 overflow-hidden'>
          <div className='h-full bg-white rounded-full transition-all duration-1000'
            style={{ width: `${progress}%` }} />
        </div>
        <p className='text-white/80 text-sm mb-3'>{Math.round(progress)}% complete</p>

        {/* Current task */}
        <div className='bg-white/20 backdrop-blur rounded-xl px-4 py-3 animate-pulse'>
          <p className='text-sm font-medium'>{generatingMsg}</p>
        </div>

        <p className='text-white/50 text-xs mt-6'>This takes about 15-20 seconds. Please wait...</p>
      </div>
    </div>
  )

  return null
}

export default SurpriseTrip