// @ts-nocheck
import { LitElement, html, css } from "../../lib/lit.js";
import { getAllNotes } from "../../services/notes.service.js";
import { sendCreatePrompt } from "../../services/prompt.service.js";
import "../little-throbber.js";

class ConversationsContainer extends LitElement {
  static properties = {
    notes: { type: Array },
    loading: { type: Boolean },
    search: { type: String },
  };

  constructor() {
    super();
    this.ogNotes = [
      {
        title: "John Brown",
        content: "had a conversation",
        tags: "goshen, IN, downtown, food"
      },
      {
        title: "James Dean",
        content: "Has a wombat named steve",
        tags: "Montieith, MN, downtown, food"
      },
    ];
    this.notes = [];
    this.loading = true;
    this.search = ''
  }


  connectedCallback() {
    super.connectedCallback();
    this.getNotes();
  }

  getNotes() {
    this.loading = true;

    this.notes = [...this.ogNotes]
    this.loading = false;
    return
    getAllNotes()
      .then((r) => {
        this.notes = this.ogNotes.reverse();
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.loading = false;
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

  searchKeyup(e) {
    this.search = e.target.value
    this.notes = this.filterResults(this.search, this.ogNotes, ['title', 'content', 'tags'])
  }

  filterResults(search, items, fields) {
    const result = [...items].filter((item) => {
      return !!fields.some(f => item[f].toLowerCase().includes(search.toLowerCase()))
    })

    return result
  }

  render() {
    if (this.loading) return html`<little-throbber></little-throbber>`;

    return html`
      <form>
        <input type="text" @keyup=${this.searchKeyup} name="search" placeholder="Search"/>
        <textarea ?hide=${!!this.search} name="prompt"></textarea>
      </form>
      <button ?hide=${!!this.search} @click=${this.submit} type="submit">Create</button>

      ${this.search ? html`
        <div ?hide=${!this.search} class="results">
          ${this.notes.map((c) => this.renderConversation(c))}
        </div>
        ` : null}
    `;
  }

  renderConversation(conversation) {
    return html`
      <div class="card hover">
        <h2>${conversation.title}</h2>
        <p>${conversation.content}</p>
        <em>${conversation.tags}</em>
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
        padding-top: 16px;
        width: 100%;
        gap: 16px;
      }
    `,
  ];
}

customElements.define("conversations-container", ConversationsContainer);