"""Seed the database with default categories."""

from app import create_app
from app.extensions import db
from app.models.category import Category

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

def seed():
    with app.app_context():
        existing = Category.query.count()
        if existing > 0:
            print(f"Database already has {existing} categories. Skipping seed.")
            return

        for data in DEFAULT_CATEGORIES:
            category = Category(**data)
            db.session.add(category)

        db.session.commit()
        print(f"Seeded {len(DEFAULT_CATEGORIES)} categories successfully.")

if __name__ == "__main__":
    seed()
