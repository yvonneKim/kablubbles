export class Game {
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
    this.setup();

    document.getElementById('display').appendChild(this._renderer.view);
    this.update();
  }

  loadAssets() {
    this._loader
      .add('pointer', 'images/pointer.png')
      .add('bubble', 'images/bubble.png')
      .add('explosion', 'images/explosions.png')
      .load();
  }

  setup() {
    const X_MIDDLE = renderer.width / 2;
    const Y_MIDDLE = renderer.height / 2;

    this.loadAssets();

    // Add background to stage
    var background = new PIXI.Graphics();
    background.beginFill(0x1099bb);
    background.drawRect(0, 0, 800, 800);
    background.endFill();
    this._stage.addChild(background);

    // Add mousedown callback to stage
    this._stage.interactive = 'true';
    this._stage.on('mousedown', (e) => {
      this.shoot(pointer.rotation - rotateDegrees(90), {
        x: pointer.position.x + Math.cos(pointer.rotation - rotateDegrees(90)) * 50,
        y: pointer.position.y + Math.sin(pointer.rotation - rotateDegrees(90)) * 50
      })
    })

    // Add pointer sprite
    pointer = new PIXI.Sprite(
      PIXI.loader.resources['pointer'].texture
    );

    pointer.scale.set(.1, .1);
    pointer.anchor.set(0.5, 0.5);
    pointer.x = X_MIDDLE;
    pointer.y = Y_MIDDLE;
    this._stage.addChild(pointer);

    // Add Explosion sprite
    // var rect = new PIXI.Rectangle(0, 0, 130, 130);
    // var texture = PIXI.loader.resources['explosion'].texture;
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
    requestAnimationFrame(update);

    // Update pointer rotation
    this.pointer.rotation = rotateToPoint(
      renderer.plugins.interaction.mouse.global.x,
      renderer.plugins.interaction.mouse.global.y,
      pointer.x,
      pointer.y
    ) + rotateDegrees(90);

    // Update bubble trajectories
    for (var b = bubbles.length - 1; b >= 0; b--) {
      this.bubbles[b].x += Math.cos(this.bubbles[b].rotation) * 5;
      this.bubbles[b].y += Math.sin(this.bubbles[b].rotation) * 5;
    }

    this._renderer.render(this._stage);
  }

  rotateToPoint(mx, my, px, py) {
    var self = this;
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
      PIXI.loader.resources['bubble'].texture
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