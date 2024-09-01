import { LitElement, html, css } from "lit-element";

class BlogList extends LitElement {
  static properties = {
    blogs: { type: Array },
  };

  static styles = css`
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      margin-bottom: 20px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }
    h2 {
      margin-bottom: 5px;
    }
    p {
      color: #666;
    }
  `;

  constructor() {
    super();
    this.blogs = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchBlogs();
  }

  async fetchBlogs() {
    const response = await fetch("http://localhost:8080/api/blogs");
    this.blogs = await response.json();
  }

  render() {
    return html`
      <ul>
        ${this.blogs.map(
          (blog) => html`
            <li>
              <h2>${blog.title}</h2>
              <p>${blog.content}</p>
              <small>${new Date(blog.createdAt).toLocaleString()}</small>
            </li>
          `
        )}
      </ul>
    `;
  }
}

customElements.define("blog-list", BlogList);
