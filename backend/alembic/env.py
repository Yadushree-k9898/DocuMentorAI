import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Import settings and Base
from app.core.config import settings
from app.db.base import Base

# 👇 Import models to make sure metadata includes them
from app.models import user, document


# Load Alembic config
config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)

# Set up logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set target metadata for Alembic autogeneration
target_metadata = Base.metadata

