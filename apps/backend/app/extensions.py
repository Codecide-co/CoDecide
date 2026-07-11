from flask_babel import Babel
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_pymongo import PyMongo
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
mongo = PyMongo()
migrate = Migrate()
jwt = JWTManager()
babel = Babel()
