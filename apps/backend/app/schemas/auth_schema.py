from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(min=6, max=255))
    apartment = fields.String(validate=validate.Length(max=20))
    tower = fields.String(validate=validate.Length(max=10))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)


class AuthResponseSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    email = fields.Email()
    role = fields.String()
    apartment = fields.String()
    tower = fields.String()
    token = fields.String()


class UpdateProfileSchema(Schema):
    name = fields.String(validate=validate.Length(min=2, max=100))
    apartment = fields.String(validate=validate.Length(max=20))
    tower = fields.String(validate=validate.Length(max=10))


class ChangePasswordSchema(Schema):
    current_password = fields.String(required=True)
    new_password = fields.String(required=True, validate=validate.Length(min=6, max=255))
