from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils.calc_utils import calculate_distribution  # Import your function

app = FastAPI()

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CalcRequest(BaseModel):
    probability: float
    trials: int

@app.get("/")
def api():
    return "'Hello from FastAPI backend!"

@app.get("/api")
def api():
    return "Connected to the FastAPI!"

@app.post("/calc")
def calc(req: CalcRequest):
    distribution, accumulated_probability = calculate_distribution(req.probability, req.trials)
    return {
        "distribution": distribution,
        "accumulatedProbability": accumulated_probability
    }
