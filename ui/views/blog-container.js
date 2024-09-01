import { LitElement, html } from "../../lib/lit.js";
import { getAllBlogs, getPost } from "../../services/blogs.service.js";

class BlogContainer extends LitElement {
  static properties = {
    posts: { type: Array },
    loading: { type: Boolean },
    selectedPost: { type: Object },
  };

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
        <p>${post.content}</p>
        <button @click=${() => (this.selectedPost = null)}>Back to list</button>
      </article>
    `;
  }
}

customElements.define("blog-container", BlogContainer);
