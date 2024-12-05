import { Bot } from "lucide-react"
import Modal from "@/components/custom/Modal"
import ChatInput from "@/components/custom/ChatInput"

export default function Chat() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Modal />
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Bot className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can I help you today?
          </h1>
          <p className="text-lg text-gray-600">
            Ask me anything about Seattle on eventbrite.com
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 250px)' }}>
          {/* <ChatContainer messages={messages} /> */}
          
          {/* <div className="p-4 border-t border-gray-200">
            <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
          </div> */}
        </div>
      </div>
    )
}