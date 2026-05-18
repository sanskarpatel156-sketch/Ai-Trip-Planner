import React, { useState } from "react"
import PlaceCardItem from "./PlaceCardItem"

function PlacesToVisit({ trip }) {
  const itinerary = trip?.tripData?.itinerary
  const [checkedPlaces, setCheckedPlaces] = useState({})

  const toggleCheck = (key) => setCheckedPlaces(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className='mt-10'>
      <div className='flex items-center gap-2 mb-2'>
        <span className='text-2xl'>🗺️</span>
        <h2 className="font-bold text-2xl">Day-by-Day Itinerary</h2>
      </div>
      <p className='text-gray-400 text-sm mb-6'>Tick off places as you visit them! Click any card for Google Maps.</p>

      {!itinerary || itinerary.length === 0 ? (
        <p className="text-gray-400 bg-gray-50 rounded-xl p-6 text-center">No itinerary data available.</p>
      ) : (
        itinerary.map((item, i) => (
          <div key={i} className='mb-10'>
            <div className='flex items-center gap-4 mb-4'>
              <div className='w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0'>
                {i + 1}
              </div>
              <div>
                <h2 className="font-bold text-xl">{item.day}</h2>
                {item.theme && <p className='text-orange-500 text-sm font-medium'>{item.theme}</p>}
              </div>
            </div>

            {/* Meals */}
            {item.meals && Object.values(item.meals).some(m => m) && (
              <div className='bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex flex-wrap gap-4'>
                <span className='text-sm font-bold text-amber-700'>🍽️ Meals:</span>
                {item.meals.breakfast && <span className='text-sm text-amber-700'>🌅 <b>Breakfast:</b> {item.meals.breakfast}</span>}
                {item.meals.lunch && <span className='text-sm text-amber-700'>☀️ <b>Lunch:</b> {item.meals.lunch}</span>}
                {item.meals.dinner && <span className='text-sm text-amber-700'>🌙 <b>Dinner:</b> {item.meals.dinner}</span>}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              {item.plan?.map((place, idx) => {
                const key = `${i}-${idx}`
                return (
                  <div key={idx} className={`transition-opacity ${checkedPlaces[key] ? 'opacity-60' : ''}`}>
                    <div className='flex items-center gap-2 mb-1'>
                      <input type='checkbox' checked={!!checkedPlaces[key]} onChange={() => toggleCheck(key)}
                        className='w-4 h-4 accent-orange-500 cursor-pointer' />
                      <span className="text-sm font-semibold text-orange-600">{place.time}</span>
                    </div>
                    <PlaceCardItem place={place} done={checkedPlaces[key]} />
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default PlacesToVisit