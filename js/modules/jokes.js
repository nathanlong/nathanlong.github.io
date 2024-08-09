const jokes = [
  {
    joke: 'Why do peppers make the best archers?',
    punchline: 'Because they habanero...',
  },
  {
    joke: 'What did the triangle say to the circle?',
    punchline: 'You’re pointless...',
  },
  {
    joke: 'Why did the computer catch cold?',
    punchline: 'It left a window open...',
  },
  {
    joke: 'Why do nurses like red crayons?',
    punchline: 'Sometimes they have to draw blood...',
  },
  {
    joke: 'Why did the orange stop halfway across the road?',
    punchline: 'It ran out of juice...',
  },
  {
    joke: 'What sounds like a sneeze and is made of leather?',
    punchline: 'A shoe...',
  },
  {
    joke: 'What kind of sandals do frogs wear?',
    punchline: 'Open-toad...',
  },
  {
    joke: 'What do you call a potato wearing glasses?',
    punchline: 'A spec-tater...',
  },
  {
    joke: 'What’s brown and sticky?',
    punchline: 'A stick.',
  },
  {
    joke: 'Justice is a dish best served cold.',
    punchline: 'If it were served warm, it would be just-water.',
  },
  {
    joke: 'What do you call a French man wearing sandals?',
    punchline: 'Philipe Fallop.',
  },
  {
    joke: 'How many ears does Captain Kirk have?',
    punchline: 'Three. The left ear, the right ear, and the final front-ear.',
  },
  {
    joke: 'Why are spiders so smart?',
    punchline: 'They can find everything on the web.',
  },
  {
    joke: 'Why are skeletons so calm?',
    punchline: 'Because nothing gets under their skin.',
  },
  {
    joke: 'Why are elevator jokes so classic and good?',
    punchline: 'They work on many levels.',
  },
  {
    joke: 'Why did the web browser have no money left?',
    punchline: 'Someone cleaned out its cache!',
  },
  {
    joke: 'How do you know when your clock is still hungry?',
    punchline: 'It goes back four seconds.',
  },
]

export default class EmailHider {
  constructor(el) {
    this.el = el
    this.joke = el.querySelector('[data-joke]')
    this.punchline = el.querySelector('[data-punchline]')
    this.moar = el.querySelector('[data-moar]')
    this.bindEvents()
    this.renderJoke()
  }

  bindEvents() {
    this.moar.addEventListener('click', this.renderJoke, false)
  }

  renderJoke = () => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
    this.joke.textContent = randomJoke.joke;
    this.punchline.textContent = randomJoke.punchline;
  }
}
