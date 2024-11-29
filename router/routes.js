import { pathToRegexp } from "../lib/path-to-regexp.js";

/**
 * @param {string} path
 * @returns {string}
 */
export function getComponentName(path) {
  const trimmedPath = path.startsWith("/") ? path.slice(1) : path;
  // replace underscores with dashes
  return `${trimmedPath.replace(/_/g, "-")}-container`;
}

/**
 * Processes a single route object and adds the pathToRegexp property.
 * @param {string} key - The key of the route object.
 * @param {Route} route - The route object to process.
 * @param {Route|null} parent - The parent route object.
 * @returns {Route} - The processed route object.
 */
export function processRoute(key, route, parent = null) {
  route.id = route.id || key;
  const path = route.path || `/${key.toLowerCase().replace(/_/g, "-")}`;
  const componentName = getComponentName(path);

  const processed = {
    id: route.id,
    path,
    parent,
    pathRegexp: pathToRegexp(path),
    componentName,
    permissions: route.permissions || [],
    children: route.children || {},
  };

  processed.children = processRoutes(processed.children, processed);
  return processed;
}

function processRoutes(routes, parentRoute = null) {
  return Object.entries(routes).reduce((acc, [key, route]) => {
    acc[key] = processRoute(key, route, parentRoute);
    return acc;
  }, {});
}

/** @type {Record<string, Route>} */
const clientRoutes = processRoutes({
  LOGIN: {
    showHeader: true,
  },
  SIGNUP: {
    showHeader: true,
  },
  DASHBOARD: {},
  PEOPLE: {},
  WORKOUTS: {
    public: true,
  },
  BLOG: {},
  BLOG_ADMIN: {},
  PROJECT_BOARD: {
    public: true,
  },
  NOTES: {},
  YOUTUBE: {
    public: true,
  },
  FLIGHTS: {
    public: true,
  },
  SANDBOX: {
    public: true,
  },
});

export default clientRoutes;
