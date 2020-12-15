// -------------------
// import PIXI classes
// -------------------

import { Application, Graphics, Renderer, InteractionManager } from 'pixi.js';

//import { Application } from '@pixi/app';

// import { Graphics } from '@pixi/graphics';

// // Renderer is the class that registers plugins
// import { Renderer } from '@pixi/core';

// BatchRenderer is the plugin for drawing sprites
// import { BatchRenderer } from '@pixi/core';
// Renderer.registerPlugin('batch', BatchRenderer);

// TickerPlugin is the plugin for running an update loop (it's for the application class)
// import { TickerPlugin } from '@pixi/ticker';
// Application.registerPlugin(TickerPlugin);

// InteractionManager handles mouse events
// import { InteractionManager } from '@pixi/interaction';
Renderer.registerPlugin('interaction', InteractionManager);

// Just for convenience let's register Loader plugin in order to use it right from Application instance like app.loader.add(..) etc.
// import { AppLoaderPlugin } from '@pixi/loaders';
// Application.registerPlugin(AppLoaderPlugin);

// ------------------------------------
// create Application and connect it up
// ------------------------------------
const app = new Application({
  width: 700,
  height: 700,
  backgroundColor: 0x304050,
});

document.body.appendChild(app.view);

app.renderer.view.addEventListener('click', function (e) {
  console.log('click', e);
});

console.log('app', app);
console.log('app.view', app.view);
console.log('app.stage', app.stage, app.stage.width);
console.log('app.renderer', app.renderer, app.renderer.width);
console.log('app.renderer.plugins', app.renderer.plugins);

// Sprite is our image on the stage
import { Sprite } from '@pixi/sprite';

// app.stage is not interacitive!
// app.stage.on('pointerdown', onTouchDown);
// app.stage.interactive = true;

// -----------------------------------------
// TRY CIRCLE
// -----------------------------------------
function makeCircle(x, y, r, fillcolor) {
  var graphics = new Graphics();
  graphics.beginFill(fillcolor);
  graphics.drawCircle(x, y, r);
  graphics.endFill();
  graphics.interactive = true;
  graphics.buttonMode = true;
  graphics
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove_2);
  return graphics;
}
app.stage.addChild(makeCircle(160, 285, 60, 0x874cac));

// ----------------------------------------
// DRAGGABLE HEXAGONS
// from https://codepen.io/zeakd/pen/NdMBgB
// ----------------------------------------

var hexagonRadius = 60;
var hexagonHeight = hexagonRadius * Math.sqrt(3);

for (var i = 0; i < 10; i++) {
  var hexaP = toHexagonPosition({
    x: Math.floor(Math.random() * app.stage.width),
    y: Math.floor(Math.random() * app.stage.width),
  });
  addHexagon(hexaP.x, hexaP.y);
}

function addHexagon(x, y) {
  //console.log('makeHexagon', x, y);

  var hexagon = new Graphics();
  hexagon.beginFill(0xff0000);

  hexagon.drawPolygon([
    -hexagonRadius,
    0,
    -hexagonRadius / 2,
    hexagonHeight / 2,
    hexagonRadius / 2,
    hexagonHeight / 2,
    hexagonRadius,
    0,
    hexagonRadius / 2,
    -hexagonHeight / 2,
    -hexagonRadius / 2,
    -hexagonHeight / 2,
  ]);

  hexagon.endFill();
  hexagon.x = x;
  hexagon.y = y;

  // enable interactive and hand cursor on hover
  hexagon.interactive = true;
  hexagon.buttonMode = true;

  // setup events for mouse + touch using the pointer events
  hexagon
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

  hexagon.x = x;
  hexagon.y = y;

  // add it to the stage
  app.stage.addChild(hexagon);
}

function onDragStart(event) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
}

function onDragMove() {
  if (this.dragging) {
    var newPosition = this.data.getLocalPosition(this.parent);
    var hexaP = toHexagonPosition(newPosition);
    this.x = hexaP.x;
    this.y = hexaP.y;
  }
}

