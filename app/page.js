'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateDistance } from '@/lib/utils'
import Link from 'next/link'
import Map from '@/components/Map'

export default function Home() {
  const [bathrooms, setBathrooms] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [filter, setFilter] = useState({ wheelchair: false, singleStall: false, genderNeutral: false })
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => console.log('Location denied:', error)
      )
    }

    // Fetch bathrooms
    fetchBathrooms()
  }, [])

  async function fetchBathrooms() {
    const { data, error } = await supabase
      .from('bathrooms')
      .select('*')
    
    if (error) {
      console.error('Error fetching bathrooms:', error)
    } else {
      setBathrooms(data)
    }
  }

  // Filter and sort bathrooms
  const filteredBathrooms = bathrooms
    .filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
                           b.building.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = 
        (!filter.wheelchair || b.wheelchair_accessible) &&
        (!filter.singleStall || b.single_stall) &&
        (!filter.genderNeutral || b.gender_neutral)
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (!userLocation) return 0
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng)
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
      return distA - distB
    })

  return (
    <div className="min-h-screen">
      <header className="p-4" style={{ backgroundColor: '#003c6c', color: '#fdc700' }}>
        <h1 className="text-2xl font-bold">UCSC Restroom Radar</h1>
        <p className="text-sm">Find, rate, and add bathrooms on campus</p>
      </header>

      <main className="container mx-auto p-4">
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <input
            type="text"
            placeholder="Search by name or building..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          
          <div className="flex gap-3 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filter.wheelchair}
                onChange={(e) => setFilter({...filter, wheelchair: e.target.checked})}
              />
              Wheelchair Accessible
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filter.singleStall}
                onChange={(e) => setFilter({...filter, singleStall: e.target.checked})}
              />
              Single Stall
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filter.genderNeutral}
                onChange={(e) => setFilter({...filter, genderNeutral: e.target.checked})}
              />
              Gender Neutral
            </label>
          </div>
        </div>

        {/* Map */}
        <div className="mb-4">
          <Map bathrooms={filteredBathrooms} userLocation={userLocation} />
        </div>

        {/* Add Bathroom Button */}
        <div className="mb-4">
          <Link 
            href="/add"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            + Add Bathroom
          </Link>
        </div>

        {/* Bathroom List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBathrooms.map((bathroom) => (
            <Link 
              key={bathroom.id}
              href={`/bathroom/${bathroom.id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="font-bold text-lg">{bathroom.name}</h3>
              <p className="text-gray-600">{bathroom.building}</p>
              
              <div className="flex gap-2 mt-2 flex-wrap">
                {bathroom.wheelchair_accessible && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">♿ Accessible</span>
                )}
                {bathroom.single_stall && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Single Stall</span>
                )}
                {bathroom.gender_neutral && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Gender Neutral</span>
                )}
              </div>
              
              {userLocation && (
                <p className="text-sm text-gray-500 mt-2">
                  {calculateDistance(userLocation.lat, userLocation.lng, bathroom.lat, bathroom.lng).toFixed(2)} km away
                </p>
              )}
            </Link>
          ))}
        </div>

        {filteredBathrooms.length === 0 && (
          <p className="text-center text-gray-500 py-8">No bathrooms found. Be the first to add one!</p>
        )}
      </main>
    </div>
  )
}
