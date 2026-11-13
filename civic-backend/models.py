from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(100))
    role = Column(String(20), default="citizen")
    login_count = Column(Integer, default=0)          # <-- NEW
    last_login = Column(DateTime, nullable=True)      # <-- NEW

class Complaint(Base):
    __tablename__ = "complaints"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    category = Column(String(100))
    status = Column(String(50), default="Pending")
    user_email = Column(String(100))

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    category = Column(String(100)) 
    data_json = Column(Text) 