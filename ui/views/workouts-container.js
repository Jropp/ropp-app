import { LitElement, html, css } from "../../lib/lit.js";
import { getSessionUser } from "../../services/session.js";
import { styles } from "../styles.js";
import "../little-throbber.js";
import { getExercises } from "../../services/workouts.service.js";
import ComponentBase from "../../lib/component-base.js";

/**
 * @typedef {Object} Exercise
 * @property {number} id
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {Object} Workout
 * @property {number} id
 * @property {string} name
 * @property {Exercise[]} exercises
 */

class WorkoutsContainer extends ComponentBase {
  __exercises = { type: Array };
  /** @type {Exercise[]} */
  exercises;

  __workouts = { type: Array };
  /** @type {Workout[]} */
  workouts;

  __selectedWorkout = { type: Object };
  /** @type {Workout|null} */
  selectedWorkout;

  __workoutStartTime = { type: Number };
  /** @type {number|null} */
  workoutStartTime;

  __isWorkoutActive = { type: Boolean };
  isWorkoutActive;

  __isCreateWorkoutOpen = { type: Boolean };
  isCreateWorkoutOpen;

  __newWorkoutName = { type: String };
  newWorkoutName;

  __newWorkoutExercises = { type: Array };
  /** @type {Exercise[]} */
  newWorkoutExercises;

  constructor() {
    super();
    this.initProperties();
  }

  connectedCallback() {
    super.connectedCallback();
    this.getExercises();
    this.getWorkouts();
  }

