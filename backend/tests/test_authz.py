import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from authz import (
    can_manage_branding,
    can_manage_users,
    get_profile_updatable_fields,
    get_user_role,
    is_owner,
    is_super_admin,
)


def test_owner_cannot_manage_branding():
    user = {"role": "owner"}
    assert get_user_role(user) == "owner"
    assert is_owner(user) is True
    assert is_super_admin(user) is False
    assert can_manage_branding(user) is False


def test_super_admin_can_manage_branding_and_profile_fields():
    user = {"role": "super_admin"}
    assert is_super_admin(user) is True
    assert can_manage_branding(user) is True
    assert get_profile_updatable_fields(user) == ("name", "email", "avatar", "password")


def test_owner_profile_fields_are_restricted():
    user = {"role": "owner"}
    assert get_profile_updatable_fields(user) == ("password",)


def test_super_admin_can_manage_users():
    user = {"role": "super_admin"}
    assert can_manage_users(user) is True


def test_owner_cannot_manage_users():
    user = {"role": "owner"}
    assert can_manage_users(user) is False
