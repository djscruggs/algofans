import { useState, useRef } from 'react'

interface CreatePostProps {
  onPostCreated?: () => void
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [isLocked, setIsLocked] = useState(false)
  const [price, setPrice] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    if (selectedFiles.length > 0) {
      setFiles(selectedFiles)

      // Generate previews
      const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
      setPreviews(newPreviews)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content && files.length === 0) {
      alert('Please add content or media')
      return
    }

    try {
      setIsSubmitting(true)

      const formData = new FormData()
      formData.append('content', content)
      formData.append('isLocked', isLocked.toString())
      if (price) {
        formData.append('price', price)
      }

      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      // Reset form
      setContent('')
      setIsLocked(false)
      setPrice('')
      setFiles([])
      setPreviews([])

      if (onPostCreated) {
        onPostCreated()
      }
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const removefile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  return (
    <div className="card p-4 mb-6">
      <form onSubmit={handleSubmit}>
        {/* Content Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="input w-full min-h-[100px] resize-none mb-4"
        />

        {/* Media Previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removefile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Options */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Subscribers Only</span>
          </label>

          {isLocked && (
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price (optional)"
              className="input w-32"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 text-primary hover:text-blue-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Add Media</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  )
}
