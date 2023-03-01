// matter is imported manually via extraJS flag
//
export default class AnimationHero {
  constructor(el) {
    this.el = el
    // this.init()
  }

  init() {
    var Engine = Matter.Engine
    var Render = Matter.Render
    var Runner = Matter.Runner
    var Bodies = Matter.Bodies
    var Composite = Matter.Composite

    var engine = Engine.create();
    var render = Render.create({
      element: this.el,
      engine: engine
    })

    var boxA = Bodies.rectangle(400, 200, 80, 80);
    var boxB = Bodies.rectangle(450, 50, 80, 80);
    var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    Composite.add(engine.world, [boxA, boxB, ground]);

    // run the renderer
    Render.run(render);

    // create runner
    var runner = Runner.create();

    // run the engine
    Runner.run(runner, engine);
  }

  cleanUp() {

  }
}
