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
    # Check if the email already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user (defaults to 'citizen' role)
    new_user = models.User(name=user.name, email=user.email, password=user.password)
    
    # Save to Aiven MySQL database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully"}

@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Find user by email
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")
    
    # Check password
    if db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    # Return user data INCLUDING the role so React knows where to redirect
    return {
        "message": "Login successful", 
        "user": {
            "name": db_user.name, 
            "email": db_user.email, 
            "role": db_user.role
        }
    }