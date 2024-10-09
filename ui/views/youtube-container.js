import { LitElement, html, css } from "../../lib/lit.js";

class YouTubeContainer extends LitElement {
  static properties = {
    videoUrl: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
    input {
      width: 300px;
      margin-right: 8px;
    }
    #player {
      margin-top: 16px;
    }
  `;

  constructor() {
    super();
    this.videoUrl = "https://www.youtube.com/watch?v=Z9uMPYB74o0";
  }

  firstUpdated() {
    this.initializeYouTubePlayer();
  }

  render() {
    return html`
      <div>
        <input type="text" .value="${this.videoUrl}" @input="${this.handleInput}" />
        <button @click="${this.loadVideo}">Load</button>
      </div>
      <div id="player"></div>
    `;
  }

  handleInput(e) {
    this.videoUrl = e.target.value;
  }

  loadVideo() {
    if (this.player) {
      const videoId = this.getVideoId(this.videoUrl);
      this.player.loadVideoById(videoId);
    }
  }

  initializeYouTubePlayer() {
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = this.createPlayer.bind(this);
    } else {
      this.createPlayer();
    }
  }

  createPlayer() {
    const videoId = this.getVideoId(this.videoUrl);
    this.player = new YT.Player(this.shadowRoot.getElementById("player"), {
      height: "360",
      width: "640",
      videoId: videoId,
      events: {
        onReady: this.onPlayerReady.bind(this),
      },
    });
  }

  onPlayerReady(event) {
    event.target.playVideo();
  }

  getVideoId(url) {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get("v");
  }
}

customElements.define("youtube-container", YouTubeContainer);
