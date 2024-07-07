import { LitElement, html } from "../../lib/lit.js";
import { setSessionUser } from "../../services/session.js";
import { loginUser, signupUser } from "../../services/user.service.js";
import { styles } from "../styles.js";
import "../little-throbber.js";

class LoginContainer extends LitElement {
  static get properties() {
    return {
      showSignup: { type: Boolean },
      loading: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.showSignup = false;
    this.loading = true;
  }

  toggleView() {
    this.showSignup = !this.showSignup;
  }

  /** @param {Event & {target: HTMLFormElement}} e */
  async signup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    this.loading = true;

    try {
      const user = await signupUser({ email, password });
      setSessionUser(user);
    } catch (error) {
      alert("Signup failed: " + error.message);
    }

    this.loading = false;
  }

  /** @param {Event & {target: HTMLFormElement}} e */
  async login(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      const user = await loginUser({ email, password });
      console.log(user);
      setSessionUser(user);
      window.dispatchEvent(new CustomEvent("go", { detail: { route: "conversations-container" } }));
    } catch (error) {}
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
              <button type="submit">Let's Go</button>
            </form>
          `}
    `;
  }

  static styles = [styles];
}

customElements.define("login-container", LoginContainer);
