import { LitElement, html } from "../../lib/lit.js";

class UserDashboardElement extends LitElement {
  render() {
    return html` <h1>UserDashboard</h1> `;
  }
}

customElements.define("user-dashboard", UserDashboardElement);
