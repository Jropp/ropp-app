// @ts-nocheck
import { LitElement, html, css } from "../../lib/lit.js";
import { getAllNotes } from "../../services/notes.service.js";
import { sendCreatePrompt } from "../../services/prompt.service.js";
import "../little-throbber.js";

class ConversationsContainer extends LitElement {
  static properties = {
    conversations: { type: Array },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.conversations = [];
    this.loading = true;
  }

  static styles = [
    css`
      :host {
        display: block;
        height: 100%;
        overflow-y: auto;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.getNotes();
  }

  getNotes() {
    this.loading = true;
    getAllNotes()
      .then((r) => {
        this.conversations = r.filter(({ type }) => type === "conversation").reverse();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  submit() {
    // @ts-ignors
    sendCreatePrompt(this.shadowRoot.querySelector("textarea").value)
      .then(() => {
        this.getNotes();
      })
      .catch(() => {
        console.error(e);
      });
  }

  render() {
    if (this.loading) return html`<little-throbber></little-throbber>`;

    return html`
      <textarea name="prompt"></textarea>
      <button @click=${this.submit} type="submit">Create</button>
      ${this.conversations.map((c) => this.renderConversation(c))}
    `;
  }

  renderConversation(conversation) {
    return html`
      <div class="card">
        <h2>${conversation.title}</h2>
        <p>${conversation.content}</p>
        <em>${conversation.tags}</em>
      </div>
    `;
  }
}

customElements.define("conversations-container", ConversationsContainer);
