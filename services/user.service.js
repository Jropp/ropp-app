import { appFetch } from "./app-fetch.js";

/** @param {UserSignup} user */
export function signupUser(user) {
  return appFetch(`/v1/users/signup`, { method: "POST", body: user }).then((r) => r.json());
}

/**
 * @param {{email: string, password: string}} login
 * @returns {Promise<*>}
 * */
export function loginUser({ email, password }) {
  return appFetch(`/v1/authentication/token`, {
    method: "POST",
    body: {
      email,
      password,
    },
  }).then((r) => r.json());
}
