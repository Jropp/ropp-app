import { LitElement, html, css } from "./lib/lit.js";
import "./env.js";
import "./ui/views/login-container.js";
import { getSessionUser } from "./services/session.js";
import { styles } from "./ui/styles.js";

/** @param {string} route */
const componentLoader = (route) => import(`./ui/views/${route}.js`);

class AppEnter extends LitElement {
  static properties = {
    user: { type: Object },
    route: { type: String },
    loggedIn: { type: Boolean },
    menuOpen: { type: Boolean },
  };

  constructor() {
    super();
    /** @type {User} */
    this.user = null;
    this.loggedIn = false;
    this.route = "";
    this.menuOpen = false;
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
      // if (this.loggedIn) {
      window.location.hash = "#dashboard";
      // } else {
      //   window.location.hash = "#login";
      // }
    } else {
      // Route specified, navigate to it
      this.handleHashChange();
    }
  }

  handleHashChange() {
    this.updateLoginStatus();
    const fullHash = window.location.hash.slice(1);
    const hashParts = fullHash.split("?");
    const hash = hashParts[0] || "dashboard";
    const route = `${hash}-container`;

    this.loadComponent(route);
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
      const element = document.createElement(route);
      element.setAttribute("hash-params", window.location.hash);
      this.shadowRoot.querySelector("slot").innerHTML = "";
      this.shadowRoot.querySelector("slot").appendChild(element);
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // @ts-ignore
  render() {
    return html` ${this.loggedIn
        ? html`
            <nav class="${this.menuOpen ? "open" : ""}">
              <div class="hamburger" @click=${this.toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <ul>
                <li><a @click=${() => this.navigate("dashboard")}>Dashboard</a></li>
                <li><a @click=${() => this.navigate("notes")}>Notes</a></li>
                <li><a @click=${() => this.navigate("conversations")}>Conversations</a></li>
                <li><a @click=${() => this.navigate("workouts")}>Workouts</a></li>
                <li><a @click=${() => this.navigate("blog")}>Blog</a></li>
                <li><a @click=${() => this.navigate("blog-admin")}>Blog Admin</a></li>
              </ul>
            </nav>
          `
        : null}
      <slot></slot>`;
  }

  static styles = [
    styles,
    css`
      nav {
        background-color: #2c3e50;
        padding: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      nav ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
      }
      nav li {
        margin: 0 1rem;
      }
      nav a {
        color: #ecf0f1;
        text-decoration: none;
        font-weight: bold;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.3s, color 0.3s;
        cursor: pointer;
      }
      nav a:hover {
        background-color: #34495e;
        color: #3498db;
      }
      .hamburger {
        display: none;
        flex-direction: column;
        cursor: pointer;
      }
      .hamburger span {
        height: 3px;
        width: 25px;
        background-color: #ecf0f1;
        margin: 2px 0;
        transition: 0.4s;
      }
      @media (max-width: 768px) {
        nav ul {
          display: none;
          flex-direction: column;
          align-items: center;
        }
        nav.open ul {
          display: flex;
        }
        nav li {
          margin: 0.5rem 0;
        }
        .hamburger {
          display: flex;
        }
        nav.open .hamburger span:nth-child(1) {
          transform: rotate(-45deg) translate(-5px, 6px);
        }
        nav.open .hamburger span:nth-child(2) {
          opacity: 0;
        }
        nav.open .hamburger span:nth-child(3) {
          transform: rotate(45deg) translate(-5px, -6px);
        }
      }
    `,
  ];
}

customElements.define("app-enter", AppEnter);
