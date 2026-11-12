from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get ALL complaints from ALL users
@router.get("/complaints")
def get_all_complaints(db: Session = Depends(get_db)):
    complaints = db.query(models.Complaint).all()
    return complaints

# Get ALL users (Citizen Tracking)
@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users