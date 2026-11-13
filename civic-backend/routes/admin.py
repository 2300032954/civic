from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import pandas as pd
import io
import json

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/complaints")
def get_all_complaints(db: Session = Depends(get_db)):
    return db.query(models.Complaint).all()

@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.post("/upload-dataset")
async def upload_dataset(
    file: UploadFile = File(...), 
    category: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        contents = await file.read()
        
        # 1. Read Excel or CSV using Pandas
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
        
        # 2. Preprocessing: Example - Count issues by area/type
        # (Adjust this based on your actual Excel columns)
        # For example, if your excel has a "Location" column:
        column_to_group = df.columns[1] # Just grabbing the 2nd column for this example
        summary = df[column_to_group].value_counts().reset_index()
        summary.columns = ['name', 'value']
        
        # 3. Convert to JSON to send to Frontend
        json_data = summary.to_json(orient="records")
        
        # 4. Save to Database
        new_dataset = models.Dataset(name=file.filename, category=category, data_json=json_data)
        db.add(new_dataset)
        db.commit()
        
        return {"message": "Dataset processed and saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/datasets")
def get_datasets(db: Session = Depends(get_db)):
    return db.query(models.Dataset).all()
@router.delete("/datasets/{dataset_id}")
def delete_dataset(dataset_id: int, db: Session = Depends(get_db)):
    dataset = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    db.delete(dataset)
    db.commit()
    return {"message": "Dataset deleted successfully"}
# ... (keep your existing routes) ...

from pydantic import BaseModel

class ComplaintStatusUpdate(BaseModel):
    status: str

@router.put("/complaints/{complaint_id}")
def update_complaint_status(complaint_id: int, status_update: ComplaintStatusUpdate, db: Session = Depends(get_db)):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    complaint.status = status_update.status
    db.commit()
    return {"message": "Complaint status updated successfully"}