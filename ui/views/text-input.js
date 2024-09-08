import { LitElement, html, css } from "../../lib/lit.js";

class TextInput extends LitElement {
  static properties = {
    value: { type: String },
    isBold: { type: Boolean },
    isItalic: { type: Boolean },
    isUnderline: { type: Boolean },
    showPreview: { type: Boolean },
  };

  constructor() {
    super();
    this.value = "";
    this.isBold = false;
    this.isItalic = false;
    this.isUnderline = false;
    this.showPreview = false;
    this.editor = null;
  }

  firstUpdated() {
    this.editor = this.shadowRoot.querySelector(".editor");
    if (this.editor) {
      this.editor.addEventListener("selectionchange", this.handleSelectionChange.bind(this));
      this.syncEditorContent(); // Add this line
    }
  }

  handleInput(e) {
    const rawHTML = e.target.innerHTML;
    const decodedHTML = this.decodeHTMLEntities(rawHTML);
    this.value = decodedHTML;
    this.updateButtonStates();
    this.dispatchEvent(new CustomEvent("input-change", { detail: this.value }));
  }

  decodeHTMLEntities(html) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  }

  // Add this new method
  syncEditorContent() {
    if (this.editor && this.value) {
      this.editor.innerHTML = this.value;
    }
  }

  updateButtonStates() {
    if (!this.editor) return;

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const tempElement = document.createElement("div");
    tempElement.appendChild(range.cloneContents());

    this.isBold = tempElement.querySelector("b, strong") !== null;
    this.isItalic = tempElement.querySelector("i, em") !== null;
    this.isUnderline = tempElement.querySelector("u") !== null;

    this.requestUpdate();
  }

  formatText(command) {
    if (!this.editor) return;

    if (this.editor instanceof HTMLElement) {
      this.editor.focus();
    }
    document.execCommand(command, false, null);
    this.updateButtonStates();
    this.handleInput({ target: this.editor });
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  render() {
    return html`
      <div class="toolbar">
        <button @click=${() => this.formatText("bold")} class="${this.isBold ? "active" : ""}">B</button>
        <button @click=${() => this.formatText("italic")} class="${this.isItalic ? "active" : ""}">I</button>
        <button @click=${() => this.formatText("underline")} class="${this.isUnderline ? "active" : ""}">U</button>
        <button @click=${this.togglePreview} class="preview-toggle">${this.showPreview ? "▲" : "▼"}</button>
      </div>
      <div
        class="editor"
        contenteditable="true"
        @input=${this.handleInput}
        @keydown=${this.handleKeyDown}
        @mouseup=${this.handleMouseUp}
      ></div>
      ${this.showPreview ? html`<div class="preview">${this.value}</div>` : ""}
    `;
  }

  handleKeyDown(e) {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          this.formatText("bold");
          break;
        case "i":
          e.preventDefault();
          this.formatText("italic");
          break;
        case "u":
          e.preventDefault();
          this.formatText("underline");
          break;
      }
    }
  }

  handleMouseUp() {
    this.updateButtonStates();
  }

  handleSelectionChange() {
    this.updateButtonStates();
  }

  static styles = css`
    :host {
      display: block;
      margin-bottom: 1rem;
    }
    .toolbar {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
    }
    .toolbar button {
      margin-right: 5px;
      padding: 5px 10px;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 3px;
      cursor: pointer;
    }
    .toolbar button.active {
      background-color: #007bff;
      color: white;
    }
    .preview-toggle {
      margin-left: auto;
    }
    .editor,
    .preview {
      border: 1px solid #ccc;
      padding: 10px;
      min-height: 100px;
      outline: 2px dashed #007bff;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: pre-wrap;
    }
  `;
}

customElements.define("text-input", TextInput);
