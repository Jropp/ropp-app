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

/**
 * @returns {Promise<*>}
 * */
export function getExercises() {
  return appFetch(`/v1/exercises`, {
    method: "GET",
  }).then((r) => r.json());
}
