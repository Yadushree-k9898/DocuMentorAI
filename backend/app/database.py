from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.base import Base  # ✅ Clean import

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,     # ✅ Reconnect on lost connections
    pool_recycle=1800,      # ✅ Recycle every 30 mins (Neon cuts idle ones quickly)
    pool_size=10,           # ✅ Default connection pool size
    max_overflow=20,        # ✅ Extra connections allowed temporarily
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
