import { LitElement, html } from "../../lib/lit.js";
import { getSessionUser } from "../../services/session.js";
import { styles } from "../styles.js";
import "../little-throbber.js";
import { getExercises } from "../../services/workouts.service.js";
class WorkoutsContainer extends LitElement {
  static properties = {
    exercises: { type: Array },
  };
  connectedCallback() {
    super.connectedCallback();
    this.getExercises();
  }

  async getExercises() {
    try {
      this.exercises = await getExercises();
    } catch (error) {}
  }

  // @ts-ignore
  render() {
    return html`
      <div>
        <h1>Lift it bro</h1>
        <select>
          ${this.exercises.map((exercise) => html`<option>${exercise.name}</option>`)}
        </select>
      </div>
      ${this.renderExerciseSelect()}
    `;
  }
  renderExerciseSelect() {
    if (!this.exercises) {
      return html`<little-throbber></little-throbber>`;
    }

    return html``;
  }
  static styles = [styles];
}

customElements.define("workouts-container", WorkoutsContainer);
