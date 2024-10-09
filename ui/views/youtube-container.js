import { LitElement, html, css } from "../../lib/lit.js";

class YouTubeContainer extends LitElement {
  static properties = {
    videoUrl: { type: String },
    bookmarks: { type: Array },
    showPopup: { type: Boolean },
    tempBookmark: { type: Object },
    playerWidth: { type: Number },
    playerHeight: { type: Number },
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
      display: flex;
      align-items: center;
    }
    .bookmark-item a {
      flex-grow: 1;
      margin-right: 8px;
    }
    .delete-button {
      background-color: #ff4136;
      color: white;
      border: none;
      padding: 2px 6px;
      cursor: pointer;
      font-size: 12px;
    }
    .popup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border: 1px solid #ccc;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }
    .popup input {
      width: 100%;
      margin-bottom: 10px;
    }
  `;

  constructor() {
    super();
    this.videoUrl = "https://www.youtube.com/watch?v=Z9uMPYB74o0";
    this.bookmarks = [];
    this.showPopup = false;
    this.tempBookmark = null;
    this.playerWidth = 640;
    this.playerHeight = 360;
    this.loadBookmarks();
  }

  firstUpdated() {
    this.initializeYouTubePlayer();
    this.updatePlayerSize();
    window.addEventListener("resize", this.updatePlayerSize.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.updatePlayerSize.bind(this));
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
          (bookmark, index) => html`
            <div class="bookmark-item">
              <a href="#youtube" @click="${(e) => this.loadBookmark(e, bookmark)}">
                ${bookmark.memo ? `[${bookmark.memo}] ` : ""} ${bookmark.videoTitle} -
                ${this.formatTime(bookmark.timestamp)}
              </a>
              <button class="delete-button" @click="${() => this.deleteBookmark(index)}">Delete</button>
            </div>
          `
        )}
      </div>
      ${this.showPopup ? this.renderPopup() : ""}
    `;
  }

  updatePlayerSize() {
    const maxWidth = window.innerWidth - 32; // 32px for padding
    const maxHeight = window.innerHeight - 200; // Leave some space for controls and bookmarks
    const aspectRatio = 16 / 9;

    if (maxWidth / aspectRatio <= maxHeight) {
      this.playerWidth = maxWidth;
      this.playerHeight = maxWidth / aspectRatio;
    } else {
      this.playerHeight = maxHeight;
      this.playerWidth = maxHeight * aspectRatio;
    }

    if (this.player && this.player.setSize) {
      this.player.setSize(this.playerWidth, this.playerHeight);
    }
  }

  renderPopup() {
    return html`
      <div class="popup">
        <input
          type="text"
          id="memoInput"
          placeholder="Enter a memo for this bookmark"
          @keyup="${this.handleMemoKeyup}"
        />
        <button @click="${this.saveBookmarkWithMemo}">Save</button>
        <button @click="${this.closePopup}">Cancel</button>
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
      height: this.playerHeight,
      width: this.playerWidth,
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
      const videoTitle = this.player.getVideoData().title;
      this.tempBookmark = { videoId, timestamp, videoTitle };
      this.showPopup = true;
      this.requestUpdate();
      // Focus on the memo input after the popup is rendered
      setTimeout(() => this.shadowRoot.getElementById("memoInput").focus(), 0);
    }
  }

  handleMemoKeyup(e) {
    if (e.key === "Enter") {
      this.saveBookmarkWithMemo();
    }
  }

  saveBookmarkWithMemo() {
    const memoInput = this.shadowRoot.getElementById("memoInput");
    const memo = memoInput.value.trim();
    const bookmark = { ...this.tempBookmark, memo };
    this.bookmarks = [...this.bookmarks, bookmark];
    this.saveBookmarks();
    this.closePopup();
  }

  closePopup() {
    this.showPopup = false;
    this.tempBookmark = null;
  }

  loadBookmark(e, bookmark) {
    e.preventDefault();
    if (this.player) {
      this.player.loadVideoById(bookmark.videoId, bookmark.timestamp);
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

  deleteBookmark(index) {
    this.bookmarks = this.bookmarks.filter((_, i) => i !== index);
    this.saveBookmarks();
    this.requestUpdate();
  }
}

customElements.define("youtube-container", YouTubeContainer);
