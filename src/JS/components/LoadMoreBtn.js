export default class LoadMoreBtn {
  constructor(selector, isHidden) {
    this.button = this.getButton(selector);
  }

  getButton(selector) {
    return document.querySelector(selector);
  }
}
