export default class LinkButton {
  constructor(el) {
    this.el = el;
    this.bindEvents()
  }

  bindEvents() {
    this.el.addEventListener('keydown', this.handleKeypress, false)
  }

  // from https://www.tempertemper.net/blog/when-design-breaks-semantics
  // allow button links to behave like buttons, allow space to activate
  handleKeypress = (e) => {
    const code = e.charCode || e.keyCode;
    if (code === 32) {
      e.preventDefault();
      this.el.click();
    }
  }

  cleanUp() {
    this.el.removeEventListener('keydown', this.handleKeypress())
  }
}
