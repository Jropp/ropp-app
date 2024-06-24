import { LitElement, html } from "../../lib/lit.js";

class LoginContainer extends LitElement {
  login(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
  }

  render() {
    return html`
      <form @submit=${this.login}>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <button type="submit">Login</button>
      </form>
    `;
  }
}

customElements.define("login-container", LoginContainer);
