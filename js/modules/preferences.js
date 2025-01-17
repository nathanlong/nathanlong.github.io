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
      toggle.addEventListener('click', this.triageChange, false),
    )
  }

  triageChange = (e) => {
    const button = e.target.closest('button')
    const setting = button?.dataset.prefSetting
    const value = button?.dataset.prefValue

    switch (setting) {
      case 'color-mode':
        this.setColor(value)
        break
      case 'motion-mode':
        this.setMotion(value)
        break
      case 'party-mode':
        this.setParty(value)
        break
    }
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

    this.dispatchEvent('themeSwitch', value)
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
      newValue === 'reduced' ? 'paused' : 'running',
    )
    this.root.style.setProperty(
      '--transition-toggle',
      newValue === 'reduced' ? '0' : '1',
    )
    this.root.classList.add(newValue)

    this.dispatchEvent('motionSwitch', value)
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

    activeTargets.push(this.getActiveTarget('color-mode', this.colorPref))
    activeTargets.push(this.getActiveTarget('motion-mode', this.motionPref))
    activeTargets.push(
      this.getActiveTarget('party-mode', this.partyPref ?? 'no-party'),
    )

    activeTargets.forEach((target) => {
      if (target) {
        target.ariaPressed = true
        target.dataset.pressed = true
      }
    })
  }

  togglePartyMode() {
    if (this.partyPref === 'no-party' && this.partyMode !== null) {
      this.partyMode.cleanUp()
      this.partyMode = null
    } else if (this.partyPref === 'party' && this.partyMode === null) {
      import('./partyTime.js').then((module) => {
        this.partyMode = new module.default()
      })
    }
  }

  // Helpers

  getActiveTarget(setting, value) {
    return document.querySelector(
      `[data-pref-setting="${setting}"][data-pref-value="${value ?? 'auto'}"]`,
    )
  }

  dispatchEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { detail })
    window.dispatchEvent(event)
  }
}
