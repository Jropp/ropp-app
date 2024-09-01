// @ts-nocheck
import { LitElement, css, html } from "../../lib/lit.js";
import { getAllNotes, saveNewNote, deleteNote, updateNote } from "../../services/notes.service.js";
import { styles } from "../styles.js";

import "../tag-input.js";
import "./notes/note-detail.js";

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
    selectedNote: { type: Object },
  };

  constructor() {
    super();
    /** @type {string} */
    this.view = VIEW_TYPES.SEARCH;
    /** @type {Note[]} */
    this.notes = [];
    /** @type {boolean} */
    this.loading = false;
    this.selectedNote = null;
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
    try {
      this.notes = await getAllNotes();
    } catch (error) {
      console.error("Error fetching notes:", error);
      this.notes = []; // Set to empty array if there's an error
    } finally {
      this.loading = false;
      this.requestUpdate(); // Ensure the component re-renders
    }
  }

  async saveNew(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await saveNewNote({
        title: formData.get("title"),
        content: formData.get("content"),
        tags: formData.get("tags"),
      });

      await this.getNotes();
      this.view = VIEW_TYPES.SEARCH;
    } catch (error) {
      console.error("Error saving new note:", error);
      // Optionally, show an error message to the user
    }
  }

  handleDetailClick(note) {
    this.selectedNote = note;
    this.view = VIEW_TYPES.DETAIL;
  }

  handleEditClick() {
    this.view = VIEW_TYPES.EDIT;
  }

  handleDeleteClick() {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNote(this.selectedNote.id).then(() => {
        this.getNotes();
        this.view = VIEW_TYPES.SEARCH;
      });
    }
  }

  async handleUpdateSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedNote = {
      id: this.selectedNote.id,
      title: formData.get("title"),
      content: formData.get("content"),
      tags: formData.get("tags"),
    };

    await updateNote(updatedNote);
    await this.getNotes();
    this.selectedNote = updatedNote;
    this.view = VIEW_TYPES.DETAIL;
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
    return html`
      <div class="note-detail">
        <h2>${this.selectedNote.title}</h2>
        <p>${this.selectedNote.content}</p>
        <em>Tags: ${this.selectedNote.tags}</em>
        <div class="actions">
          <button @click=${this.handleEditClick}>Edit</button>
          <button @click=${this.handleDeleteClick}>Delete</button>
        </div>
      </div>
    `;
  }

  edit() {
    return html`
      <form @submit=${this.handleUpdateSubmit}>
        <input name="title" value="${this.selectedNote.title}" required />
        <textarea name="content" required>${this.selectedNote.content}</textarea>
        <tag-input name="tags" .value=${this.selectedNote.tags}></tag-input>
        <button type="submit">Update</button>
      </form>
    `;
  }

  search() {
    if (this.loading) {
      return html`<p>Loading...</p>`;
    }

    if (!this.notes || this.notes.length === 0) {
      return html`
        <div class="no-notes">
          <p>No notes to display</p>
          <button @click=${() => (this.view = VIEW_TYPES.NEW)}>Create Note</button>
        </div>
      `;
    }

    return html`
      <div class="search-container">
        <button @click=${() => (this.view = VIEW_TYPES.NEW)}>+ New Note</button>
        <input type="text" placeholder="Search notes..." @input=${this.handleSearch} />
      </div>
      <div class="notes-grid">
        ${this.notes.map(
          (note) => html`
            <div class="note-card" @click=${() => this.handleDetailClick(note)}>
              <h3>${note.title}</h3>
              <p>${note.content.substring(0, 100)}${note.content.length > 100 ? "..." : ""}</p>
              <em>Tags: ${note.tags}</em>
            </div>
          `
        )}
      </div>
    `;
  }

  static styles = [
    styles,
    css`
      :host {
        display: block;
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      input,
      textarea {
        padding: 0.5rem;
        font-size: 1rem;
      }
      button {
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      button:hover {
        background-color: #0056b3;
      }
      .search-container {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      .notes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
      }
      .note-card {
        border: 1px solid #ddd;
        padding: 1rem;
        cursor: pointer;
        transition: box-shadow 0.3s;
      }
      .note-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .note-detail {
        border: 1px solid #ddd;
        padding: 1rem;
      }
      .actions {
        margin-top: 1rem;
      }
      .no-notes {
        text-align: center;
        margin-top: 2rem;
      }
      .no-notes p {
        font-size: 1.2rem;
        margin-bottom: 1rem;
      }
    `,
  ];
}

customElements.define("notes-container", NotesContainer);
