import { LitElement, html, css } from "../../lib/lit.js";
import { getAllBlogs, updateBlog, createBlog, deleteBlog } from "../../services/blogs.service.js";
import { styles } from "../styles.js";
import "../tag-input.js";
import "./text-input.js";

class BlogAdminContainer extends LitElement {
  static properties = {
    posts: { type: Array },
    selectedPost: { type: Object },
    editMode: { type: Boolean },
    showNewForm: { type: Boolean },
    loading: { type: Boolean },
    error: { type: String },
    content: { type: String },
    showCurrentBlogs: { type: Boolean },
  };

  constructor() {
    super();
    this.posts = [];
    this.selectedPost = null;
    this.editMode = false;
    this.showNewForm = false;
    this.loading = true;
    this.error = null;
    this.content = "";
    this.showCurrentBlogs = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchPosts();
  }

  async fetchPosts() {
    this.loading = true;
    this.error = null;
    try {
      this.posts = await getAllBlogs();
    } catch (error) {
      console.error("Error fetching posts:", error);
      this.error = "Failed to load blogs. Please try again later.";
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) {
      return html`<p>Loading...</p>`;
    }

    if (this.error) {
      return html`<p class="error">${this.error}</p>`;
    }

    return html`
      <h1>Blog Admin</h1>
      <button @click=${this.toggleNewForm}>${this.showNewForm ? "Cancel" : "Add New Blog"}</button>
      ${this.showNewForm ? this.renderNewForm() : ""}
      <div class="current-blogs-section">
        <h2 @click=${this.toggleCurrentBlogs} class="clickable">
          Current Blogs
          <span class="toggle-icon">${this.showCurrentBlogs ? "▼" : "▶"}</span>
        </h2>
        ${this.showCurrentBlogs ? this.renderBlogList() : ""}
      </div>
      ${this.editMode ? this.renderEditForm(this.selectedPost) : ""}
    `;
  }

  toggleCurrentBlogs() {
    this.showCurrentBlogs = !this.showCurrentBlogs;
  }

  renderBlogList() {
    if (!this.posts || this.posts.length === 0) {
      return html`<p>No blogs available.</p>`;
    }
    return html`
      <ul class="blog-list">
        ${this.posts.map(
          (post) => html`
            <li class="blog-item">
              <div class="blog-content">
                <a href="#" @click=${(e) => this.handleEditClick(e, post)} class="blog-title">${post.title}</a>
              </div>
              <div class="blog-actions">
                <button class="delete-btn" @click=${() => this.handleDeleteClick(post)}>🗑️</button>
              </div>
            </li>
          `
        )}
      </ul>
    `;
  }

  handleContentChange(e) {
    this.content = e.detail;
  }

  renderNewForm() {
    return html`
      <form @submit=${this.handleNewSubmit}>
        <input name="title" placeholder="Title" required />
        <text-input @input-change=${this.handleContentChange}></text-input>
        <tag-input name="tags"></tag-input>
        <button type="submit">Save</button>
      </form>
    `;
  }

  renderEditForm(post) {
    if (!post) return null;
    return html`
      <form @submit=${this.handleEditSubmit}>
        <input name="title" .value=${post.title} required />
        <text-input .value=${post.content} @input-change=${this.handleContentChange}></text-input>
        <tag-input name="tags" .tags=${post.tags || []}></tag-input>
        <button type="submit">Update</button>
        <button type="button" @click=${this.cancelEdit}>Cancel</button>
      </form>
    `;
  }

  toggleNewForm() {
    this.showNewForm = !this.showNewForm;
    this.editMode = false;
    this.selectedPost = null;
    this.requestUpdate();
  }

  handleEditClick(e, post) {
    e.preventDefault();
    this.selectedPost = post;
    this.editMode = true;
    this.showNewForm = false;
  }

  async handleNewSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPost = {
      title: formData.get("title"),
      content: this.content,
      tags: formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };
    try {
      await createBlog(newPost);
      await this.fetchPosts();
      this.showNewForm = false;
      this.showAlert("Blog post saved successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      this.showAlert("Error saving blog post. Please try again.", "error");
    }
  }

  async handleEditSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedPost = {
      id: this.selectedPost.id,
      title: formData.get("title"),
      content: this.content,
      tags: formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
    };
    try {
      await updateBlog(updatedPost);
      await this.fetchPosts();
      this.editMode = false;
      this.selectedPost = null;
      this.showAlert("Blog post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      this.showAlert("Error updating blog post. Please try again.", "error");
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.selectedPost = null;
  }

  async handleDeleteClick(post) {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await deleteBlog(post.id);
        await this.fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  }

  showAlert(message, type = "success") {
    const alert = document.createElement("div");
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    this.shadowRoot.appendChild(alert);
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }

  static styles = [
    styles,
    css`
      :host {
        display: block;
        padding: 1rem;
      }
      .current-blogs-section {
        margin-top: 2rem;
        background-color: #f9f9f9;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 1rem;
      }
      .clickable {
        cursor: pointer;
        user-select: none;
      }
      .toggle-icon {
        font-size: 0.8em;
        margin-left: 0.5rem;
      }
      .blog-list {
        list-style-type: none;
        padding: 0;
      }
      .blog-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid #e0e0e0;
        padding: 0.5rem 0;
      }
      .blog-content {
        flex: 1;
        min-width: 0;
        margin-right: 1rem;
      }
      .blog-title {
        white-space: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .blog-actions {
        flex-shrink: 0;
        display: flex;
        align-items: center;
      }
      .delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0.5rem;
        color: #dc3545;
      }
      .delete-btn:hover {
        opacity: 0.7;
      }
      .blog-list a {
        color: #007bff;
        text-decoration: none;
      }
      .blog-list a:hover {
        text-decoration: underline;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      input,
      textarea,
      tag-input {
        padding: 0.5rem;
      }
      button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 5px 10px;
        cursor: pointer;
        border-radius: 4px;
      }
      button:hover {
        background-color: #0056b3;
      }
      .error {
        color: red;
        font-weight: bold;
      }
      .alert {
        padding: 10px;
        margin-bottom: 15px;
        border-radius: 4px;
        font-weight: bold;
        text-align: center;
      }
      .alert-success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }
      .alert-error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
      @media (max-width: 600px) {
        .blog-item {
          flex-wrap: nowrap;
        }
        .blog-content {
          margin-right: 0.5rem;
        }
      }
    `,
  ];
}

customElements.define("blog-admin-container", BlogAdminContainer);
