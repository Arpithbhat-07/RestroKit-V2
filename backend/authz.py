from typing import Any, Dict, Optional, Sequence

SUPER_ADMIN_ROLES = {"super_admin", "admin"}
OWNER_ROLE = "owner"
BRANDING_RESOURCES = {"restaurant", "hero", "about", "settings"}


def get_user_role(user: Optional[Dict[str, Any]]) -> Optional[str]:
    if not user:
        return None
    role = user.get("role")
    if role:
        return str(role).lower()
    roles = user.get("roles") or []
    if isinstance(roles, str):
        return roles.lower()
    if isinstance(roles, Sequence):
        for item in roles:
            if isinstance(item, str):
                return item.lower()
    return None


def is_super_admin(user: Optional[Dict[str, Any]]) -> bool:
    return get_user_role(user) in SUPER_ADMIN_ROLES


def is_owner(user: Optional[Dict[str, Any]]) -> bool:
    return get_user_role(user) == OWNER_ROLE


def can_manage_branding(user: Optional[Dict[str, Any]]) -> bool:
    return is_super_admin(user)


def can_manage_profile(user: Optional[Dict[str, Any]]) -> bool:
    return True


def can_manage_users(user: Optional[Dict[str, Any]]) -> bool:
    return is_super_admin(user)


def get_profile_updatable_fields(user: Optional[Dict[str, Any]]) -> Sequence[str]:
    if is_owner(user):
        return ("password",)
    return ("name", "email", "avatar", "password")


def require_branding_access(user: Optional[Dict[str, Any]], resource: str) -> None:
    if resource in BRANDING_RESOURCES and not can_manage_branding(user):
        raise PermissionError("Only super administrators can manage branding settings")
