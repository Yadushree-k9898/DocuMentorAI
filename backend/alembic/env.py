import sys
import os

# Add app to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.base import Base
from app.core.config import settings
from sqlalchemy import engine_from_config, pool
from logging.config import fileConfig

# Load DB URL from app settings
from alembic import context

config = context.config
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

fileConfig(config.config_file_name)

target_metadata = Base.metadata
