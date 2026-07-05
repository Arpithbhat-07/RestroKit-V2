import pytest
from server import FallbackDatabase


@pytest.mark.anyio
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


@pytest.mark.anyio
async def test_fallback_database_update_one_api_compatibility():
    db = FallbackDatabase()
    users = db["users"]

    # Test basic update_one on existing document
    await users.insert_one({"id": "u1", "email": "user1@example.com", "name": "User One"})
    res = await users.update_one({"id": "u1"}, {"$set": {"name": "User One Updated"}})
    assert res.matched_count == 1
    assert res.modified_count == 1
    
    updated_user = await users.find_one({"id": "u1"})
    assert updated_user["name"] == "User One Updated"

    # Test update_one with upsert=True when doc doesn't exist
    res_upsert = await users.update_one({"id": "u2"}, {"$set": {"email": "user2@example.com", "name": "User Two"}}, upsert=True)
    assert res_upsert.matched_count == 0
    assert res_upsert.modified_count == 1
    assert res_upsert.upserted_id is not None
    
    upserted_user = await users.find_one({"id": "u2"})
    assert upserted_user is not None
    assert upserted_user["email"] == "user2@example.com"
    assert upserted_user["name"] == "User Two"

    # Test update_one with upsert=False (default) when doc doesn't exist
    res_no_upsert = await users.update_one({"id": "u3"}, {"$set": {"email": "user3@example.com"}})
    assert res_no_upsert.matched_count == 0
    assert res_no_upsert.modified_count == 0
    
    user3 = await users.find_one({"id": "u3"})
    assert user3 is None

    # Test update_one with unexpected kwargs (should safely ignore them and not crash)
    res_kwargs = await users.update_one(
        {"id": "u1"},
        {"$set": {"name": "User One kwarg"}},
        bypass_document_validation=True,
        collation={"locale": "en"},
        hint=None
    )
    assert res_kwargs.matched_count == 1
    assert res_kwargs.modified_count == 1


@pytest.mark.anyio
async def test_database_proxy_fails_on_explicit_invalid_mongo_url(monkeypatch):
    from server import DatabaseProxy
    import server
    monkeypatch.setenv("MONGODB_URI", "mongodb://invalid_host_explicit:27017/fake_db")
    monkeypatch.setattr(server, "mongo_url", "mongodb://invalid_host_explicit:27017/fake_db")
    
    proxy = DatabaseProxy()
    with pytest.raises(Exception):
        await proxy._ensure_backend()


@pytest.mark.anyio
async def test_database_proxy_extracts_default_db_from_connection_string(monkeypatch):
    from server import DatabaseProxy
    import server
    
    class DummyClient:
        def __init__(self, *args, **kwargs):
            pass
        
        class Admin:
            async def command(self, cmd):
                return {"ok": 1}
        admin = Admin()
        
        def get_default_database(self):
            class DummyDb:
                pass
            db = DummyDb()
            db.name = "my_custom_db"
            return db
            
    monkeypatch.setattr(server, "AsyncIOMotorClient", DummyClient)
    monkeypatch.setenv("MONGODB_URI", "mongodb://localhost:27017/my_custom_db")
    monkeypatch.setattr(server, "mongo_url", "mongodb://localhost:27017/my_custom_db")
    
    proxy = DatabaseProxy()
    backend = await proxy._ensure_backend()
    assert backend == "mongo"
    assert proxy._real_db.name == "my_custom_db"
