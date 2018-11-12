export default class Game {
  constructor() {
    this._renderer = PIXI.autoDetectRenderer(800, 800, {
      backgroundColor: 0x1099bb,
      resolution: 1,
    });

    this.pointer;    
    this.explosion;
    this.bubbles = [];

    this._stage = new PIXI.Container();
    this._loader = new PIXI.loaders.Loader();

    this.rotateToPoint = this.rotateToPoint.bind(this);
    this.rotateDegrees = this.rotateDegrees.bind(this);
    this.loadAssets = this.loadAssets.bind(this);
    this.shoot = this.shoot.bind(this);
    this.update = this.update.bind(this);
    this.setup = this.setup.bind(this);

    this.loadAssets();

    document.getElementById('display').appendChild(this._renderer.view);
    this.update();
  }

  async loadAssets() {
    this._loader
      .add('pointer', 'images/pointer.png')
      .add('bubble', 'images/bubble.png')
      .add('explosion', 'images/explosions.png')
      .load(this.setup);
  }

  setup() {
    const X_MIDDLE = this._renderer.width / 2;
    const Y_MIDDLE = this._renderer.height / 2;

    // Add background to stage
    var background = new PIXI.Graphics();
    background.beginFill(0x1099bb);
    background.drawRect(0, 0, 800, 800);
    background.endFill();
    this._stage.addChild(background);

    // Add mousedown callback to stage
    this._stage.interactive = 'true';
    this._stage.on('mousedown', (e) => {
      this.shoot(this.pointer.rotation - this.rotateDegrees(90), {
        x: this.pointer.position.x + Math.cos(this.pointer.rotation - this.rotateDegrees(90)) * 50,
        y: this.pointer.position.y + Math.sin(this.pointer.rotation - this.rotateDegrees(90)) * 50
      })
    })

    var texture = this._loader.resources['pointer'].texture;
    console.log(this._loader.resources['pointer']);
    console.log(this._loader.resources['pointer'].texture);

    // Add pointer sprite
    const newpointer = new PIXI.Sprite(
      this._loader.resources['pointer'].texture
    );
    
    newpointer.scale.set(.1, .1);
    newpointer.anchor.set(0.5, 0.5);
    newpointer.x = X_MIDDLE;
    newpointer.y = Y_MIDDLE;
    this.pointer = newpointer;
    this._stage.addChild(newpointer);

    // Add Explosion sprite
    // var rect = new PIXI.Rectangle(0, 0, 130, 130);
    // var texture = this._loader.resources['explosion'].texture;
    // texture.frame = rect;
    // explosion = new PIXI.Sprite(texture);
    // explosion.x = X_MIDDLE
    // explosion.y = Y_MIDDLE;
    // explosion.anchor.set(0.5, 0.5);
    // explosion.scale.set(1, 1);

    // this._stage.addChild(explosion);

    // var explode = setInterval(() => {
    //     if (rect.x >= 130 * 6) {
    //         rect.x = 0;
    //         rect.y += 130;
    //     }

    //     if (rect.y >= 130 * 7) rect.y = 0;

    //     explosion.texture.frame = rect;
    //     rect.x += 130;
    // }, 12)        
  }

  update() {
    requestAnimationFrame(this.update);

    // Update pointer rotation
    this.pointer.rotation = this.rotateToPoint(
      this._renderer.plugins.interaction.mouse.global.x,
      this._renderer.plugins.interaction.mouse.global.y,
      this.pointer.x,
      this.pointer.y
    ) + this.rotateDegrees(90);

    // Update bubble trajectories
    for (var b = this.bubbles.length - 1; b >= 0; b--) {
      this.bubbles[b].x += Math.cos(this.bubbles[b].rotation) * 5;
      this.bubbles[b].y += Math.sin(this.bubbles[b].rotation) * 5;
    }

    this._renderer.render(this._stage);
  }

  rotateToPoint(mx, my, px, py) {
    var dist_Y = my - py;
    var dist_X = mx - px;
    var angle = Math.atan2(dist_Y, dist_X);
    return angle
  }

  rotateDegrees(d) {
    return Math.PI * d / 180;
  }

  shoot(rotation, startPos) {
    var bubble = new PIXI.Sprite(
      this._loader.resources['bubble'].texture
    );
    bubble.anchor.set(0.5, 0.5);
    bubble.scale.set(0.05, 0.05);
    bubble.x = startPos.x;
    bubble.y = startPos.y;
    bubble.rotation = rotation;
    this.bubbles.push(bubble);
    this._stage.addChild(bubble);
  }
}