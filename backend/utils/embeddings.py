import os
import json
from typing import Dict, Any
import unicodedata
from dotenv import load_dotenv
from pathlib import Path
from pinecone import Pinecone, ServerlessSpec

env_file = Path(__file__).resolve().parent / "../../.env"
load_dotenv(dotenv_path=env_file)

pinecone_api_key = os.getenv("PINECONE_API_KEY")

pc = Pinecone(api_key=pinecone_api_key)
index_name = "multilingual-e5-large"

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

    embeddings = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[d['name'] for d in data],
        parameters={"input_type": "passage", "truncate": "END"}
    )

    vectors = []

    for d, e in zip(data, embeddings):
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
    print(index)
    results = index.query(
        namespace="backend-namespace",
        vector=embedding[0].values,
        top_k=top_k,
        include_values=False,
        include_metadata=True,
        score_threshold=threshold
    )

    return results