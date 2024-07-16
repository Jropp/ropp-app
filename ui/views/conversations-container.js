// @ts-nocheck
import { LitElement, html, css } from "../../lib/lit.js";
import { deleteNote, getAllNotes } from "../../services/notes.service.js";
import { sendCreatePrompt } from "../../services/prompt.service.js";
import "../little-throbber.js";
import { styles } from "../styles.js";

class ConversationsContainer extends LitElement {
  static properties = {
    notes: { type: Array },
    loading: { type: Boolean },
    search: { type: String },
  };

  constructor() {
    super();
    this.notes = [];
    this.loading = true;
    this.search = "";
  }

  async connectedCallback() {
    super.connectedCallback();
    
    this.loading = true;
    this.notes = await this.getNotes();
    this.loading = false;
  }

  async getNotes() {
    const r = await getAllNotes();
    this.ogNotes = r.reverse();
    
    return this.ogNotes
  }

  async submit() {
    await sendCreatePrompt(this.shadowRoot.querySelector("textarea").value)
    this.loading = true;
    this.notes = await this.getNotes();
    this.loading = false;
  }

  searchKeyup(e) {
    this.search = e.target.value;
    this.notes = this.filterResults(this.search, this.ogNotes, ["title", "content", "tags"]);
  }

  async deleteItem(item) {
    this.loading = true;
    await deleteNote(item.id);
    this.notes = await this.getNotes();
    this.loading = false;
  }

  filterResults(search, items, fields) {
    if (search.toLowerCase().startsWith(":all")) return items;

    return [...items].filter((item) => {
      return !!fields.some((f) => item[f].toLowerCase().includes(search.toLowerCase()));
    });
  }

  render() {
    if (this.loading) return html`<little-throbber></little-throbber>`;

    return html`
      <form>
        <input type="text" @keyup=${this.searchKeyup} name="search" placeholder="Search" />
        <textarea ?hide=${!!this.search} name="prompt"></textarea>
      </form>
      <button ?hide=${!!this.search} @click=${this.submit} type="submit">Create</button>

      ${this.search
        ? html` <div ?hide=${!this.search} class="results">${this.notes.map((c) => this.renderConversation(c))}</div> `
        : null}
    `;
  }

  renderConversation(conversation) {
    return html`
      <div class="card">
        <div class="content">
          <h2>${conversation.title}</h2>
          <p>${conversation.content}</p>
          <em>${conversation.tags}</em>
        </div>
        <div class="actions">
          <button id=${conversation.id} @click=${() => this.deleteItem(conversation)}>x</button>
        </div>
      </div>
    `;
  }

  static styles = [
    styles,
    css`
      :host {
        display: block;
        height: 100%;
        overflow-y: auto;
        padding: 16px;
      }
      .results {
        display: flex;
        flex-direction: column;
        padding-top: 16px;
        width: 100%;
        gap: 16px;
      }
      .card {
        display: flex;
        flex-direction: row;
        gap: 8px;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
      }
    `,
  ];
}

customElements.define("conversations-container", ConversationsContainer);
