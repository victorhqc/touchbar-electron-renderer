import TouchBarText from './TouchBarText';

class TouchBarColor {
  constructor(text) {
    this.text = text;
  }

  // Text can have only one child.
  appendChild(text) {
    if (
      !text
      && typeof text !== 'string'
      && !text instanceof TouchBarText
    ) {
      console.warn(`<color /> child should be string, but received ${typeof text}`);
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

export default TouchBarColor;
