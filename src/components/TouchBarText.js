class TouchBarText {
  constructor(text) {
    this.text = text;
  }

  // Text can have only one child.
  appendChild(text) {
    if (!text || typeof text !== 'string') {
      return;
    }

    this.text = text;
  }

  insertBefore(text) {
    return this.appendChild(text);
  }

  replaceText(text) {
    return this.appendChild(text);
  }

  removeChild() {
    this.text = null;
  }

  createInstance() {
    return this.text;
  }
}

export default TouchBarText;
