import React from 'react'
import { cn } from '@/lib/utils'

export interface Message {
  id: string
  category: string
  link: string
  name: string
}

export default function ChatMessage({ id, category, link, name }: Message) {
  return (
    <div className={cn(
      'flex gap-4 p-6 bg-gray-50'
    )}>
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-600'
      )}>
      </div>
      <div className="flex-1">
        <p className="text-gray-900">
          <span className="font-bold">Name:</span> {id}
        </p>
        <p className="text-gray-900">
          <span className="font-bold">Category:</span> {category}
        </p>
        <p className="text-gray-900">
          <span className="font-bold">Link:</span>{" "}
          <a href={link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {link}
          </a>
        </p>
      </div>
    </div>
  )
}