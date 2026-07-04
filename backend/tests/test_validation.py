from pydantic import ValidationError
from server import MenuItem, ReservationCreate, ContactCreate, NewsletterCreate, Offer


def test_menu_price_validation():
    try:
        MenuItem(name="Test", description="Nice enough", price=0, category="Starters")
    except ValidationError as exc:
        assert "price" in str(exc)
    else:
        raise AssertionError("Expected validation error")


def test_reservation_validation():
    try:
        ReservationCreate(name="A", phone="123", email="invalid", guests=0, date="2020-01-01", time="10:00")
    except ValidationError as exc:
        assert any("email" in str(e) or "phone" in str(e) or "guests" in str(e) for e in exc.errors())
    else:
        raise AssertionError("Expected validation error")


def test_offer_discount_validation():
    try:
        Offer(title="Promo", description="desc", discount=150, valid_from="2026-01-01", valid_until="2026-01-02")
    except ValidationError as exc:
        assert "discount" in str(exc)
    else:
        raise AssertionError("Expected validation error")
