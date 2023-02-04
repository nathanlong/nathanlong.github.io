// debounce throttling to help control resizing events and prevent thrashing
// from: https://www.joshwcomeau.com/snippets/javascript/debounce/
//
// usage:
// const customFunction = debounce((ev) => { ... }, 250);
//
// note:
// register outside of the the event/observer loop to avoid reregistering the
// timeout every time the event fires

export const debounce = (callback, wait) => {
  let timeoutId = null
  return (...args) => {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args)
    }, wait)
  }
}
