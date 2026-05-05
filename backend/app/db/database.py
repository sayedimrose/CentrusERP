from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# For development, we can use SQLite, but PostgreSQL is recommended for production.
SQLALCHEMY_DATABASE_URL = "sqlite:///./centrus_erp.db"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} # check_same_thread is needed only for SQLite
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
