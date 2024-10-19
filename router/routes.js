import { pathToRegexp } from "../lib/path-to-regexp.js";

/**
 * @param {string} path
 * @returns {string}
 */
export function getComponentName(path) {
  const trimmedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${trimmedPath.replace(/\//g, "-")}-container`;
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
  const path = route.path || `/${key.toLowerCase()}`;
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

  console.log(`Processing route: ${key}`, processed);

  processed.children = processRoutes(processed.children, processed);
  return processed;
}

function processRoutes(routes, parentRoute = null) {
  console.log(`Processing routes:`, routes);
  return Object.entries(routes).reduce((acc, [key, route]) => {
    acc[key] = processRoute(key, route, parentRoute);
    return acc;
  }, {});
}

const clientRoutes = processRoutes({
  LOGIN: {
    showHeader: true,
  },
  SIGNUP: {
    showHeader: true,
  },
  DASHBOARD: {},
  WORKOUTS: {},
  BLOG: {},
  BLOG_ADMIN: {},
  NOTES: {},
});

console.log("Final processed routes:", clientRoutes);

export default clientRoutes;
