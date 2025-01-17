// import * as PIXI from 'https://cdn.skypack.dev/pixi.js@7.2.1'
import * as PIXI from 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.2.4/pixi.mjs'

const PARTICLE_COUNT = 30
const DARK_COLORS = ['0x4361ee', '0x3a0ca3', '0x7209b7', '0xf72585']
const LIGHT_COLORS = ['0xbde0fe', '0xa2d2ff', '0xffafcc', '0xffc8dd']

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}

class Particle {
  constructor(texture, radius, x, y, speed, bounds) {
    this.radius = radius
    this.sprite = PIXI.Sprite.from(texture)
    this.sprite.anchor.set(0.5)
    this.sprite.direction = Math.random() * Math.PI * 2
    this.sprite.turnSpeed = Math.random() - 0.8
    this.sprite.scale.set(1 + Math.random() * 0.3)
    this.sprite.original = new PIXI.Point()
    this.sprite.original.copyFrom(this.sprite.scale)
    this.sprite.x = x
    this.sprite.y = y
    this.sprite.speed = speed
    this.bounds = bounds
    this.interactive = true
    this.sprite.eventMode = 'static'
    this.sprite.inertia = 0
    this.scrollDelta = 0
  }

  move(delta, count) {
    this.sprite.direction += this.sprite.turnSpeed * 0.01
    this.sprite.x += Math.sin(this.sprite.direction) * this.sprite.speed
    this.sprite.y += Math.cos(this.sprite.direction) * this.sprite.speed
    this.sprite.rotation = -this.sprite.direction - Math.PI / 2

    if (this.sprite.inertia > 0) {
      const depthShift = (this.radius / 10) * this.scrollDelta * this.sprite.inertia
      this.sprite.y += depthShift
      this.sprite.inertia -= delta * 0.02
    }

    if (this.sprite.x < this.bounds.x) {
      this.sprite.x += this.bounds.width
    } else if (this.sprite.x > this.bounds.x + this.bounds.width) {
      this.sprite.x -= this.bounds.width
    }

    if (this.sprite.y < this.bounds.y) {
      this.sprite.y += this.bounds.height
    } else if (this.sprite.y > this.bounds.y + this.bounds.height) {
      this.sprite.y -= this.bounds.height
    }
  }

  shift(amount) {
    const depthShift = (this.radius / 10) * amount
    this.sprite.y += depthShift
  }
}

export default class partyTime {
  constructor() {
    this.setVars()
    this.init()
    this.createParticles()
    this.bindEvents()
  }

  get isLightTheme() {
    return document.documentElement.classList.contains('light')
  }

  get motionPref() {
    return (
      getComputedStyle(document.documentElement).getPropertyValue(
        '--play-state'
      ) === 'running'
    )
  }

  setVars() {
    this.particles = []
    this.particleTotal = PARTICLE_COUNT
    this.count = 0
    this.background = this.isLightTheme ? 'cyan' : 'indigo'
    this.ticking = false
  }

  init() {
    this.pixi = new PIXI.Application({
      background: this.background,
      resizeTo: window,
    })
    document.body.appendChild(this.pixi.view)
    this.pixi.view.classList = 'pixi-canvas'
    this.pixi.stage.eventMode = 'dynamic'
    this.pixi.stage.hitArea = this.pixi.screen

    this.container = new PIXI.Container()
    this.pixi.stage.addChild(this.container)

    this.padding = 50
    this.bounds = new PIXI.Rectangle(
      -this.padding,
      -this.padding,
      this.pixi.screen.width + this.padding * 2,
      this.pixi.screen.height + this.padding * 2
    )

    this.createParticles()
    this.pixi.ticker.add((delta) => this.tick(delta))
  }

  bindEvents() {
    window.addEventListener('themeSwitch', this.handleSwitch)
    window.addEventListener('motionSwitch', this.handleMotion)
    window.addEventListener('scroll', this.handleScroll)
    this.pixi.renderer.on('resize', this.handleResize)
  }

  tick(delta) {
    this.count += 0.2
    this.particles.forEach((particle) => {
      particle.move(delta, this.count)
    })
  }

  createParticles() {
    if (this.particleContainer) {
      return
    }

    this.particleContainer = new PIXI.Container()
    this.pixi.stage.addChild(this.particleContainer)

    const colors = this.isLightTheme ? LIGHT_COLORS : DARK_COLORS
    const colorTotal = colors.length

    for (let i = 0; i < this.particleTotal; i++) {
      const circle = new PIXI.Graphics()
      const randomColor = Math.floor(Math.random() * colorTotal)
      const x = Math.random() * this.pixi.screen.width
      const y = Math.random() * this.pixi.screen.height
      const radius = Math.random() * 10 + 4
      const color = colors[randomColor]
      const speed = this.motionPref ? Math.random() : 0

      circle.beginFill(color)
      circle.drawCircle(0, 0, radius)
      circle.endFill()

      const circleTexture = this.pixi.renderer.generateTexture(circle)
      const particle = new Particle(
        circleTexture,
        radius,
        x,
        y,
        speed,
        this.bounds
      )

      this.particles.push(particle)
      this.particleContainer.addChild(particle.sprite)
    }
  }

  handleResize = debounce((ev) => {
    this.bounds = new PIXI.Rectangle(
      -this.padding,
      -this.padding,
      this.pixi.screen.width + this.padding * 2,
      this.pixi.screen.height + this.padding * 2
    )

    this.particleContainer.destroy()
    this.particleContainer = null
    this.createParticles()
  }, 250)

  handleSwitch = () => {
    this.pixi.renderer.background.color = this.isLightTheme
      ? '0x00FFFF'
      : '0x4B0082'
    this.particleContainer.destroy()
    this.particleContainer = null
    this.createParticles()
  }

  handleMotion = () => {
    this.particles.forEach((particle) => {
      const speed = this.motionPref ? Math.random() : 0
      particle.sprite.speed = speed
    })
  }

  handleScroll = (e) => {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        let newScroll = window.scrollY
        let scrollDelta = this.scrollY - newScroll
        let delta = Math.floor(scrollDelta) || 0
        this.scrollY = newScroll
        this.particles.forEach((particle) => {
          particle.sprite.inertia = 1
          particle.scrollDelta = delta
        })
        this.ticking = false
      })

      this.ticking = true
    }
  }

  cleanUp() {
    console.log('Party Time Over!!')
    window.removeEventListener('themeSwitch', this.handleSwitch)
    window.removeEventListener('motionSwitch', this.handleMotion)
    window.removeEventListener('scroll', this.handleScroll)
    document.body.removeChild(this.pixi.view)
  }
}
