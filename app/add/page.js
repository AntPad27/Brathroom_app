'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Wrapper } from '@googlemaps/react-wrapper'
import Link from 'next/link'

// UCSC campus bounds
const UCSC_BOUNDS = {
  north: 37.0050,
  south: 36.9750,
  west: -122.0750,
  east: -122.0450,
}

function AddBathroomMap({ onLocationSelect, initialLocation }) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)

  useEffect(() => {
    if (!mapRef.current) return

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: initialLocation || { lat: 36.9914, lng: -122.0609 },
      zoom: 16,
      restriction: {
        latLngBounds: UCSC_BOUNDS,
        strictBounds: false,
      },
    })

    setMap(newMap)

    // Add click listener to place marker
    newMap.addListener('click', (e) => {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      
      // Remove old marker
      if (marker) marker.setMap(null)
      
      // Add new marker
      const newMarker = new window.google.maps.Marker({
        position: { lat, lng },
        map: newMap,
      })
      
      setMarker(newMarker)
      onLocationSelect(lat, lng)
    })
  }, [])

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
}

export default function AddBathroom() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [building, setBuilding] = useState('')
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [wheelchair, setWheelchair] = useState(false)
  const [singleStall, setSingleStall] = useState(false)
  const [genderNeutral, setGenderNeutral] = useState(false)
  const [grabBars, setGrabBars] = useState(false)
  const [automaticDoor, setAutomaticDoor] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          setLat(location.lat)
          setLng(location.lng)
        }
      )
    }
  }, [])

  function handleLocationSelect(latitude, longitude) {
    setLat(latitude)
    setLng(longitude)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!lat || !lng) {
      alert('Please select a location on the map')
      return
    }
    
    setSubmitting(true)

    const { error } = await supabase
      .from('bathrooms')
      .insert({
        name,
        building,
        lat,
        lng,
        wheelchair_accessible: wheelchair,
        single_stall: singleStall,
        gender_neutral: genderNeutral,
        grab_bars: grabBars,
        automatic_door: automaticDoor
      })

    if (error) {
      console.error('Error adding bathroom:', error)
      alert('Error adding bathroom')
    } else {
      router.push('/')
    }
    
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen">
      <header className="p-4" style={{ backgroundColor: '#003c6c', color: '#fdc700' }}>
        <div className="flex items-center gap-3">
          <img src="/slugloo-icon.PNG" alt="Slug Loo Icon" className="w-16 h-16" />
          <div>
            <Link href="/" className="text-sm hover:underline">← Back to Map</Link>
            <h1 className="text-2xl font-bold mt-2">Add Bathroom</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold mb-4">Basic Information</h2>
            
            <div className="mb-4">
              <label className="block font-medium mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border rounded"
                placeholder="e.g., McHenry Library 1st Floor"
                style={{ border: '1px solid #003c6c' }}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Building *</label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                required
                className="w-full p-2 border rounded"
                placeholder="e.g., McHenry Library"
                style={{ border: '1px solid #003c6c' }}
              />
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold mb-2">Location *</h2>
            <p className="text-sm text-gray-600 mb-3">Click on the map to place a pin</p>
            
            <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
              <AddBathroomMap 
                onLocationSelect={handleLocationSelect}
                initialLocation={userLocation}
              />
            </Wrapper>
            
            {lat && lng && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Location selected: {lat.toFixed(5)}, {lng.toFixed(5)}
              </p>
            )}
          </div>

          {/* Accessibility */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-bold mb-4">Accessibility Features</h2>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={wheelchair}
                  onChange={(e) => setWheelchair(e.target.checked)}
                />
                Wheelchair Accessible
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={singleStall}
                  onChange={(e) => setSingleStall(e.target.checked)}
                />
                Single Stall
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={genderNeutral}
                  onChange={(e) => setGenderNeutral(e.target.checked)}
                />
                Gender Neutral
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={grabBars}
                  onChange={(e) => setGrabBars(e.target.checked)}
                />
                Grab Bars
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={automaticDoor}
                  onChange={(e) => setAutomaticDoor(e.target.checked)}
                />
                Automatic Door
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
            style={{ backgroundColor: '#003c6c', color: '#fff' }}
          >
            {submitting ? 'Adding...' : 'Add Bathroom'}
          </button>
        </form>
      </main>
    </div>
  )
}
