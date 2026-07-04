import { hasAnyRole, normalizeUserRole } from "./roleUtils";

describe("role helpers", () => {
  it("normalizes roles from strings and arrays", () => {
    expect(normalizeUserRole({ role: "Super_Admin" })).toBe("super_admin");
    expect(normalizeUserRole({ roles: ["OWNER", "admin"] })).toBe("owner");
  });

  it("allows admin and super admin access to protected routes", () => {
    expect(hasAnyRole({ role: "ADMIN" }, ["super_admin", "admin"])).toBe(true);
    expect(hasAnyRole({ roles: ["SUPER_ADMIN"] }, ["super_admin", "admin"])).toBe(true);
    expect(hasAnyRole({ role: "owner" }, ["super_admin", "admin"])).toBe(false);
  });
});
