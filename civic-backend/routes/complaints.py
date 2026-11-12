from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import models, schemas

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/complaints")
def create_complaint(complaint: schemas.ComplaintCreate, db: Session = Depends(get_db)):
    new_complaint = models.Complaint(
        title=complaint.title, 
        category=complaint.category, 
        user_email=complaint.user_email
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return {"message": "Complaint submitted successfully"}

@router.get("/complaints/{user_email}")
def get_user_complaints(user_email: str, db: Session = Depends(get_db)):
    complaints = db.query(models.Complaint).filter(models.Complaint.user_email == user_email).all()
    return complaints