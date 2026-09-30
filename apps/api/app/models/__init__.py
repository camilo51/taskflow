"""Import ORM models so Alembic can discover their metadata."""

from app.models.user import User

__all__ = ["User"]
