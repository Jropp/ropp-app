import { LitElement, css, html } from "../lib/lit.js";

class TagInput extends LitElement {
  static formAssociated = true;

  static properties = {
    tags: { type: Array },
    inputValue: { type: String },
  };

  constructor() {
    super();
    /** @type {string[]} */
    this.tags = [];
    this.inputValue = "";
    this.internals_ = this.attachInternals();
    this.internals_.setFormValue(this.tags.join(","));
  }

  static styles = css`
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5em;
    }
    .tag {
      background: #e0e0e0;
      padding: 0.3em 0.6em;
      border-radius: 0.5em;
      display: flex;
      align-items: center;
    }
    .tag span {
      margin-right: 0.5em;
    }
    .tag button {
      background: none;
      border: none;
      cursor: pointer;
    }
    input {
      border: 1px solid #ccc;
      padding: 0.5em;
      border-radius: 0.5em;
    }
  `;

  // TODO: something is not working here
  set value(value) {
    this.tags = value.split(",");
  }

  handleInput(e) {
    this.inputValue = e.target.value;
  }

  handleKeyUp(e) {
    if (e.key === "," && this.inputValue.trim() !== "") {
      this.addTag(this.inputValue.trim());
      this.inputValue = "";
    }
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags = [...this.tags, tag.replace(",", "")];
      this.updateFormValue();
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter((t) => t !== tag);
    this.updateFormValue();
  }

  updateFormValue() {
    this.internals_.setFormValue(this.tags.join(","));
  }

  render() {
    return html`
      <div class="tags">
        ${this.tags.map(
          (tag) => html`
            <div class="tag">
              <span>${tag}</span>
              <button @click="${() => this.removeTag(tag)}">&times;</button>
            </div>
          `
        )}
      </div>
      <input
        type="text"
        .value="${this.inputValue}"
        @input="${this.handleInput}"
        @keyup="${this.handleKeyUp}"
        placeholder="Add a tag and press ','"
      />
    `;
  }
}

customElements.define("tag-input", TagInput);
