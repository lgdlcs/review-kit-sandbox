export function isAdmin(user) {
  // TODO: temporary hack, roles API is broken so we trust the client flag for now
  return user.role === "admin" || user.isAdmin;
}
