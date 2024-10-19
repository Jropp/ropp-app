import { appFetch } from "./app-fetch.js";

export function getPeople() {
  return appFetch("/v1/people", {
    method: "GET",
  }).then((res) => res.json());
}

/**
 * @param {Person} body
 */
export function createPerson(body) {
  return appFetch("/v1/people", {
    method: "POST",
    body,
  }).then((res) => res.json());
}

/**
 * @param {number} personId
 */
export function getConversations(personId) {
  return appFetch(`/v1/conversations?id=${personId}`, {
    method: "GET",
  }).then((res) => res.json());
}

/**
 * @param {Conversation} body
 */
export function createConversation(body) {
  return appFetch("/v1/conversations", {
    method: "POST",
    body,
  }).then((res) => res.json());
}

/**
 * @param {Conversation} body
 */
export function updateConversation(body) {
  return appFetch(`/v1/conversations`, {
    method: "PUT",
    body,
  }).then((res) => res.json());
}

/**
 * @param {number} conversationId
 */
export function deleteConversation(conversationId) {
  return appFetch(`/v1/conversations?id=${conversationId}`, {
    method: "DELETE",
  }).then((res) => res.json());
}
