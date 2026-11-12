from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows your Vercel frontend to talk to Render
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = FastAPI(
    title="Civic Accountability Platform API"
)


@app.get("/")
def home():
    return {
        "message": "Civic Accountability Platform Backend is running"
    }