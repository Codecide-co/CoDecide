from marshmallow import Schema, fields, validate


class CreateReportSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=5, max=200))
    description = fields.String(required=True, validate=validate.Length(min=10))
    category_id = fields.Integer(required=True)
    location = fields.String(validate=validate.Length(max=255))


class UpdateReportSchema(Schema):
    title = fields.String(validate=validate.Length(min=5, max=200))
    description = fields.String(validate=validate.Length(min=10))
    location = fields.String(validate=validate.Length(max=255))


class StatusUpdateSchema(Schema):
    status = fields.String(
        required=True,
        validate=validate.OneOf(["open", "in_progress", "resolved", "closed"]),
    )


class VoteSchema(Schema):
    vote_type = fields.String(
        required=True,
        validate=validate.OneOf(["up", "down"]),
    )


class CommentSchema(Schema):
    body = fields.String(required=True, validate=validate.Length(min=1))


class ReportResponseSchema(Schema):
    id = fields.Integer()
    title = fields.String()
    description = fields.String()
    status = fields.String()
    tracking_number = fields.String()
    location = fields.String()
    category_id = fields.Integer()
    user_id = fields.Integer()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()


class ReportListSchema(Schema):
    id = fields.Integer()
    title = fields.String()
    status = fields.String()
    tracking_number = fields.String()
    category_id = fields.Integer()
    user_id = fields.Integer()
    created_at = fields.DateTime()
    votes_count = fields.Integer()
    comments_count = fields.Integer()
