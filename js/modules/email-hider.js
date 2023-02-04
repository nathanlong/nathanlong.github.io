export default class EmailHider {
  constructor(el) {
    this.el = el
    this.renderAddress()
  }

  // from: https://www.matthewthom.as/blog/stop-email-scraping/
  // this script will attempt to obfuscate email from ze bots (theoretically)
  // but still allow humans to see my email
  //
  // Usage: <a data-module="email-hider"></a>
  renderAddress() {
    var me = 'nlong5+blog'
    var place = 'gmail.com'
    this.el.href = `mailto:${me}@${place}`
    this.el.innerHTML = `${me}@${place}`
  }
}
