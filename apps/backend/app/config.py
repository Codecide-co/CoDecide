import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / '.env')


class Config:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")

    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        "DATABASE_URL", "sqlite:///cokedecide.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    MONGO_URI: str = os.getenv(
        "MONGO_URI",
        "mongodb://localhost:27017/cokedecide"
    )
    MONGO_DB_NAME: str = os.getenv(
        "MONGO_DB_NAME",
        "cokedecide"
    )

    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "jwt-secret-key"
    )