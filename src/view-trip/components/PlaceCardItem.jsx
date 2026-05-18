import React, { useEffect, useState } from "react"
import { GetPlaceImage } from "@/service/GlobalApi"

function PlaceCardItem({ place, done }) {
  const [photoUrl, setPhotoUrl] = useState(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    setImgLoaded(false)
    GetPlaceImage(place?.placeName).then(setPhotoUrl)
  }, [place])

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.placeName)}`

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group ${done ? 'border-green-300' : ''}`}>
      <div className='relative overflow-hidden h-44'>
        {!imgLoaded && <div className="h-full w-full bg-gray-200 animate-pulse" />}
        <img src={photoUrl || "/placeholder.jpg"}
          className={`h-full w-full object-cover group-hover:scale-105 transition-all duration-500 ${imgLoaded ? "block" : "hidden"}`}
          alt={place?.placeName}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => { e.target.src = "/placeholder.jpg"; setImgLoaded(true) }} />
        {done && (
          <div className='absolute inset-0 bg-green-500/30 flex items-center justify-center'>
            <span className='text-5xl'>✅</span>
          </div>
        )}
        {place?.bestFor && (
          <div className='absolute bottom-2 left-2'>
            <span className='bg-black/60 text-white text-xs px-2 py-1 rounded-full'>{place.bestFor}</span>
          </div>
        )}
      </div>
      <div className='p-4'>
        <h2 className="font-bold text-base mb-1">{place?.placeName}</h2>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{place?.placeDetails}</p>
        <div className='flex flex-wrap gap-2 text-xs mb-3'>
          {place?.ticketPricing && <span className='bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium'>🎫 {place.ticketPricing}</span>}
          {place?.travelTime && <span className='bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium'>🚗 {place.travelTime}</span>}
        </div>
        {place?.tips && (
          <div className='bg-yellow-50 rounded-lg p-2 mb-3'>
            <p className='text-xs text-yellow-700'>💡 <b>Tip:</b> {place.tips}</p>
          </div>
        )}
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-sm text-white bg-gradient-to-r from-orange-500 to-pink-500 py-2 rounded-xl font-medium hover:opacity-90 transition-all">
          📍 Open in Google Maps
        </a>
      </div>
    </div>
  )
}

export default PlaceCardItem