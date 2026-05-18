import React, { useState } from 'react'

function DownloadPDF({ trip }) {
  const [loading, setLoading] = useState(false)

  const tripData = trip?.tripData
  const userSelection = trip?.userSelection
  const destination = userSelection?.location?.label || 'Trip'
  const days = Number(userSelection?.noOfDays) || 0
  const summary = tripData?.tripSummary
  const budget = tripData?.budgetBreakdown
  const travelInfo = tripData?.travelFromInfo

  const handleDownload = () => {
    setLoading(true)

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${destination} Trip Plan</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: #fff; }

    .cover {
      min-height: 100vh;
      background: linear-gradient(135deg, #f97316, #ec4899, #a855f7);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 60px 40px;
      page-break-after: always;
      color: white;
      position: relative;
    }
    .cover-badge {
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.4);
      border-radius: 50px; padding: 8px 20px;
      font-size: 13px; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      margin-bottom: 24px;
    }
    .cover h1 { font-size: 56px; font-weight: 900; margin-bottom: 12px; line-height: 1.1; }
    .cover .subtitle { font-size: 20px; opacity: 0.85; margin-bottom: 40px; }
    .cover-chips { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 50px; }
    .cover-chip {
      background: rgba(255,255,255,0.2); backdrop-filter: blur(4px);
      border-radius: 50px; padding: 8px 18px;
      font-size: 14px; font-weight: 600;
    }
    .cover-from {
      background: rgba(255,255,255,0.15);
      border-radius: 16px; padding: 16px 32px;
      font-size: 15px; margin-top: 10px;
    }
    .cover-footer {
      position: absolute; bottom: 30px;
      font-size: 12px; opacity: 0.6; letter-spacing: 1px;
    }
    .cover-logo { font-size: 28px; font-weight: 900; margin-bottom: 30px; letter-spacing: -1px; }

    .page { padding: 40px 50px; page-break-after: always; }
    .page:last-child { page-break-after: auto; }

    .section-title {
      font-size: 22px; font-weight: 800;
      color: #f97316; margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 3px solid #fed7aa;
      display: flex; align-items: center; gap: 8px;
    }

    .summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .summary-card {
      background: #fff7ed; border: 1px solid #fed7aa;
      border-radius: 12px; padding: 14px 16px;
    }
    .summary-card .label { font-size: 11px; color: #f97316; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    .summary-card .value { font-size: 15px; font-weight: 700; color: #1c1917; margin-top: 4px; }
    .total-cost {
      background: linear-gradient(135deg, #f97316, #ec4899);
      color: white; border-radius: 14px; padding: 20px 24px;
      text-align: center; margin-top: 8px;
    }
    .total-cost .label { font-size: 12px; opacity: 0.85; text-transform: uppercase; letter-spacing: 1px; }
    .total-cost .amount { font-size: 36px; font-weight: 900; margin-top: 4px; }

    .travel-route {
      background: linear-gradient(135deg, #7c3aed, #ec4899);
      color: white; border-radius: 14px; padding: 20px 24px;
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 16px;
    }
    .travel-city .city-label { font-size: 11px; opacity: 0.75; text-transform: uppercase; }
    .travel-city .city-name { font-size: 20px; font-weight: 800; }
    .travel-arrow { font-size: 28px; opacity: 0.9; }
    .travel-option {
      background: #faf5ff; border: 1px solid #e9d5ff;
      border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;
    }
    .travel-option .mode { font-weight: 700; color: #7c3aed; font-size: 14px; }
    .travel-meta { display: flex; gap: 20px; margin-top: 6px; font-size: 13px; color: #555; }
    .travel-detail { font-size: 13px; color: #444; margin-top: 6px; }
    .booking-tip {
      background: #eff6ff; border-left: 3px solid #3b82f6;
      padding: 8px 12px; margin-top: 8px; border-radius: 0 8px 8px 0;
      font-size: 12px; color: #1e40af;
    }

    .budget-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 16px; margin-bottom: 8px;
      background: #f9fafb; border-radius: 10px;
      border-left: 4px solid #f97316;
    }
    .budget-row .blabel { font-weight: 600; font-size: 14px; }
    .budget-row .bvalue { font-weight: 700; color: #f97316; font-size: 15px; }

    .hotel-card {
      border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 16px; margin-bottom: 14px;
      background: #fafafa;
    }
    .hotel-name { font-size: 16px; font-weight: 800; color: #111; }
    .hotel-addr { font-size: 12px; color: #888; margin-top: 3px; }
    .hotel-meta { display: flex; gap: 16px; margin-top: 10px; flex-wrap: wrap; }
    .hotel-badge {
      background: #fff7ed; color: #ea580c;
      border-radius: 20px; padding: 4px 12px;
      font-size: 12px; font-weight: 600;
    }
    .hotel-desc { font-size: 13px; color: #555; margin-top: 8px; line-height: 1.5; }
    .hotel-amenities { font-size: 12px; color: #888; margin-top: 6px; font-style: italic; }

    .day-header {
      background: linear-gradient(135deg, #f97316, #ec4899);
      color: white; border-radius: 12px;
      padding: 14px 20px; margin-bottom: 12px;
      display: flex; align-items: center; gap: 12px;
    }
    .day-number {
      width: 36px; height: 36px; background: rgba(255,255,255,0.25);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 14px; flex-shrink: 0;
    }
    .day-title { font-size: 17px; font-weight: 800; }
    .day-theme { font-size: 13px; opacity: 0.85; margin-top: 2px; }
    .meals-bar {
      background: #fffbeb; border: 1px solid #fde68a;
      border-radius: 10px; padding: 10px 14px;
      margin-bottom: 12px; font-size: 13px; color: #92400e;
    }
    .place-card {
      border: 1px solid #e5e7eb; border-radius: 10px;
      padding: 14px 16px; margin-bottom: 10px;
      background: white;
    }
    .place-time { font-size: 11px; font-weight: 700; color: #f97316; text-transform: uppercase; letter-spacing: 0.5px; }
    .place-name { font-size: 15px; font-weight: 800; color: #111; margin-top: 3px; }
    .place-details { font-size: 13px; color: #555; margin-top: 5px; line-height: 1.5; }
    .place-meta { display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; }
    .place-tag { border-radius: 20px; padding: 3px 10px; font-size: 11px; font-weight: 600; }
    .tag-green { background: #dcfce7; color: #166534; }
    .tag-blue { background: #dbeafe; color: #1e40af; }
    .place-tip {
      background: #fffbeb; border-left: 3px solid #f59e0b;
      padding: 7px 10px; margin-top: 8px;
      border-radius: 0 8px 8px 0; font-size: 12px; color: #78350f;
    }

    .packing-section {
      border: 1px solid #e5e7eb; border-radius: 12px;
      padding: 16px; margin-bottom: 14px;
    }
    .packing-title { font-size: 14px; font-weight: 800; margin-bottom: 10px; color: #374151; }
    .packing-item {
      font-size: 13px; color: #555;
      padding: 4px 0; display: flex; align-items: center; gap: 6px;
    }
    .checkbox {
      width: 14px; height: 14px; border: 2px solid #d1d5db;
      border-radius: 4px; flex-shrink: 0; display: inline-block;
    }

    .tips-list { list-style: none; }
    .tips-list li {
      background: #fffbeb; border: 1px solid #fde68a;
      border-radius: 10px; padding: 10px 14px;
      margin-bottom: 8px; font-size: 13px; color: #78350f;
      display: flex; gap: 8px; align-items: flex-start;
    }
    .tips-list li::before { content: "💡"; flex-shrink: 0; }

    .emergency-box {
      background: #fef2f2; border: 2px solid #fecaca;
      border-radius: 12px; padding: 16px 20px; margin-bottom: 16px;
    }
    .emergency-title { font-weight: 800; color: #dc2626; margin-bottom: 8px; font-size: 15px; }
    .emergency-row { font-size: 13px; color: #7f1d1d; margin-bottom: 4px; }

    .pdf-footer {
      text-align: center; padding: 30px;
      background: linear-gradient(135deg, #f97316, #ec4899);
      color: white;
    }
    .pdf-footer .logo { font-size: 24px; font-weight: 900; margin-bottom: 6px; }
    .pdf-footer p { font-size: 13px; opacity: 0.8; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover">
    <div class="cover-logo">✈ TripAI</div>
    <div class="cover-badge">${userSelection?.isSurpriseTrip ? '🎲 Surprise Trip' : 'AI Generated Trip'}</div>
    <h1>${destination}</h1>
    <div class="subtitle">Your Complete Travel Guide</div>
    <div class="cover-chips">
      <div class="cover-chip">📅 ${days} Day${days !== 1 ? 's' : ''}</div>
      <div class="cover-chip">💰 ${userSelection?.budget || 'Moderate'} Budget</div>
      <div class="cover-chip">👥 ${userSelection?.traveler || '2 People'}</div>
      ${userSelection?.persona ? `<div class="cover-chip">🎭 ${userSelection.persona}</div>` : ''}
    </div>
    ${userSelection?.fromLocation ? `<div class="cover-from">📍 Traveling from <b>${userSelection.fromLocation}</b></div>` : ''}
    ${summary?.bestTimeToVisit ? `<div style="margin-top:12px;font-size:14px;opacity:0.8">🌤 Best time to visit: <b>${summary.bestTimeToVisit}</b></div>` : ''}
    <div class="cover-footer">Generated by TripAI • Powered by Google Gemini</div>
  </div>

  <!-- TRIP OVERVIEW -->
  <div class="page">
    <div class="section-title">📋 Trip Overview</div>
    <div class="summary-grid">
      ${summary?.currency ? `<div class="summary-card"><div class="label">Currency</div><div class="value">💱 ${summary.currency}</div></div>` : ''}
      ${summary?.language ? `<div class="summary-card"><div class="label">Language</div><div class="value">🗣 ${summary.language}</div></div>` : ''}
      ${summary?.bestTimeToVisit ? `<div class="summary-card"><div class="label">Best Time to Visit</div><div class="value">🌤 ${summary.bestTimeToVisit}</div></div>` : ''}
      ${summary?.destination ? `<div class="summary-card"><div class="label">Destination</div><div class="value">📍 ${summary.destination}</div></div>` : ''}
    </div>
    ${summary?.totalEstimatedCost ? `
    <div class="total-cost">
      <div class="label">Total Estimated Cost</div>
      <div class="amount">${summary.totalEstimatedCost}</div>
    </div>` : ''}
    ${(summary?.emergencyNumber || summary?.nearestHospital) ? `
    <div class="emergency-box" style="margin-top:20px">
      <div class="emergency-title">🚨 Emergency Information</div>
      ${summary?.emergencyNumber ? `<div class="emergency-row">📞 Emergency Number: <b>${summary.emergencyNumber}</b></div>` : ''}
      ${summary?.nearestHospital ? `<div class="emergency-row">🏥 Nearest Hospital: ${summary.nearestHospital}</div>` : ''}
    </div>` : ''}
    ${tripData?.transportationTips ? `
    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px;margin-top:16px">
      <div style="font-weight:800;color:#1d4ed8;margin-bottom:6px;font-size:14px">🚌 Getting Around</div>
      <div style="font-size:13px;color:#1e40af;line-height:1.6">${tripData.transportationTips}</div>
    </div>` : ''}
  </div>

  <!-- HOW TO GET THERE -->
  ${travelInfo ? `
  <div class="page">
    <div class="section-title">✈️ How to Get There</div>
    <div class="travel-route">
      <div class="travel-city">
        <div class="city-label">From</div>
        <div class="city-name">${travelInfo.from || userSelection?.fromLocation || ''}</div>
      </div>
      <div class="travel-arrow">✈️</div>
      <div class="travel-city" style="text-align:right">
        <div class="city-label">To</div>
        <div class="city-name">${travelInfo.to || destination}</div>
      </div>
    </div>
    ${travelInfo.totalTravelTime ? `<div style="text-align:center;font-size:13px;color:#888;margin-bottom:16px">⏱ Total travel time: <b>${travelInfo.totalTravelTime}</b></div>` : ''}
    ${travelInfo.bestOption ? `<div style="background:#f3e8ff;color:#7c3aed;padding:8px 16px;border-radius:50px;display:inline-block;margin-bottom:16px;font-weight:700;font-size:13px">⭐ Best option: ${travelInfo.bestOption}</div>` : ''}
    ${(travelInfo.alternatives || []).map(alt => `
    <div class="travel-option">
      <div class="mode">${alt.mode}</div>
      <div class="travel-meta">
        <span>⏱ ${alt.duration}</span>
        <span>💰 ${alt.estimatedCost}</span>
      </div>
      ${alt.details ? `<div class="travel-detail">${alt.details}</div>` : ''}
      ${alt.bookingTip ? `<div class="booking-tip">💡 Booking tip: ${alt.bookingTip}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  <!-- BUDGET BREAKDOWN -->
  ${budget ? `
  <div class="page">
    <div class="section-title">💰 Budget Breakdown</div>
    ${budget.travelToDestination ? `<div class="budget-row"><div class="blabel">✈️ Travel to Destination</div><div class="bvalue">${budget.travelToDestination}</div></div>` : ''}
    ${budget.localTransport ? `<div class="budget-row"><div class="blabel">🚗 Local Transport</div><div class="bvalue">${budget.localTransport}</div></div>` : ''}
    ${budget.accommodation ? `<div class="budget-row"><div class="blabel">🏨 Accommodation</div><div class="bvalue">${budget.accommodation}</div></div>` : ''}
    ${budget.food ? `<div class="budget-row"><div class="blabel">🍽️ Food & Dining</div><div class="bvalue">${budget.food}</div></div>` : ''}
    ${budget.sightseeing ? `<div class="budget-row"><div class="blabel">🎡 Sightseeing</div><div class="bvalue">${budget.sightseeing}</div></div>` : ''}
    ${budget.miscellaneous ? `<div class="budget-row"><div class="blabel">🛍️ Miscellaneous</div><div class="bvalue">${budget.miscellaneous}</div></div>` : ''}
    ${budget.total ? `
    <div style="background:linear-gradient(135deg,#f97316,#ec4899);color:white;border-radius:14px;padding:20px 24px;text-align:center;margin-top:20px">
      <div style="font-size:13px;opacity:0.85;text-transform:uppercase;letter-spacing:1px">Grand Total</div>
      <div style="font-size:40px;font-weight:900;margin-top:4px">${budget.total}</div>
      <div style="font-size:11px;opacity:0.7;margin-top:6px">*Estimates only. Actual prices may vary.</div>
    </div>` : ''}
  </div>` : ''}

  <!-- HOTELS -->
  ${(tripData?.hotels?.length > 0) ? `
  <div class="page">
    <div class="section-title">🏨 Hotel Recommendations</div>
    ${tripData.hotels.map(h => `
    <div class="hotel-card">
      <div class="hotel-name">${h.hotelName || ''}</div>
      <div class="hotel-addr">📍 ${h.hotelAddress || ''}</div>
      <div class="hotel-meta">
        <span class="hotel-badge">💰 ${h.price || ''}</span>
        <span class="hotel-badge">⭐ ${h.rating || ''}</span>
      </div>
      ${h.description ? `<div class="hotel-desc">${h.description}</div>` : ''}
      ${h.amenities ? `<div class="hotel-amenities">✨ ${h.amenities}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  <!-- DAY BY DAY ITINERARY -->
  ${(tripData?.itinerary || []).map((day, di) => `
  <div class="page">
    <div class="day-header">
      <div class="day-number">${di + 1}</div>
      <div>
        <div class="day-title">${day.day}</div>
        ${day.theme ? `<div class="day-theme">🎯 ${day.theme}</div>` : ''}
      </div>
    </div>
    ${(day.meals && Object.values(day.meals).some(m => m)) ? `
    <div class="meals-bar">
      🍽️ <b>Meals:</b>
      ${day.meals.breakfast ? `&nbsp; 🌅 <b>Breakfast:</b> ${day.meals.breakfast}` : ''}
      ${day.meals.lunch ? `&nbsp;&nbsp; ☀️ <b>Lunch:</b> ${day.meals.lunch}` : ''}
      ${day.meals.dinner ? `&nbsp;&nbsp; 🌙 <b>Dinner:</b> ${day.meals.dinner}` : ''}
    </div>` : ''}
    ${(day.plan || []).map(place => `
    <div class="place-card">
      <div class="place-time">${place.time || ''}</div>
      <div class="place-name">${place.placeName || ''}</div>
      <div class="place-details">${place.placeDetails || ''}</div>
      <div class="place-meta">
        ${place.ticketPricing ? `<span class="place-tag tag-green">🎫 ${place.ticketPricing}</span>` : ''}
        ${place.travelTime ? `<span class="place-tag tag-blue">🚗 ${place.travelTime}</span>` : ''}
        ${place.bestFor ? `<span class="place-tag" style="background:#f3e8ff;color:#7c3aed">${place.bestFor}</span>` : ''}
      </div>
      ${place.tips ? `<div class="place-tip">💡 Tip: ${place.tips}</div>` : ''}
    </div>`).join('')}
  </div>`).join('')}

  <!-- PACKING LIST -->
  ${tripData?.packingList ? `
  <div class="page">
    <div class="section-title">🎒 Packing List</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      ${tripData.packingList.essentials?.length ? `
      <div class="packing-section">
        <div class="packing-title">⭐ Essentials</div>
        ${tripData.packingList.essentials.map(i => `<div class="packing-item"><span class="checkbox"></span>${i}</div>`).join('')}
      </div>` : ''}
      ${tripData.packingList.clothing?.length ? `
      <div class="packing-section">
        <div class="packing-title">👕 Clothing</div>
        ${tripData.packingList.clothing.map(i => `<div class="packing-item"><span class="checkbox"></span>${i}</div>`).join('')}
      </div>` : ''}
      ${tripData.packingList.documents?.length ? `
      <div class="packing-section">
        <div class="packing-title">📄 Documents</div>
        ${tripData.packingList.documents.map(i => `<div class="packing-item"><span class="checkbox"></span>${i}</div>`).join('')}
      </div>` : ''}
      ${tripData.packingList.electronics?.length ? `
      <div class="packing-section">
        <div class="packing-title">🔌 Electronics</div>
        ${tripData.packingList.electronics.map(i => `<div class="packing-item"><span class="checkbox"></span>${i}</div>`).join('')}
      </div>` : ''}
    </div>
  </div>` : ''}

  <!-- LOCAL TIPS -->
  ${tripData?.localTips?.length > 0 ? `
  <div class="page">
    <div class="section-title">💡 Local Tips & Insider Secrets</div>
    <ul class="tips-list">
      ${tripData.localTips.map(tip => `<li>${tip}</li>`).join('')}
    </ul>
    ${tripData?.hiddenGems?.length ? `
    <div style="margin-top:24px">
      <div class="section-title">💎 Hidden Gems</div>
      <ul class="tips-list">
        ${tripData.hiddenGems.map(g => `<li>${g}</li>`).join('')}
      </ul>
    </div>` : ''}
    ${tripData?.mustTryFoods?.length ? `
    <div style="margin-top:24px">
      <div class="section-title">🍽️ Must-Try Foods</div>
      <ul class="tips-list">
        ${tripData.mustTryFoods.map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>` : ''}
  </div>` : ''}

  <!-- BACK COVER -->
  <div class="pdf-footer">
    <div class="logo">✈ TripAI</div>
    <p>AI-powered travel planning — smarter than any travel agent</p>
    <p style="margin-top:6px;font-size:11px;opacity:0.6">
      Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
    </p>
  </div>

</body>
</html>`

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus()
        printWindow.print()
        setLoading(false)
      }, 500)
    }
    setTimeout(() => setLoading(false), 4000)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className='flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500
        text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105
        transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100'
    >
      {loading ? (
        <>
          <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24' fill='none'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8H4z' />
          </svg>
          Preparing PDF...
        </>
      ) : (
        <>📄 Download PDF</>
      )}
    </button>
  )
}

export default DownloadPDF