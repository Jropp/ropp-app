import { html, css } from "../../lib/lit.js";
import "../workout-timer.js";
import "../workout-progress.js";
import "../workout-card.js";
import { LitElement } from "../../lib/lit.js";

class WorkoutsContainer extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      padding-bottom: 160px;
      color: var(--color-blue-dark);
    }
    .timer-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      margin-bottom: 20px;
    }
    .timer-controls span {
      margin: 0 20px;
      font-weight: bold;
      color: var(--color-blue-dark);
    }
    .timer-controls div {
      cursor: pointer;
      user-select: none;
      color: var(--color-blue-accent);
      font-weight: bold;
      padding: 10px;
    }
    #start-workout {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px 30px;
      font-size: 24px;
      cursor: pointer;
      background-color: var(--color-blue-accent);
      color: var(--color-white);
      border: none;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    #start-workout:hover {
      background-color: var(--color-blue-medium);
    }
    #exercise-options {
      width: 100%;
    }
    .exercise-option {
      width: 100%;
      margin: 10px 0;
      padding: 15px;
      border: 1px solid #000;
      border-radius: 5px;
      background-color: #fff;
      position: relative;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      box-sizing: border-box;
    }
    .exercise-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .difficulty-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #fff;
    }
    .easy {
      background-color: #4caf50;
    }
    .medium {
      background-color: #ff9800;
    }
    .hard {
      background-color: #f44336;
    }
    .exercise-option.selected {
      background-color: #e8f5e9;
    }
    .exercise-option.completed {
      background-color: #f5f5f5;
      opacity: 0.7;
    }
    .exercise-duration {
      margin-top: 5px;
      font-style: italic;
      color: #666;
    }
    #completed-section {
      width: 100%;
      margin-top: 20px;
      padding: 15px;
      background-color: var(--color-white);
      border: 1px solid var(--color-blue-light);
      border-radius: 5px;
    }
    .completed-header {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      color: var(--color-blue-dark);
    }
    .all-exercises-section {
      width: 100%;
      margin-top: 20px;
      border: 1px solid #eee;
      border-radius: 5px;
    }
    .expand-button {
      width: 100%;
      padding: 10px;
      background-color: var(--color-white);
      border: 1px solid var(--color-blue-light);
      border-radius: 5px;
      cursor: pointer;
      text-align: left;
      font-size: 16px;
      color: var(--color-blue-dark);
    }
    .expand-button:hover {
      background-color: var(--color-blue-light);
      color: var(--color-white);
    }
    .all-exercises-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }
    .all-exercises-content.expanded {
      max-height: 2000px;
    }
    .suggested-workouts {
      width: 100%;
      margin-bottom: 20px;
    }
    .suggested-items {
      display: flex;
      flex-direction: column;
      flex-basis: 100%;
    }
    .suggested-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .mix-button {
      padding: 8px 16px;
      background-color: var(--color-blue-accent);
      color: var(--color-white);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s;
    }
    .mix-button:hover {
      background-color: var(--color-blue-medium);
    }
  `;

  static properties = {
    workoutTime: { type: Number },
    workoutStarted: { type: Boolean },
    timePassed: { type: Number },
    workoutSets: { type: Array },
    activeWorkout: { type: Number },
    completedSets: { type: Array },
    suggestedSets: { type: Array },
  };

  constructor() {
    super();
    this.workoutTime = 30; // Default 30 minutes
    this.workoutStarted = false;
    this.timePassed = 0;
    this.timerInterval = null;
    this.workoutSets = WorkoutsContainer.mockWorkoutSets;
    this.activeWorkout = null;
    this.completedSets = [];
    this.suggestedSets = this.getSuggestedSets();
  }

  getSuggestedSets() {
    return [
      this.workoutSets.find((set) => set.exercise.difficulty_rating === 1),
      this.workoutSets.find((set) => set.exercise.difficulty_rating === 2),
      this.workoutSets.find((set) => set.exercise.difficulty_rating === 3),
    ].filter(Boolean);
  }

  handleWorkoutCardClick(set) {
    if (this.activeWorkout !== null) return; // Prevent starting multiple workouts

    this.activeWorkout = set.id;
    const workoutCard = this.shadowRoot.querySelector(`workout-card[data-set-id="${set.id}"]`);
    workoutCard?.startWorkout();
  }

  handleWorkoutCompleted(e) {
    const workoutCard = e.target;
    const set = workoutCard.set;
    const duration = e.detail.duration;

    // Move workout to completed sets
    this.completedSets = [...this.completedSets, { ...set, duration }];
    this.workoutSets = [...this.workoutSets.filter((ws) => ws.id !== set.id)];

    // Replace the completed suggested workout with a new one of same difficulty
    this.suggestedSets = this.suggestedSets.map((suggestedSet) => {
      if (suggestedSet.id === set.id) {
        return this.workoutSets.find((ws) => ws.exercise.difficulty_rating === set.exercise.difficulty_rating);
      }
      return suggestedSet;
    });

    this.activeWorkout = null;
    this.requestUpdate();
  }

  handleWorkoutCancelled() {
    this.activeWorkout = null;
    this.requestUpdate();
  }

  calculateTotalPoints() {
    return this.workoutSets.reduce((total, set) => total + set.exercise.difficulty_rating, 0);
  }

  calculateCompletedPoints() {
    return this.completedSets.reduce((total, set) => total + set.exercise.difficulty_rating, 0);
  }

  render() {
    return html`
      ${!this.workoutStarted
        ? html`
            <div class="timer-controls">
              <div @click="${this.decrementTime}">-</div>
              <span id="workout-time">${this.workoutTime}</span>
              <div @click="${this.incrementTime}">+</div>
            </div>
            <button id="start-workout" @click="${this.startWorkout}">Start Workout</button>
          `
        : html`
            <div class="suggested-workouts">
              <div class="suggested-header">
                <h2>Suggested Next Workout</h2>
                <button class="mix-button" @click="${this.mixUpSuggestions}">Mix It Up 🔄</button>
              </div>
              <div class="suggested-items">
                ${this.suggestedSets.map(
                  (set) => html`
                    <workout-card
                      data-set-id="${set.id}"
                      .set="${set}"
                      .isActive="${set.id === this.activeWorkout}"
                      @click="${() => this.handleWorkoutCardClick(set)}"
                      @workout-completed="${this.handleWorkoutCompleted}"
                      @workout-cancelled="${this.handleWorkoutCancelled}"
                    ></workout-card>
                  `
                )}
              </div>
            </div>

            <div class="all-exercises-section">
              <button class="expand-button" @click="${this.toggleExpand}">
                All Workouts
                <span>▼</span>
              </button>
              <div class="all-exercises-content">
                <!-- group by exercise type and render each exercise type in a column -->
                ${Object.values(
                  this.workoutSets.reduce((acc, set) => {
                    acc[set.exercise.name] = acc[set.exercise.name] || [];
                    acc[set.exercise.name].push(set);
                    return acc;
                  }, {})
                ).map(
                  (sets) => html`
                    <div class="exercise-type">
                      <h3>${sets[0].exercise.name}</h3>
                      ${sets.map(
                        (set) => html`
                          <workout-card
                            data-set-id="${set.id}"
                            .set="${set}"
                            .isActive="${set.id === this.activeWorkout}"
                            @click="${() => this.handleWorkoutCardClick(set)}"
                            @workout-completed="${this.handleWorkoutCompleted}"
                            @workout-cancelled="${this.handleWorkoutCancelled}"
                          ></workout-card>
                        `
                      )}
                    </div>
                  `
                )}
              </div>
            </div>

            ${this.completedSets.length > 0
              ? html`
                  <div id="completed-section">
                    <h2 class="completed-header">Completed Exercises</h2>
                    ${this.completedSets.map(
                      (set) => html`
                        <workout-card data-set-id="${set.id}" .set="${set}" .isCompleted="${true}"></workout-card>
                      `
                    )}
                  </div>
                `
              : null}

            <workout-progress
              .completed="${this.calculateCompletedPoints()}"
              .total="${this.calculateCompletedPoints() + this.calculateTotalPoints()}"
            ></workout-progress>

            <workout-timer
              .duration="${this.workoutTime * 60}"
              .timePassed="${this.timePassed}"
              .isActive="${true}"
            ></workout-timer>
          `}
    `;
  }

  incrementTime() {
    this.workoutTime += 5;
    this.requestUpdate();
  }

  decrementTime() {
    if (this.workoutTime > 5) {
      this.workoutTime -= 5;
      this.requestUpdate();
    }
  }

  startWorkout() {
    this.workoutStarted = true;
    this.startWorkoutTs = Date.now();

    // Start the timer
    this.timerInterval = setInterval(() => {
      this.timePassed++;
      this.requestUpdate();
    }, 1000);
  }

  stopWorkout() {
    clearInterval(this.timerInterval);
    this.workoutStarted = false;
    this.timePassed = 0;
    this.requestUpdate();
  }

  toggleExpand() {
    const allExercisesContent = this.shadowRoot.querySelector(".all-exercises-content");
    if (!allExercisesContent) return;

    requestAnimationFrame(() => {
      allExercisesContent.classList.toggle("expanded");
    });
  }

  getRandomSetByDifficulty(difficulty) {
    const availableSets = this.workoutSets.filter(
      (set) =>
        set.exercise.difficulty_rating === difficulty &&
        !this.suggestedSets.some((suggested) => suggested?.id === set.id)
    );
    return availableSets[Math.floor(Math.random() * availableSets.length)];
  }

  mixUpSuggestions() {
    this.suggestedSets = [
      this.getRandomSetByDifficulty(1), // Easy
      this.getRandomSetByDifficulty(2), // Medium
      this.getRandomSetByDifficulty(3), // Hard
    ].filter(Boolean);
    this.requestUpdate();
  }

  // Add mock data as a static property
  static get mockWorkoutSets() {
    return [
      // Push-ups sets (Easy)
      {
        id: 1,
        exercise: { id: 1, name: "Push-ups", difficulty_rating: 1 },
        reps: 10,
        goal_duration_seconds: 60,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      {
        id: 2,
        exercise: { id: 1, name: "Push-ups", difficulty_rating: 1 },
        reps: 12,
        goal_duration_seconds: 70,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      // Bench Press sets (Medium)
      {
        id: 7,
        exercise: { id: 4, name: "Bench Press", difficulty_rating: 2 },
        reps: 8,
        goal_duration_seconds: 90,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      {
        id: 8,
        exercise: { id: 4, name: "Bench Press", difficulty_rating: 2 },
        reps: 10,
        goal_duration_seconds: 100,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      // Deadlifts sets (Hard)
      {
        id: 9,
        exercise: { id: 5, name: "Deadlifts", difficulty_rating: 3 },
        reps: 6,
        goal_duration_seconds: 120,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      {
        id: 10,
        exercise: { id: 5, name: "Deadlifts", difficulty_rating: 3 },
        reps: 8,
        goal_duration_seconds: 130,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      // Bicep Curls sets (Easy)
      {
        id: 11,
        exercise: { id: 6, name: "Bicep Curls", difficulty_rating: 1 },
        reps: 12,
        goal_duration_seconds: 60,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      {
        id: 12,
        exercise: { id: 6, name: "Bicep Curls", difficulty_rating: 1 },
        reps: 15,
        goal_duration_seconds: 70,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      // Squats sets (Medium)
      {
        id: 3,
        exercise: { id: 2, name: "Squats", difficulty_rating: 2 },
        reps: 15,
        goal_duration_seconds: 90,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      {
        id: 4,
        exercise: { id: 2, name: "Squats", difficulty_rating: 2 },
        reps: 20,
        goal_duration_seconds: 100,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      // Lunges sets (Hard)
      {
        id: 5,
        exercise: { id: 3, name: "Lunges", difficulty_rating: 3 },
        reps: 12,
        goal_duration_seconds: 120,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
      {
        id: 6,
        exercise: { id: 3, name: "Lunges", difficulty_rating: 3 },
        reps: 10,
        goal_duration_seconds: 110,
        completed: false,
        started_ts: 0,
        completed_ts: 0,
      },
    ];
  }

  // Don't forget to clear the interval when the component is disconnected
  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.timerInterval);
  }
}

customElements.define("workouts-container", WorkoutsContainer);
