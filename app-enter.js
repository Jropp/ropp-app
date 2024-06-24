import { LitElement, html } from "./lib/lit.js";
import "./env.js";

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
  }

  go(route) {
    componentLoader(route).then(() => {
      this.shadowRoot.querySelector("slot").innerHTML = `<${route}></${route}>`;
    });
  }

  // @ts-ignore
  render() {
    return html` <button @click=${this.go("login-container")}>Login</button>
      <slot></slot>`;
  }
}

customElements.define("app-enter", AppEnter);
