"""create users table

Revision ID: 771a479665f1
Revises: c3fc63db5c97
Create Date: 2025-07-02 19:10:28.050209

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '771a479665f1'
down_revision: Union[str, Sequence[str], None] = 'c3fc63db5c97'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
