import React, { useState, KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSubmit: (message: string) => void
  isLoading?: boolean
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSubmit(message.trim())
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative w-full">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Query about Seattle..."
        className={cn(
          'w-full min-h-[60px] p-4 pr-12 rounded-lg resize-none',
          'bg-white border border-gray-300',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'placeholder:text-gray-400',
          'text-gray-900'
        )}
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || isLoading}
        className={cn(
          'absolute right-2 bottom-2 p-2 rounded-lg',
          'text-blue-600 hover:bg-blue-50 transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  )
}