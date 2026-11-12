from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import auth
import models # Important: tells the database to create the User table

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

# This connects the /signup route to the main app
app.include_router(auth.router, prefix="/auth")

@app.get("/")
def home():
    return {
        "message": "Civic Accountability Platform Backend is running"
    }