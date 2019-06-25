import uuidv4 from 'uuid/v4';

class TouchBarText {
  constructor(text) {
    this.id = uuidv4();
    this.appendChild(text);
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
