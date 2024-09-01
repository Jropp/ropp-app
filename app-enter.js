import { LitElement, html } from "./lib/lit.js";
import "./env.js";
import "./ui/views/login-container.js";
import "./ui/views/conversations-container.js";
import { getSessionUser } from "./services/session.js";
import { styles } from "./ui/styles.js";

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
    this.user = null;
    this.loggedIn = false;
    this.route = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.loggedIn = !!getSessionUser();

    // Handle initial route
    this.handleInitialRoute();

    // Listen for hash changes
    window.addEventListener("hashchange", () => this.handleHashChange());
  }

  handleInitialRoute() {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      // No route specified, redirect based on login status
      if (this.loggedIn) {
        window.location.hash = "#dashboard";
      } else {
        window.location.hash = "#login";
      }
    } else {
      // Route specified, navigate to it
      this.handleHashChange();
    }
  }

  handleHashChange() {
    this.updateLoginStatus();
    const hash = window.location.hash.slice(1) || "dashboard";
    const route = `${hash}-container`;

    if (!this.loggedIn && hash !== "login") {
      window.location.hash = "#login";
    } else {
      this.loadComponent(route);
    }
  }

  updateLoginStatus() {
    this.loggedIn = !!getSessionUser();
  }

  /** @param {string} route */
  navigate(route) {
    // Remove the '-container' suffix if present
    const hash = route.endsWith("-container") ? route.slice(0, -10) : route;

    // Set the hash, which will trigger the hashchange event
    window.location.hash = `#${hash}`;
  }

  /** @param {string} route */
  loadComponent(route) {
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
              <a @click=${() => this.navigate("dashboard")}>Dashboard</a>
              <a @click=${() => this.navigate("notes")}>Notes</a>
              <a @click=${() => this.navigate("conversations")}>Conversations</a>
              <a @click=${() => this.navigate("workouts")}>Workouts</a>
            </nav>
          `
        : null}
      <slot></slot>`;
  }

  static styles = [styles];
}

customElements.define("app-enter", AppEnter);
