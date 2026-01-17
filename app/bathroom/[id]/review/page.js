'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getDeviceId, hashDeviceId } from '@/lib/utils'
import Link from 'next/link'

export default function AddReview({ params }) {
  const router = useRouter()
  const [cleanliness, setCleanliness] = useState(3)
  const [accessibility, setAccessibility] = useState(3)
  const [privacy, setPrivacy] = useState(3)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)

    const deviceId = getDeviceId()
    const deviceHash = await hashDeviceId(deviceId)

    const { error } = await supabase
      .from('reviews')
      .insert({
        bathroom_id: params.id,
        cleanliness,
        accessibility,
        privacy,
        comment: comment.trim() || null,
        device_hash: deviceHash
      })

    if (error) {
      console.error('Error submitting review:', error)
      alert('Error submitting review. You may have already reviewed this bathroom recently.')
    } else {
      router.push(`/bathroom/${params.id}`)
    }
    
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <Link href={`/bathroom/${params.id}`} className="text-sm hover:underline">← Back</Link>
        <h1 className="text-2xl font-bold mt-2">Add Review</h1>
      </header>

      <main className="container mx-auto p-4 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          
          {/* Cleanliness */}
          <div className="mb-6">
            <label className="block font-bold mb-2">
              Cleanliness: {cleanliness}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={cleanliness}
              onChange={(e) => setCleanliness(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Accessibility */}
          <div className="mb-6">
            <label className="block font-bold mb-2">
              Accessibility: {accessibility}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={accessibility}
              onChange={(e) => setAccessibility(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Privacy */}
          <div className="mb-6">
            <label className="block font-bold mb-2">
              Privacy: {privacy}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={privacy}
              onChange={(e) => setPrivacy(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block font-bold mb-2">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className="w-full p-2 border rounded"
              placeholder="Share your experience..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </main>
    </div>
  )
}
