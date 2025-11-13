import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/messages')({
  component: Messages,
})

function Messages() {
  return (
    <div className="min-h-screen bg-darker py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>

        <div className="flex h-[600px] card overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <input
                type="text"
                placeholder="Search messages..."
                className="input w-full"
              />
            </div>
            <div className="overflow-y-auto h-full">
              <p className="text-center text-gray-400 mt-8">No conversations yet</p>
            </div>
          </div>

          {/* Message View */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg
                className="w-24 h-24 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
