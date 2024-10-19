export default class ComponentBase extends HTMLElement {
  constructor() {
    super();
    this._properties = {};
    this._listeners = [];
    this._skipNextRender = false;
    this._initialRenderDone = false;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    if (!this._initialRenderDone) {
      this.render();
      this._initialRenderDone = true;
    }
  }

  getBoundProperties() {
    const boundProperties = {};
    // Capture instance properties (class fields)
    Object.getOwnPropertyNames(this).forEach((prop) => {
      if (prop.startsWith("__")) boundProperties[prop.replace("__", "")] = this[prop];
    });

    return boundProperties;
  }

  initProperties() {
    const props = this.getBoundProperties();
    Object.entries(props).forEach(([name, descriptor]) => {
      // Provide a default object if descriptor is null
      let { type, value, urlParam } = descriptor || { type: String, value: "", urlParam: undefined };

      if (type === Number && value == undefined) {
        value = 0;
      }

      const urlValue = this.getUrlParamValue(urlParam);
      this._properties[name] = {
        type,
        value: urlValue !== null ? type(urlValue) : value !== undefined ? type(value) : undefined,
        urlParam,
      };
      Object.defineProperty(this, name, {
        get: () => this._properties[name].value,
        set: (newValue) => {
          this.updateProperty(name, type(newValue));
        },
        configurable: true,
        enumerable: true,
      });
    });

    this.requestUpdate();
  }

  getUrlParamValue(urlParam) {
    if (!urlParam) return null;
    const url = new URL(window.location.href);
    const value = url.searchParams.get(urlParam);
    return value !== null ? decodeURIComponent(value) : null;
  }

  updateProperty(name, value) {
    if (name in this._properties) {
      this._properties[name].value = value;
      this.requestUpdate();
      this.updateUrlParam(name, value);
      this.dispatchEvent(
        new CustomEvent("property-changed", {
          detail: { name, value },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  updateUrlParam(name, value) {
    const { urlParam } = this._properties[name];
    if (urlParam == false || urlParam) {
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set(urlParam, encodeURIComponent(value));
      } else {
        url.searchParams.delete(urlParam);
      }
      window.history.replaceState({}, "", url);
    }
  }

  requestUpdate() {
    if (!this._updateRequested) {
      this._updateRequested = true;
      Promise.resolve().then(() => {
        this._updateRequested = false;
        if (!this._skipNextRender) {
          this.render();
          this.addEventListeners();
        }
        this._skipNextRender = false;
      });
    }
  }

  skipNextRender() {
    this._skipNextRender = true;
  }

  render() {
    // To be implemented by subclasses
  }

  addEventListeners() {
    this._listeners.forEach(({ event, selector, handler }) => {
      const element = this.shadowRoot.querySelector(selector);
      if (element) {
        element.addEventListener(event, handler.bind(this));
      }
    });
  }

  set listeners(value) {
    this._listeners = value;
    this.addEventListeners();
  }

  update(updates, skipRender = false) {
    Object.entries(updates).forEach(([name, value]) => {
      if (name in this._properties) {
        this._properties[name].value = this._properties[name].type(value);
        this.updateUrlParam(name, value);
        this.dispatchEvent(
          new CustomEvent("property-changed", {
            detail: { name, value },
            bubbles: true,
            composed: true,
          })
        );
      }
    });

    if (!skipRender) {
      this.requestUpdate();
    }
  }
}
