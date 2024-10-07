from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'okhereiawh'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add 'active' column to 'units' table
    with op.batch_alter_table('Units', schema=None) as batch_op:
        batch_op.add_column(sa.Column('ok', sa.Boolean(), nullable=False, server_default=sa.true()))

def downgrade():
    # Remove 'active' column from 'units' table
    with op.batch_alter_table('Units', schema=None) as batch_op:
        batch_op.drop_column('ok')
