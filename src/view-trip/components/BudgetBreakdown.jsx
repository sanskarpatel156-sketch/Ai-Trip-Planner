import React from "react"

function BudgetBreakdown({ trip }) {
  const budget = trip?.tripData?.budgetBreakdown
  if (!budget) return null

  const items = [
    { label: 'Travel to Destination', value: budget.travelToDestination, icon: '✈️', color: 'bg-sky-500' },
    { label: 'Local Transport', value: budget.localTransport, icon: '🚗', color: 'bg-green-500' },
    { label: 'Accommodation', value: budget.accommodation, icon: '🏨', color: 'bg-blue-500' },
    { label: 'Food & Dining', value: budget.food, icon: '🍽️', color: 'bg-orange-500' },
    { label: 'Sightseeing', value: budget.sightseeing, icon: '🎡', color: 'bg-purple-500' },
    { label: 'Miscellaneous', value: budget.miscellaneous, icon: '🛍️', color: 'bg-pink-500' },
  ].filter(item => item.value)

  return (
    <div className='mt-8 bg-white rounded-2xl border p-6 shadow-sm'>
      <div className='flex items-center gap-2 mb-6'>
        <span className='text-2xl'>💰</span>
        <h2 className="font-bold text-2xl">Budget Breakdown</h2>
      </div>
      <div className='grid md:grid-cols-2 gap-8'>
        <div className='space-y-4'>
          {items.map((item, i) => (
            <div key={i} className='flex items-center gap-4'>
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0`}>
                {item.icon}
              </div>
              <div className='flex-1'>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm font-semibold text-gray-700'>{item.label}</span>
                  <span className='text-sm font-bold text-gray-800'>{item.value}</span>
                </div>
                <div className='h-2 bg-gray-100 rounded-full'>
                  <div className={`h-2 ${item.color} rounded-full opacity-70`} style={{ width: '65%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8'>
          <p className='text-gray-500 text-sm font-medium'>ESTIMATED TOTAL</p>
          <p className='font-extrabold text-4xl text-orange-600 mt-2'>{budget.total}</p>
          <p className='text-gray-400 text-xs mt-3 text-center'>*Estimates only. Actual prices may vary.</p>
        </div>
      </div>
    </div>
  )
}

export default BudgetBreakdown