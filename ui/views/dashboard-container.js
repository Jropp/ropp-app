import { LitElement, html } from "../../lib/lit.js";
import { getSessionUser } from "../../services/session.js";
import { styles } from "../styles.js";
import "../little-throbber.js";

class DashboardContainer extends LitElement {
  // @ts-ignore
  render() {
    const sessionUser = getSessionUser();
    return html`
      <h1>Well hey there...</h1>
      <h3>Next helpful functionality</h3>
      <p>
        Weightlifting view with simplest thing that works. Use htmx and make it run off server endpoints inside a web
        component.
      </p>
      <h4>TODO</h4>
      <ul>
        <li>API: wire up handlers to repository for creating and deleting an empty workout.</li>
        <em
          >Workouts aren't "started" yet. I may put in automated functionality so start creats and starts. But for now
          who cares.</em
        >
        <li>UI: HTMX to hit endpoint on load and replace with endpont generated UI to create a workout.</li>
        <li>API: HTMX hello world component to create a workout.</li>
      </ul>
      <h4>TODONE:</h4>
      <ul>
        <li>Service call gets generic success.</li>
      </ul>
    `;
  }

  static styles = [styles];
}

customElements.define("dashboard-container", DashboardContainer);
