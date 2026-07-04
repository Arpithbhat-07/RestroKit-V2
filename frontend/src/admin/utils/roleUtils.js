export function normalizeUserRole(user) {
  if (!user) return null;

  if (typeof user.role === "string" && user.role.trim()) {
    return user.role.trim().toLowerCase();
  }

  const roles = user.roles;
  if (Array.isArray(roles)) {
    for (const role of roles) {
      if (typeof role === "string" && role.trim()) {
        return role.trim().toLowerCase();
      }
    }
  }

  return null;
}

export function hasAnyRole(user, allowedRoles = []) {
  const role = normalizeUserRole(user);
  if (!role) return false;
  return allowedRoles.map((item) => item.toLowerCase()).includes(role);
}
