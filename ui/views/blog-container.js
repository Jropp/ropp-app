import { LitElement, html, css } from "../../lib/lit.js";
import { getAllBlogs, getPost } from "../../services/blogs.service.js";

class BlogContainer extends LitElement {
  static properties = {
    posts: { type: Array },
    loading: { type: Boolean },
    selectedPost: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #333;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin-bottom: 20px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }
    button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      cursor: pointer;
      border-radius: 4px;
    }
    button:hover {
      background-color: #0056b3;
    }
    article {
      line-height: 1.6;
    }
    .tag {
      display: inline-block;
      background-color: #f1f1f1;
      padding: 5px 10px;
      margin-right: 5px;
      border-radius: 20px;
      font-size: 0.8em;
    }
  `;

  constructor() {
    super();
    this.posts = [];
    this.loading = true;
    this.selectedPost = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchPosts();
  }

  async fetchPosts() {
    try {
      this.posts = (await getAllBlogs()) || [];
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      this.loading = false;
    }
  }

  async selectPost(id) {
    this.loading = true;
    try {
      this.selectedPost = await getPost(id);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`<p>Loading...</p>`;
    }

    if (this.selectedPost) {
      return this.renderPost(this.selectedPost);
    }

    return html`
      <h1>Blog</h1>
      ${this.posts.length === 0
        ? html`<p>No posts available.</p>`
        : html`
            <ul>
              ${this.posts.map(
                (post) => html`
                  <li>
                    <h2>${post.title}</h2>
                    <p>${post.excerpt || post.content.substring(0, 100)}...</p>
                    ${this.renderTags(post.tags)}
                    <button @click=${() => this.selectPost(post.id)}>Read more</button>
                  </li>
                `
              )}
            </ul>
          `}
    `;
  }

  renderPost(post) {
    return html`
      <article>
        <h1>${post.title}</h1>
        ${this.renderTags(post.tags)}
        <p>${post.content}</p>
        <button @click=${() => (this.selectedPost = null)}>Back to list</button>
      </article>
    `;
  }

  renderTags(tags) {
    if (!tags || tags.length === 0) return null;
    return html` <div>${tags.map((tag) => html`<span class="tag">${tag}</span>`)}</div> `;
  }
}

customElements.define("blog-container", BlogContainer);
