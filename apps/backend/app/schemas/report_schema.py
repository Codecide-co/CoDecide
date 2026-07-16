"""
Marshmallow schemas for report endpoints.

Defines validation rules for creating, updating, and interacting with
reports, including status transitions, voting, and comments.
"""

from marshmallow import Schema, fields, validate


class CreateReportSchema(Schema):
    """Schema for creating a new report."""
    
    title = fields.String(required=True, validate=validate.Length(min=5, max=200))
    description = fields.String(required=True, validate=validate.Length(min=10))
    category_id = fields.Integer(required=True)
    location = fields.String(validate=validate.Length(max=255))
    is_anonymous = fields.Bool(missing=False)


class UpdateReportSchema(Schema):
    """Schema for updating an existing report."""

    title = fields.String(validate=validate.Length(min=5, max=200))
    description = fields.String(validate=validate.Length(min=10))
    location = fields.String(validate=validate.Length(max=255))


class StatusUpdateSchema(Schema):
    """Schema for updating a report's status."""

    status = fields.String(
        required=True,
        validate=validate.OneOf(["open", "in_progress", "resolved", "closed"]),
    )
    comment = fields.String(validate=validate.Length(max=500))


class VoteSchema(Schema):
    """Schema for voting on a report."""

    vote_type = fields.String(
        required=True,
        validate=validate.OneOf(["up", "down"]),
    )


class CommentSchema(Schema):
    """Schema for creating a comment on a report."""

    body = fields.String(required=True, validate=validate.Length(min=1))


class ReportResponseSchema(Schema):
    """Schema for report detail responses."""

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
    """Schema for report list responses."""

    id = fields.Integer()
    title = fields.String()
    status = fields.String()
    tracking_number = fields.String()
    category_id = fields.Integer()
    user_id = fields.Integer()
    created_at = fields.DateTime()
    votes_count = fields.Integer()
    comments_count = fields.Integer()
