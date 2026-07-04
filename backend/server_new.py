from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import csv
import io
import re
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, field_validator, model_validator
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone, timedelta
import bcrypt
from jose import jwt, JWTError
from fastapi.responses import StreamingResponse

from cloudinary import upload_image, delete_image
from validation import validate_menu_payload, validate_offer_payload, validate_contact_payload, validate_reservation_payload, validate_restaurant_payload

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
db_name = os.environ.get("DB_NAME", "restrokit")
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

JWT_SECRET = os.environ.get("JWT_SECRET", "restrokit-secret-change-in-prod")
JWT_ALGO = "HS256"
JWT_EXP_HOURS = 72

app = FastAPI(title="RestroKit CMS API")
api_router = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def _id():
    return str(uuid.uuid4())


def _now():
    return datetime.now(timezone.utc)


def _strip(doc):
    if doc:
        doc.pop("_id", None)
    return doc


def _soft_delete_payload(user: Optional[Dict[str, Any]] = None):
    payload = {"isDeleted": True, "deletedAt": _now().isoformat()}
    if user:
        payload["deletedBy"] = user.get("id") or user.get("email") or "admin"
    return payload


def _active_query():
    return {"isDeleted": {"$ne": True}}


def _search_filter(search: Optional[str], fields: List[str]):
    if not search:
        return {}
    regex = {"$regex": re.escape(search), "$options": "i"}
    return {"$or": [{field: regex} for field in fields]}


def _normalize_media_payload(data: Dict[str, Any]) -> Dict[str, Any]:
    normalized = dict(data)
    for key in ["img", "url", "banner", "logo", "image", "photo", "avatar", "favicon"]:
        value = normalized.get(key)
        if isinstance(value, dict):
            media_url = value.get("imageUrl") or value.get("url") or value.get("secure_url") or ""
            public_id = value.get("publicId") or value.get("public_id") or ""
            normalized[key] = media_url
            normalized["imageUrl"] = media_url
            normalized["publicId"] = public_id
            normalized["uploadedAt"] = value.get("uploadedAt") or _now().isoformat()
    return normalized


async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        user = await db["users"].find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    avatar: Optional[str] = None


class RestaurantPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: Optional[str] = None
    tagline: Optional[str] = None
    logo: Optional[Any] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    map_embed: Optional[str] = None
    hours: Optional[List[Dict[str, Any]]] = None
    social: Optional[Dict[str, Any]] = None
    website: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    whatsapp: Optional[str] = None
    imageUrl: Optional[str] = None
    publicId: Optional[str] = None
    uploadedAt: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def validate_restaurant(cls, values):
        if isinstance(values, dict):
            return validate_restaurant_payload(cls, values)
        return values


class HeroPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    kicker: Optional[str] = None
    title: Optional[str] = None
    title_alt: Optional[str] = None
    subtitle: Optional[str] = None
    image: Optional[Any] = None
    cta_primary: Optional[str] = None
    cta_secondary: Optional[str] = None
    imageUrl: Optional[str] = None
    publicId: Optional[str] = None
    uploadedAt: Optional[str] = None


class AboutPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    heading: Optional[str] = None
    paragraph: Optional[str] = None
    bullets: Optional[List[str]] = None
    stats: Optional[List[Dict[str, Any]]] = None
    images: Optional[List[Any]] = None


class SettingsPayload(BaseModel):
    model_config = ConfigDict(extra="ignore")
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    accent_color: Optional[str] = None
    website_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    footer_text: Optional[str] = None
    copyright: Optional[str] = None


class MenuItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_id)
    name: str
    description: str = ""
    price: float
    category: str
    diet: str = "veg"
    core: str = ""
    img: Optional[Any] = ""
    popular: bool = False
    chef_special: bool = False
    available: bool = True
    spice_level: int = 0
    display_order: int = 0
    imageUrl: Optional[str] = None
    publicId: Optional[str] = None
    uploadedAt: Optional[str] = None
    isDeleted: bool = False
    deletedAt: Optional[str] = None
    deletedBy: Optional[str] = None
    created_at: str = Field(default_factory=lambda: _now().isoformat())

    @model_validator(mode="before")
    @classmethod
    def validate_menu(cls, values):
        if isinstance(values, dict):
            return validate_menu_payload(cls, values)
        return values


