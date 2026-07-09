from marshmallow import Schema, fields, validate


class UserProfileSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    email = fields.Email()
    role = fields.String()
    apartment = fields.String()
    tower = fields.String()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class UserSummarySchema(Schema):
    id = fields.Integer()
    name = fields.String()
    apartment = fields.String()
    tower = fields.String()
