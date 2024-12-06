"use client"

import { Bot } from "lucide-react"
import axios from "axios"
import Modal from "@/components/custom/Modal"
import ChatInput from "@/components/custom/ChatInput"
import { ChatContainer } from "@/components/custom/ChatContainer"
import { useState } from "react"
import { Message } from "@/components/custom/ChatMessage"

export default function Chat() {
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])

    async function handleSubmit(query: string) {
        const payload = {
            query: query,
            top_k: localStorage.getItem("top_k"),
            threshold: 0.7
        }
        setIsLoading(true)
        try {
            const response = await axios.post("http://localhost:8000/get-results", payload);
            if (response.status === 200) {
                const newMessages: Message[] = response.data.results.map((result: any) => ({
                    id: result.id,
                    category: result.category,
                    link: result.link,
                    name: result.name,
                }))
                console.log("hi mama howdy you")
                setMessages((prevMessages) => [...prevMessages, ...newMessages])
            } else {
                console.log("yo wassup")
                console.error("Failed to fetch results:", response.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false)
        }
    }

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
                <div className="p-4 border-t border-gray-200">
                    <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
                </div>
                <ChatContainer messages={messages} />
            </div>
        </div>
    )
}