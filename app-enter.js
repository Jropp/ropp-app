import { LitElement, html } from "./lib/lit.js";
import "./env.js";
import "./ui/views/login-container.js";
import { getSessionUser } from "./services/session.js";

/** @param {string} route */
const componentLoader = (route) => import(`./ui/views/${route}.js`);

class AppEnter extends LitElement {
  static properties = {
    user: { type: Object },
  };

  constructor() {
    super();
    /** @type {User} */
    this.user = null;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("go", (e) => this.go(e.detail.route));

    if (!getSessionUser()) {
      this.go("login-container");
    } else {
      this.go("notes-container");
    }
  }

  go(route) {
    componentLoader(route).then(() => {
      this.shadowRoot.querySelector("slot").innerHTML = `<${route}></${route}>`;
    });
  }

  // @ts-ignore
  render() {
    return html` 
      <button @click=${() => this.go("login-container")}>Login</button>
      <button @click=${() => this.go("notes-container")}>Notes</button>
      <slot></slot>`;
  }
}

customElements.define("app-enter", AppEnter);
