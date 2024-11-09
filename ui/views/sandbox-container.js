//@ts-nocheck

import { LitElement, html, css } from "../../lib/lit.js";
import { card } from "./card.js";

class SandboxElement extends LitElement {
  static properties = {
    loading: { type: Boolean },
    executionTime: { type: String },
    testData: { type: Array },
    hasData: { type: Boolean },
    queryPerformance: { type: Array },
    initializing: { type: Boolean },
  };

  constructor() {
    super();
    this.userRoles = [];
    this.userPermissions = [];
    this.user = "";
    this.newRole = "";
    this.addRoleResult = "";
    this.db = null;
    this.loading = false;
    this.executionTime = "";
    this.testData = null;
    this.hasData = false;
    this.queryPerformance = [];
    this.initializing = false;
    this.worker = new Worker("/ui/workers/sql-worker.js");
    this.queryDebounceTimer = null;

    this.worker.onmessage = (e) => {
      const { type, result, error, executionTime } = e.data;

      switch (type) {
        case "queryResult":
          console.log("Query Result:", result);
          const endTime = performance.now();
          if (result && result.length > 0) {
            this.queryPerformance = [
              {
                query: this.lastQuery,
                time: Math.round(endTime - this.queryStartTime),
                l: result[0]?.values?.length,
                timestamp: new Date().toLocaleTimeString(),
              },
              ...this.queryPerformance,
            ].slice(0, 5);
          }
          this.testData = result;
          break;

        case "createTestDataResult":
          this.executionTime = `Execution time: ${executionTime} seconds`;
          this.loading = false;
          this.hasData = true;
          break;

        case "error":
          console.error("Worker error:", error);
          this.loading = false;
          break;
      }

      this.requestUpdate();
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    this.worker.postMessage({ type: "init" });
  }

  async createTestData() {
    this.initializing = true;
    this.requestUpdate();
    await new Promise((resolve) => setTimeout(resolve, 50)); // Let UI update

    this.loading = true;
    this.executionTime = "";

    const names = ["Alice", "Bob", "Charlie", "David", "Eve"];
    const testJson = JSON.stringify(card);

    this.worker.postMessage({
      type: "createTestData",
      data: { names, testJson },
    });
  }

  deleteTestData() {
    this.worker.postMessage({ type: "deleteTestData" });
    this.executionTime = "";
    this.hasData = false;
    this.testData = null;
    this.queryPerformance = [];
    this.requestUpdate();
  }

  handleQuery(e) {
    const query = e.target.value;
    if (!query) return;

    clearTimeout(this.queryDebounceTimer);

    this.queryDebounceTimer = setTimeout(() => {
      this.lastQuery = query;
      this.queryStartTime = performance.now();
      this.worker.postMessage({ type: "query", data: { query } });
    }, 3000);
  }

  render() {
    return html`
      <div class="container">
        ${!this.hasData
          ? html`
              <div class="action-panel">
                <button
                  class="primary-btn"
                  @click=${this.createTestData}
                  ?disabled=${this.loading || this.initializing}
                >
                  ${this.initializing
                    ? "Initializing DB..."
                    : this.loading
                    ? html`<span class="spinner"></span> Creating...`
                    : "Create 100,000 Test Rows"}
                </button>
              </div>
            `
          : ""}
        ${this.hasData
          ? html`
              <div class="query-container">
                <textarea
                  class="query-input"
                  @keyup=${this.handleQuery}
                  placeholder="Enter your SQL query here..."
                  rows="3"
                ></textarea>

                ${this.queryPerformance.length
                  ? html`
                      <div class="query-history">
                        ${this.queryPerformance.map(
                          (p) => html`
                            <div class="query-item">
                              <div class="query-info">
                                <code>${p.query}</code>
                                <span class="result-count">${p.l} rows</span>
                              </div>
                              <span class="time">${p.time}ms</span>
                            </div>
                          `
                        )}
                      </div>
                    `
                  : ""}
              </div>
              <button class="danger-btn clear-btn" @click=${this.deleteTestData}>Clear Database</button>
            `
          : ""}
      </div>
    `;
  }

  static styles = css`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .query-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .query-input {
      width: 100%;
      padding: 16px;
      border: none;
      border-bottom: 1px solid #eee;
      font-family: monospace;
      font-size: 14px;
      resize: none;
      box-sizing: border-box;
    }

    .query-input:focus {
      outline: none;
    }

    .query-history {
      max-height: 300px;
      overflow-y: auto;
    }

    .query-item {
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      gap: 16px;
    }

    .query-item code {
      font-family: monospace;
      font-size: 13px;
    }

    .time {
      color: #10b981;
      font-size: 13px;
      font-weight: 500;
    }

    .clear-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 8px 16px;
      border: 2px solid #000;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      z-index: 1000;
    }

    .clear-btn:hover {
      background: #000;
      color: white;
    }

    .primary-btn {
      padding: 12px 24px;
      border: 2px solid #000;
      background: white;
      border-radius: 8px;
      cursor: pointer;
    }

    .primary-btn:hover {
      background: #000;
      color: white;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #000;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .query-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .result-count {
      color: #666;
      font-size: 13px;
    }
  `;
}

customElements.define("sandbox-container", SandboxElement);
