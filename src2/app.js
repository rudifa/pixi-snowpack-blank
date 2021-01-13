import { makeCircle, makeSquare, makeHexagon, makeHexaGrid } from "./hexa.js";

PIXI.utils.sayHello();
// Create the application
const app = new PIXI.Application({
  width: 800,
  height: 800,
  backgroundColor: 0xcccccc,
  antialias: true,
});

// Add the view to the DOM
document.body.appendChild(app.view);

//========================================================================
// add a rotating sprite
let hexa = PIXI.Sprite.from("assets/7-hexagons.png");

app.stage.addChild(hexa);
hexa.anchor.set(0.5);
hexa.x = app.view.width / 2;
hexa.y = app.view.height / 2;

// start animating
animate();
function animate() {
  requestAnimationFrame(animate);

  // rotate the sprite
  hexa.rotation += 0.02;

  // render the container
  //app.renderer.render(app.stage); // superfluous
}

//========================================================================
// draw circles

app.stage.addChild(makeCircle(40, 600, 40));

//===================================
// draw squares

app.stage.addChild(makeSquare(100, 560, 80));

//========================================================================
// draw hexagons

app.stage.addChild(makeHexagon(40, 440, 40, true, 0xffffff, 0xff0000));
app.stage.addChild(makeHexagon(120, 440, 40, true, 0xffffff, 0x00ff00));
app.stage.addChild(makeHexagon(200, 440, 40, true, 0xffffff, 0x0000ff));

app.stage.addChild(makeHexagon(40, 520, 40, false, 0xff0000, 0xffffff));
app.stage.addChild(makeHexagon(120, 520, 40, false, 0x00ff00, 0xffffff));
app.stage.addChild(makeHexagon(200, 520, 40, false, 0x0000ff, 0xffffff));

//========================================================================
// draw hexa grids

let r = 40;

for (let hexagon of makeHexaGrid(5, 6, 0, 0, r, true, null, 0x0000aa)) {
  app.stage.addChild(hexagon);
}
for (let hexagon of makeHexaGrid(
  6,
  5,
  10 * r,
  0,
  r,
  false,
  0xffa500,
  0xff0000
)) {
  app.stage.addChild(hexagon);
}
