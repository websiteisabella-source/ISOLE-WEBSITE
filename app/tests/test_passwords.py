"""Password hashing tests."""

from app.auth.password import hash_password, verify_password


def test_hash_password_verifies_original_password() -> None:
    """A bcrypt hash should verify the original password only."""

    hashed = hash_password("StrongPass123")

    assert hashed != "StrongPass123"
    assert verify_password("StrongPass123", hashed)
    assert not verify_password("WrongPass123", hashed)
