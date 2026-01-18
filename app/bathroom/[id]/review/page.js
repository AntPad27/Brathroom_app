'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getDeviceId, hashDeviceId } from '@/lib/utils'
import Link from 'next/link'

export default function AddReview({ params }) {
  const { id } = use(params)
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
        bathroom_id: id,
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
      router.push(`/bathroom/${id}`)
    }
    
    setSubmitting(false)
  }

  const StarRating = ({ value, onChange, label }) => {
    return (
      <div className="mb-6">
        <label className="block font-bold mb-3">{label}</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className="text-4xl transition-all hover:scale-110"
            >
              {star <= value ? '⭐' : '☆'}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="p-4" style={{ backgroundColor: '#003c6c', color: '#fdc700' }}>
        <Link href={`/bathroom/${id}`} className="text-sm hover:underline">← Back</Link>
        <h1 className="text-2xl font-bold mt-2">Add Review</h1>
      </header>

      <main className="container mx-auto p-4 max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          
          {/* Cleanliness */}
          <StarRating 
            value={cleanliness}
            onChange={setCleanliness}
            label="Cleanliness"
          />

          {/* Accessibility */}
          <StarRating 
            value={accessibility}
            onChange={setAccessibility}
            label="Accessibility"
          />

          {/* Privacy */}
          <StarRating 
            value={privacy}
            onChange={setPrivacy}
            label="Privacy"
          />

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
            className="w-full py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            style={{ backgroundColor: submitting ? undefined : '#003c6c', color: '#fdc700' }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </main>
    </div>
  )
}
