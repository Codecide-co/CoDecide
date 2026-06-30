import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")

    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        "DATABASE_URL", "sqlite:///cokedecide.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/cokedecide")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "cokedecide")
