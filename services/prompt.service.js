import { appFetch } from "./app-fetch.js";

/** @param {string} prompt */
export function sendCreatePrompt(prompt) {
  return appFetch("/prompt/create", {
    method: "POST",
    body: { prompt },
  }).then((res) => res.json());
}
