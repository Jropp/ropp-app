import { LitElement, html } from "../../lib/lit.js";
import { getSessionUser } from "../../services/session.js";
import { styles } from "../styles.js";
import "../little-throbber.js";

class DashboardContainer extends LitElement {
  // @ts-ignore
  render() {
    const sessionUser = getSessionUser();
    console.log(sessionUser);
    return html` <h1>Well hey there... ${sessionUser.first_name}</h1> `;
  }

  static styles = [styles];
}

customElements.define("dashboard-container", DashboardContainer);
