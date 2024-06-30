// @ts-nocheck
import { LitElement, css, html } from "../../lib/lit.js";
import { getAllNotes, saveNewNote } from "../../services/notes.service.js";
import { styles } from "../styles.js";

import "../tag-input.js";
import NoteDetail from "./notes/note-detail.js";

const VIEW_TYPES = {
  NEW: "new",
  DETAIL: "detail",
  EDIT: "edit",
  SEARCH: "search",
};

class NotesContainer extends LitElement {
  static properties = {
    view: { type: String },
    notes: { type: Array },
  };

  constructor() {
    super();
    /** @type {string} */
    this.view = VIEW_TYPES.NEW;
    /** @type {Note[]} */
    this.notes = [];
    /** @type {boolean} */
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getNotes();
  }

  render() {
    const view = this[this.view]();

    return html`
      <h1>Notes</h1>
      ${view}
    `;
  }

  async getNotes() {
    this.loading = true;
    this.notes = await getAllNotes();
    this.loading = false;
  }

  async saveNew(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    await saveNewNote({
      title: formData.get("title"),
      content: formData.get("content"),
      tags: formData.get("tags")
    });

    this.getNotes();
    this.view = VIEW_TYPES.SEARCH;
  }

  new() {
    return html`
      <form @submit=${this.saveNew}>
        <input name="title" placeholder="Title" required />
        <textarea name="content" placeholder="Content" required></textarea>
        <tag-input name="tags"></tag-input>
        <button type="submit">Save</button>
      </form>
    `;
  }

  detail() {
    return html``;
  }

  edit() {
    return html``;
  }

  search() {
    return html`
      ${this.loading ?
        html`<p>Loading...</p>` :
        this.notes.map((note) => html`<note-detail .note=${note}></note-detail>`)}

    `;
  }

  static styles = [
    styles,
    css`
      form {
        padding: 16px;
      }
    `,
  ];
}

customElements.define("notes-container", NotesContainer);
