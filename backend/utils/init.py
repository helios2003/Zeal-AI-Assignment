import os
from pathlib import Path
from dotenv import load_dotenv
from pinecone import Pinecone

def load_env_vars() -> list:
    env_file = Path(__file__).resolve().parent / "../../.env"
    load_dotenv(dotenv_path=env_file)

    pinecone_api_key = os.getenv("PINECONE_API_KEY")

    pc = Pinecone(api_key=pinecone_api_key)
    index_name = "multilingual-e5-large"

    return [pc, index_name]
