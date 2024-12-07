import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export interface Output {
  name: string;
  category: string;
}

export interface QandAProps {
  index: number;
  question: string;
  ground_truth: Output[];
  model_output: Output[];
  cosine_similarity: string;
}

export default function QuestionAnswer({
  index,
  question,
  ground_truth,
  model_output,
  cosine_similarity,
}: QandAProps) {
  return (
    <Card key={index}>
      <CardHeader>
        <CardTitle>Question {index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-gray-600 font-medium">Question</h4>
            <p className="text-gray-800">{question}</p>
          </div>
          <div>
            <h4 className="text-gray-600 font-medium">Ground Truth</h4>
            <div className="space-y-2">
              <p className="text-gray-800">
                {ground_truth[0].name} ({ground_truth[0].category})
              </p>
              <p className="text-gray-800">
                {ground_truth[1].name} ({ground_truth[1].category})
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-gray-600 font-medium">Model Output</h4>
            <div className="space-y-2">
              <p className="text-gray-800">
                {model_output[0].name} ({model_output[0].category})
              </p>
              <p className="text-gray-800">
                {model_output[1].name} ({model_output[1].category})
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-gray-600 font-medium">Cosine Similarity Score</h4>
            <p className="text-gray-800">{cosine_similarity}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}