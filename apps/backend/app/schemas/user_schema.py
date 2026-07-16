"""
Marshmallow schemas for user data serialization.

Defines schemas for user profile and summary responses.
"""

from marshmallow import Schema, fields, validate


class UserProfileSchema(Schema):
    """Schema for full user profile responses."""

    id = fields.Integer()
    name = fields.String()
    email = fields.Email()
    role = fields.String()
    apartment = fields.String()
    tower = fields.String()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class UserSummarySchema(Schema):
    """Schema for summarized user data (e.g., in lists)."""

    id = fields.Integer()
    name = fields.String()
    apartment = fields.String()
    tower = fields.String()
