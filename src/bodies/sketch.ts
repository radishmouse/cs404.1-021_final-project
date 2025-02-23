import P5 from "p5";
import { HEIGHT, WIDTH } from "../const";
import { Body } from "../lib/Body";
import { P5Instance } from "../lib/p5Instance";

const bodies: Body[] = [];
const p5Sketch = new P5(sketch);
console.log(`Created new sketch`);
console.log(p5Sketch);

function sketch(p5: P5) {
  P5Instance.setInstance(p5);

  const wind = p5.createVector(0.05, 0);

  p5.setup = () => {
    const canvas = p5.createCanvas(WIDTH, HEIGHT);
    canvas.mousePressed(mousePressed);
    // canvas.mouseMoved(mousePressed);
  };

  p5.draw = () => {
    p5.background(0);
    for (const body of bodies) {
      // body.attract();
      body.applyForce(wind);
      body.update();
      body.show();
    }
  };
}

function mousePressed(evt: MouseEvent) {
  bodies.push(new Body(bodies.length, evt.x, evt.y, 0, 0, 10));
}
