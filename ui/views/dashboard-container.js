import { LitElement, html, css } from "../../lib/lit.js";
import { styles } from "../styles.js";
import "../little-throbber.js";

export default class DashboardContainer extends LitElement {
  static properties = {
    todos: { type: Array },
  };

  constructor() {
    super();
    /** @type {Todo[]} */
    this.todos = [];
    this.loadTodos();
    this.addInitialTodos();
  }

  loadTodos() {
    const storedTodos = localStorage.getItem("roppapitodos");
    if (storedTodos) {
      /** @type {Todo[]} */
      this.todos = JSON.parse(storedTodos);
    }
  }

  saveTodos() {
    localStorage.setItem("roppapitodos", JSON.stringify(this.todos));
  }

  addInitialTodos() {
    const initialTodos = [
      {
        id: 1,
        text: "API: wire up handlers to repository for creating and deleting an empty workout.",
        completed: false,
      },
      {
        id: 2,
        text: "UI: HTMX to hit endpoint on load and replace with endpoint generated UI to create a workout.",
        completed: false,
      },
      { id: 3, text: "API: HTMX hello world component to create a workout.", completed: false },
    ];

    const storedTodos = localStorage.getItem("roppapitodos");
    if (!storedTodos) {
      this.todos = initialTodos;
      this.saveTodos();
    }
  }

  // @ts-ignore
  render() {
    return html`
      <div class="dashboard-container">
        <h1>Well hey there...</h1>
        <p>
          Weightlifting view with simplest thing that works. Use htmx and make it run off server endpoints inside a web
          component.
        </p>
        <div class="todo-block">
          <h2>TODO</h2>
          <ul>
            ${this.todos.map(
              (todo) => html`
                <li>
                  <input type="checkbox" @change=${() => this.completeTodo(todo.id)} />
                  ${todo.text}
                </li>
              `
            )}
          </ul>
          <form @submit=${this.addTodo}>
            <input type="text" id="newTodo" placeholder="Add new todo" required />
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
    `;
  }

  /**
   * @param {number} id
   */
  completeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveTodos();
  }

  /**
   * @param {Event} e
   */
  addTodo(e) {
    e.preventDefault();
    // @ts-ignore
    const input = /** @type {HTMLInputElement} */ (this.shadowRoot.getElementById("newTodo"));
    const newTodoText = input.value.trim();
    if (newTodoText) {
      /** @type {Todo} */
      const newTodo = {
        id: Date.now(),
        text: newTodoText,
        completed: false,
      };
      this.todos = [...this.todos, newTodo];
      this.saveTodos();
      input.value = "";
    }
  }

  static styles = [
    styles,
    css`
      .dashboard-container {
        padding: 20px;
      }
      .todo-block {
        margin-top: 20px;
        padding: 15px;
        background-color: #f0f4f8;
        border-radius: 8px;
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      li input[type="checkbox"] {
        margin-right: 10px;
      }
      form {
        display: flex;
        margin-top: 10px;
      }
      form input {
        flex-grow: 1;
        margin-right: 10px;
        padding: 5px;
      }
      button {
        padding: 5px 10px;
        background-color: #4a90e2;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background-color: #357abd;
      }
    `,
  ];
}

customElements.define("dashboard-container", DashboardContainer);
