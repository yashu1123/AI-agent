from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.graph.graph import build_graph


app = FastAPI(title="NewsDate AI Agent")


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# REQUEST MODEL
# --------------------------------------------------

class DateRequest(BaseModel):
    date: str


# --------------------------------------------------
# LANGGRAPH
# --------------------------------------------------

news_graph = build_graph()


# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "NewsDate AI Agent is running"
    }


# --------------------------------------------------
# HEALTH
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "UP"
    }


# --------------------------------------------------
# RESEARCH
# --------------------------------------------------

@app.post("/agent/research")
def research_date(request: DateRequest):

    print(
        f"📅 Research requested for: {request.date}"
    )

    result = news_graph.invoke({
        "date": request.date,
        "research_plan": "",
        "categories": {},
        "events": [],
        "final_response": "",
    })

    print("✅ Research completed")

    return {
        "date": result["date"],
        "response": result["final_response"],
    }