import { debounce } from '../util/debounce.js'
import {
  disableBodyScroll,
  enableBodyScroll,
} from '../vendor/bodyScrollLock.esm.js'

// Constants
const BREAKPOINT = '(min-width: 576px)';
const ANIMATION_TIMING = {
  duration: 500,
  fill: 'both',
  iterations: 1,
  easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
};
const ANIMATION_UP = [
  { transform: 'translateY(1rem)', opacity: 0 },
  { transform: 'translateY(0)', opacity: 1 },
];
const ANIMATION_DOWN = [
  { transform: 'translateY(-2rem)', opacity: 0 },
  { transform: 'translateY(0)', opacity: 1 },
];


export default class Nav {
  constructor(el) {
    this.el = el
    this.setVars()
    this.bindEvents()
    this.buildAnimations()
  }

  get motionPref() {
    return (
      getComputedStyle(document.documentElement).getPropertyValue(
        '--play-state'
      ) === 'running'
    )
  }

  get mobileOpen() {
    return this.el.dataset.mobile === 'true'
  }

  get prefOpen() {
    return this.el.dataset.pref === 'true'
  }

  setVars() {
    this.mql = window.matchMedia(BREAKPOINT)
    this.navTarget = this.el.querySelector('[data-nav-target]')
    this.prefTrigger = this.el.querySelector('[data-pref-trigger]')
    this.prefTarget = this.el.querySelector('[data-pref-target]')
    this.mobileTrigger = this.el.querySelector('[data-mobile-trigger]')
    this.focusableEls = this.el.querySelectorAll(
      'a[href]:not([disabled]), a[href]:not(.skip-link), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    )
    this.focusFirst = this.focusableEls[0]
    this.focusLast = this.focusableEls[this.focusableEls.length - 1]

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const _entry of entries) {
        if (this.mql.matches) {
          this.debouncedClear()
        }
      }
    })
  }

  bindEvents() {
    window.addEventListener('click', this.checkClickOutside)
    this.prefTrigger.addEventListener('click', this.togglePrefs.bind(this))
    this.mobileTrigger.addEventListener('click', this.toggleMobile.bind(this))
    this.resizeObserver.observe(this.el)
    window.addEventListener('keydown', this.handleKeyDown)
  }

  buildAnimations() {
    const keyframesPref = new KeyframeEffect(
      this.prefTarget,
      ANIMATION_UP,
      ANIMATION_TIMING
    )
    this.prefAnimation = new Animation(keyframesPref, document.timeline)

    const keyframesMobile = new KeyframeEffect(
      this.navTarget,
      ANIMATION_DOWN,
      ANIMATION_TIMING
    )
    this.mobileAnimation = new Animation(keyframesMobile, document.timeline)
  }

  togglePrefs = () => {
    const isOpen = this.prefOpen
    this.prefTrigger.ariaPressed = !isOpen
    if (this.motionPref) {
      // we have to set the data attr first if it's not open
      !isOpen ? this.el.dataset.pref = 'true' : null
      this.prefAnimation.playbackRate = isOpen ? -1 : 1
      this.prefAnimation.play()
      this.prefAnimation.finished.then(() => {
        this.el.dataset.pref = isOpen ? 'false' : 'true'
      })
    } else {
      this.el.dataset.pref = isOpen ? 'false' : 'true'
    }
  }

  toggleMobile = () => {
    const isOpen = this.mobileOpen
    this.mobileTrigger.ariaPressed = !isOpen
    this.el.dataset.mobile = !isOpen
    if (this.motionPref) {
      isOpen ? this.el.dataset.mobile = true : null
      this.mobileAnimation.playbackRate = isOpen ? -1 : 1
      this.mobileAnimation.play()
      this.mobileAnimation.finished.then(() => {
        if (!isOpen) {
          this.navTarget.focus()
        } else {
          this.el.dataset.mobile = false;
        }
      })
    } else {
      this.el.dataset.mobile = !isOpen
    }
    if (isOpen) {
      enableBodyScroll(this.navTarget)
      this.el.removeEventListener('keydown', this.focusTrap)
      document.activeElement.blur()
    } else {
      disableBodyScroll(this.navTarget)
      this.el.addEventListener('keydown', this.focusTrap)
    }
  }

  focusTrap = (e) => {
    const isTabPressed = e.key === 'Tab' || e.keyCode === '9'
    const isEscapedPressed = e.key === 'Escape' || e.keyCode === '27'

    if (isEscapedPressed) {
      this.toggleMobile();
    }

    if (!isTabPressed) {
      return
    }

    if (e.shiftKey) {
      //shift + tab
      if (document.activeElement === this.focusFirst) {
        this.focusLast.focus()
        e.preventDefault()
      }
    } else {
      // tab
      if (document.activeElement === this.focusLast) {
        this.focusFirst.focus()
        e.preventDefault()
      }
    }

  }

  checkClickOutside = (e) => {
    if (this.el.dataset.pref === 'false') {
      return
    }

    if (
      !this.prefTarget.contains(e.target) &&
      !this.prefTrigger.contains(e.target)
    ) {
      this.togglePrefs()
    }
  }

  // close nav on Escape press if nav is open
  handleKeyDown = (e) => {
    if (!this.prefOpen) {
      return
    }

    if (e.key === 'Escape' || e.keyCode === '27') {
      this.clearNavs()
    }
  }

  clearNavs() {
    this.clearEffects()

    if (this.mobileOpen) {
      this.toggleMobile()
    }

    if (this.prefOpen) {
      this.togglePrefs()
    }
  }

  debouncedClear = debounce(() => this.clearEffects(), 300)

  clearEffects() {
    this.prefAnimation.cancel()
    this.mobileAnimation.cancel()
  }
}
