import { LitElement, html, css } from "../../lib/lit.js";

class YouTubeContainer extends LitElement {
  static properties = {
    videoUrl: { type: String },
    bookmarks: { type: Array },
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
    .bookmark-list {
      margin-top: 16px;
    }
    .bookmark-item {
      margin-bottom: 8px;
    }
  `;

  constructor() {
    super();
    this.videoUrl = "https://www.youtube.com/watch?v=Z9uMPYB74o0";
    this.bookmarks = [];
    this.loadBookmarks();
  }

  firstUpdated() {
    this.initializeYouTubePlayer();
  }

  render() {
    return html`
      <div>
        <input type="text" .value="${this.videoUrl}" @input="${this.handleInput}" />
        <button @click="${this.loadVideo}">Load</button>
        <button @click="${this.addBookmark}">Bookmark</button>
      </div>
      <div id="player"></div>
      <div class="bookmark-list">
        <h3>Bookmarks</h3>
        ${this.bookmarks.map(
          (bookmark) => html`
            <div class="bookmark-item">
              <a href="#youtube" @click="${(e) => this.loadBookmark(e, bookmark)}">
                ${bookmark.videoId} - ${this.formatTime(bookmark.timestamp)}
              </a>
            </div>
          `
        )}
      </div>
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

  addBookmark() {
    if (this.player) {
      const videoId = this.player.getVideoData().video_id;
      const timestamp = Math.floor(this.player.getCurrentTime());
      const bookmark = { videoId, timestamp };
      this.bookmarks = [...this.bookmarks, bookmark];
      this.saveBookmarks();
    }
  }

  loadBookmark(e, bookmark) {
    e.preventDefault(); // Prevent default link behavior
    if (this.player) {
      this.player.loadVideoById(bookmark.videoId, bookmark.timestamp);
      // Update the URL hash
      window.location.hash = `youtube?v=${bookmark.videoId}&t=${bookmark.timestamp}`;
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  saveBookmarks() {
    localStorage.setItem("youtubeBookmarks", JSON.stringify(this.bookmarks));
  }

  loadBookmarks() {
    const savedBookmarks = localStorage.getItem("youtubeBookmarks");
    if (savedBookmarks) {
      this.bookmarks = JSON.parse(savedBookmarks);
    }
  }
}

customElements.define("youtube-container", YouTubeContainer);
