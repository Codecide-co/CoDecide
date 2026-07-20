"""add avatar_url to users

Revision ID: 7b5bf5e84377
Revises: cec8fd320dda
Create Date: 2026-07-19 21:00:02.250535

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7b5bf5e84377'
down_revision = 'cec8fd320dda'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('avatar_url', sa.String(length=255), nullable=True))


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('avatar_url')