function onDragMove_2() {
  if (this.dragging) {
    var newPosition = this.data.getLocalPosition(this.parent);
    console.log('onDragMove_2', this.x, this.y, newPosition);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}

function onTouchDown(e) {
  console.log('onTouchDown', e);
}

function toHexagonPosition(p) {
  var newP = {};
  var xIdx = Math.round(p.x / (hexagonRadius * (3 / 2)));
  newP.x = xIdx * (hexagonRadius * (3 / 2));
  if (xIdx % 2) {
    newP.y =
      Math.floor(p.y / hexagonHeight) * hexagonHeight + hexagonHeight / 2;
  } else {
    newP.y = Math.round(p.y / hexagonHeight) * hexagonHeight;
  }
  console.log('toHexagonPosition', p, newP);
  return newP;
}

// -------------------------------------------------
// KEYBOARD EVENTS
// from https://codepen.io/SkuliOskarsson/pen/ZbJKVW
// -------------------------------------------------
//(function () {
// Set up Pixi.js
// var renderer = PIXI.autoDetectRenderer(660, 660, {
//   backgroundColor: 0x34495e,
//   antialias: true,
// });
// document.body.appendChild(renderer.view);

// // Create the stage
// var stage = new PIXI.Container();

// Set the width and height of our boxes
var boxWidth = app.renderer.width / 10;
var boxHeight = app.renderer.height / 10;

// Create the "player"
var playerBox = new Graphics();
playerBox.lineStyle(1, 0x000000);
playerBox.beginFill(0x3498dff); // Blue color
playerBox.drawRect(0, 0, boxWidth, boxHeight);
playerBox.endFill();

// Create the target
var goalBox = new Graphics();
goalBox.lineStyle(1, 0x000000);
goalBox.beginFill(0xe74c3c); // Red color
goalBox.drawRect(0, 0, boxWidth, boxHeight);
goalBox.endFill();

// Add boxes to the stage
app.stage.addChild(playerBox);
app.stage.addChild(goalBox);

// Add the 'keydown' event listener to the document
document.addEventListener('keydown', onKeyDown);

// Spawn our target
goalBoxSpawn();

animate();

function animate() {
  // Render the stage
  app.renderer.render(app.stage);

  // Check if your player collides with the target
  checkPosition();
  requestAnimationFrame(animate);
}

function goalBoxSpawn() {
  // Spawns the target at a random position on our stage

  // Create two random points on our stage
  var randomX = Math.floor(Math.random() * 10 + 0);
  var randomY = Math.floor(Math.random() * 10 + 0);

  // Set the position of our target
  goalBox.position.x = boxWidth * randomX;
  goalBox.position.y = boxHeight * randomY;
}

function checkPosition() {
  // If the player and target are at the same position, spawn the target in another position
  if (
    goalBox.position.x === playerBox.position.x &&
    goalBox.position.y === playerBox.position.y
  ) {
    goalBoxSpawn();
  }
}

function onKeyDown(key) {
  // W Key is 87
  // Up arrow is 87
  if (key.keyCode === 87 || key.keyCode === 38) {
    // If the W key or the Up arrow is pressed, move the player up.
    if (playerBox.position.y != 0) {
      // Don't move up if the player is at the top of the stage
      playerBox.position.y -= boxHeight;
    }
  }

  // S Key is 83
  // Down arrow is 40
  if (key.keyCode === 83 || key.keyCode === 40) {
    // If the S key or the Down arrow is pressed, move the player down.
    if (playerBox.position.y != app.renderer.height - boxHeight) {
      // Don't move down if the player is at the bottom of the stage
      playerBox.position.y += boxHeight;
    }
  }

  // A Key is 65
  // Left arrow is 37
  if (key.keyCode === 65 || key.keyCode === 37) {
    // If the A key or the Left arrow is pressed, move the player to the left.
    if (playerBox.position.x != 0) {
      // Don't move to the left if the player is at the left side of the stage
      playerBox.position.x -= boxWidth;
    }
  }

  // D Key is 68
  // Right arrow is 39
  if (key.keyCode === 68 || key.keyCode === 39) {
    // If the D key or the Right arrow is pressed, move the player to the right.
    if (playerBox.position.x != app.renderer.width - boxWidth) {
      // Don't move to the right if the player is at the right side of the stage
      playerBox.position.x += boxWidth;
    }
  }
}
//})();

// Added this to codepen only so that the blog readers can try it in the iframe.
// var playButton = document.getElementById('play-button');
// playButton.addEventListener('click', function () {
//   var preview = document.getElementById('preview');

//   preview.setAttribute('class', 'hide');
// });
