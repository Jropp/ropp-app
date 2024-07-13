import { appFetch } from "./app-fetch.js";

/** @param {NewNote} note */
export async function saveNewNote(note) {
  appFetch("/notes/create", {
    method: "POST",
    body: note,
  }).then((r) => r.json());
}

/** @param {Note} note */
export async function updateNote(note) {
  appFetch(`/notes/${note.id}`, {
    method: "PUT",
    body: note,
  }).then((r) => r.json());
}

/** @param {string} id */
export async function deleteNote(id) {
  appFetch(`/notes/delete?id=${id}`, {
    method: "DELETE",
  }).then((r) => r.json());
}

export async function getAllNotes() {
  return appFetch("/notes/all", { method: "GET" }).then((r) => r.json());
}

// /** @param {NewNote} note */
// export async function saveNewNote(note) {
//   const notes = JSON.parse(localStorage.getItem("notes") || "[]");
//   notes.push(note);
//   localStorage.setItem("notes", JSON.stringify(notes));
//   return
//   appFetch("/notes", {
//     method: "POST",
//     body: note,
//   }).then(r => r.json());
// }

// /** @param {Note} note */
// export async function updateNote(note) {
//   const notes = JSON.parse(localStorage.getItem("notes") || "[]");
//   const index = notes.findIndex(n => n.id === note.id);
//   notes[index] = note;
//   return localStorage.setItem("notes", JSON.stringify(notes));

//   appFetch(`/notes/${note.id}`, {
//     method: "PUT",
//     body: note,
//   }).then(r => r.json());
// }

// /** @param {string} id */
// export async function deleteNote(id) {
//   const notes = JSON.parse(localStorage.getItem("notes") || "[]");
//   const index = notes.findIndex(n => n.id === id);
//   notes.splice(index, 1);
//   return localStorage.setItem("notes", JSON.stringify(notes));

//   appFetch(`/notes/${id}`, {
//     method: "DELETE",
//   }).then(r => r.json());
// }

// export async function getAllNotes() {
//   return JSON.parse(localStorage.getItem("notes") || "[]");
//   return appFetch("/notes").then(r => r.json());
// }
