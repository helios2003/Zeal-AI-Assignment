"use client"

import { Bot } from "lucide-react"
import axios from "axios"
import Modal from "@/components/custom/Modal"
import ChatInput from "@/components/custom/ChatInput"
import { ChatContainer } from "@/components/custom/ChatContainer"
import { Loader } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Message } from "@/components/custom/ChatMessage"
import { useToast } from "@/hooks/use-toast"

export default function Chat() {
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [queryInputs, setQueryInputs] = useState<string[]>([])
    const [messageLengths, setMessageLengths] = useState<number[]>([])
    const chatMessagesRef = useRef<HTMLDivElement>(null)

    const { toast } = useToast()

    async function handleSubmit(query: string) {
        const payload = {
            query: query,
            top_k: localStorage.getItem("top_k"),
            threshold: 0.7
        }
        setIsLoading(true)
        try {

            const response = await axios.post("http://localhost:8000/get-results", payload)
            if (response.status === 200) {
                const newMessages: Message[] = response.data.results.map((result: any) => ({
                    id: result.id,
                    category: result.category,
                    link: result.link,
                    name: result.name
                }))

                setMessages((prevMessages) => [...prevMessages, ...newMessages])
                setQueryInputs((prevQueryInputs) => [...prevQueryInputs, query])
                setMessageLengths((prevLengths) => [...prevLengths, newMessages.length])
            } else {
                console.error("Failed to fetch results:", response.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        toast({
        title: "Attention",
        description: "Please enter valid details by clicking on 'Add Details'. Ignore if already done",
      })
    }, [])

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
            <div ref={chatMessagesRef}>
                    <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />

                {messageLengths.map((length, index) => {
                    let startIndex = messageLengths.slice(0, index).reduce((a, b) => a + b, 0);
                    return (
                        <div key={index} className="py-2 space-y-4">
                            <ChatContainer messages={messages.slice(startIndex, startIndex + length)} />
                            <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
                        </div>
                    )
                })}
                {isLoading && (
                    <div className="flex justify-center items-center py-4">
                        <Loader className="h-6 w-6 text-blue-600 animate-spin" />
                    </div>
                )}
            </div>
        </div>
    )
}