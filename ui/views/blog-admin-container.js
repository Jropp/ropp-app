import { LitElement, html, css } from "../../lib/lit.js";
import { getAllBlogs, updateBlog, createBlog, deleteBlog } from "../../services/blogs.service.js";
import { styles } from "../styles.js";
import "../tag-input.js";
import "./text-input.js"; // Import the text-input component

class BlogAdminContainer extends LitElement {
  static properties = {
    posts: { type: Array },
    selectedPost: { type: Object },
    editMode: { type: Boolean },
    showNewForm: { type: Boolean },
    loading: { type: Boolean },
    error: { type: String },
    content: { type: String }, // Add content property to store the rich text content
  };

  constructor() {
    super();
    this.posts = [];
    this.selectedPost = null;
    this.editMode = false;
    this.showNewForm = false;
    this.loading = true;
    this.error = null;
    this.content = ""; // Initialize content property
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
      <h2>Current Blogs</h2>
      ${this.renderBlogList()} ${this.editMode ? this.renderEditForm(this.selectedPost) : ""}
    `;
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
      content: this.content, // Use the rich text content
      tags: String(formData.get("tags"))
        .split(",")
        .filter((tag) => tag.trim() !== ""),
    };
    try {
      await createBlog(newPost);
      await this.fetchPosts();
      this.showNewForm = false;
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  async handleEditSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedPost = {
      id: this.selectedPost.id,
      title: formData.get("title"),
      content: this.content, // Use the rich text content
      tags: formData.get("tags"),
    };
    try {
      await updateBlog(updatedPost);
      await this.fetchPosts();
      this.editMode = false;
      this.selectedPost = null;
    } catch (error) {
      console.error("Error updating post:", error);
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

  static styles = [
    styles,
    css`
      :host {
        display: block;
        padding: 1rem;
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
        min-width: 0; /* Allows text to wrap */
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
