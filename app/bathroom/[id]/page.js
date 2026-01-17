'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function BathroomDetail({ params }) {
  const [bathroom, setBathroom] = useState(null)
  const [reviews, setReviews] = useState([])
  const [averages, setAverages] = useState({ cleanliness: 0, accessibility: 0, privacy: 0 })

  useEffect(() => {
    fetchBathroom()
    fetchReviews()
  }, [])

  async function fetchBathroom() {
    const { id } = await params;
    const { data, error } = await supabase
      .from('bathrooms')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching bathroom:', error)
    } else {
      setBathroom(data)
    }
  }

  async function fetchReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('bathroom_id', params.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching reviews:', error)
    } else {
      setReviews(data)
      
      // Calculate averages
      if (data.length > 0) {
        const avgCleanliness = data.reduce((sum, r) => sum + r.cleanliness, 0) / data.length
        const avgAccessibility = data.reduce((sum, r) => sum + r.accessibility, 0) / data.length
        const avgPrivacy = data.reduce((sum, r) => sum + r.privacy, 0) / data.length
        
        setAverages({
          cleanliness: avgCleanliness.toFixed(1),
          accessibility: avgAccessibility.toFixed(1),
          privacy: avgPrivacy.toFixed(1)
        })
      }
    }
  }

  if (!bathroom) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <Link href="/" className="text-sm hover:underline">← Back to Map</Link>
        <h1 className="text-2xl font-bold mt-2">{bathroom.name}</h1>
        <p className="text-sm">{bathroom.building}</p>
      </header>

      <main className="container mx-auto p-4 max-w-3xl">
        {/* Tags */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="font-bold mb-2">Features</h2>
          <div className="flex gap-2 flex-wrap">
            {bathroom.wheelchair_accessible && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">♿ Wheelchair Accessible</span>
            )}
            {bathroom.single_stall && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Single Stall</span>
            )}
            {bathroom.gender_neutral && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Gender Neutral</span>
            )}
            {bathroom.grab_bars && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">Grab Bars</span>
            )}
            {bathroom.automatic_door && (
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">Automatic Door</span>
            )}
          </div>
        </div>

        {/* Ratings */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="font-bold mb-3">Average Ratings</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Cleanliness:</span> {averages.cleanliness || 'No ratings yet'} / 5
            </div>
            <div>
              <span className="font-medium">Accessibility:</span> {averages.accessibility || 'No ratings yet'} / 5
            </div>
            <div>
              <span className="font-medium">Privacy:</span> {averages.privacy || 'No ratings yet'} / 5
            </div>
          </div>
        </div>

        {/* Add Review Button */}
        <div className="mb-4">
          <Link 
            href={`/bathroom/${bathroom.id}/review`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Add Review
          </Link>
        </div>

        {/* Reviews */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-3">Reviews ({reviews.length})</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                  <span>Cleanliness: {review.cleanliness}/5</span>
                  <span>Accessibility: {review.accessibility}/5</span>
                  <span>Privacy: {review.privacy}/5</span>
                </div>
                {review.comment && (
                  <p className="text-gray-800">{review.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
            
            {reviews.length === 0 && (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
