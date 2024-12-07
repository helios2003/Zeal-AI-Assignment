from sklearn.metrics.pairwise import cosine_similarity as sklearn_cosine_similarity
from utils.embeddings import get_embeddings
import numpy as np
from typing import List, Dict, Any

def extract_text(data: List[Dict[str, Any]]) -> List[str]:
    return [f"{item['name']} {item['category']}" for item in data]

def cosine_similarity(ground_truth: List[Dict[str, Any]], model_output: List[Dict[str, Any]]) -> float:

    gt_text = extract_text(ground_truth)
    model_output_text = extract_text(model_output)
    
    gt_embedding = get_embeddings(gt_text)
    model_output_embedding = get_embeddings(model_output_text)

    similarity = sklearn_cosine_similarity(gt_embedding, model_output_embedding)
    mean_similarity = np.mean(similarity)

    return mean_similarity

def evaluate_dataset(evaluation_data):
    """
    Evaluate entire dataset and aggregate results
    """
    overall_results = []
    
    for entry in evaluation_data:
        question = entry['question']
        ground_truth = entry['ground_truth']
        model_output = entry['model']
        
        # Calculate metrics for this entry
        cosine = cosine_similarity(ground_truth, model_output)

        overall_results.append({
            "question": question,
            "ground_truth": ground_truth,
            "model_output": model_output,
            "cosine_similarity": cosine,
        })
    
    return overall_results