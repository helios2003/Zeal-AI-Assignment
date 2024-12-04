import os
import json
import unicodedata
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

pinecone_api_key = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=pinecone_api_key)

index_name = "multilingual-e5-large"


def sanitize_vectors(vector_id):
    sanitized = unicodedata.normalize('NFKD', vector_id).encode('ascii', 'ignore').decode('ascii')
    return sanitized

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
    namespace="example-namespace"
)

query = "tell me about Seattle SOLD OUT"

embedding = pc.inference.embed(
    model="multilingual-e5-large",
    inputs=[query],
    parameters={
        "input_type": "query"
    }
)

results = index.query(
    namespace="example-namespace",
    vector=embedding[0].values,
    top_k=2,
    include_values=False,
    include_metadata=True,
    score_threshold=0.6
)

print(results)