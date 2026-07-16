"""
Application configuration.

Loads settings from environment variables with sensible defaults for
development. Uses a .env file in the backend root directory.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / '.env')


class Config:
    """
    Flask application configuration class.

    Attributes:
        SECRET_KEY: Flask secret key for session signing.
        SQLALCHEMY_DATABASE_URI: Database connection string (SQLite dev, MySQL prod).
        MONGO_URI: MongoDB connection string.
        JWT_SECRET_KEY: Key used to sign JWT tokens.
        CORS_ORIGINS: Comma-separated list of allowed CORS origins.
    """
    
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

    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173"
    )