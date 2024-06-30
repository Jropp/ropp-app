import { LitElement, html } from "../../../lib/lit.js";

export default class NoteDetail extends LitElement {
  static get properties() {
    return {
      note: { type: Object },
    };
  }

  constructor() {
    super();
    /** @type {Note} */
    this.note = null;
  }
  // @ts-ignore
  render() {
    return html`
      <h1>${this.note.title}</h1>
      <p>${this.note.content}</p>
      <em>${this.note.tags}</em>
    `;
  }
}

customElements.define("note-detail", NoteDetail);
