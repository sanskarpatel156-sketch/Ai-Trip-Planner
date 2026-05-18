import React, { useState } from 'react'

const modeIcons = {
  flight: '✈️', airplane: '✈️', air: '✈️',
  train: '🚂', rail: '🚂', railway: '🚂',
  bus: '🚌', road: '🚌',
  car: '🚗', drive: '🚗', taxi: '🚖',
  bike: '🏍️', motorcycle: '🏍️',
  ferry: '⛴️', boat: '⛴️', ship: '⛴️',
}

const getModeIcon = (mode = '') => {
  const lower = mode.toLowerCase()
  for (const key in modeIcons) {
    if (lower.includes(key)) return modeIcons[key]
  }
  return '🚀'
}

function TravelFromInfo({ trip }) {
  const info = trip?.tripData?.travelFromInfo
  const from = trip?.userSelection?.fromLocation
  const to = trip?.userSelection?.location?.label
  const [selected, setSelected] = useState(0)

  if (!info && !from) return null

  const alternatives = info?.alternatives || []

  return (
    <div className='mt-8 bg-white rounded-2xl border shadow-sm overflow-hidden'>

      {/* Header */}
      <div className='bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white'>
        <div className='flex items-center gap-2 mb-4'>
          <span className='text-2xl'>🛣️</span>
          <h2 className='font-bold text-2xl'>How to Get There</h2>
        </div>

        {/* Route display */}
        <div className='flex items-center gap-4 bg-white/20 backdrop-blur rounded-2xl p-4'>
          <div className='text-center flex-1'>
            <p className='text-xs text-orange-100 font-medium uppercase tracking-wide'>From</p>
            <p className='font-bold text-lg mt-1'>{info?.from || from}</p>
          </div>
          <div className='flex flex-col items-center gap-1'>
            <div className='flex items-center gap-1'>
              <div className='w-2 h-2 bg-white rounded-full' />
              <div className='w-12 md:w-20 h-0.5 bg-white/60' />
              <span className='text-xl'>✈️</span>
              <div className='w-12 md:w-20 h-0.5 bg-white/60' />
              <div className='w-2 h-2 bg-white rounded-full' />
            </div>
            {info?.totalTravelTime && (
              <span className='text-xs text-orange-100'>{info.totalTravelTime}</span>
            )}
          </div>
          <div className='text-center flex-1'>
            <p className='text-xs text-orange-100 font-medium uppercase tracking-wide'>To</p>
            <p className='font-bold text-lg mt-1'>{info?.to || to}</p>
          </div>
        </div>

        {/* Best option badge */}
        {info?.bestOption && (
          <div className='mt-3 flex items-center gap-2'>
            <span className='bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full'>
              ⭐ Best Option: {info.bestOption}
            </span>
          </div>
        )}
      </div>

      {/* Transport options */}
      {alternatives.length > 0 && (
        <div className='p-6'>
          <p className='text-sm font-semibold text-gray-500 mb-4'>Choose your travel mode:</p>

          {/* Mode tabs */}
          <div className='flex gap-3 overflow-x-auto pb-2 mb-5'>
            {alternatives.map((alt, i) => (
              <button key={i} onClick={() => setSelected(i)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all
                  ${selected === i
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <span>{getModeIcon(alt.mode)}</span>
                <span>{alt.mode}</span>
              </button>
            ))}
          </div>

          {/* Selected option details */}
          {alternatives[selected] && (
            <div className='bg-orange-50 border border-orange-200 rounded-2xl p-5'>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-4'>
                <div className='bg-white rounded-xl p-3 text-center shadow-sm'>
                  <p className='text-xs text-gray-400 font-medium uppercase'>Mode</p>
                  <p className='font-bold text-gray-800 mt-1 flex items-center justify-center gap-1'>
                    <span>{getModeIcon(alternatives[selected].mode)}</span>
                    {alternatives[selected].mode}
                  </p>
                </div>
                <div className='bg-white rounded-xl p-3 text-center shadow-sm'>
                  <p className='text-xs text-gray-400 font-medium uppercase'>Duration</p>
                  <p className='font-bold text-gray-800 mt-1'>⏱️ {alternatives[selected].duration}</p>
                </div>
                <div className='bg-white rounded-xl p-3 text-center shadow-sm col-span-2 md:col-span-1'>
                  <p className='text-xs text-gray-400 font-medium uppercase'>Est. Cost</p>
                  <p className='font-bold text-orange-600 mt-1'>💰 {alternatives[selected].estimatedCost}</p>
                </div>
              </div>

              {alternatives[selected].details && (
                <div className='bg-white rounded-xl p-4 mb-3 shadow-sm'>
                  <p className='text-xs font-semibold text-gray-500 mb-1'>DETAILS</p>
                  <p className='text-sm text-gray-700'>{alternatives[selected].details}</p>
                </div>
              )}

              {alternatives[selected].bookingTip && (
                <div className='bg-blue-50 border border-blue-200 rounded-xl p-3'>
                  <p className='text-sm text-blue-700'>
                    💡 <b>Booking Tip:</b> {alternatives[selected].bookingTip}
                  </p>
                </div>
              )}

              {/* Google Maps directions link */}
              <a href={`https://www.google.com/maps/dir/${encodeURIComponent(info?.from || from)}/${encodeURIComponent(info?.to || to)}`}
                target='_blank' rel='noopener noreferrer'
                className='mt-4 flex items-center justify-center gap-2 text-sm text-white bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-xl font-semibold hover:opacity-90 transition-all'>
                🗺️ Open Directions in Google Maps →
              </a>
            </div>
          )}
        </div>
      )}

      {/* Fallback if no alternatives from AI */}
      {alternatives.length === 0 && (from || info?.from) && (
        <div className='p-6'>
          <a href={`https://www.google.com/maps/dir/${encodeURIComponent(info?.from || from)}/${encodeURIComponent(info?.to || to)}`}
            target='_blank' rel='noopener noreferrer'
            className='flex items-center justify-center gap-2 text-sm text-white bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-xl font-semibold hover:opacity-90 transition-all'>
            🗺️ Get Directions: {from} → {to} on Google Maps →
          </a>
        </div>
      )}
    </div>
  )
}

export default TravelFromInfo