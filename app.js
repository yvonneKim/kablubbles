var renderer = PIXI.autoDetectRenderer(512, 512, {
    transparent: true,
    resolution: 1,    
});

document.getElementById('display').appendChild(renderer.view)

var stage = new PIXI.Container();

PIXI.loader
    .add('bubble', 'images/bubble.png')
    .add('explosion', 'images/explosions.png')
    .load(setup);

var explosion;
var bubble;

function setup() {
    stage.interactive = 'true';

    // Add Explosion sprite
    var rect = new PIXI.Rectangle(0, 0, 130, 130);
    var texture = PIXI.loader.resources['explosion'].texture;
    texture.frame = rect;    
    explosion = new PIXI.Sprite(texture);
    explosion.x = renderer.width / 2;
    explosion.y = renderer.height / 2;
    explosion.anchor.set(0.5, 0.5);
    explosion.scale.set(1, 1);
    
    stage.addChild(explosion);

    var explode = setInterval(() => {
	if (rect.x >= 130*6) {
	    rect.x = 0;
	    rect.y += 130;
	}

	if (rect.y >= 130*7) rect.y = 0;
	
	explosion.texture.frame = rect;
	rect.x += 130;
    }, 12)
    // Add Bubble sprite
    bubble = new PIXI.Sprite(
	PIXI.loader.resources['bubble'].texture
    );

    bubble.scale.set(0.1, 0.1)
    bubble.anchor.set(0.5, 0.5);
    bubble.interactive = 'true';
    bubble.x = renderer.width / 2;
    bubble.y = renderer.height / 2;
    
    bubble.click = function() {
	bubble.scale.x -= 0.01;
	bubble.scale.y -= 0.01;
    }
    
    stage.addChild(bubble);

    
    animationLoop();
}

function animationLoop() {
    requestAnimationFrame(animationLoop);
    bubble.rotation += 0.1;
    renderer.render(stage);
}
