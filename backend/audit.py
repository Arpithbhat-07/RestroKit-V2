from __future__ import annotations

from typing import Any, Dict, Optional
from fastapi import Request


async def log_admin_action(
    db,
    user: Dict[str, Any],
    action: str,
    collection: str,
    document_id: Optional[str],
    *,
    request: Optional[Request] = None,
    old_values: Optional[Dict[str, Any]] = None,
    new_values: Optional[Dict[str, Any]] = None,
) -> None:
    try:
        if request is None:
            client_ip = None
            user_agent = None
        else:
            client_ip = request.headers.get("x-forwarded-for") or request.client.host if request.client else None
            user_agent = request.headers.get("user-agent")
        payload = {
            "id": str(__import__("uuid").uuid4()),
            "timestamp": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
            "actor_id": user.get("id"),
            "actor_email": user.get("email"),
            "actor_role": user.get("role"),
            "action": action,
            "collection": collection,
            "document_id": document_id,
            "ip_address": client_ip,
            "user_agent": user_agent,
            "old_values": old_values or {},
            "new_values": new_values or {},
        }
        await db["audit_logs"].insert_one(payload)
    except Exception:
        return
