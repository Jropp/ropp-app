import { LitElement, html, css } from "../../lib/lit.js";
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

      if (!user.userId) {
        throw new Error("Login failed");
      }
      setSessionUser(user);
      // Update this line to use hash-based navigation
      window.location.hash = "#dashboard";
    } catch (error) {
      console.error(error);
    }
  }

  // @ts-ignore
  render() {
    return html`
      <div class="container">
        <div class="form-container">
          ${this.showSignup
            ? html`
                <form @submit=${this.signup}>
                  <h2>Sign Up</h2>
                  <input type="email" name="email" placeholder="Email" required />
                  <input type="password" name="password" placeholder="Password" required />
                  <button type="submit">Sign Up</button>
                </form>
                <button @click=${this.toggleView} class="toggle-button">Already have an account? Log In</button>
              `
            : html`
                <form @submit=${this.login}>
                  <input type="text" name="email" placeholder="Email" required />
                  <input type="password" name="password" placeholder="Password" required />
                  <button type="submit">Go Time</button>
                </form>
              `}
        </div>
      </div>
    `;
  }

  static styles = [
    styles,
    css`
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f0f4f8;
      }
      .container {
        position: relative;
        width: 100%;
        max-width: 400px;
      }
      .form-container {
        background-color: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      h2 {
        margin-top: 0;
        color: #333;
      }
      input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      button {
        padding: 0.5rem;
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      button:hover {
        background-color: #357abd;
      }
      .toggle-button {
        background-color: transparent;
        color: #4a90e2;
        text-decoration: underline;
        margin-top: 1rem;
      }
      .toggle-button:hover {
        color: #357abd;
        background-color: transparent;
      }
      .hidden-signup-button {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 200px;
        height: 200px;
        opacity: 0;
        cursor: pointer;
      }
    `,
  ];
}

customElements.define("login-container", LoginContainer);