  async getExercises() {
    try {
      this.exercises = await getExercises();
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  }

  async getWorkouts() {
    // TODO: Implement getWorkouts service
    this.workouts = [
      { id: 1, name: "Full Body Workout", exercises: [] },
      { id: 2, name: "Upper Body Workout", exercises: [] },
    ];
  }

  async toggleWorkout() {
    if (this.isWorkoutActive) {
      if (confirm("Are you sure you want to stop the workout?")) {
        this.stopWorkout();
      }
    } else {
      if (confirm("Are you sure you want to start the workout?")) {
        this.startWorkout();
      }
    }
  }

  startWorkout() {
    this.workoutStartTime = Date.now();
    this.isWorkoutActive = true;
    this.startTimer();
  }

  stopWorkout() {
    this.workoutStartTime = null;
    this.isWorkoutActive = false;
  }

  startTimer() {
    setInterval(() => {
      this.requestUpdate();
    }, 1000);
  }

  getElapsedTime() {
    if (!this.workoutStartTime) return "00:00:00";
    const elapsed = Math.floor((Date.now() - this.workoutStartTime) / 1000);
    const hours = Math.floor(elapsed / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((elapsed % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (elapsed % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  openCreateWorkout() {
    this.isCreateWorkoutOpen = true;
  }

  closeCreateWorkout() {
    this.isCreateWorkoutOpen = false;
    this.newWorkoutName = "";
    this.newWorkoutExercises = [];
  }

  /**
   * @param {Event} e
   */
  handleNewWorkoutNameChange(e) {
    this.newWorkoutName = /** @type {HTMLInputElement} */ (e.target).value;
  }

  /**
   * @param {Exercise} exercise
   */
  toggleExerciseSelection(exercise) {
    const index = this.newWorkoutExercises.findIndex((e) => e.id === exercise.id);
    if (index === -1) {
      this.newWorkoutExercises = [...this.newWorkoutExercises, exercise];
    } else {
      this.newWorkoutExercises = this.newWorkoutExercises.filter((e) => e.id !== exercise.id);
    }
  }

  saveNewWorkout() {
    if (this.newWorkoutName && this.newWorkoutExercises.length > 0) {
      const newWorkout = {
        id: this.workouts.length + 1, // Simple ID generation
        name: this.newWorkoutName,
        exercises: this.newWorkoutExercises,
      };
      this.workouts = [...this.workouts, newWorkout];
      this.closeCreateWorkout();
    }
  }

  // @ts-ignore
  render() {
    return html`
      <div>
        <h1>Lift it bro 💪</h1>
        <h2>Select a workout:</h2>
        <select
          @change=${
            /**
             * @param {Event & {target: HTMLSelectElement}} e
             */
            (e) => {
              this.selectedWorkout = this.workouts.find((w) => w.id === parseInt(e.target.value)) || null;
            }
          }
        >
          <option value="">Choose a workout</option>
          ${this.workouts.map((workout) => html`<option value=${workout.id}>${workout.name}</option>`)}
        </select>
        <button @click=${this.openCreateWorkout} class="create-workout-button">Create New Workout</button>
        ${this.selectedWorkout
          ? html`
              <h3>${this.selectedWorkout.name}</h3>
              <button @click=${this.toggleWorkout} class="workout-button ${this.isWorkoutActive ? "stop" : "start"}">
                ${this.isWorkoutActive ? "Stop" : "Start"} Workout
              </button>
              ${this.workoutStartTime ? html`<p>Workout time: ${this.getElapsedTime()}</p>` : ""}
            `
          : ""}
        <h2>Available Exercises:</h2>
        ${this.renderExerciseSelect()} ${this.renderCreateWorkoutPopup()}
      </div>
    `;
  }

  renderExerciseSelect() {
    if (!this.exercises) {
      return html`<little-throbber></little-throbber>`;
    }

    return html`
      <ul class="exercise-list">
        ${this.exercises.map((exercise) => html`<li class="exercise-item">${exercise.name}</li>`)}
      </ul>
    `;
  }

  renderCreateWorkoutPopup() {
    if (!this.isCreateWorkoutOpen) return "";

    return html`
      <div class="popup-overlay">
        <div class="popup-content">
          <h2>Create New Workout</h2>
          <input
            type="text"
            .value=${this.newWorkoutName}
            @input=${this.handleNewWorkoutNameChange}
            placeholder="Workout Name"
          />
          <h3>Select Exercises:</h3>
          <ul class="exercise-list">
            ${this.exercises.map(
              (exercise) => html`
                <li class="exercise-item">
                  <label>
                    <input
                      type="checkbox"
                      .checked=${this.newWorkoutExercises.some((e) => e.id === exercise.id)}
                      @change=${() => this.toggleExerciseSelection(exercise)}
                    />
                    ${exercise.name}
                  </label>
                </li>
              `
            )}
          </ul>
          <div class="popup-actions">
            <button @click=${this.saveNewWorkout} class="save-button">Save Workout</button>
            <button @click=${this.closeCreateWorkout} class="cancel-button">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  static styles = [
    styles,
    css`
      :host {
        display: block;
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      h1 {
        color: #333;
        text-align: center;
        margin-bottom: 20px;
      }

      h2 {
        color: #555;
        margin-top: 20px;
      }

      select {
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
      }

      .workout-button {
        width: auto;
        padding: 10px 20px;
        font-size: 16px;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s ease;
      }

      .workout-button.start {
        background-color: #4caf50;
      }

      .workout-button.start:hover {
        background-color: #45a049;
      }

      .workout-button.stop {
        background-color: #f44336;
      }

      .workout-button.stop:hover {
        background-color: #d32f2f;
      }

      p {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        text-align: center;
      }

      .exercise-list {
        list-style-type: none;
        padding: 0;
      }

      .exercise-item {
        background-color: white;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .create-workout-button {
        background-color: #3498db;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 10px;
      }

      .create-workout-button:hover {
        background-color: #2980b9;
      }

      .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .popup-content {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        max-width: 500px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
      }

      .popup-content input[type="text"] {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        font-size: 16px;
      }

      .popup-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
      }

      .save-button,
      .cancel-button {
        padding: 8px 16px;
        margin-left: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }

      .save-button {
        background-color: #2ecc71;
        color: white;
      }

      .cancel-button {
        background-color: #e74c3c;
        color: white;
      }
    `,
  ];
}

customElements.define("workouts-container", WorkoutsContainer);
