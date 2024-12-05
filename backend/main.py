import os
import json
import uvicorn
from pathlib import Path
from pydantic import BaseModel
from fastapi import FastAPI, status, HTTPException
from dotenv import load_dotenv
from utils.scraper import scrape_seattle_website
from utils.embeddings import generate_embeddings, get_results

app = FastAPI()

class APIKeyRequest(BaseModel):
    api_key: str

class GetResults(BaseModel):
    query: str
    top_k: float
    threshold: float

@app.get("/scrape", status_code=status.HTTP_200_OK)
def scrape_website(start_page: int, end_page: int):
    try:
        if start_page < 1 or end_page > 256 or start_page > end_page:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="page range given is not right"
            )
        
        scrape_seattle_website(start_page, end_page)
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
  
@app.get('/create-embeddings', status_code=status.HTTP_201_CREATED)
def create_embeddings():
    try:
        if not os.path.exists('events_details.json'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="first scrape the website for querying the data"
            )
        generate_embeddings()

        return {
            "message": "Embeddings created successfully",
            "status_code": status.HTTP_201_CREATED 
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
    
@app.post('/get-results', status_code=200)
def get_results_route(payload: GetResults):

    query = payload.query
    top_k = payload.top_k
    threshold = payload.threshold
    
    if len(query) < 3 or len(query) > 5000 or not (1 <= top_k <= 100) or not (0.0 <= threshold <= 1.0):
        raise HTTPException(
            status_code=400,
            detail="Invalid input"
        )

    try:
        results = get_results(query=query, top_k=top_k, threshold=threshold)
        print(results)
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
    