import pytest
from server import FallbackDatabase


@pytest.mark.asyncio
async def test_fallback_database_supports_basic_crud_and_queries():
    db = FallbackDatabase()
    users = db["users"]

    await users.insert_one({
        "id": "u1",
        "email": "admin@restrokit.com",
        "role": "super_admin",
        "password_hash": "hashed",
    })

    user = await users.find_one({"email": "admin@restrokit.com"})
    assert user["email"] == "admin@restrokit.com"

    docs = await users.find({}, {"_id": 0}).to_list(10)
    assert len(docs) == 1
