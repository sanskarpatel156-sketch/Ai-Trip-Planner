import React, { useState } from "react"

function PackingList({ trip }) {
  const packing = trip?.tripData?.packingList
  if (!packing) return null

  const [checked, setChecked] = useState({})
  const toggle = (key) => setChecked(prev => ({ ...prev, [key]: !prev[key] }))

  const sections = [
    { title: 'Essentials', items: packing.essentials, icon: '⭐', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
    { title: 'Clothing', items: packing.clothing, icon: '👕', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { title: 'Documents', items: packing.documents, icon: '📄', color: 'text-green-700 bg-green-50 border-green-200' },
    { title: 'Electronics', items: packing.electronics, icon: '🔌', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  ].filter(s => s.items?.length > 0)

  const totalItems = sections.reduce((acc, s) => acc + (s.items?.length || 0), 0)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const percent = totalItems ? Math.round((checkedCount / totalItems) * 100) : 0

  return (
    <div className='mt-8 bg-white rounded-2xl border p-6 shadow-sm'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <span className='text-2xl'>🎒</span>
          <h2 className="font-bold text-2xl">Packing List</h2>
        </div>
        <div className='text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
          {checkedCount}/{totalItems} packed
        </div>
      </div>

      {/* Progress bar */}
      <div className='h-3 bg-gray-100 rounded-full mb-2'>
        <div className='h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full transition-all duration-500'
          style={{ width: `${percent}%` }} />
      </div>
      <p className='text-xs text-gray-400 mb-6'>{percent}% packed{percent === 100 ? ' — You\'re ready! 🎉' : ''}</p>

      <div className='grid md:grid-cols-2 gap-5'>
        {sections.map((section, si) => (
          <div key={si} className={`rounded-xl p-4 border ${section.color}`}>
            <h3 className='font-bold mb-3 flex items-center gap-2'>{section.icon} {section.title}</h3>
            <ul className='space-y-2'>
              {section.items.map((item, ii) => {
                const key = `${si}-${ii}`
                return (
                  <li key={ii} className='flex items-center gap-2 cursor-pointer select-none' onClick={() => toggle(key)}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0
                      ${checked[key] ? 'bg-green-500 border-green-500' : 'border-gray-400 bg-white'}`}>
                      {checked[key] && <span className='text-white text-xs font-bold'>✓</span>}
                    </div>
                    <span className={`text-sm transition-all ${checked[key] ? 'line-through opacity-50' : ''}`}>{item}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PackingList