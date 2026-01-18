'use client'

import { useEffect, useRef, useState } from 'react'
import { Wrapper } from '@googlemaps/react-wrapper'

// UCSC campus bounds
const UCSC_BOUNDS = {
  north: 37.0050,
  south: 36.9750,
  west: -122.0750,
  east: -122.0450,
}

function MapComponent({ bathrooms, userLocation }) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map centered on UCSC
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 36.9914, lng: -122.0609 }, // UCSC coordinates
      zoom: 15,
      restriction: {
        latLngBounds: UCSC_BOUNDS,
        strictBounds: false,
      },
    })

    setMap(newMap)
  }, [])

  useEffect(() => {
    if (!map) return

    // Clear existing markers
    // Add bathroom markers
    bathrooms.forEach((bathroom) => {
      const marker = new window.google.maps.Marker({
        position: { lat: bathroom.lat, lng: bathroom.lng },
        map: map,
        title: bathroom.name,
      })

      marker.addListener('click', () => {
        window.location.href = `/bathroom/${bathroom.id}`
      })
    })

    // Add user location marker
    if (userLocation) {
      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2,
        },
        title: 'Your Location',
      })
    }
  }, [map, bathrooms, userLocation])

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
}

export default function Map({ bathrooms, userLocation }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <Wrapper apiKey={apiKey}>
      <MapComponent bathrooms={bathrooms} userLocation={userLocation} />
    </Wrapper>
  )
}
