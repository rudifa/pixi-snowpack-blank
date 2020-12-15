import { Application } from '@pixi/app'; // WORKS
// import { Application } from 'pixi.js'; // DOES NOT WORK
import { Graphics } from '@pixi/graphics';
import { Renderer } from '@pixi/core'; // Renderer is the class that is going to register plugins

import { BatchRenderer } from '@pixi/core'; // BatchRenderer is the "plugin" for drawing sprites
Renderer.registerPlugin('batch', BatchRenderer);

import { TickerPlugin } from '@pixi/ticker'; // TickerPlugin is the plugin for running an update loop (it's for the application class)
Application.registerPlugin(TickerPlugin);

import { InteractionManager } from '@pixi/interaction';

Renderer.registerPlugin('interaction', InteractionManager);
// // And just for convenience let's register Loader plugin in order to use it right from Application instance like app.loader.add(..) etc.
// import { AppLoaderPlugin } from '@pixi/loaders';
// Application.registerPlugin(AppLoaderPlugin);

// Sprite is our image on the stage
import { Sprite } from '@pixi/sprite';

const app = new Application({
  width: 600,
  height: 600,
  backgroundColor: 0x1099bb,
});

console.log('app', app);
console.log('app.view', app.view);
console.log('app.stage', app.stage, app.stage.width);
console.log('app.renderer', app.renderer, app.renderer.width);
console.log('app.renderer.plugins', app.renderer.plugins);

// create a manager instance, passing stage and renderer.view
// var manager = new InteractionManager(app.stage, app.renderer.view);
//app.renderer.registerPlugin('interaction', InteractionManager);
document.body.appendChild(app.view);

app.renderer.view.addEventListener('click', function (e) {
  console.log(e);
});

// not interacitive!
// app.stage.on('pointerdown', onTouchDown);
// app.stage.interactive = true;

// code from https://codepen.io/rudifa/pen/qBarNLg

// var canv = document.getElementById('canvas');
// canv.width = 500;
// canv.height = 500;

// var ctx = canv.getContext('2d');
// ctx.rect(0, 0, canv.width, canv.height);
// ctx.fillStyle = "#888888"
// ctx.fill();

// const renderer = PIXI.autoDetectRenderer(256, 256);
// document.body.appendChild(renderer.view);

// const stage = new PIXI.Container();
// renderer.render(stage);

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
