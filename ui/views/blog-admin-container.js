import { LitElement, html, css } from "../../lib/lit.js";
import { createBlog, getAllBlogs } from "../../services/blogs.service.js";
import { styles } from "../styles.js";
// Import necessary services (to be implemented)
class BlogAdminContainer extends LitElement {
  static properties = {
    view: { type: String },
    posts: { type: Array },
    selectedPost: { type: Object },
  };

  constructor() {
    super();
    this.view = "list";
    this.posts = [];
    this.selectedPost = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getPosts();
  }

  async getPosts() {
    // Implement this method to fetch posts from the backend
    this.posts = await getAllBlogs();
    this.posts = []; // Placeholder
  }

  render() {
    return html`
      <h1>Blog Admin</h1>
      ${this[this.view]()}
    `;
  }

  list() {
    return html`
      <div>
        <button @click=${() => (this.view = "new")}>New Post</button>
        <ul>
          ${this.posts.map(
            (post) => html`
              <li>
                ${post.title}
                <button @click=${() => this.handleEditClick(post)}>Edit</button>
                <button @click=${() => this.handleDeleteClick(post)}>Delete</button>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }

  new() {
    return html`
      <form @submit=${this.handleNewSubmit}>
        <input name="title" placeholder="Title" required />
        <textarea name="content" placeholder="Content" required></textarea>
        <button type="submit">Save</button>
      </form>
    `;
  }

  edit() {
    return html`
      <form @submit=${this.handleEditSubmit}>
        <input name="title" .value=${this.selectedPost.title} required />
        <textarea name="content" required>${this.selectedPost.content}</textarea>
        <button type="submit">Update</button>
      </form>
    `;
  }

  async handleNewSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPost = {
      title: formData.get("title"),
      content: formData.get("content"),
      tags: ["test"],
    };
    // await saveNewPost(newPost);
    try {
      await createBlog(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
    }
    await this.getPosts();
    this.view = "list";
  }

  handleEditClick(post) {
    this.selectedPost = post;
    this.view = "edit";
  }

  async handleEditSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedPost = {
      id: this.selectedPost.id,
      title: formData.get("title"),
      content: formData.get("content"),
    };
    // await updatePost(updatedPost);
    await this.getPosts();
    this.view = "list";
  }

  async handleDeleteClick(post) {
    if (confirm("Are you sure you want to delete this post?")) {
      // await deletePost(post.id);
      await this.getPosts();
    }
  }

  static styles = [
    styles,
    css`
      :host {
        display: block;
        padding: 1rem;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      input,
      textarea {
        padding: 0.5rem;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        margin-bottom: 0.5rem;
      }
    `,
  ];
}

customElements.define("blog-admin-container", BlogAdminContainer);
