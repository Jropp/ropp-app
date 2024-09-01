import { LitElement, html } from "../../lib/lit.js";
import { displayText, parseText } from "./text-editor.util.js";

class TextEditor extends LitElement {
  static properties = {
    value: { type: String },
  };

  constructor() {
    super();
    this.value = "";
    this.config = null;
  }

  onInput() {
    this.value = this.shadowRoot.querySelector("div").innerText;

    this.config = parseText(this.value);
    console.log(this.config);

    displayText(this.config, this.shadowRoot.querySelector("#display"));
  }

  render() {
    return html`
      <div contenteditable="true" @input=${this.onInput}>New</div>

      <div id="display"></div>
    `;
  }
}

customElements.define("text-editor", TextEditor);
