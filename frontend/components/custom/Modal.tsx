"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { useState } from "react"
import axios from "axios"

export default function Modal() {
    const [apiKey, setAPIKey] = useState("")
    const [topK, setTopK] = useState("")

    async function handleSubmit() {
        console.log("2rgraethnhgcr13T4MCGJVH,J")
        try {
            const settingsURL = "http://localhost:8000/settings"
            const response = await axios.post(settingsURL, { api_key: apiKey })

            if (response.status === 200) {
                console.log("everything is added")
                localStorage.setItem("top_k", topK)
            } else if (response.status === 400) {
                console.log("wrong submission")
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dialog>
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
    )
}