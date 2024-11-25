// @ts-nocheck
import { env } from "../env.js";
import { getSessionUser } from "./session.js";

/**
 * @param {HeadersInit} overrides
 * @returns {HeadersInit}
 */
function setHeaders(overrides = {}, sessionUser = getSessionUser()) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  if (sessionUser?.token) defaultHeaders.Authorization = `Bearer ${sessionUser.token}`;

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
  // if incoming url has https: then just use url instead of root plust url

  return url.includes("https") ? fetch(url, reqInit) : fetch(env.API_URL + url, reqInit);
}
