"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import axios from "axios"

export default function Modal() {
    const [apiKey, setAPIKey] = useState("")
    const [topK, setTopK] = useState("")
    const [isOn, setIsOn] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const { toast } = useToast()

    async function handleSubmit() {
        try {
            const settingsURL = "http://localhost:8000/settings"
            const response = await axios.post(settingsURL, { api_key: apiKey })

            if (response.status === 200) {
                // add some params to local storage for the MVP
                localStorage.setItem("top_k", topK)
                localStorage.setItem("metrics", isOn ? "1" : "0")

                toast({
                    title: "Success",
                    description: "Your settings have been updated",
                })
            } else if (response.status === 400) {
                toast({
                    variant: "destructive",
                    title: "Bad request",
                    description: "API Key or number of top answers selected is invalid",
                })
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Bad request",
                description: "Internal Server Error",
            })
        } finally {
            setModalOpen(false)
        }
    }

    return (
        <>
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <div className="flex justify-end">
                    <DialogTrigger className="bg-blue-600 px-4 py-2 text-white rounded-md text-center inline-block float-right">
                        Add the details
                    </DialogTrigger>
                </div>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Your Settings</DialogTitle>
                        <DialogDescription className="space-y-4">
                            <input
                                className="w-full p-2 border border-black rounded-md"
                                type="input"
                                onChange={(e) => { setAPIKey(e.target.value) }}
                                placeholder="Pinecone API key (75 characters long)"
                            />
                            <input
                                className="w-full p-2 border border-black rounded-md"
                                type="input"
                                onChange={(e) => { setTopK(e.target.value) }}
                                placeholder="Number of top answers to be returned (b/w 1 to 10)"
                            />
                            <Button
                                className="bg-blue-600 w-full"
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}