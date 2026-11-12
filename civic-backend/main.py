from fastapi import FastAPI

app = FastAPI(
    title="Civic Accountability Platform API"
)


@app.get("/")
def home():
    return {
        "message": "Civic Accountability Platform Backend is running"
    }