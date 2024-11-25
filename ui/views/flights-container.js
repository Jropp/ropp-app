import { css, html, LitElement } from "../../lib/lit.js";
import { appFetch } from "../../services/app-fetch.js";

// This view is going to take in a query from a user that in conjunction
// with filtering results through google flights api will return a list of
// specifically tailored to the user's needs

// Also there will be a pre-existing prompt that is set up previously with some parameters
// For now we will call the ai api and such locally and then later move it to the
// the ai api and such locally and then later move it to the backendd
const serpApiKey = "27bc1d3539c3b3301eb06197a1f77b0eb878c727503ffdd65bd099c8e068f949";

/**
 * @typedef {Object} FlightParams
 * @property {string} query
 * @property {string} earliestDeparture
 * @property {string} latestDeparture
 * @property {string} earliestReturn
 * @property {string} latestReturn
 * @property {string} minTripDuration
 * @property {string} maxTripDuration
 * @property {number} absolutePriceMax
 */

class FlightsContainer extends LitElement {
  static properties = {
    flightParams: { type: Object },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.flightParams = {
      query: "",
      earliestDeparture: "",
      latestDeparture: "",
      earliestReturn: "",
      latestReturn: "",
      minTripDuration: "",
      maxTripDuration: "",
      absolutePriceMax: null,
    };
    this.loading = false;
  }

  // @ts-ignore
  render() {
    return html`
      <form @submit=${this._handleSubmit}>
        <div class="form-group">
          <textarea name="query" placeholder="Describe your ideal flight..." @input=${this._handleInput}>
${this.flightParams.query}</textarea
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Earliest Departure</label>
            <input type="datetime-local" name="earliestDeparture" @input=${this._handleInput} />
          </div>
          <div class="form-group">
            <label>Latest Departure</label>
            <input type="datetime-local" name="latestDeparture" @input=${this._handleInput} />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Max Price</label>
            <input type="number" name="absolutePriceMax" min="0" @input=${this._handleInput} />
          </div>
          <div class="form-group">
            <label>Trip Duration (days)</label>
            <input type="number" name="maxTripDuration" min="1" max="30" @input=${this._handleInput} />
          </div>
        </div>

        <button type="submit">Search Flights</button>
      </form>
    `;
  }

  _handleInput(e) {
    const { name, value } = e.target;
    this.flightParams = {
      ...this.flightParams,
      [name]: name === "absolutePriceMax" || name === "maxTripDuration" ? Number(value) || null : value,
    };
  }

  _handleSubmit(e) {
    e.preventDefault();
    this.loading = true;

    /** @type {FlightSearchParams} */
    const searchParams = {
      engine: "google_flights",
      departure_id: "", // From AI
      arrival_id: "", // From AI
      outbound_date: this._formatDate(this.flightParams.earliestDeparture),
      return_date: this._formatDate(this.flightParams.earliestReturn),
      currency: "USD",
      max_price: String(this.flightParams.absolutePriceMax || ""),
      hl: "en",
      type: "1",
      adults: "1",
      api_key: serpApiKey,
    };

    // delete any fields that are empty
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key] === "") delete searchParams[key];
    });

    const url = `https://serpapi.com/search?${new URLSearchParams(searchParams)}`;
    appFetch(url, { method: "GET" }).then((res) => {
      console.log("API URL:", url);
      console.log("API Response:", res);
    });
  }

  _formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  }

  static styles = css`
    form {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
    }

    textarea {
      width: 100%;
      height: 150px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    button {
      padding: 10px 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background: #0056b3;
    }
  `;
}

customElements.define("flights-container", FlightsContainer);
