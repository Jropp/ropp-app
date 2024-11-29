import ComponentBase from "../../lib/component-base.js";
import { getPeople, createPerson } from "../../services/people.service.js";

class PeopleContainer extends ComponentBase {
  /** @type {Person[]} */
  people;
  __people = { type: Array, value: [], urlParam: "people" };

  /** @type {Person} */
  person;
  __person = { type: Object };

  constructor() {
    super();
    this.initProperties();
    this.listeners = [{ event: "submit", selector: "form", handler: this.handleCreatePerson }];
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchPeople();
  }

  async fetchPeople() {
    try {
      this.people = await getPeople();
      this.render();
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  }

  /** @param {Event & {target: HTMLFormElement}} e */
  async handleCreatePerson(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    // cast as person
    const newPerson = /** @type {Person} */ (/**  @type {*} */ (Object.fromEntries(formData.entries())));

    try {
      // @ts-ignore
      await createPerson(newPerson);
      e.target.reset();
      await this.fetchPeople();
    } catch (error) {
      console.error("Error creating person:", error);
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        form {
          display: grid;
          padding: 16px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin-bottom: 8px;
          padding: 8px;
          background-color: #f0f0f0;
          border-radius: 4px;
        }
        form {
          margin-bottom: 16px;
        }
        input, button {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      </style>
      <div id="container">
        <h2>People</h2>
        <form>
          <input type="text" name="firstName" placeholder="First Name" required>
          <input type="text" name="lastName" placeholder="Last Name" required>
          <input type="email" name="email" placeholder="Email">
          <input type="tel" name="phone" placeholder="Phone">
          <input type="number" name="birthDate" placeholder="Birth Date">
          <input type="text" name="address" placeholder="Address">
          <input type="text" name="address2" placeholder="Address 2">
          <input type="text" name="city" placeholder="City">
          <input type="text" name="state" placeholder="State">
          <input type="text" name="zipCode" placeholder="Zip Code">
          <button type="submit">Add Person</button>
        </form>
        <ul>
          ${this.people
            .map(
              (person) => `
            <li>
              ${person.firstName} ${person.lastName} - ${person.email} ${person.phone ? `(${person.phone})` : ""}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
  }
}

customElements.define("people-container", PeopleContainer);
