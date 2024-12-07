import json
from typing import Dict, Any, List
import unicodedata
from pinecone import ServerlessSpec
from utils.init import load_env_vars

[pc, index_name] = load_env_vars()

def chunk_list(lst: List[str], chunk_size: int):
    """
    Splits a list into smaller chunks of a specified size.
    """
    for i in range(0, len(lst), chunk_size):
        yield lst[i:i + chunk_size]

def sanitize_vectors(vector_id: str) -> str:
    """
    Removes non ASCII charaxters from a particular vector
    """
    sanitized = unicodedata.normalize('NFKD', vector_id).encode('ascii', 'ignore').decode('ascii')
    return sanitized

def generate_embeddings() -> None:
    """
    Generates embeddings for events and upserts them into the Pinecone index
    """
    if not pc.has_index(index_name):
        pc.create_index(
            name=index_name,
            dimension=1024,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region='us-east-1'
        )
    )

    with open('events_details.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    index = pc.Index(index_name)
    inputs = [sanitize_vectors(d['name']) for d in data]    
    chunk_size = 20
    vectors = []

    for chunk in chunk_list(inputs, chunk_size):
        embeddings = pc.inference.embed(
            model="multilingual-e5-large",
            inputs=chunk,
            parameters={"input_type": "passage", "truncate": "END"}
        )

        for d, e in zip(data[:len(chunk)], embeddings):
            vector_id = sanitize_vectors(d['name'])
            vectors.append({
                "id": vector_id,
                "values": e['values'],
                "metadata": {
                    'name': d['name'],
                    'link': d['link'],
                    'location': d['location'],
                    'category': d['category']
                }
            })

    index.upsert(
        vectors=vectors,
        namespace="backend-namespace"
    )

def get_embeddings(input_texts) -> list:
    """
    Returns the embeddings for the list of input texts.
    """
    if not pc.has_index(index_name):
        pc.create_index(
            name=index_name,
            dimension=1024,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region='us-east-1'
        )
    )
    embedding_response = pc.inference.embed(
        model="multilingual-e5-large",  
        inputs=input_texts,
        parameters={"input_type": "query"}
    )
    
    return [embedding['values'] for embedding in embedding_response]

def get_results(query: str, top_k: int, threshold: float) -> Dict[str, Any]:
    """
    Obtain the top results for the particualr query as provided and returns
    the resultant object
    """
    embedding = pc.inference.embed(
        model=index_name,
        inputs=[query],
        parameters={
            "input_type": "query"
        }
    )
    index = pc.Index(index_name)
    results = index.query(
        namespace="backend-namespace",
        vector=embedding[0].values,
        top_k=top_k,
        include_values=False,
        include_metadata=True,
        score_threshold=threshold
    )
    return results