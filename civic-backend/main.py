from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth, complaints # <-- Added complaints here
import models 

# Create the tables in Aiven MySQL when the app starts
#Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Civic Accountability Platform API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect the routes
app.include_router(auth.router, prefix="/auth")
app.include_router(complaints.router, prefix="/api") # <-- Added this line

@app.get("/")
def home():
    return {
        "message": "Civic Accountability Platform Backend is running"
    }