class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_id)
    url: Optional[Any] = ""
    caption: str = ""
    display_order: int = 0
    tags: List[str] | None = None
    file_name: Optional[str] = None
    imageUrl: Optional[str] = None
    publicId: Optional[str] = None
    uploadedAt: Optional[str] = None
    isDeleted: bool = False
    deletedAt: Optional[str] = None
    deletedBy: Optional[str] = None
    created_at: str = Field(default_factory=lambda: _now().isoformat())


class Offer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_id)
    title: str
    description: str = ""
    discount: int = 0
    banner: Optional[Any] = ""
    valid_from: str = ""
    valid_until: str = ""
    btn_text: str = "Order Now"
    btn_link: str = ""
    active: bool = True
    imageUrl: Optional[str] = None
    publicId: Optional[str] = None
    uploadedAt: Optional[str] = None
    isDeleted: bool = False
    deletedAt: Optional[str] = None
    deletedBy: Optional[str] = None
    created_at: str = Field(default_factory=lambda: _now().isoformat())

    @model_validator(mode="before")
    @classmethod
    def validate_offer(cls, values):
        if isinstance(values, dict):
            return validate_offer_payload(cls, values)
        return values


class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_id)
    name: str
    rating: int = 5
    review: str
    img: Optional[Any] = ""
    date: str = Field(default_factory=lambda: _now().date().isoformat())
    featured: bool = False
    imageUrl: Optional[str] = None
    publicId: Optional[str] = None
    uploadedAt: Optional[str] = None
    isDeleted: bool = False
    deletedAt: Optional[str] = None
    deletedBy: Optional[str] = None
    created_at: str = Field(default_factory=lambda: _now().isoformat())


class ReservationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=6, max_length=30)
    email: EmailStr
    guests: int = Field(ge=1, le=30)
    date: str
    time: str
    message: Optional[str] = ""

    @model_validator(mode="before")
    @classmethod
    def validate_reservation(cls, values):
        if isinstance(values, dict):
            return validate_reservation_payload(cls, values)
        return values


class Reservation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_id)
    name: str
    phone: str
    email: str
    guests: int
    date: str
    time: str
    message: str = ""
    status: str = "pending"
    isDeleted: bool = False
    deletedAt: Optional[str] = None
    deletedBy: Optional[str] = None
    created_at: str = Field(default_factory=lambda: _now().isoformat())


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    message: str = Field(min_length=2, max_length=2000)

    @model_validator(mode="before")
    @classmethod
    def validate_contact(cls, values):
        if isinstance(values, dict):
            return validate_contact_payload(cls, values)
        return values


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_id)
    name: str
    email: str
    message: str
    read: bool = False
    isDeleted: bool = False
    deletedAt: Optional[str] = None
    deletedBy: Optional[str] = None
    created_at: str = Field(default_factory=lambda: _now().isoformat())


class NewsletterCreate(BaseModel):
    email: EmailStr


class NewsletterEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=_id)
    email: str
    isDeleted: bool = False
    deletedAt: Optional[str] = None
    deletedBy: Optional[str] = None
    created_at: str = Field(default_factory=lambda: _now().isoformat())


async def get_section(col: str):
    doc = await db[col].find_one({"isDeleted": {"$ne": True}}, {"_id": 0})
    return doc or {}


async def upsert_section(col: str, data: dict):
    payload = _normalize_media_payload(data)
    await db[col].update_one({}, {"$set": payload}, upsert=True)
    return await get_section(col)


async def ensure_indexes():
    await db["menu"].create_index([("name", "text"), ("description", "text"), ("category", "text"), ("core", "text")], name="menu_search")
    await db["menu"].create_index([("category", 1), ("diet", 1), ("available", 1), ("popular", 1), ("chef_special", 1), ("display_order", 1)], name="menu_filters")
    await db["gallery"].create_index([("caption", "text"), ("file_name", "text"), ("tags", "text")], name="gallery_search")
    await db["reservations"].create_index([("name", "text"), ("phone", "text"), ("email", "text"), ("date", 1), ("status", 1)], name="reservations_search")
    await db["contacts"].create_index([("name", "text"), ("email", "text"), ("message", "text")], name="contacts_search")
    await db["newsletter"].create_index([("email", "text")], name="newsletter_search")
    await db["offers"].create_index([("title", "text"), ("discount", 1), ("active", 1)], name="offers_search")
    await db["reviews"].create_index([("name", "text"), ("review", "text")], name="reviews_search")


