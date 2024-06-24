const sessionVariables = {
  USER: "user",
  GLOBALS: "globals",
};

/** @param {SessionUser} user */
export function setSessionData(user) {
  setSessionUser(user);
}

/**
 * @param {SessionUser} user a logged in user
 * @returns
 */
export function setSessionUser(user) {
  return window.sessionStorage.setItem(sessionVariables.USER, JSON.stringify(user));
}

/** @returns {SessionUser | null} */
export function getSessionUser() {
  return JSON.parse(window.sessionStorage.getItem(sessionVariables.USER));
}

export function clearSession() {
  window.sessionStorage.clear();
}

export function deleteSessionUser() {
  window.sessionStorage.removeItem(sessionVariables.USER);
}

export function storeSessionGlobals(settings) {
  window.sessionStorage.setItem(sessionVariables.GLOBALS, JSON.stringify(settings));
}

export function getSessionGlobals() {
  const stored = window.sessionStorage.getItem(sessionVariables.GLOBALS);
  return stored && JSON.parse(stored);
}
