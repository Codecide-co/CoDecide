"""Seed the database with default categories and optionally create an admin user."""

import getpass
import random

import werkzeug.security

from app import create_app
from app.extensions import db
from app.models.category import Category
from app.models.user import User

app = create_app()

DEFAULT_CATEGORIES = [
    {"name": "Public Utilities", "type": "infrastructure", "description": "Water, electricity, gas, and other public services"},
    {"name": "Roads & Sidewalks", "type": "infrastructure", "description": "Street maintenance, potholes, sidewalks, signage"},
    {"name": "Parks & Green Areas", "type": "infrastructure", "description": "Public parks, gardens, trees, and recreational areas"},
    {"name": "Waste Management", "type": "infrastructure", "description": "Garbage collection, recycling, dumping, and street cleaning"},
    {"name": "Public Lighting", "type": "infrastructure", "description": "Street lights, public area illumination"},
    {"name": "Coexistence", "type": "coexistence", "description": "Noise complaints, neighbor disputes, community living issues"},
    {"name": "Security", "type": "coexistence", "description": "Safety concerns, suspicious activity, public security"},
    {"name": "Transportation", "type": "infrastructure", "description": "Public transit, traffic, bike lanes, parking"},
    {"name": "Health & Sanitation", "type": "infrastructure", "description": "Public health concerns, sanitation issues"},
    {"name": "Other", "type": "coexistence", "description": "Other community concerns not covered above"},
]


def seed_categories():
    existing = Category.query.count()
    if existing > 0:
        print(f"Database already has {existing} categories. Skipping seed.")
        return

    for data in DEFAULT_CATEGORIES:
        category = Category(**data)
        db.session.add(category)

    db.session.commit()
    print(f"Seeded {len(DEFAULT_CATEGORIES)} categories successfully.")


def create_user():
    print("\n--- User account creation ---")

    name = input("Name: ").strip()
    while not name:
        name = input("Name (required): ").strip()

    email = input("Email: ").strip()
    while not email:
        email = input("Email (required): ").strip()

    if User.query.filter_by(email=email).first():
        print(f"User with email '{email}' already exists. Skipping admin creation.")
        return

    password = getpass.getpass("Password: ")
    while not password:
        password = getpass.getpass("Password (required): ")

    apartment = input("Apartment (optional): ").strip() or None
    tower = input("Tower (optional): ").strip() or None

    role = input("Role (admin/resident) [admin]: ").strip().lower() or "admin"
    while role not in ("admin", "resident"):
        role = input("Role must be 'admin' or 'resident': ").strip().lower()

    user = User(
        name=name,
        email=email,
        password_hash=werkzeug.security.generate_password_hash(password),
        role=role,
        apartment=apartment,
        tower=tower,
        avatar_url=f"/static/avatars/avatar{random.randint(1, 150)}.svg",
    )
    db.session.add(user)
    db.session.commit()
    print(f"Admin user '{name}' <{email}> created successfully.")


def seed():
    with app.app_context():
        seed_categories()

        while True:
            answer = input("\nCreate an admin account? (y/N): ").strip().lower()
            if answer == "y":
                create_user()
                break
            elif answer in ("n", ""):
                print("Skipping admin creation.")
                break
            else:
                print("Please answer 'y' or 'n'.")


if __name__ == "__main__":
    seed()
