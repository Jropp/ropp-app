import { LitElement, html, css } from "../../lib/lit.js";
import { getAllBlogs, updateBlog, createBlog } from "../../services/blogs.service.js";
import { styles } from "../styles.js";
import "../tag-input.js";

class BlogAdminContainer extends LitElement {
  static properties = {
    posts: { type: Array },
    selectedPost: { type: Object },
    editMode: { type: Boolean },
    showNewForm: { type: Boolean },
  };

  constructor() {
    super();
    this.posts = [];
    this.selectedPost = null;
    this.editMode = false;
    this.showNewForm = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchPosts();
  }

  async fetchPosts() {
    try {
      this.posts = await getAllBlogs();
      this.requestUpdate(); // Ensure the component re-renders after fetching posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  render() {
    console.log(this.posts);
    return html`
      <h1>Blog Admin</h1>
      <button @click=${this.toggleNewForm}>Add New Blog</button>
      ${this.showNewForm ? this.renderNewForm() : ""}
      <h2>Current Blogs</h2>
      ${this.renderBlogList()} ${this.editMode ? this.renderEditForm(this.selectedPost) : ""}
    `;
  }

  renderBlogList() {
    console.log(this.posts);
    if (this.posts.length === 0) {
      return html`<p>No blogs available.</p>`;
    }
    return html`
      <ul class="blog-list">
        ${this.posts.map(
          (post) => html`
            <li>
              <a href="#" @click=${(e) => this.handleEditClick(e, post)}>${post.title}</a>
            </li>
          `
        )}
      </ul>
    `;
  }

  renderNewForm() {
    return html`
      <form @submit=${this.handleNewSubmit}>
        <input name="title" placeholder="Title" required />
        <textarea name="content" placeholder="Content" required></textarea>
        <tag-input name="tags"></tag-input>
        <button type="submit">Save</button>
        <button type="button" @click=${this.toggleNewForm}>Cancel</button>
      </form>
    `;
  }

  renderEditForm(post) {
    if (!post) return null;
    return html`
      <form @submit=${this.handleEditSubmit}>
        <input name="title" .value=${post.title} required />
        <textarea name="content" required>${post.content}</textarea>
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
      content: formData.get("content"),
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
      content: formData.get("content"),
      tags: formData.get("tags"), // This will already be a comma-separated string
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
      .blog-list li {
        margin-bottom: 0.5rem;
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
    `,
  ];
}

customElements.define("blog-admin-container", BlogAdminContainer);
