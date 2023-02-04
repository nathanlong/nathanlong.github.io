import { debounce } from '../util/debounce.js'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from '../vendor/bodyScrollLock.esm.js'

export default class Nav {
  constructor(el) {
    this.el = el
    this.setVars()
    this.bindEvents()
    this.buildAnimations()
  }

  // animation keyframe values
  openingUp = [
    { transform: 'translateY(10px)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 },
  ]

  openingNav = [
    { transform: 'translateY(-2rem)', opacity: 0 },
    { transform: 'translateY(0)', opacity: 1 },
  ]

  // animation keyframe options
  defaultTiming = {
    duration: 500,
    fill: 'both',
    iterations: 1,
    easing: 'cubic-bezier(0.33, 1, 0.68, 1)', //easeOutCubic
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
    this.navTarget = this.el.querySelector('[data-nav-target]')
    this.prefTrigger = this.el.querySelector('[data-pref-trigger]')
    this.prefTarget = this.el.querySelector('[data-pref-target]')
    this.mobileTrigger = this.el.querySelector('[data-mobile-trigger]')
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const _entry of entries) {
        this.debouncedClear()
      }
    })
  }

  bindEvents() {
    window.addEventListener('click', this.checkClickOutside, false)
    this.prefTrigger.addEventListener('click', this.togglePrefs.bind(this))
    this.mobileTrigger.addEventListener('click', this.toggleMobile.bind(this))
    this.resizeObserver.observe(this.el)
    window.addEventListener('keydown', this.handleKeyDown)
  }

  buildAnimations() {
    const keyframesPref = new KeyframeEffect(
      this.prefTarget,
      this.openingUp,
      this.defaultTiming
    )
    this.prefAnimation = new Animation(keyframesPref, document.timeline)

    const keyframesMobile = new KeyframeEffect(
      this.navTarget,
      this.openingNav,
      this.defaultTiming
    )
    this.mobileAnimation = new Animation(keyframesMobile, document.timeline)
  }

  togglePrefs = () => {
    if (this.prefOpen) {
      this.prefTrigger.ariaPressed = false
      if (this.motionPref) {
        this.prefAnimation.playbackRate = -1
        this.prefAnimation.play()
        this.prefAnimation.finished.then(() => {
          this.el.dataset.pref = 'false'
        })
      } else {
        this.el.dataset.pref = 'false'
      }
    } else {
      this.el.dataset.pref = 'true'
      this.prefTrigger.ariaPressed = true
      if (this.motionPref) {
        this.prefAnimation.playbackRate = 1
        this.prefAnimation.play()
      }
    }
  }

  toggleMobile = () => {
    if (this.mobileOpen) {
      // close
      if (this.motionPref) {
        this.mobileAnimation.playbackRate = -1
        this.mobileAnimation.play()
        this.mobileAnimation.finished.then(() => {
          this.el.dataset.mobile = false
        })
      } else {
        this.el.dataset.mobile = false
      }
      enableBodyScroll(this.navTarget)
    } else {
      // open
      this.el.dataset.mobile = true
      if (this.motionPref) {
        this.mobileAnimation.playbackRate = 1
        this.mobileAnimation.play()
      }
      disableBodyScroll(this.navTarget)
    }
  }

  checkClickOutside = (e) => {
    if (this.prefTarget.dataset.state === 'closed') {
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

    // NOTE: may need better normalization of keycodes? 27 = ESC (mostly)
    if (e.keyCode === 27) {
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
