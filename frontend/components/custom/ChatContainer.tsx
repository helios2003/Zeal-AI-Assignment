import ChatMessage from "./ChatMessage"

interface Message {
    id: string
    text: string
    isUser: boolean
  }
  
  interface ChatContainerProps {
    messages: Message[]
  }
  
  export function ChatContainer({ messages }: ChatContainerProps) {
    return (
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
      </div>
    )
  }