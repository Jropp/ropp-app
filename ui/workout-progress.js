import { LitElement, html, css } from "../lib/lit.js";

class WorkoutProgress extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    .stats-bar {
      position: fixed;
      bottom: 40px;
      left: 0;
      width: 100%;
      background-color: #f8f8f8;
      padding: 10px;
      box-sizing: border-box;
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
    }
    .difficulty-progress {
      background-color: #e0e0e0;
      height: 20px;
      width: 200px;
      border-radius: 10px;
      overflow: hidden;
      margin: 0 10px;
    }
    .difficulty-fill {
      height: 100%;
      background-color: #2196f3;
      transition: width 0.3s ease;
    }
  `;

  static properties = {
    completed: { type: Number },
    total: { type: Number },
  };

  constructor() {
    super();
    this.completed = 0;
    this.total = 0;
  }

  render() {
    const percentage = (this.completed / this.total) * 100;
    return html`
      <div class="stats-bar">
        <span>Difficulty Progress:</span>
        <div class="difficulty-progress">
          <div class="difficulty-fill" style="width: ${percentage}%;"></div>
        </div>
        <span id="difficulty-text">${this.completed}/${this.total}</span>
      </div>
    `;
  }
}

customElements.define("workout-progress", WorkoutProgress);
