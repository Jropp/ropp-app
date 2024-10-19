import ComponentBase from "../../lib/component-base.js";

class SandboxContainer extends ComponentBase {
  __name;
  __age = { type: Number, urlParam: "age" };

  constructor() {
    super();
    this.initProperties();
    this.listeners = [
      {
        event: "input",
        selector: "#nameInput",
        handler: this.updateName,
      },
      {
        event: "click",
        selector: "#incrementAge",
        handler: this.incrementAge,
      },
    ];
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div id="container">
        <h2>Sandbox Container</h2>
        <p>
          <label for="nameInput">Name:</label>
          <div id="name">${this.name}</div>
          <input id="nameInput" type="text" value="${this.name}">
        </p>
        <p>
          <label>Age: <span id="ageDisplay">${this.age}</span></label>
          <button id="incrementAge">Increment Age</button>
          <tag-input></tag-input>
        </p>
      </div>
    `;
  }

  updateName(event) {
    this.skipNextRender();
    this.name = event.target.value;
  }

  incrementAge() {
    this.age = this.age + 1;
  }
}

customElements.define("sandbox-container", SandboxContainer);
