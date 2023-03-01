import '../vendor/party-js.2.2.0.min.js'
import 'https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.5.0'

// uses:
// https://party.js.org/ (sets global `party` object)
// TODO:
// - disco ball? (could be audio control in lower left?)
//

export default class partyTime {
  constructor() {
    this.setVars()
    this.init()
    this.bindEvents()
  }

  get isLightTheme() {
    return document.documentElement.classList.contains('light')
  }

  get partySongProgress() {
    return window.localStorage.getItem('party-progress')
  }

  get partySongIndex() {
    return window.localStorage.getItem('party-song-index') ?? 0
  }

  setVars() {
    this.motionPref =
      getComputedStyle(document.documentElement).getPropertyValue(
        '--play-state'
      ) === 'running'
    this.audioPref = window.localStorage.getItem('party-audio')

    //set up audio
    this.audioContext = new AudioContext()
    this.sampleRate = this.audioContext.sampleRate
    this.primaryGainControl = this.audioContext.createGain()
    this.primaryGainControl.gain.setValueAtTime(0.2, 0)
    this.primaryGainControl.connect(this.audioContext.destination)

    //track progress

    this.midiFiles = [
      '../../audio/kakariko-party-mix.mid',
      '../../audio/gerudo-valley.mid',
      '../../audio/chrono-battle.mid',
      '../../audio/koopa-theme.mid',
      '../../audio/lost-woods-hot-v21.mid',
      '../../audio/mmx-storm-eagle-4.mid',
      '../../audio/ultra-pinball-11.mid',
    ]

    this.midiIndex = parseInt(this.partySongIndex)
    this.midiSRC = this.midiFiles[this.midiIndex]
    this.midiPlayer = document.createElement('midi-player')
    this.midiPlayer.classList = 'w-full'
    this.midiPlayer.src = this.midiSRC
    this.midiPlayer.loop = true
    this.midiPlayer.soundFont =
      'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus'
    this.midiPlayer.dataset.index = 0

    this.midiVisualizer = document.createElement('midi-visualizer')
    this.midiVisualizer.src = this.midiSRC
    this.midiVisualizer.classList = 'fixed inset-lower overflow-hidden w-full'

    this.vizWidth = Math.max(100, Math.floor(window.innerWidth / 10))
    this.vizActiveColor = this.isLightTheme ? '0, 235, 240' : '105, 15, 160'
    this.vizNoteColor = this.isLightTheme ? '0, 245, 250' : '55, 0, 110'
    console.log(this.vizActiveColor, this.vizNoteColor)
    this.vizConfig = {
      activeNoteRGB: this.vizActiveColor,
      noteRGB: this.vizNoteColor,
      noteHeight: 10,
      pixelsPerTimeStep: this.vizWidth,
    }
    this.midiVisualizer.config = this.vizConfig

    this.midiWrapper = document.createElement('div')
    this.midiWrapper.classList =
      'fixed flex flex-wrap inset-lower-right mr-1 mb-1 z-1'
    this.playNext = document.createElement('button')
    this.playNext.classList =
      'btn bg-editor w-3 ml-1 mb-1 rounded-full text-center aspect-square'
    this.playNext.dataset.direction = 'next'
    this.playNext.innerHTML = '>>'
    this.playPrev = document.createElement('button')
    this.playPrev.classList =
      'btn bg-editor w-3 ml-auto mb-1 rounded-full text-center aspect-square'
    this.playPrev.dataset.direction = 'prev'
    this.playPrev.innerHTML = '<<'
    this.midiWrapper.appendChild(this.playPrev)
    this.midiWrapper.appendChild(this.playNext)
  }

  init() {
    // if not set activate the song
    if (typeof this.audioPref !== 'string') {
      window.localStorage.setItem('party-audio', 'play')
    }

    this.midiWrapper.appendChild(this.midiPlayer)
    document.body.appendChild(this.midiWrapper)
    document.body.appendChild(this.midiVisualizer)
    // this.partySong()
  }

  bindEvents() {
    window.addEventListener('mousedown', this.handleClick)
    window.addEventListener('beforeunload', this.saveAudioProgress)
    window.addEventListener('themeSwitch', this.handleSwitch)
    this.playPrev.addEventListener('click', this.switchSong)
    this.playNext.addEventListener('click', this.switchSong)
    this.midiPlayer.addEventListener('load', this.resumeSong)
    this.midiPlayer.addEventListener('loop', () => {
      this.midiVisualizer.querySelector(
        '.piano-roll-visualizer'
      ).scrollLeft = 0
    })
  }

