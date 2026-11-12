from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

# ADD THIS
class ComplaintCreate(BaseModel):
    title: str
    category: str
    user_email: str