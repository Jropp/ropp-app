import { LitElement, html, css } from "../lib/lit.js";

class WorkoutTimer extends LitElement {
  static properties = {
    duration: { type: Number },
    timePassed: { type: Number },
  };

  constructor() {
    super();
    this.duration = 0;
    this.timePassed = 0;
    this.interval = null;
  }

  render() {
    const percentage = (this.timePassed / this.duration) * 100;
    const minutes = Math.floor(this.timePassed / 60);
    const seconds = this.timePassed % 60;
    const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    return html`
      <div class="footer">
        <div class="progress-bar" style="width: ${percentage}%;"></div>
        <div id="timer">${timeStr}</div>
      </div>
    `;
  }

  startTimer(duration) {
    this.duration = duration;
    this.timePassed = 0;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.timePassed++;
      this.requestUpdate();
      if (this.timePassed >= this.duration) {
        clearInterval(this.interval);
        this.dispatchEvent(
          new CustomEvent("timer-complete", {
            bubbles: true,
            composed: true,
          })
        );
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      position: relative;
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #f1f1f1;
      text-align: center;
      padding: 10px;
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      box-sizing: border-box;
    }
    .progress-bar {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background-color: #2196f3;
      opacity: 0.3;
      transition: width 1s linear;
    }
  `;
}

customElements.define("workout-timer", WorkoutTimer);
