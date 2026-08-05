"""Create or update a single administrator account."""

import argparse
import asyncio
from getpass import getpass

from app.auth.password import hash_password
from app.auth.permissions import permissions_for_role
from app.core.enums import UserRole
from app.database.database import close_database, connect_database
from app.models.user import User
from app.repositories.users import UserRepository


def parse_args() -> argparse.Namespace:
    """Parse command-line arguments."""

    parser = argparse.ArgumentParser(description="Create or update an admin user.")
    parser.add_argument("--email", required=True, help="Admin email address.")
    parser.add_argument("--password", help="Admin password. If omitted, prompts securely.")
    parser.add_argument(
        "--only-admin",
        action="store_true",
        help="Deactivate every other active admin account.",
    )
    return parser.parse_args()


async def upsert_admin(email: str, password: str, only_admin: bool) -> None:
    """Create or update the requested admin account."""

    await connect_database()
    try:
        users = UserRepository()
        normalized_email = email.strip().lower()
        existing = await users.get_by_email(normalized_email)
        data = {
            "email": normalized_email,
            "hashed_password": hash_password(password),
            "first_name": "ISOLE",
            "last_name": "Admin",
            "role": UserRole.ADMIN,
            "permissions": permissions_for_role(UserRole.ADMIN),
            "is_verified": True,
            "is_active": True,
        }

        if existing is None:
            await users.create(data)
            action = "created"
        else:
            for field, value in data.items():
                setattr(existing, field, value)
            await existing.save()
            action = "updated"

        deactivated = 0
        if only_admin:
            other_admins = await User.find(
                {
                    "email": {"$ne": normalized_email},
                    "role": UserRole.ADMIN,
                    "is_active": True,
                    "deleted_at": None,
                }
            ).to_list()
            for admin in other_admins:
                admin.is_active = False
                await admin.save()
                deactivated += 1

        print(f"Admin {action}: {normalized_email}")
        print(f"Other active admins deactivated: {deactivated}")
    finally:
        await close_database()


def main() -> None:
    """Run the admin upsert workflow."""

    args = parse_args()
    password = args.password or getpass("Admin password: ")
    asyncio.run(upsert_admin(args.email, password, args.only_admin))


if __name__ == "__main__":
    main()
