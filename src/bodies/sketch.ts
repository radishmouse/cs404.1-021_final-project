import P5 from "p5";
import { HEIGHT, WIDTH } from "../const";
import { Body } from "../lib/Body";
import { P5Instance } from "../lib/p5Instance";
import { QuadTree } from "../lib/Quadtree";
import { Rectangle } from "../lib/Rectangle";
import { Point } from "../lib/Point";

const bodies: Body[] = [];
const p5Sketch = new P5(sketch);
let quadtree: QuadTree;

console.log(`Created new sketch`);
console.log(p5Sketch);

function sketch(p5: P5) {
  P5Instance.setInstance(p5);
  // const wind = p5.createVector(0.05, 0);

  p5.setup = () => {
    const canvas = p5.createCanvas(WIDTH, HEIGHT);
    canvas.mousePressed(mousePressed);
    const boundary = new Rectangle(
      p5.width / 2,
      p5.height / 2,
      p5.width / 2,
      p5.height / 2,
    );
    quadtree = new QuadTree(boundary);
    // canvas.mouseMoved(mousePressed);
  };

  p5.draw = () => {
    p5.background(0);
    quadtree.clear();
    for (const body of bodies) {
      // body.attract();
      // body.applyForce(wind);
      body.update();
      body.show();
      quadtree.insert(new Point(body.pos.x, body.pos.y));
    }
    quadtree.show();
  };
}

function mousePressed(evt: MouseEvent) {
  bodies.push(new Body(bodies.length, evt.x, evt.y, 0, 0, 10));
}
