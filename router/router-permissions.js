// @ts-nocheck
import routes from "./routes.js";

/** @type {PermissionCheck} */
export function userIsLoggedIn(options) {
  const isLoggedIn = !!options.sessionUser?.email;

  if (!isLoggedIn) {
    return routes.LOGIN;
  }

  return null;
}

/** @type {PermissionCheck} */
export function userIsAdmin(options) {
  // if kind property exists then user is logged in
  return options.sessionUser?.kind == "Administrator" ? null : routes.LOGIN;
}
