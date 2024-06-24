import { LitElement, html } from "../../lib/lit.js";

class UserSettingsElement extends LitElement {
  render() {
    return html` <h1>UserSettings</h1> `;
  }
}

customElements.define("user-settings", UserSettingsElement);