@app.on_event("startup")
async def startup_event():
    await ensure_indexes()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


@api_router.post("/auth/login")
async def login(payload: LoginPayload):
    user = await db["users"].find_one({"email": payload.email}, {"_id": 0})
    if not user or not bcrypt.checkpw(payload.password.encode(), user["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = make_token(user["id"])
    return {"token": token, "user": {k: v for k, v in user.items() if k != "password_hash"}}


@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return {k: v for k, v in user.items() if k != "password_hash"}


@api_router.put("/auth/profile")
async def update_profile(payload: UserUpdate, user=Depends(get_current_user)):
    update = {}
    if payload.name:
        update["name"] = payload.name
    if payload.email:
        update["email"] = payload.email
    if payload.avatar is not None:
        update["avatar"] = payload.avatar
    if payload.password:
        update["password_hash"] = bcrypt.hashpw(payload.password.encode(), bcrypt.gensalt()).decode()
    if update:
        await db["users"].update_one({"id": user["id"]}, {"$set": update})
    updated = await db["users"].find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return updated


@api_router.get("/restaurant")
async def get_restaurant():
    return await get_section("restaurant")


@api_router.put("/restaurant")
async def update_restaurant(data: Dict[str, Any], _=Depends(get_current_user)):
    return await upsert_section("restaurant", data)


@api_router.get("/hero")
async def get_hero():
    return await get_section("hero")


@api_router.put("/hero")
async def update_hero(data: Dict[str, Any], _=Depends(get_current_user)):
    return await upsert_section("hero", data)


@api_router.get("/about")
async def get_about():
    return await get_section("about")


@api_router.put("/about")
async def update_about(data: Dict[str, Any], _=Depends(get_current_user)):
    return await upsert_section("about", data)


@api_router.get("/settings")
async def get_settings():
    return await get_section("settings")


@api_router.put("/settings")
async def update_settings(data: Dict[str, Any], _=Depends(get_current_user)):
    return await upsert_section("settings", data)


@api_router.post("/upload")
async def upload_media(file: UploadFile = File(...), folder: str = Form("restrokit"), _=Depends(get_current_user)):
    return await upload_image(file, folder=folder)


@api_router.delete("/media/{public_id}")
async def delete_media(public_id: str, _=Depends(get_current_user)):
    deleted = delete_image(public_id)
    return {"ok": deleted}


@api_router.get("/menu")
async def list_menu(search: Optional[str] = None, category: Optional[str] = None, diet: Optional[str] = None, available: Optional[bool] = None, popular: Optional[bool] = None, chef_special: Optional[bool] = None, price_min: Optional[float] = None, price_max: Optional[float] = None, limit: int = 100, skip: int = 0):
    query = dict(_active_query())
    if search:
        query.update(_search_filter(search, ["name", "description", "category", "core"]))
    if category:
        query["category"] = category
    if diet:
        query["diet"] = diet
    if available is not None:
        query["available"] = available
    if popular is not None:
        query["popular"] = popular
    if chef_special is not None:
        query["chef_special"] = chef_special
    if price_min is not None or price_max is not None:
        query["price"] = {}
        if price_min is not None:
            query["price"]["$gte"] = price_min
        if price_max is not None:
            query["price"]["$lte"] = price_max
    docs = await db["menu"].find(query, {"_id": 0}).sort("display_order", 1).skip(skip).limit(min(limit, 200)).to_list(length=min(limit, 200))
    return docs


@api_router.post("/menu")
async def create_menu_item(item: MenuItem, _=Depends(get_current_user)):
    payload = _normalize_media_payload(item.model_dump())
    await db["menu"].insert_one(payload)
    return payload


@api_router.put("/menu/{item_id}")
async def update_menu_item(item_id: str, data: Dict[str, Any], _=Depends(get_current_user)):
    payload = _normalize_media_payload(data)
    payload.pop("id", None)
    result = await db["menu"].update_one({"id": item_id}, {"$set": payload})
    if result.matched_count == 0:
        raise HTTPException(404, "Item not found")
    return _strip(await db["menu"].find_one({"id": item_id}, {"_id": 0}))


@api_router.delete("/menu/{item_id}")
async def delete_menu_item(item_id: str, user=Depends(get_current_user)):
    await db["menu"].update_one({"id": item_id}, {"$set": _soft_delete_payload(user)})
    return {"ok": True}


@api_router.get("/menu/trash")
async def menu_trash(_=Depends(get_current_user)):
    docs = await db["menu"].find({"isDeleted": True}, {"_id": 0}).sort("deletedAt", -1).to_list(100)
    return docs


@api_router.post("/menu/{item_id}/restore")
async def restore_menu_item(item_id: str, _=Depends(get_current_user)):
    result = await db["menu"].update_one({"id": item_id}, {"$set": {"isDeleted": False, "deletedAt": None, "deletedBy": None}})
    if result.matched_count == 0:
        raise HTTPException(404, "Item not found")
    return {"ok": True}


@api_router.delete("/menu/{item_id}/permanent")
async def permanent_delete_menu_item(item_id: str, _=Depends(get_current_user)):
    doc = await db["menu"].find_one({"id": item_id}, {"_id": 0})
    if doc and doc.get("publicId"):
        delete_image(doc["publicId"])
    await db["menu"].delete_one({"id": item_id})
    return {"ok": True}


@api_router.post("/menu/{item_id}/duplicate")
async def duplicate_menu_item(item_id: str, _=Depends(get_current_user)):
    doc = await db["menu"].find_one({"id": item_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Item not found")
    doc["id"] = _id()
    doc["name"] = doc["name"] + " (Copy)"
    doc["created_at"] = _now().isoformat()
    doc["isDeleted"] = False
    doc["deletedAt"] = None
    doc["deletedBy"] = None
    await db["menu"].insert_one(doc)
    return doc


@api_router.get("/gallery")
async def list_gallery(search: Optional[str] = None, tag: Optional[str] = None, limit: int = 100, skip: int = 0):
    query = dict(_active_query())
    if search:
        query.update(_search_filter(search, ["caption", "file_name", "tags"]))
    if tag:
        query["tags"] = {"$in": [tag]}
    docs = await db["gallery"].find(query, {"_id": 0}).sort("display_order", 1).skip(skip).limit(min(limit, 200)).to_list(length=min(limit, 200))
    return docs


@api_router.post("/gallery")
async def add_gallery_item(item: GalleryItem, _=Depends(get_current_user)):
    payload = _normalize_media_payload(item.model_dump())
    await db["gallery"].insert_one(payload)
    return payload


@api_router.put("/gallery/{item_id}")
async def update_gallery_item(item_id: str, data: Dict[str, Any], _=Depends(get_current_user)):
    payload = _normalize_media_payload(data)
    payload.pop("id", None)
    await db["gallery"].update_one({"id": item_id}, {"$set": payload})
    return _strip(await db["gallery"].find_one({"id": item_id}, {"_id": 0}))


@api_router.delete("/gallery/{item_id}")
async def delete_gallery_item(item_id: str, user=Depends(get_current_user)):
    await db["gallery"].update_one({"id": item_id}, {"$set": _soft_delete_payload(user)})
    return {"ok": True}


@api_router.get("/gallery/trash")
async def gallery_trash(_=Depends(get_current_user)):
    return await db["gallery"].find({"isDeleted": True}, {"_id": 0}).sort("deletedAt", -1).to_list(100)


@api_router.post("/gallery/{item_id}/restore")
async def restore_gallery_item(item_id: str, _=Depends(get_current_user)):
    await db["gallery"].update_one({"id": item_id}, {"$set": {"isDeleted": False, "deletedAt": None, "deletedBy": None}})
    return {"ok": True}


@api_router.delete("/gallery/{item_id}/permanent")
async def permanent_delete_gallery_item(item_id: str, _=Depends(get_current_user)):
    doc = await db["gallery"].find_one({"id": item_id}, {"_id": 0})
    if doc and doc.get("publicId"):
        delete_image(doc["publicId"])
    await db["gallery"].delete_one({"id": item_id})
    return {"ok": True}


@api_router.get("/chef")
async def get_chef():
    return await get_section("chef")


@api_router.put("/chef")
async def update_chef(data: Dict[str, Any], _=Depends(get_current_user)):
    return await upsert_section("chef", data)


@api_router.get("/offers")
async def list_offers(search: Optional[str] = None, active: Optional[bool] = None, limit: int = 100, skip: int = 0):
    query = dict(_active_query())
    if search:
        query.update(_search_filter(search, ["title", "description", "btn_text"]))
    if active is not None:
        query["active"] = active
    docs = await db["offers"].find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(min(limit, 200)).to_list(length=min(limit, 200))
    return docs


@api_router.post("/offers")
async def create_offer(offer: Offer, _=Depends(get_current_user)):
    payload = _normalize_media_payload(offer.model_dump())
    await db["offers"].insert_one(payload)
    return payload


@api_router.put("/offers/{offer_id}")
async def update_offer(offer_id: str, data: Dict[str, Any], _=Depends(get_current_user)):
    payload = _normalize_media_payload(data)
    payload.pop("id", None)
    await db["offers"].update_one({"id": offer_id}, {"$set": payload})
    return _strip(await db["offers"].find_one({"id": offer_id}, {"_id": 0}))


@api_router.delete("/offers/{offer_id}")
async def delete_offer(offer_id: str, user=Depends(get_current_user)):
    await db["offers"].update_one({"id": offer_id}, {"$set": _soft_delete_payload(user)})
    return {"ok": True}


@api_router.get("/offers/trash")
async def offers_trash(_=Depends(get_current_user)):
    return await db["offers"].find({"isDeleted": True}, {"_id": 0}).sort("deletedAt", -1).to_list(100)


@api_router.post("/offers/{offer_id}/restore")
async def restore_offer(offer_id: str, _=Depends(get_current_user)):
    await db["offers"].update_one({"id": offer_id}, {"$set": {"isDeleted": False, "deletedAt": None, "deletedBy": None}})
    return {"ok": True}


@api_router.delete("/offers/{offer_id}/permanent")
async def permanent_delete_offer(offer_id: str, _=Depends(get_current_user)):
    doc = await db["offers"].find_one({"id": offer_id}, {"_id": 0})
    if doc and doc.get("publicId"):
        delete_image(doc["publicId"])
    await db["offers"].delete_one({"id": offer_id})
    return {"ok": True}


@api_router.get("/reviews")
async def list_reviews(search: Optional[str] = None, rating: Optional[int] = None, featured: Optional[bool] = None, limit: int = 100, skip: int = 0):
    query = dict(_active_query())
    if search:
        query.update(_search_filter(search, ["name", "review"]))
    if rating is not None:
        query["rating"] = rating
    if featured is not None:
        query["featured"] = featured
    docs = await db["reviews"].find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(min(limit, 200)).to_list(length=min(limit, 200))
    return docs


@api_router.post("/reviews")
async def create_review(review: Review, _=Depends(get_current_user)):
    payload = _normalize_media_payload(review.model_dump())
    await db["reviews"].insert_one(payload)
    return payload


@api_router.put("/reviews/{review_id}")
async def update_review(review_id: str, data: Dict[str, Any], _=Depends(get_current_user)):
    payload = _normalize_media_payload(data)
    payload.pop("id", None)
    await db["reviews"].update_one({"id": review_id}, {"$set": payload})
    return _strip(await db["reviews"].find_one({"id": review_id}, {"_id": 0}))


@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, user=Depends(get_current_user)):
    await db["reviews"].update_one({"id": review_id}, {"$set": _soft_delete_payload(user)})
    return {"ok": True}


@api_router.get("/reviews/trash")
async def reviews_trash(_=Depends(get_current_user)):
    return await db["reviews"].find({"isDeleted": True}, {"_id": 0}).sort("deletedAt", -1).to_list(100)


@api_router.post("/reviews/{review_id}/restore")
async def restore_review(review_id: str, _=Depends(get_current_user)):
    await db["reviews"].update_one({"id": review_id}, {"$set": {"isDeleted": False, "deletedAt": None, "deletedBy": None}})
    return {"ok": True}


@api_router.delete("/reviews/{review_id}/permanent")
async def permanent_delete_review(review_id: str, _=Depends(get_current_user)):
    doc = await db["reviews"].find_one({"id": review_id}, {"_id": 0})
    if doc and doc.get("publicId"):
        delete_image(doc["publicId"])
    await db["reviews"].delete_one({"id": review_id})
    return {"ok": True}


@api_router.post("/reservations", response_model=Reservation)
async def create_reservation(payload: ReservationCreate):
    reservation = Reservation(**payload.model_dump())
    await db["reservations"].insert_one(reservation.model_dump())
    return reservation


@api_router.get("/reservations")
async def list_reservations(search: Optional[str] = None, status: Optional[str] = None, date_from: Optional[str] = None, date_to: Optional[str] = None, _=Depends(get_current_user), limit: int = 100, skip: int = 0):
    query = dict(_active_query())
    if search:
        query.update(_search_filter(search, ["name", "phone", "email", "message", "date", "status"]))
    if status:
        query["status"] = status
    if date_from or date_to:
        query["date"] = {}
        if date_from:
            query["date"]["$gte"] = date_from
        if date_to:
            query["date"]["$lte"] = date_to
    docs = await db["reservations"].find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(min(limit, 200)).to_list(length=min(limit, 200))
    return docs


@api_router.put("/reservations/{res_id}/status")
async def update_reservation_status(res_id: str, data: Dict[str, Any], _=Depends(get_current_user)):
    await db["reservations"].update_one({"id": res_id}, {"$set": {"status": data["status"]}})
    return _strip(await db["reservations"].find_one({"id": res_id}, {"_id": 0}))


@api_router.delete("/reservations/{res_id}")
async def delete_reservation(res_id: str, user=Depends(get_current_user)):
    await db["reservations"].update_one({"id": res_id}, {"$set": _soft_delete_payload(user)})
    return {"ok": True}


@api_router.get("/reservations/trash")
async def reservations_trash(_=Depends(get_current_user)):
    return await db["reservations"].find({"isDeleted": True}, {"_id": 0}).sort("deletedAt", -1).to_list(100)


@api_router.post("/reservations/{res_id}/restore")
async def restore_reservation(res_id: str, _=Depends(get_current_user)):
    await db["reservations"].update_one({"id": res_id}, {"$set": {"isDeleted": False, "deletedAt": None, "deletedBy": None}})
    return {"ok": True}


@api_router.delete("/reservations/{res_id}/permanent")
async def permanent_delete_reservation(res_id: str, _=Depends(get_current_user)):
    await db["reservations"].delete_one({"id": res_id})
    return {"ok": True}


@api_router.get("/reservations/export")
async def export_reservations(_=Depends(get_current_user)):
    docs = await db["reservations"].find(_active_query(), {"_id": 0}).sort("created_at", -1).to_list(5000)
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["id", "name", "phone", "email", "guests", "date", "time", "message", "status", "created_at"])
    writer.writeheader()
    writer.writerows(docs)
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=reservations.csv"})


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(payload: ContactCreate):
    msg = ContactMessage(**payload.model_dump())
    await db["contacts"].insert_one(msg.model_dump())
    return msg


@api_router.get("/contacts")
async def list_contacts(search: Optional[str] = None, read: Optional[bool] = None, limit: int = 100, skip: int = 0, _=Depends(get_current_user)):
    query = dict(_active_query())
    if search:
        query.update(_search_filter(search, ["name", "email", "message"]))
    if read is not None:
        query["read"] = read
    docs = await db["contacts"].find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(min(limit, 200)).to_list(length=min(limit, 200))
    return docs


@api_router.put("/contacts/{msg_id}/read")
async def mark_contact_read(msg_id: str, _=Depends(get_current_user)):
    await db["contacts"].update_one({"id": msg_id}, {"$set": {"read": True}})
    return {"ok": True}


@api_router.delete("/contacts/{msg_id}")
async def delete_contact(msg_id: str, user=Depends(get_current_user)):
    await db["contacts"].update_one({"id": msg_id}, {"$set": _soft_delete_payload(user)})
    return {"ok": True}


@api_router.get("/contacts/trash")
async def contacts_trash(_=Depends(get_current_user)):
    return await db["contacts"].find({"isDeleted": True}, {"_id": 0}).sort("deletedAt", -1).to_list(100)


@api_router.post("/contacts/{msg_id}/restore")
async def restore_contact(msg_id: str, _=Depends(get_current_user)):
    await db["contacts"].update_one({"id": msg_id}, {"$set": {"isDeleted": False, "deletedAt": None, "deletedBy": None}})
    return {"ok": True}


@api_router.delete("/contacts/{msg_id}/permanent")
async def permanent_delete_contact(msg_id: str, _=Depends(get_current_user)):
    await db["contacts"].delete_one({"id": msg_id})
    return {"ok": True}


@api_router.post("/newsletter", response_model=NewsletterEntry)
async def subscribe_newsletter(payload: NewsletterCreate):
    existing = await db["newsletter"].find_one({"email": payload.email, "isDeleted": {"$ne": True}})
    if existing:
        raise HTTPException(status_code=409, detail="Email already subscribed")
    entry = NewsletterEntry(email=payload.email)
    await db["newsletter"].insert_one(entry.model_dump())
    return entry


@api_router.get("/newsletter")
async def list_newsletter(search: Optional[str] = None, limit: int = 100, skip: int = 0, _=Depends(get_current_user)):
    query = dict(_active_query())
    if search:
        query.update(_search_filter(search, ["email"]))
    docs = await db["newsletter"].find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(min(limit, 200)).to_list(length=min(limit, 200))
    return docs


@api_router.delete("/newsletter/{sub_id}")
async def delete_subscriber(sub_id: str, user=Depends(get_current_user)):
    await db["newsletter"].update_one({"id": sub_id}, {"$set": _soft_delete_payload(user)})
    return {"ok": True}


@api_router.get("/newsletter/trash")
async def newsletter_trash(_=Depends(get_current_user)):
    return await db["newsletter"].find({"isDeleted": True}, {"_id": 0}).sort("deletedAt", -1).to_list(100)


@api_router.post("/newsletter/{sub_id}/restore")
async def restore_subscriber(sub_id: str, _=Depends(get_current_user)):
    await db["newsletter"].update_one({"id": sub_id}, {"$set": {"isDeleted": False, "deletedAt": None, "deletedBy": None}})
    return {"ok": True}


@api_router.delete("/newsletter/{sub_id}/permanent")
async def permanent_delete_subscriber(sub_id: str, _=Depends(get_current_user)):
    await db["newsletter"].delete_one({"id": sub_id})
    return {"ok": True}


@api_router.get("/newsletter/export")
async def export_newsletter(_=Depends(get_current_user)):
    docs = await db["newsletter"].find(_active_query(), {"_id": 0}).sort("created_at", -1).to_list(50000)
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["id", "email", "created_at"])
    writer.writeheader()
    writer.writerows(docs)
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv", headers={"Content-Disposition": "attachment; filename=newsletter.csv"})


@api_router.get("/dashboard/stats")
async def dashboard_stats(_=Depends(get_current_user)):
    today = _now().date().isoformat()
    reservations = await db["reservations"].find(_active_query(), {"_id": 0, "status": 1, "date": 1}).to_list(10000)
    return {
        "today_reservations": sum(1 for r in reservations if r.get("date") == today),
        "pending": sum(1 for r in reservations if r.get("status") == "pending"),
        "confirmed": sum(1 for r in reservations if r.get("status") == "confirmed"),
        "completed": sum(1 for r in reservations if r.get("status") == "completed"),
        "total_menu": await db["menu"].count_documents(_active_query()),
        "gallery_images": await db["gallery"].count_documents(_active_query()),
        "newsletter_subscribers": await db["newsletter"].count_documents(_active_query()),
        "unread_contacts": await db["contacts"].count_documents({"read": False, "isDeleted": {"$ne": True}}),
    }


@api_router.get("/dashboard/recent")
async def dashboard_recent(_=Depends(get_current_user)):
    reservations = await db["reservations"].find(_active_query(), {"_id": 0}).sort("created_at", -1).to_list(5)
    contacts = await db["contacts"].find(_active_query(), {"_id": 0}).sort("created_at", -1).to_list(5)
    return {"reservations": reservations, "contacts": contacts}


@api_router.post("/seed")
async def seed_database():
    if not await db["users"].find_one({}):
        pw = bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode()
        await db["users"].insert_one({"id": _id(), "name": "Admin", "email": "admin@restrokit.com", "password_hash": pw, "avatar": "", "role": "admin", "created_at": _now().isoformat()})

    if not await db["restaurant"].find_one({}):
        await db["restaurant"].insert_one({"name": "VANAS", "tagline": "Authentic Coastal Cuisine", "logo": "/images/logo.jpg", "description": "A contemporary Indian kitchen serving authentic coastal delicacies.", "phone": "+91 96867 60009", "email": "vanasmng@gmail.com", "address": "Next to Tejaswini Hospital, Kadri, Mangaluru, Karnataka 575003", "map_embed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2654.622708946022!2d74.85175853958039!3d12.881228193582968!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35be519332b91%3A0x5d4f4e6b9beb29fd!2sVanas!5e0!3m2!1sen!2sin!4v1782934059877!5m2!1sen!2sin", "hours": [{"day": "Monday – Friday", "time": "12:00 PM – 03:00 PM , 07:00 PM – 10:30 PM"}, {"day": "Saturday – Sunday", "time": "12:00 PM – 03:30 PM , 07:00 PM – 11:00 PM"}], "social": {"instagram": "https://www.instagram.com/vanas_mangaluru/?hl=en", "facebook": "https://www.facebook.com/vanas.mangalore/", "whatsapp": "https://wa.me/919686760009"}})

    if not await db["hero"].find_one({}):
        await db["hero"].insert_one({"kicker": "Est. 2019 — Mangalore", "title": "Taste the Tradition of Mangalorean Cuisine", "title_alt": "Savor the Flavors of Coastal India", "subtitle": "Serving Mangalore's finest Authentic delicacies", "image": "/images/hero.jpg", "cta_primary": "Reserve Table", "cta_secondary": "View Menu"})

    if not await db["about"].find_one({}):
        await db["about"].insert_one({"heading": "Bringing Mangalore's Culinary Heritage to Your Table", "paragraph": "Experience the true taste of the coast with recipes inspired by generations of Mangalorean tradition.", "bullets": ["Fresh Food", "Family Friendly", "Affordable", "Hygienic Kitchen"], "stats": [{"value": 15, "suffix": "+", "label": "Years"}, {"value": 50, "suffix": "+", "label": "Dishes"}, {"value": 10, "suffix": "+", "label": "Happy Guests"}], "images": ["/images/interior.jpg", "/images/exterior.jpg"]})

    if not await db["settings"].find_one({}):
        await db["settings"].insert_one({"primary_color": "#C62828", "secondary_color": "#FFB703", "accent_color": "#8B4513", "website_title": "VANAS Restaurant", "seo_description": "Authentic Mangalorean coastal cuisine", "seo_keywords": "restaurant, mangalore, coastal, seafood", "footer_text": "A contemporary Indian kitchen serving authentic coastal delicacies and warm hospitality since 2019.", "copyright": "VANAS"})

    if not await db["reviews"].find_one({}):
        seed_reviews = [
            {"name": "The Powerhouse", "rating": 5, "review": "The Lemon Chicken was the standout dish during my visit.", "img": "/images/reviews/powerhouse.jpg", "featured": True},
            {"name": "Anvitha Acharya", "rating": 5, "review": "Loved the Seafood Thali experience.", "img": "/images/reviews/anvitha.jpg", "featured": True},
            {"name": "Saheer Hejmadi", "rating": 5, "review": "A wonderful experience with authentic coastal cuisine.", "img": "/images/reviews/saheer.jpg", "featured": True},
            {"name": "Padmini V Shenoy", "rating": 5, "review": "The Fish Tawa Fry was absolutely delicious.", "img": "/images/reviews/padmini.jpg", "featured": True},
        ]
        for r in seed_reviews:
            await db["reviews"].insert_one(Review(**r).model_dump())

    if not await db["gallery"].find_one({}):
        for i, src in enumerate([f"/images/gallery/image{j}.jpg" for j in range(1, 10)]):
            await db["gallery"].insert_one(GalleryItem(url=src, display_order=i).model_dump())

    return {"ok": True, "message": "Database seeded. Admin: admin@restrokit.com / admin123"}


@api_router.get("/")
async def root():
    return {"message": "RestroKit CMS API"}


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


def make_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXP_HOURS)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)
