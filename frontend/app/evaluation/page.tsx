"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Loader } from 'lucide-react'
import { QandAProps } from '@/components/custom/QuestionAnswer'
import QuestionAnswer from '@/components/custom/QuestionAnswer'

export default function Evaluation() {
  const [questions, setQuestions] = useState<QandAProps[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('')

  useEffect(() => {
    async function fetchQuestionData() {
      setLoading(true)
      try {
        const evalURL = 'http://localhost:8000/evaluate'
        const response = await axios.get(evalURL)
        setQuestions(response.data['results'])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching question data:', error)
        setLoading(false)
      }
    }

    fetchQuestionData()

    const loadingMessages = [
      'Evaluating 10 unique queries',
      'Comparing with ground truth',
      'Finding the cosine similarity',
      'Demonstrates the performace of the finetuned model'
    ]

    let currentIndex = 0
    const intervalId = setInterval(() => {
      setLoadingMessage(loadingMessages[currentIndex])
      currentIndex = (currentIndex + 1) % loadingMessages.length
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden">
          <div className="animate-spin">
            <Loader className="h-12 w-12 text-blue-600" />
          </div>
          <div className="text-gray-600 text-lg mt-4">{loadingMessage}</div>
        </div>
      ) : (
        <>
          <div className="text-5xl font-bold text-blue-600 text-center m-2">
            Evaluation of the RAG
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((question, index) => (
              <QuestionAnswer
                key={index}
                index={index}
                question={question.question}
                ground_truth={question.ground_truth}
                model_output={question.model_output}
                cosine_similarity={question.cosine_similarity}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}