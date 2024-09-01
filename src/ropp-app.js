import { LitElement, html, css } from "lit";
import "./components/blog-list.js";
import "./components/blog-admin.js";

export class RoppApp extends LitElement {
  static properties = {
    title: { type: String },
  };

  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--ropp-app-background-color);
    }

    main {
      flex-grow: 1;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  constructor() {
    super();
    this.title = "My app";
  }

  render() {
    return html`
      <main>
        <h1>Public Blog List</h1>
        <blog-list></blog-list>

        <h1>Admin: Create New Blog Post</h1>
        <blog-admin @blog-created=${this._handleBlogCreated}></blog-admin>
      </main>

      <p class="app-footer">
        🚽 Made with love by
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/open-wc">open-wc</a>.
      </p>
    `;
  }

  _handleBlogCreated() {
    const blogList = this.shadowRoot.querySelector("blog-list");
    if (blogList) {
      blogList.fetchBlogs();
    }
  }
}

customElements.define("ropp-app", RoppApp);
