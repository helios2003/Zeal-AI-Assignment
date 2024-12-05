"use client"

import { PartyPopper } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import axios from "axios"

export default function Home() {
  const [startPage, setStartPage] = useState<number>()
  const [endPage, setEndPage] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()

  async function handleScrape() {
    setLoading(true)
    if (startPage === undefined || endPage === undefined) {
      setLoading(false)
      toast({
        variant: "destructive",
        title: "Bad request",
        description: "One of the page number fields is empty",
      })
      return
    }

    try {
      const scrapeURL = `http://localhost:8000/scrape?start_page=${startPage}&end_page=${endPage}`
      const response = await axios.get(scrapeURL)

      if (response.status === 200) {
        console.log("Scraping is complete")
        setLoading(false)
        router.push('/chat')
      } else if (response.status === 400) {
        toast({
          variant: "destructive",
          title: "Bad request",
          description: "Enter valid page numbers",
        })
      }

    } catch (err) {
      console.error("Internal Server Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
            <Toaster />
      <div className="flex flex-col items-center justify-start px-4 py-12 max-w-4xl mx-auto">
        <div className="text-center space-y-8 w-full">
          <div className="flex justify-center">
            <PartyPopper className="h-16 w-16 text-blue-600 animate-bounce" />
          </div>
          <h1 className="text-7xl font-bold text-blue-600">
            Chat Seattle
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Use EventBrite to find out about all the latest and exciting stuff happening in Seattle!!
          </p>
          <div className="space-y-6 w-full max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="startPage" className="block text-sm font-medium text-gray-700">
                    Start Page
                  </label>
                  <input
                    id="startPage"
                    type="number"
                    min="1"
                    value={startPage}
                    onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                    className={cn(
                      'w-full px-4 py-2 border rounded-lg bg-white',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      'transition-colors duration-200',
                      'placeholder:text-gray-400',
                    )}
                    placeholder="1"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="endPage" className="block text-sm font-medium text-gray-700">
                    End Page
                  </label>
                  <input
                    id="endPage"
                    type="number"
                    min="1"
                    value={endPage}
                    onChange={(e) => setEndPage(parseInt(e.target.value) || 1)}
                    className={cn(
                      'w-full px-4 py-2 border rounded-lg bg-white',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      'transition-colors duration-200',
                      'placeholder:text-gray-400',
                    )}
                    placeholder="1"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4 w-full max-w-2xl mx-auto">
              <Button
                onClick={handleScrape}
                disabled={loading}
                className={cn(
                  'w-full bg-blue-600',
                  loading && 'opacity-50 cursor-not-allowed bg-blue-600 hover:bg-blue-600'
                )}
              >
                {loading ? "Loading..." : "Gather Data"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
