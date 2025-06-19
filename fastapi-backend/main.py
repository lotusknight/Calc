from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

@app.post("/calc")
def calc(req: CalcRequest):
    distribution = []
    accumulated_probability = 0
    for i in range(1, req.trials + 1):
        prob = (1 - req.probability) ** (i - 1) * req.probability
        distribution.append(prob)
        accumulated_probability += prob
    return {
        "distribution": distribution,
        "accumulatedProbability": accumulated_probability
    }