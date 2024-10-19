import { appendParamsObjToPath, decodeQuerystringValues, getRouteByPath } from "./router-util.js";
import { getSessionUser } from "../services/session.js";
import routes from "./routes.js";
import AppEvents from "../app-events.js";
import clientRoutes from "./routes.js";

export function go(path, params = null) {
  if (getRouteByPath(path, routes)) {
    window.history.pushState(null, null, params ? appendParamsObjToPath(path, params) : path);
    window.dispatchEvent(new CustomEvent(AppEvents.ROUTE_CHANGE));
  }
}

function checkRoutePermissions(routeObj) {
  const options = { sessionUser: getSessionUser() };
  let redirect = null;

  routeObj.permissions.forEach((p) => {
    redirect = p(options);
    if (redirect) return;
  });

  return redirect;
}

const componentLoader = (componentName) => import(`./../ui/views/${componentName}.js`);

export default (SuperClass) => {
  return class extends SuperClass {
    constructor() {
      super();
      this.history = [];
      this.bindEvents();
    }

    bindEvents() {
      window.addEventListener("load", () => this.urlChange(), false);
      window.addEventListener("popstate", () => this.urlChange(), false);
      window.addEventListener(AppEvents.ROUTE_CHANGE, () => this.urlChange(), false);
    }

    async urlChange() {
      const { pathname, search } = window.location;
      console.log(clientRoutes);
      // ts-ignore
      if (pathname === "/") return go(clientRoutes.LOGIN.path);

      const routeObj = getRouteByPath(pathname, routes);
      const redirectRoute = checkRoutePermissions(routeObj);
      if (!routeObj || redirectRoute) return go(redirectRoute.path);

      await componentLoader(routeObj.componentName).catch(console.error);

      const context = { params: decodeQuerystringValues(search) };
      this.updateHistory(routeObj, context);
      this.updateUI(routeObj, context);
    }

    updateHistory(routeObj, context) {
      this.history = [...this.history, { ...routeObj, context }];
      if (this.history.length > 10) this.history.length = 10;
    }

    async updateUI(nextView, context) {
      const component = document.createElement(nextView.componentName);

      try {
        if (component.routeEnter) await component.routeEnter({ nextView, context });
      } catch (error) {
        console.error(error);
      }

      // if (component.onGlobalsUpdate) {
      //   // @ts-ignore
      //   component.disconnectGlobals = window.Globals.onUpdate(component.onGlobalsUpdate.bind(component));
      // }

      const slot = this.shadowRoot.querySelector("slot");
      slot.innerHTML = "";
      slot.append(component);
    }
  };
};

// Prevent Chrome's popstate event on page load
(function () {
  let blockPopstateEvent = document.readyState !== "complete";
  window.addEventListener(
    "load",
    () =>
      setTimeout(() => {
        blockPopstateEvent = false;
      }, 0),
    false
  );
  window.addEventListener(
    "popstate",
    (evt) => {
      if (blockPopstateEvent && document.readyState === "complete") {
        evt.preventDefault();
        evt.stopImmediatePropagation();
      }
    },
    false
  );
})();
