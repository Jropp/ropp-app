import { LitElement, html, css } from "../../lib/lit.js";

class YouTubeContainer extends LitElement {
  static properties = {
    videoUrl: { type: String },
    bookmarks: { type: Array },
    showPopup: { type: Boolean },
    tempBookmark: { type: Object },
    playerWidth: { type: Number },
    playerHeight: { type: Number },
    playerLoaded: { type: Boolean },
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
    this.videoUrl = "";
    this.bookmarks = [];
    this.showPopup = false;
    this.tempBookmark = null;
    this.playerWidth = 640;
    this.playerHeight = 360;
    this.playerLoaded = false;
    this.loadBookmarks();
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadBookmarks();
    this.checkUrlParams();
  }

  firstUpdated() {
    this.updatePlayerSize();
    window.addEventListener("resize", this.updatePlayerSize.bind(this));
    this.checkUrlParams();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("resize", this.updatePlayerSize.bind(this));
  }

  render() {
    return html`
      <div>
        <input type="text" .value="${this.videoUrl}" @input="${this.handleInput}" placeholder="Enter YouTube URL" />
        <button @click="${this.loadVideo}">Load</button>
        ${this.playerLoaded ? html`<button @click="${this.addBookmark}">Bookmark</button>` : ""}
      </div>
      <div id="player"></div>
      ${this.renderBookmarks()} ${this.showPopup ? this.renderPopup() : ""}
    `;
  }

  renderBookmarks() {
    return html`
      <div class="bookmark-list">
        <h3>Bookmarks</h3>
        ${this.bookmarks.length > 0
          ? this.bookmarks.map(
              (bookmark, index) => html`
                <div class="bookmark-item">
                  <a href="#youtube" @click="${(e) => this.loadBookmark(e, bookmark)}">
                    ${bookmark.memo ? `[${bookmark.memo}] ` : ""} ${bookmark.videoTitle} -
                    ${this.formatTime(bookmark.timestamp)}
                  </a>
                  <button class="delete-button" @click="${() => this.deleteBookmark(index)}">Delete</button>
                </div>
              `
            )
          : html`<p>No bookmarks yet. Add some by playing a video and clicking "Bookmark".</p>`}
      </div>
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
    const videoId = this.getVideoId(this.videoUrl);
    if (videoId) {
      if (!this.playerLoaded) {
        this.initializeYouTubePlayer(videoId);
      } else {
        this.player.loadVideoById(videoId);
      }
      this.playerLoaded = true;
    } else {
      console.error("Invalid YouTube URL");
      // You might want to show an error message to the user here
    }
  }

  updateUrlWithParams(videoId, timestamp = 0, bookmarkId = null) {
    const url = new URL(window.location.href);
    let hashParts = url.hash.split("?");
    const baseHash = hashParts[0] || "#youtube";
    const params = new URLSearchParams();

    if (bookmarkId) {
      params.set("b", bookmarkId);
    } else if (videoId) {
      params.set("v", videoId);
      if (timestamp > 0) {
        params.set("t", timestamp.toString());
      }
    }

    url.hash = params.toString() ? `${baseHash}?${params.toString()}` : baseHash;
    window.history.replaceState({}, "", url);
  }

  initializeYouTubePlayer(videoId) {
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => this.createPlayer(videoId);
    } else {
      this.createPlayer(videoId);
    }
  }

  createPlayer(videoId) {
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
    if (this.pendingSeek !== undefined) {
      this.player.seekTo(this.pendingSeek);
      this.player.playVideo();
      delete this.pendingSeek;
    } else {
      event.target.playVideo();
    }
  }

  getVideoId(url) {
    try {
      const urlObj = new URL(url);
      const searchParams = new URLSearchParams(urlObj.search);
      return searchParams.get("v") || urlObj.pathname.split("/").pop();
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
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
    const bookmark = { ...this.tempBookmark, memo, id: Date.now().toString() };
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
    this.videoUrl = `https://www.youtube.com/watch?v=${bookmark.videoId}`;

    if (!this.player) {
      // If the player doesn't exist, initialize it with the bookmarked video
      this.initializeYouTubePlayer(bookmark.videoId);
      this.pendingSeek = bookmark.timestamp;
    } else {
      // If the player exists, load the bookmarked video
      this.player.loadVideoById(bookmark.videoId, bookmark.timestamp);
    }

    this.playerLoaded = true;
    this.updateUrlWithParams(null, null, bookmark.id);
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

  checkUrlParams() {
    const hashParams = new URLSearchParams(this.getAttribute("hash-params").split("?")[1] || "");
    const bookmarkId = hashParams.get("b");
    const videoId = hashParams.get("v");
    const timestamp = hashParams.get("t");

    if (bookmarkId) {
      const bookmark = this.bookmarks.find((b) => b.id === bookmarkId);
      if (bookmark) {
        this.videoUrl = `https://www.youtube.com/watch?v=${bookmark.videoId}`;
        this.loadVideo();
        this.pendingSeek = bookmark.timestamp;
      }
    } else if (videoId) {
      this.videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      this.loadVideo();
      if (timestamp) {
        const seekTo = parseInt(timestamp, 10);
        if (!isNaN(seekTo)) {
          this.pendingSeek = seekTo;
        }
      }
    }
  }

  updateUrlWithBookmarkId(bookmarkId) {
    const url = new URL(window.location.href);
    url.hash = `#youtube?bookmark=${bookmarkId}`;
    window.history.replaceState({}, "", url);
  }
}

customElements.define("youtube-container", YouTubeContainer);
