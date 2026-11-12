from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "citizen" # <-- Added role

class ComplaintCreate(BaseModel):
    title: str
    category: str
    user_email: str

class DatasetCreate(BaseModel):
    name: str
    category: str
    data_json: str # We will store the processed data as a JSON string