/**
 * @typedef {Object} Todo
 * @property {number} id - The unique identifier for the todo item
 * @property {string} text - The text content of the todo item
 * @property {boolean} completed - Whether the todo item is completed or not
 */

/**
 * @typedef {Object} Person
 * @property {number} [id] - The unique identifier for the person
 * @property {string} firstName - The first name of the person
 * @property {string} lastName - The last name of the person
 * @property {string} [email] - The email address of the person
 * @property {string} [phone] - The phone number of the person
 * @property {number} [birthDate] - The birth date of the person
 * @property {string} [address] - The address of the person
 * @property {string} [address2] - The address line 2 of the person
 * @property {string} [city] - The city of the person
 * @property {string} [state] - The state of the person
 * @property {string} [zipCode] - The zip code of the person
 * @property {number} [createdAt] - The creation date of the person
 * @property {number} [updatedAt] - The update date of the person
 */

/**
 * @typedef {Object} Conversation
 * @property {number} id - The unique identifier for the conversation
 * @property {number} personId - The unique identifier for the person
 * @property {string} content - The content of the conversation
 * @property {string} tags - The tags of the conversation
 * @property {number} createdAt - The creation date of the conversation
 * @property {number} updatedAt - The update date of the conversation
 */

/** @typedef {Object<string, string>} Paths */

/**
 * @typedef {Object} Route
 * @property {string} [id] - The route id
 * @property {string} [path] - The route path
 * @property {RegExp} [pathRegexp] - A Regexp used to match the route to its path
 * @property {string} [componentPath] - The path to the component in the views folder
 * @property {string} [componentName] - The name of the web-component
 * @property {boolean} [isPublic] - Public routes can be accessed by users that aren't logged in.
 * @property {boolean} [showNav] - Whether or not the nav bar should be shown for the route.
 * @property {boolean} [showHeader] - Whether or not the header should be shown for the route.
 * @property {boolean} [showHeaderQuickNav] - Whether or not the header quick nav should be shown for the route that has login or home icon.
 * @property {boolean} [showBackArrow] - Whether or not the header back navigation arrow should be shown in a sub route
 * @property {*} [permissions] - The permissions required to access the route.
 * @property {Object<string, Route>} [children] - The child routes of the route.
 * @property {Route['path']} [backArrowLocation] - The path to navigate to when the back arrow is clicked.
  
 */

/**
 * @typedef {Object} NewRouteContext
 * @property {ContextParams}  params
 * @property {string}         path
 */

/**
 * @typedef {HTMLElement & {
 *  routeEnter?: (arg0: RouteEnterArgs) => void
 *  onGlobalsUpdate?: (arg0: *) => void
 *  disconnectGlobals?: Function
 * }} RouteContainerComponent
 */

/**
 * @typedef {(arg0: PermissionParams) => Route | null} PermissionCheck
 */

/**
 * @typedef {Object} PermissionParams
 * @property {SessionUser} sessionUser
 */

/**
 * @typedef {Object} RouteContext
 * @property {string}         canonicalPath
 * @property {string}         hash
 * @property {boolean}        init
 * @property {Object}         page
 * @property {ContextParams}  params
 * @property {string}         path
 * @property {string}         pathname
 * @property {string}         querystring
 * @property {string}         routePath
 * @property {Object}         state
 * @property {string}         title
 */

/**
 * @typedef {Object} OptionalParams
 * @property {string} [email]
 */

/**
 * @typedef {{nextView: Route, context: RouteContext}} RouteEnterArgs
 */

/**
 * @typedef {OptionalParams & Object<string, *>} ContextParams
 */
