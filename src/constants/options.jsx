export const SelectTravelesList = [
  { id: 1, title: 'Just Me', desc: 'Solo adventure, your rules', icon: '✈️', people: '1' },
  { id: 2, title: 'A Couple', desc: 'Romantic getaway for two', icon: '🥂', people: '2 People' },
  { id: 3, title: 'Family', desc: 'Fun for the whole family', icon: '🏡', people: '3 to 5 People' },
  { id: 4, title: 'Friends', desc: 'Epic group adventure', icon: '⛵', people: '5 to 10 People' },
]

export const SelectBudgetOptions = [
  { id: 1, title: 'Cheap', desc: 'Budget-friendly travel', icon: '💵' },
  { id: 2, title: 'Moderate', desc: 'Comfortable mid-range', icon: '💰' },
  { id: 3, title: 'Luxury', desc: 'Only the best', icon: '💸' },
]

export const TripPersonas = [
  { id: 1, title: 'Adventure', desc: 'Hiking, sports & thrills', icon: '🧗' },
  { id: 2, title: 'Romantic', desc: 'Cozy & intimate spots', icon: '❤️' },
  { id: 3, title: 'Cultural', desc: 'History, art & local life', icon: '🏛️' },
  { id: 4, title: 'Foodie', desc: 'Best local cuisine & cafes', icon: '🍜' },
  { id: 5, title: 'Nature', desc: 'Parks, beaches & wildlife', icon: '🌿' },
  { id: 6, title: 'Photography', desc: 'Scenic & Instagrammable spots', icon: '📸' },
]

export const AI_PROMPT = `You are an expert travel planner. Create a detailed travel plan for:
- Traveling FROM: {fromLocation}
- Destination: {location}
- Duration: {totalDays} days
- Travelers: {traveler}
- Budget: {budget}
- Trip Style: {persona}
- Special Interests: {interests}

Return ONLY valid JSON in this exact format (no extra text):
{
  "tripSummary": {
    "destination": "",
    "bestTimeToVisit": "",
    "currency": "",
    "language": "",
    "totalEstimatedCost": "",
    "emergencyNumber": "",
    "nearestHospital": ""
  },
  "travelFromInfo": {
    "from": "",
    "to": "",
    "recommendedMode": "",
    "alternatives": [
      {
        "mode": "",
        "duration": "",
        "estimatedCost": "",
        "details": "",
        "bookingTip": ""
      }
    ],
    "totalTravelTime": "",
    "bestOption": ""
  },
  "hotels": [
    {
      "hotelName": "",
      "hotelAddress": "",
      "price": "",
      "rating": "",
      "description": "",
      "amenities": ""
    }
  ],
  "itinerary": [
    {
      "day": "Day 1",
      "theme": "",
      "meals": {
        "breakfast": "",
        "lunch": "",
        "dinner": ""
      },
      "plan": [
        {
          "time": "",
          "placeName": "",
          "placeDetails": "",
          "ticketPricing": "",
          "travelTime": "",
          "bestFor": "",
          "tips": ""
        }
      ]
    }
  ],
  "packingList": {
    "essentials": [],
    "clothing": [],
    "documents": [],
    "electronics": []
  },
  "budgetBreakdown": {
    "travelToDestination": "",
    "localTransport": "",
    "accommodation": "",
    "food": "",
    "sightseeing": "",
    "miscellaneous": "",
    "total": ""
  },
  "localTips": [],
  "transportationTips": ""
}`