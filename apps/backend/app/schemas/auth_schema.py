"""
Marshmallow schemas for authentication endpoints.

Defines validation rules for registration, login, profile updates,
and password changes.
"""

from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    """Schema for user registration requests."""
    
    name = fields.String(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6, max=255))
    apartment = fields.String(validate=validate.Length(max=20))
    tower = fields.String(validate=validate.Length(max=10))


class LoginSchema(Schema):
    """Schema for login requests."""

    email = fields.Email(required=True)
    password = fields.String(required=True)


class AuthResponseSchema(Schema):
    """Schema for authentication response serialization."""

    id = fields.Integer()
    name = fields.String()
    email = fields.Email()
    role = fields.String()
    apartment = fields.String()
    tower = fields.String()
    token = fields.String()


class UpdateProfileSchema(Schema):
    """Schema for profile update requests."""

    name = fields.String(validate=validate.Length(min=2, max=100))
    apartment = fields.String(validate=validate.Length(max=20))
    tower = fields.String(validate=validate.Length(max=10))
    avatar_url = fields.String(validate=validate.Length(max=255))


class ChangePasswordSchema(Schema):
    """Schema for change password requests."""
    
    current_password = fields.String(required=True)
    new_password = fields.String(required=True, validate=validate.Length(min=6, max=255))
