import os
import json
import uvicorn
from pathlib import Path
from typing import Dict, Any
from pydantic import BaseModel
from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from utils.scraper import scrape_seattle_website
from utils.embeddings import generate_embeddings, get_results

app = FastAPI()


app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class APIKeyRequest(BaseModel):
    api_key: str

class GetResults(BaseModel):
    query: str
    top_k: float
    threshold: float

@app.get("/scrape", status_code=status.HTTP_200_OK)
def scrape_website(start_page: int, end_page: int):
    """
    Scrapes the website for the URLs specified, user can specify the page numbers
    which they want to scrape as well
    """
    try:
        if start_page < 1 or end_page > 256 or start_page > end_page:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="page range given is not right"
            )
        
        scrape_seattle_website(start_page, end_page)
        generate_embeddings()
        return {
            "status_code": status.HTTP_200_OK,
            "message": f"Scraping completed for pages {start_page} to {end_page}."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "error": str(e)
            }
        )

@app.post("/settings", status_code=status.HTTP_200_OK)
def set_api_key(payload: APIKeyRequest):
    """
    Set the API key that the user needs to use to access the remotely
    hosted model
    """
    try:
        api_key = payload.api_key
        if len(str(api_key)) != 75:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="API key does not follow the valid format"
            )
        
        env_file = Path(__file__).resolve().parent / "../.env"
        load_dotenv(dotenv_path=env_file)

        with open(env_file, "w", encoding="utf-8") as file:
            file.write(f"\nPINECONE_API_KEY={api_key}\n")

        load_dotenv(dotenv_path=env_file, override=True)

        return {
            "status_code": status.HTTP_200_OK,
            "message": "API key successfully updated",
            "PINECONE_API_KEY": os.getenv("PINECONE_API_KEY")
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "error": str(e)
            }
        )

# @app.post('/initial-prompt' status_code=200)
# def set_prompt(prompt: str):
    
@app.post('/get-results', status_code=status.HTTP_200_OK)
def get_results_route(payload: GetResults) -> Dict[str, Any]:
    """
    Get the results for the query as specified by the user
    """
    query = payload.query
    top_k = payload.top_k
    threshold = payload.threshold
    
    if len(query) < 3 or len(query) > 5000 or not (1 <= top_k <= 10) or not (0.0 <= threshold <= 1.0):
        raise HTTPException(
            status_code=400,
            detail="Invalid input"
        )

    try:
        results = get_results(query=query, top_k=top_k, threshold=threshold)
        return json.dumps(str(results))
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "error": str(e)
            }
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    