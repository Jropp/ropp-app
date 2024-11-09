// @ts-nocheck
import ComponentBase from "../../lib/component-base.js";

class ProjectBoardContainer extends ComponentBase {
  static properties = {
    columns: { type: Object },
  };

  constructor() {
    super();
    this.columns = mockData;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log("ProjectBoardContainer connected");
    requestAnimationFrame(() => {
      Object.values(this.columns).forEach((column) => {
        this.drawCards(column);
      });
    });
  }

  drawCards(column) {
    const columnElement = this.shadowRoot.querySelector(`#column-${column.id}`);
    if (!columnElement) return;

    column.cards.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.innerHTML = `
        <h3>${card.title}</h3>
        <p>${card.text}</p>
      `;

      let isDragging = false;
      let currentX;
      let currentY;
      let initialX;
      let initialY;
      let xOffset = 0;
      let yOffset = 0;

      cardElement.addEventListener("mousedown", (e) => {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === cardElement) {
          isDragging = true;
          cardElement.style.position = "absolute";
          cardElement.style.zIndex = "1000";
        }
      });

      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        cardElement.style.transform = `translate(${currentX}px, ${currentY}px)`;
      });

      document.addEventListener("mouseup", () => {
        if (!isDragging) return;

        initialX = currentX;
        initialY = currentY;
        isDragging = false;

        cardElement.style.position = "";
        cardElement.style.zIndex = "";
        cardElement.style.transform = "";
      });

      document.addEventListener("mousemove", (event) => {});

      columnElement.appendChild(cardElement);
      const cardBoundingRect = cardElement.getBoundingClientRect();
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
    <style>
      .columns {
        display: grid;
        grid-template-columns: repeat(${Object.keys(this.columns).length}, 1fr);
        gap: 1rem;
        padding: 1rem;
        height: 100%;
      }
      .column {
        background: #f4f5f7;
        border-radius: 8px;
        padding: 1rem;
      }
      .card {
        background: white;
        border-radius: 4px;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        cursor: grab;
        user-select: none;
      }
      .card:active {
        cursor: grabbing;
      }
      .card h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
      }
      .card p {
        margin: 0;
        font-size: 0.875rem;
        color: #666;
      }
    </style>
    <div class="columns">
      ${Object.entries(this.columns)
        .map(
          ([key, column]) => `
          <div id="column-${column.id}" class="column">
            <h2>${key}</h2>
          </div>
        `
        )
        .join("")}
    </div>
    `;
  }
}

customElements.define("project-board-container", ProjectBoardContainer);
export default ProjectBoardContainer;

const mockData = {
  Backlog: {
    id: "backlog",
    cards: [
      { id: 1, title: "Update Lease Terms", text: "Review and update standard lease agreement for 2024", index: 0 },
      { id: 2, title: "Property Photos", text: "Schedule professional photographer for unit 204", index: 1 },
      { id: 3, title: "Maintenance Schedule", text: "Create annual maintenance calendar for all properties", index: 2 },
    ],
  },
  "To Do": {
    id: "todo",
    cards: [
      { id: 4, title: "Tenant Screening", text: "Review applications for 123 Main St unit", index: 0 },
      { id: 5, title: "Rent Collection", text: "Follow up on overdue payments for Building A", index: 1 },
      { id: 6, title: "Insurance Renewal", text: "Update property insurance policies", index: 2 },
      { id: 7, title: "Market Analysis", text: "Research current rental rates in downtown area", index: 3 },
    ],
  },
  "In Progress": {
    id: "in-progress",
    cards: [
      { id: 8, title: "Unit Renovation", text: "Bathroom remodel at 456 Oak Ave", index: 0 },
      { id: 9, title: "Lease Signing", text: "Process paperwork for new tenant in unit 301", index: 1 },
      { id: 10, title: "Maintenance Request", text: "Fix HVAC system in Building B", index: 2 },
    ],
  },
  Review: {
    id: "review",
    cards: [
      { id: 11, title: "Budget Approval", text: "Q2 maintenance budget needs review", index: 0 },
      { id: 12, title: "Contract Review", text: "New cleaning service agreement", index: 1 },
      { id: 13, title: "Inspection Report", text: "Annual property inspection findings for Pine Street", index: 2 },
    ],
  },
  Testing: {
    id: "testing",
    cards: [
      { id: 14, title: "Smart Lock System", text: "Testing new keyless entry system in Building C", index: 0 },
      { id: 15, title: "Online Portal", text: "Beta testing new tenant payment portal", index: 1 },
      { id: 16, title: "Security Cameras", text: "Verify new surveillance system functionality", index: 2 },
    ],
  },
  // Done: {
  //   id: "done",
  //   cards: [
  //     { id: 17, title: "Lease Renewal", text: "Completed renewals for Building D tenants", index: 0 },
  //     { id: 18, title: "Property Tax", text: "Filed property tax documents for 2023", index: 1 },
  //     { id: 19, title: "Move-out Inspection", text: "Completed final walkthrough of unit 105", index: 2 },
  //     { id: 20, title: "Vendor Payment", text: "Processed payments for maintenance contractors", index: 3 },
  //   ],
  // },
};
