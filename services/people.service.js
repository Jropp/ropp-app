import { appFetch } from "./app-fetch.js";

/** @returns {Promise<Person[]>} */
export async function getPeople() {
  return appFetch("/v1/people", {
    method: "GET",
  }).then((res) => res.json());
}

/**
 * @param {Promise<Person>} body
 */
export async function createPerson(body) {
  return appFetch("/v1/people", {
    method: "POST",
    body,
  }).then((res) => res.json());
}

/**
 * @param {Person['id']} personId
 */
export async function getConversations(personId) {
  return appFetch(`/v1/conversations?id=${personId}`, {
    method: "GET",
  }).then((res) => res.json());
}

/**
 * @param {Promise<Conversation>} body
 */
export async function createConversation(body) {
  return appFetch("/v1/conversations", {
    method: "POST",
    body,
  }).then((res) => res.json());
}

/**
 * @param {Promise<Conversation>} body
 */
export async function updateConversation(body) {
  return appFetch(`/v1/conversations`, {
    method: "PUT",
    body,
  }).then((res) => res.json());
}

/**
 * @param {Promise<Conversation['id']>} conversationId
 */
export async function deleteConversation(conversationId) {
  return appFetch(`/v1/conversations?id=${conversationId}`, {
    method: "DELETE",
  }).then((res) => res.json());
}
