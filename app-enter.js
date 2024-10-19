import { LitElement, html } from "./lib/lit.js";
import appRouter from "./router/app-router.js";

export class AppEnter extends appRouter(LitElement) {
  render() {
    return html` <slot></slot> `;
  }
}

customElements.define("app-enter", AppEnter);
