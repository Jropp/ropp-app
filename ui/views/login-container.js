import { LitElement, html } from "../../lib/lit.js";
import { setSessionUser } from "../../services/session.js";
import { loginUser, signupUser } from "../../services/user.service.js";

class LoginContainer extends LitElement {
  static get properties() {
    return {
      showSignup: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.showSignup = false;
  }

  toggleView() {
    this.showSignup = !this.showSignup;
  }

  async signup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const user = await signupUser({ email, password });
      setSessionUser(user);
      alert("Signup successful!");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  }

  async login(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("email");
    const password = formData.get("password");

    try {
      const user = await loginUser({ username, password });
      setSessionUser(user);
      alert("Login successful!");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  }

  render() {
    return html`
      ${this.showSignup
        ? html`
            <form @submit=${this.signup}>
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Signup</button>
            </form>
            <button @click=${this.toggleView}>Already have an account? Login</button>
          `
        : html`
            <form @submit=${this.login}>
              <input type="text" name="email" placeholder="email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Login</button>
            </form>
            <button @click=${this.toggleView}>Don't have an account? Signup</button>
          `}
    `;
  }
}

customElements.define("login-container", LoginContainer);
