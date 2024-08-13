import { appFetch } from "./app-fetch.js";

/**
 * @returns {Promise<*>}
 * */
export function createWorkout() {
  return appFetch(`/v1/workout/create`, {
    method: "POST",
    body: {},
  }).then((r) => r.json());
}
