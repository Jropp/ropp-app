import { LitElement, html } from "./lib/lit.js";
import "./env.js";
import "./ui/views/login-container.js";
import "./ui/views/conversations-container.js";
import { getSessionUser } from "./services/session.js";
import { styles } from "./ui/styles.js";
import * as htmx from "./lib/htmx.js";
// @ts-ignore
window.htmx = htmx;

/** @param {string} route */
const componentLoader = (route) => import(`./ui/views/${route}.js`);

class AppEnter extends LitElement {
  static properties = {
    user: { type: Object },
    route: { type: String },
    loggedIn: { type: Boolean },
  };

  constructor() {
    super();
    /** @type {User} */
    this.user = null;
    this.loggedIn = false;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("go", (/** @type {CustomEvent} */ e) => this.go(e.detail.route));
    this.loggedIn = !!getSessionUser();

    if (!this.loggedIn) {
      this.go("login-container");
    } else {
      this.go("conversations-container");
    }
  }

  /** @param {string} route */
  go(route) {
    this.route = route;
    componentLoader(route).then(() => {
      this.shadowRoot.querySelector("slot").innerHTML = `<${route}></${route}>`;
    });
  }

  // @ts-ignore
  render() {
    return html` ${this.loggedIn
        ? html`
            <nav>
              <a @click=${() => this.go("dashboard-container")}>Dashboard</a>
              <a @click=${() => this.go("notes-container")}>Notes</a>
              <a @click=${() => this.go("conversations-container")}>Conversations</a>
            </nav>
          `
        : null}
      <slot></slot>`;
  }

  static styles = [styles];
}

customElements.define("app-enter", AppEnter);
