import { LitElement, html, css } from "../lib/lit.js";

class WorkoutCard extends LitElement {
  static properties = {
    set: { type: Object },
    isActive: { type: Boolean },
    timeElapsed: { type: Number },
  };

  constructor() {
    super();
    this.set = {};
    this.isActive = false;
    this.timeElapsed = 0;
    this.timerInterval = null;
  }

  getDifficultyClass(difficultyRating) {
    if (difficultyRating === 1) return "easy";
    if (difficultyRating === 2) return "medium";
    if (difficultyRating === 3) return "hard";
    return "";
  }

  render() {
    const { id, exercise, reps } = this.set;
    return html`
      <div class="exercise-option ${this.isActive ? "selected" : ""}" data-set-id="${id}">
        <div class="exercise-title">${exercise.name}</div>
        <div>${reps} reps</div>
        <div class="difficulty-icon ${this.getDifficultyClass(exercise.difficulty_rating)}">
          ${exercise.difficulty_rating}
        </div>
        ${this.isActive
          ? html`
              <div class="timer">
                ${Math.floor(this.timeElapsed / 60)}:${(this.timeElapsed % 60).toString().padStart(2, "0")}
              </div>
              <div class="button-container">
                <button class="action-button complete" @click="${this._handleComplete}">Complete</button>
                <button class="action-button cancel" @click="${this._handleCancel}">Cancel</button>
              </div>
            `
          : ""}
      </div>
    `;
  }

  startWorkout() {
    this.isActive = true;
    this.timeElapsed = 0;
    this.timerInterval = setInterval(() => {
      this.timeElapsed++;
      this.requestUpdate();
    }, 1000);
  }

  _handleComplete(e) {
    e.stopPropagation();
    clearInterval(this.timerInterval);
    this.dispatchEvent(
      new CustomEvent("workout-completed", {
        bubbles: true,
        composed: true,
        detail: { duration: this.timeElapsed },
      })
    );
  }

  _handleCancel(e) {
    e.stopPropagation();
    clearInterval(this.timerInterval);
    this.isActive = false;
    this.timeElapsed = 0;
    this.dispatchEvent(
      new CustomEvent("workout-cancelled", {
        bubbles: true,
        composed: true,
      })
    );
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      margin: 10px 0;
    }
    .exercise-option {
      width: 100%;
      padding: 15px;
      border: 1px solid var(--color-blue-dark);
      border-radius: 5px;
      background-color: var(--color-white);
      position: relative;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      box-sizing: border-box;
    }
    .exercise-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
      color: var(--color-blue-dark);
    }
    .difficulty-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: var(--color-white);
    }
    .easy {
      background-color: var(--color-blue-light);
    }
    .medium {
      background-color: var(--color-blue-accent);
    }
    .hard {
      background-color: var(--color-blue-medium);
    }
    .selected {
      background-color: #e8f5e9;
    }
    .completed {
      background-color: #f5f5f5;
      opacity: 0.7;
    }
    .done-button {
      display: block;
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .exercise-duration {
      margin-top: 5px;
      font-style: italic;
      color: #666;
    }
    .timer {
      font-size: 24px;
      text-align: center;
      margin: 15px 0;
      font-weight: bold;
      color: #333;
    }
    .button-container {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    .action-button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .action-button:hover {
      opacity: 0.9;
    }
    .complete {
      background-color: #4caf50;
      color: white;
    }
    .cancel {
      background-color: #f44336;
      color: white;
    }
  `;
}

customElements.define("workout-card", WorkoutCard);
