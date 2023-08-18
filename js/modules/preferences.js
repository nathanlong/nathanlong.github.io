export default class preferences {
  constructor(el) {
    this.el = el
    this.setVars()
    this.bindEvents()
    this.setControls()
    this.togglePartyMode()
  }

  setVars() {
    this.toggles = this.el.querySelectorAll('[data-pref-toggle]')
    this.colorPref = window.localStorage.getItem('color-mode')
    this.motionPref = window.localStorage.getItem('motion-mode')
    this.partyPref = window.localStorage.getItem('party-mode')
    this.root = document.documentElement
    this.partyMode = null
    this.partyStart = null
  }

  bindEvents() {
    this.toggles.forEach((toggle) =>
      toggle.addEventListener('click', this.triageChange, false)
    )
  }

  triageChange = (e) => {
    const setting = e.target.closest('button').dataset.prefSetting
    const value = e.target.closest('button').dataset.prefValue

    setting === 'color-mode' ? this.setColor(value) : null
    setting === 'motion-mode' ? this.setMotion(value) : null
    setting === 'party-mode' ? this.setParty(value) : null
  }

  setColor(value) {
    this.root.classList.remove('light', 'dark')
    if (value === 'auto') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      const autoValue = mql.matches ? 'dark' : 'light'
      window.localStorage.removeItem('color-mode')
      this.colorPref = null
      this.root.classList.add(autoValue)
    } else {
      window.localStorage.setItem('color-mode', value)
      this.colorPref = value
      this.root.classList.add(value)
    }

    const event = new CustomEvent('themeSwitch', { detail: value });
    window.dispatchEvent(event)

    this.setControls()
  }

  setMotion(value) {
    let newValue

    if (value === 'auto') {
      const mql = window.matchMedia('(prefers-reduced-motion: no-preference)')
      newValue = mql.matches ? 'no-preference' : 'reduced'
      window.localStorage.removeItem('motion-mode')
      this.motionPref = null
    } else {
      window.localStorage.setItem('motion-mode', value)
      this.motionPref = value
      newValue = value
    }

    this.root.classList.remove('no-preference', 'reduced')
    this.root.style.setProperty(
      '--play-state',
      newValue === 'reduced' ? 'paused' : 'running'
    )
    this.root.style.setProperty(
      '--transition-toggle',
      newValue === 'reduced' ? '0' : '1'
    )
    this.root.classList.add(newValue)

    const event = new CustomEvent('motionSwitch', { detail: value });
    window.dispatchEvent(event)

    this.setControls()
  }

  setParty(value) {
    this.root.classList.remove('no-party', 'party')
    window.localStorage.setItem('party-mode', value)
    this.partyPref = value
    this.root.classList.add(value)
    this.setControls()
    this.togglePartyMode()
  }

  setControls() {
    let activeTargets = []

    this.toggles.forEach((toggle) => {
      toggle.ariaPressed = false
      toggle.dataset.pressed = false
    })

    if (this.colorPref === null) {
      activeTargets.push(
        document.querySelector(
          '[data-pref-setting="color-mode"][data-pref-value="auto"]'
        )
      )
    } else {
      activeTargets.push(
        document.querySelector(
          `[data-pref-setting="color-mode"][data-pref-value="${this.colorPref}"]`
        )
      )
    }

    if (this.motionPref === null) {
      activeTargets.push(
        document.querySelector(
          '[data-pref-setting="motion-mode"][data-pref-value="auto"]'
        )
      )
    } else {
      activeTargets.push(
        document.querySelector(
          `[data-pref-setting="motion-mode"][data-pref-value="${this.motionPref}"]`
        )
      )
    }

    if (this.partyPref == null) {
      activeTargets.push(
        document.querySelector(
          '[data-pref-setting="party-mode"][data-pref-value="no-party"]'
        )
      )
    } else {
      activeTargets.push(
        document.querySelector(
          `[data-pref-setting="party-mode"][data-pref-value="${this.partyPref}"]`
        )
      )
    }

    activeTargets.forEach((target) => {
      target.ariaPressed = true
      target.dataset.pressed = true
    })
  }

  togglePartyMode() {
    if (this.partyPref === null) {
      return
    }

    if (this.partyPref === 'no-party' && this.partyMode !== null) {
      this.partyMode.cleanUp()
      this.partyMode = null
    } else if (this.partyPref === 'party' && this.partyMode === null) {
      import('./partyTime.js').then((module) => {
        this.partyMode = new module.default()
      })
    }
  }
}
