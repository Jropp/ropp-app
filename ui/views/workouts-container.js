import { LitElement, html } from "../../lib/lit.js";
import { getSessionUser } from "../../services/session.js";
import { styles } from "../styles.js";
import "../little-throbber.js";
import { createWorkout } from "../../services/workouts.service.js";

class WorkoutsContainer extends LitElement {
  connectedCallback() {
    super.connectedCallback();

    createWorkout().then((workout) => {
      console.log(workout);
    });
  }
  // @ts-ignore
  render() {
    const sessionUser = getSessionUser();
    return html` <h1>Lift it bro</h1> `;
  }

  static styles = [styles];
}

customElements.define("workouts-container", WorkoutsContainer);
