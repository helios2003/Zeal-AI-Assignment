import React from 'react'
import { User, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: string
  isUser: boolean
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  return (
    <div className={cn(
      'flex gap-4 p-6',
      isUser ? 'bg-white' : 'bg-gray-50'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser ? 'bg-blue-600' : 'bg-emerald-600'
      )}>
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-gray-900 whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  )
}