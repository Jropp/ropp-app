const VERSION = "1.0.1";
self.addEventListener("install", function () {
  console.log("Service worker installing...");
  addResourcesToCache([
    "/ui/little-throbber.js",
    "/ui/tag-input.js",
    "/ui/views/user-dashboard.js",
    "/ui/views/conversations-container.js",
    "/ui/views/notes/note-detail.js",
    "/ui/views/user-settings.js",
    "/ui/views/login-container.js",
    "/ui/views/notes-container.js",
    "/ui/styles.js",
    "/cachelist.sh",
    "/index.html",
    "/app-enter.js",
    "/index.js",
    "/env.js",
    "/README.md",
    "/types.ts",
    "/lib/lit.js",
    "/lib/htmx.js",
    "/tsconfig.json",
    "/service-worker.js",
    "/services/user.service.js",
    "/services/session.js",
    "/services/prompt.service.js",
    "/services/notes.service.js",
    "/services/notes.model.js",
    "/services/model.js",
    "/services/app-fetch.js",
  ]).then(() => {
    console.log("Resources added to cache");
  });
});

self.addEventListener("activate", function () {
  console.log("Service worker activating...");
});

/** @param {string[]} resources */
async function addResourcesToCache(resources) {
  const cache = await caches.open(VERSION);
  await cache.addAll(resources);
}
