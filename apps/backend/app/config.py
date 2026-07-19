"""
Application configuration.

Loads settings from environment variables with sensible defaults for
development. Uses a .env file in the backend root directory.
"""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / '.env')


class Config:
    """
    Flask application configuration class.

    Attributes:
        SECRET_KEY: Flask secret key for session signing.
        SQLALCHEMY_DATABASE_URI: Database connection string (SQLite dev, MySQL prod).
        USE_MONGO: Whether to use MongoDB for audit logs and attachments.
        MONGO_URI: MongoDB connection string.
        MONGO_DB_NAME: MongoDB database name.
        JWT_SECRET_KEY: Key used to sign JWT tokens.
        JWT_ACCESS_TOKEN_EXPIRES: JWT token expiration timedelta.
        CORS_ORIGINS: Comma-separated list of allowed CORS origins.
        UPLOAD_FOLDER: Filesystem path for uploaded files.
        MAX_CONTENT_LENGTH: Maximum upload file size in bytes.
    """
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")

    SQLALCHEMY_DATABASE_URI: str = os.getenv(
        "DATABASE_URL", "sqlite:///codecide.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    USE_MONGO: bool = os.getenv("USE_MONGO", "false").lower() == "true"

    MONGO_URI: str = os.getenv(
        "MONGO_URI",
        "mongodb://localhost:27017/codecide"
    )
    MONGO_DB_NAME: str = os.getenv(
        "MONGO_DB_NAME",
        "codecide"
    )

    JWT_SECRET_KEY: str = os.getenv(
        "JWT_SECRET_KEY",
        "jwt-secret-key"
    )

    JWT_ACCESS_TOKEN_EXPIRES: timedelta = timedelta(
        days=int(os.getenv("JWT_EXPIRATION_DAYS", "7"))
    )

    CORS_ORIGINS: str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173"
    )

    UPLOAD_FOLDER: str = os.getenv(
        "UPLOAD_FOLDER",
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
    )

    MAX_CONTENT_LENGTH: int = int(os.getenv("MAX_FILE_SIZE_MB", "16")) * 1024 * 1024