from app.db.base import Base
from app.models.user import User


def test_users_table_is_registered_in_metadata() -> None:
    assert User.__tablename__ == "users"
    assert "users" in Base.metadata.tables


def test_user_table_has_required_identity_columns() -> None:
    columns = Base.metadata.tables["users"].columns

    assert {"id", "email", "full_name", "password_hash"} <= set(columns.keys())
