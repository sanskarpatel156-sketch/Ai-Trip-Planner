import React from 'react'

function SurpriseBanner({ trip }) {
  if (!trip?.userSelection?.isSurpriseTrip) return null

  const hiddenGems = trip?.tripData?.hiddenGems || []
  const mustTryFoods = trip?.tripData?.mustTryFoods || []
  const whyThisTrip = trip?.tripData?.tripSummary?.whyThisTrip

  return (
    <div className='mt-6 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 rounded-2xl p-6 text-white'>
      <div className='flex items-center gap-3 mb-4'>
        <span className='text-3xl'>🎲</span>
        <div>
          <h3 className='font-extrabold text-xl'>Your Surprise Trip!</h3>
          <p className='text-white/70 text-sm'>AI picked this trending destination just for you</p>
        </div>
        <span className='ml-auto bg-white/20 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap'>
          🏆 AI Picked
        </span>
      </div>

      {whyThisTrip && (
        <div className='bg-white/20 backdrop-blur rounded-xl p-4 mb-4'>
          <p className='text-sm font-semibold mb-1'>💡 Why AI picked this for you:</p>
          <p className='text-white/90 text-sm'>{whyThisTrip}</p>
        </div>
      )}

      <div className='grid md:grid-cols-2 gap-4'>
        {hiddenGems.length > 0 && (
          <div className='bg-white/20 backdrop-blur rounded-xl p-4'>
            <p className='font-bold text-sm mb-2'>💎 Hidden Gems</p>
            <ul className='space-y-1'>
              {hiddenGems.slice(0, 4).map((gem, i) => (
                <li key={i} className='text-xs text-white/90 flex items-start gap-1'>
                  <span className='mt-0.5'>→</span> {gem}
                </li>
              ))}
            </ul>
          </div>
        )}
        {mustTryFoods.length > 0 && (
          <div className='bg-white/20 backdrop-blur rounded-xl p-4'>
            <p className='font-bold text-sm mb-2'>🍽️ Must Try Foods</p>
            <ul className='space-y-1'>
              {mustTryFoods.slice(0, 4).map((food, i) => (
                <li key={i} className='text-xs text-white/90 flex items-start gap-1'>
                  <span className='mt-0.5'>→</span> {food}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default SurpriseBanner