  handleClick = (e) => {
    if (this.motionPref) {
      party.confetti(e, {
        count: party.variation.range(20, 40),
      })
    }

    const jumpOscillator = this.audioContext.createOscillator()
    jumpOscillator.type = 'triangle'

    // exp ramp up like a mario jump
    jumpOscillator.frequency.setValueAtTime(
      this.getRandomInt(800, 1200),
      this.audioContext.currentTime
    )
    jumpOscillator.frequency.exponentialRampToValueAtTime(
      // 0.001,
      this.getRandomInt(4000, 5000),
      this.audioContext.currentTime + 0.5
    )

    // exp ramp gain to remove click
    const jumpGain = this.audioContext.createGain()
    jumpGain.gain.setValueAtTime(2, 0)
    jumpGain.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.5
    )

    jumpOscillator.connect(jumpGain)
    jumpGain.connect(this.primaryGainControl)
    jumpOscillator.start()
    jumpOscillator.stop(this.audioContext.currentTime + 0.5)
  }

  handleSwitch = () => {
    console.log(this.isLightTheme)
    this.vizActiveColor = this.isLightTheme ? '0, 235, 240' : '105, 15, 160'
    this.vizNoteColor = this.isLightTheme ? '0, 245, 250' : '55, 0, 110'

    this.vizConfig = {
      activeNoteRGB: this.vizActiveColor,
      noteRGB: this.vizNoteColor,
      noteHeight: 10,
      pixelsPerTimeStep: this.vizWidth,
    }
    this.midiVisualizer.config = this.vizConfig

    this.midiVisualizer.redraw()
  }

  saveAudioProgress = () => {
    const progress = this.midiPlayer.currentTime ?? 0
    const status = this.midiPlayer.playing ? 'play' : 'stop'
    window.localStorage.setItem('party-audio', status)
    window.localStorage.setItem('party-progress', progress)
  }

  partySong(song) {
    this.midiPlayer.src = song
    this.midiVisualizer.src = song

    if (typeof this.audioPref === 'string' && this.audioPref === 'play') {
      console.log('audio pref')
      // this.resumeSong();
      this.playButton.innerHTML = this.iconPause
    } else {
      // console.log('no audio pref')
      // this.partySongSource.mediaElement.pause()
      this.playButton.innerHTML = this.iconPlay
    }
  }

  switchSong = (e) => {
    const prevIndex = parseInt(this.partySongIndex)
    const dir = e.target.dataset.direction ?? 'next'
    let newIndex

    if (dir === 'next') {
      console.log('next')
      newIndex = prevIndex === this.midiFiles.length - 1 ? 0 : prevIndex + 1
    } else {
      console.log('prev')
      newIndex = prevIndex === 0 ? this.midiFiles.length - 1 : prevIndex - 1
    }

    console.log(prevIndex, dir, newIndex)

    window.localStorage.setItem('party-progress', 0)
    this.midiPlayer.src = this.midiFiles[newIndex]
    this.midiVisualizer.src = this.midiFiles[newIndex]
    this.midiVisualizer.querySelector('.piano-roll-visualizer').scrollLeft = 0
    window.localStorage.setItem('party-song-index', newIndex)
  }

  resumeSong = () => {
    console.log('resume')
    if (
      typeof this.partySongProgress === 'string' &&
      this.partySongProgress !== '0'
    ) {
      this.midiPlayer.currentTime = this.partySongProgress
    }

    this.midiPlayer.addVisualizer(this.midiVisualizer)

    if (this.audioPref !== 'stop') {
      this.midiPlayer.start()
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
  }

  // Remove listeners, stop audio, and halt progress tracking
  cleanUp() {
    console.log('Party Time Over!!')
    window.removeEventListener('mousedown', this.handleClick)
    window.removeEventListener('beforeunload', this.saveAudioProgress)
    this.midiPlayer.stop()
    window.localStorage.removeItem('party-progress')
    window.localStorage.removeItem('party-audio')
    document.body.removeChild(this.midiWrapper)
    document.body.removeChild(this.midiVisualizer)
  }
}
