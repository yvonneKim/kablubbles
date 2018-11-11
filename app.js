var renderer = PIXI.autoDetectRenderer(800, 800, {
    backgroundColor: 0x1099bb,
    resolution: 1,
});

document.getElementById('display').appendChild(renderer.view)

var stage = new PIXI.Container();
var background = new PIXI.Graphics();
background.beginFill(0x1099bb);
background.drawRect(0, 0, 800, 800);
background.endFill();
stage.addChild(background);


PIXI.loader
    .add('pointer', 'images/pointer.png')
    .add('bubble', 'images/bubble.png')
    .add('explosion', 'images/explosions.png')
    .load(setup);

var X_MIDDLE = renderer.width / 2;
var Y_MIDDLE = renderer.height / 2;

var pointer;
var explosion;
var bubble;
var bubbles = [];
var bubbleSpeed = 5;

function setup() {
    stage.interactive = 'true';
    stage.on('mousedown', (e) => {
        console.log(pointer.rotation);
        shoot(pointer.rotation - rotateDegrees(90), {
            x: pointer.position.x + Math.cos(pointer.rotation - rotateDegrees(90))*50,
            y: pointer.position.y + Math.sin(pointer.rotation - rotateDegrees(90))*50
        })
    })

    // Add Explosion sprite
    var rect = new PIXI.Rectangle(0, 0, 130, 130);
    var texture = PIXI.loader.resources['explosion'].texture;
    texture.frame = rect;
    explosion = new PIXI.Sprite(texture);
    explosion.x = X_MIDDLE
    explosion.y = Y_MIDDLE;
    explosion.anchor.set(0.5, 0.5);
    explosion.scale.set(1, 1);

    stage.addChild(explosion);

    var explode = setInterval(() => {
        if (rect.x >= 130 * 6) {
            rect.x = 0;
            rect.y += 130;
        }

        if (rect.y >= 130 * 7) rect.y = 0;

        explosion.texture.frame = rect;
        rect.x += 130;
    }, 12)

    // Add pointer sprite
    pointer = new PIXI.Sprite(
        PIXI.loader.resources['pointer'].texture
    );

    pointer.scale.set(.1, .1);
    pointer.anchor.set(0.5, 0.5);
    pointer.x = X_MIDDLE;
    pointer.y = Y_MIDDLE;

    stage.addChild(pointer);
}

function rotateToPoint(mx, my, px, py) {
    var self = this;
    var dist_Y = my - py;
    var dist_X = mx - px;
    var angle = Math.atan2(dist_Y, dist_X);
    return angle
}

function rotateDegrees(d) {
    return Math.PI * d / 180;
}

function getPointerRotation() {
    return rotateToPoint(
        renderer.plugins.interaction.mouse.global.x,
        renderer.plugins.interaction.mouse.global.y,
        pointer.x,
        pointer.y
    )
}

function shoot(rotation, startPos) {
    var bubble = new PIXI.Sprite(
        PIXI.loader.resources['bubble'].texture
    );
    bubble.anchor.set(0.5, 0.5);
    bubble.scale.set(0.05, 0.05);
    bubble.x = startPos.x;
    bubble.y = startPos.y;
    bubble.rotation = rotation;
    stage.addChild(bubble);
    bubbles.push(bubble);
}

function animationLoop() {
    requestAnimationFrame(animationLoop);
    pointer.rotation = rotateToPoint(
        renderer.plugins.interaction.mouse.global.x,
        renderer.plugins.interaction.mouse.global.y,
        pointer.x,
        pointer.y
    ) + rotateDegrees(90);

    for (var b = bubbles.length - 1; b >= 0; b--) {
        bubbles[b].x += Math.cos(bubbles[b].rotation) * bubbleSpeed;
        bubbles[b].y += Math.sin(bubbles[b].rotation) * bubbleSpeed;
    }

    renderer.render(stage);
}

animationLoop();