import ChatMessage from "./ChatMessage"
import { Message } from "./ChatMessage"

interface ChatContainerProps {
  messages: Message[]
}

export function ChatContainer({ messages }: ChatContainerProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          id={message.id}
          category={message.category}
          name={message.name}
          link={message.link}
        />
      ))}
    </div>
  )
}