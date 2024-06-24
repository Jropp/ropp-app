import { getSessionUser } from "./session.js";

/**
 * @param {HeadersInit} overrides
 * @returns {HeadersInit}
 */
function setHeaders(overrides = {}, sessionUser = getSessionUser()) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (sessionUser?.accessToken) defaultHeaders.Authorization = `Bearer ${sessionUser.accessToken}`;

  return { ...defaultHeaders, ...overrides };
}

/**
 * @param {string} url 'url to add to root path
 * @param {{
 *  method?: 'GET'|'POST'|'PUT'|'DELETE'
 *  body?: any
 *  headers?: HeadersInit
 * }} settings 'url to add to root path
 */
export function appFetch(url, { method = "GET", body, headers = {} }) {
  /** @type {RequestInit} */
  let reqInit = {
    method: method,
    headers: setHeaders(headers),
  };

  if (body) reqInit.body = JSON.stringify(body);

  return fetch("app.jasonropp.com/api" + url, reqInit);
}
