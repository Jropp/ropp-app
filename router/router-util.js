/**
 * Traverses the given routes object and returns the route object that matches the given path.
 * @param {string} path - The path to match.
 * @param {Object<string,Route>} routes - The routes object to traverse.
 * @returns {Route|null} - The matching route object or null if no match is found.
 */
export function getRouteByPath(path, routes) {
  // Try to find a direct match first
  const match = Object.values(routes).find((route) => route.pathRegexp.test(path));
  if (match) return match;

  // Otherwise, recursively search the children of each route
  for (const route of Object.values(routes)) {
    if (route.children) {
      const childMatch = getRouteByPath(path, route.children);
      if (childMatch) return childMatch;
    }
  }

  // No match found
  return null;
}

/**
 * @param {string} path
 * @param {Object<string, *>} params
 * @returns {string} the path with params appended
 * */
export function appendParamsObjToPath(path, params = {}) {
  // Check if path already has params before appending
  const querySymbol = path.includes("?") ? "&" : "?";
  return `${path}${querySymbol}${new URLSearchParams(params).toString()}`;
}

/**
 * @param {string} querystring
 * @returns {Object<string, *>}
 * */
export function decodeQuerystringValues(querystring) {
  const paramMap = new URLSearchParams(querystring.replace("?", ""));
  return Array.from(paramMap.entries()).reduce((params, [key, val]) => {
    return {
      ...params,
      [key]: _normalizeQsValue(val),
    };
  }, {});
}

/**
 * @description ensure boolean/number values instead of boolean/number string
 * @param {string} param
 * @returns {*}
 */
export function _normalizeQsValue(param) {
  if (param.includes(",")) return _arrayFromQsList(param);
  if (param.toLowerCase() === "true") return true;
  if (param.toLowerCase() === "false") return false;
  if (param === "null") return null;
  if (param === "undefined") return undefined;
  // @ts-ignore
  // Check if value is string number
  if (!isNaN(param)) return +param;

  return param;
}

/**
 * @description converts a querystring value a,b,c to an array [a,b,c]
 * Recursively calls _normalizeQsValue to ensure proper type for items in array
 * @param {string} value
 * @returns {Array<*>}
 */
export function _arrayFromQsList(value) {
  return value.split(",").map(_normalizeQsValue);
}
