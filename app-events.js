/**
 * @typedef {{
 *  GLOBALS_UPDATED: 'app:globals-updated',
 *  HASH_CHANGE: 'app:hashchange',
 *  ROUTE_CHANGE: 'app:routechange',
 *  URL_UPDATED: 'URL_UPDATED',
 *  PAGE_LOAD: 'load',
 *  TOAST: 'toast-fired'
 *  SET_BACK_ARROW: 'set-back-arrow',
 * }} AppEvents
 */

/** @type {AppEvents} */
const AppEvents = {
  GLOBALS_UPDATED: "app:globals-updated",
  HASH_CHANGE: "app:hashchange",
  ROUTE_CHANGE: "app:routechange",
  URL_UPDATED: "URL_UPDATED",
  PAGE_LOAD: "load",
  TOAST: "toast-fired",
  SET_BACK_ARROW: "set-back-arrow",
};

export default AppEvents;
