const P = {
  type: "text",
  text: "",
};

const H1 = {
  type: "h1",
  text: "",
};

const H2 = {
  type: "h2",
  text: "",
};

/** @param {string} text */
export function parseText(text) {
  const h1 = "# ";
  const h2 = "## ";

  return text.split(/\n/).map((line) => {
    line = line.trim();
    if (line.trim().startsWith(h1)) {
      return {
        ...H1,
        text: line.replace(h1, ""),
      };
    }
    if (line.trim().startsWith(h2)) {
      return {
        ...H2,
        text: line.replace(h2, ""),
      };
    }
    return {
      ...P,
      text: line,
    };
  });
}
/**
 * @param {HTMLElement} displayEl
 * @param {Array<Object>} textConfig
 * @returns {HTMLElement}
 * */
export function displayText(textConfig, displayEl = document.createElement("div")) {
  displayEl.innerHTML = "";
  textConfig.forEach((item) => {
    const el = document.createElement(item.type);
    el.innerText = item.text;
    displayEl.appendChild(el);
  });

  return displayEl;
}
