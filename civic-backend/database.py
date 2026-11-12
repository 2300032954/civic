import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# This now reads from your .env file instead of hardcoding it
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:Himasri%40123@localhost/civic_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()