from app.core.config import settings
from app.database import engine, Base
from app.models.user import User  # Make sure model is imported

print("📢 Creating all tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created successfully.")
