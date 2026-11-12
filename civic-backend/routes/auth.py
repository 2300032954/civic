from fastapi import APIRouter, Depends, HTTPException
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

@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(name=user.name, email=user.email, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

# 🚨 NEW LOGIN ROUTE
@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Find the user by email
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")
    
    # Check password (Note: In a real app, you should hash passwords, but for now we just check plain text)
    if db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    return {
        "message": "Login successful", 
        "user": {"name": db_user.name, "email": db_user.email}
    }