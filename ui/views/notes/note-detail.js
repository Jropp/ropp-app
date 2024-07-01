import { LitElement, html, css } from "../../../lib/lit.js";
import { styles } from "../../styles.js";

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
  static styles = [
    styles,
    css`
      p {
        display: inline-block;
        white-space: pre-wrap;
      }
    `,
  ];
}

customElements.define("note-detail", NoteDetail);
