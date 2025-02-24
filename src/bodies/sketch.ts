import P5 from "p5";
import { HEIGHT, HOW_MANY, WIDTH } from "../const";
import { Body } from "../lib/Body";
import { P5Instance } from "../lib/p5Instance";
import { QuadTree } from "../lib/Quadtree";
import { Rectangle } from "../lib/Rectangle";
import { Point } from "../lib/Point";

let quadtree: QuadTree;
const bodies: Body[] = [];
const p5Sketch = new P5(sketch);

console.log(`Created new sketch`);
console.log(p5Sketch);

function sketch(p5: P5) {
  P5Instance.setInstance(p5);
  // const testForce = p5.createVector(0, 0.05);

  // const sun = new Body(0, WIDTH / 2, HEIGHT / 2, 0, 0, 500);
  let count = 0;
  let fpsEl!: Element;
  const el = document.querySelector("#fps");
  if (el) {
    fpsEl = el;
  }

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
    for (let i = 0; i < HOW_MANY; i++) {
      bodies.push(
        new Body(
          bodies.length, // "auto-incrementing" IDs
          p5.random(0, WIDTH), // initial x position
          p5.random(0, HEIGHT), // initial y position
          p5.random(-1, 1), // initial x velocity
          0, // initial y velocity
          p5.random(10), // mass
        ),
      );
    }
  };

  p5.draw = () => {
    p5.background(0);
    quadtree.clear();
    for (const body of bodies) {
      quadtree.insert(new Point(body.pos.x, body.pos.y));
    }

    for (const body of bodies) {
      // sun.attract(body);
      // First, do the O(n^2)
      // nested loop
      // shouldn't I do i, j so that I can start j at i?
      for (const neighbor of bodies) {
        if (body.id !== neighbor.id) {
          body.attract(neighbor);
        }
      }
      //
      // Then, do the O(N logN) using the quadtree
      // query the quadtree for neighbors of body
      // for each neighbor (that !== body)
      // add the gravitational effect as a force for this body
      //
      body.update();
      body.show();
    }

    quadtree.show();
    count++;
    if (count >= 60) {
      fpsEl.textContent = `FPS: ${Math.floor(p5.frameRate())}`;
      count = 0;
    }
    // sun.update();
    // sun.show(20, "orange");
  };
}

function mousePressed(evt: MouseEvent) {
  // for (let i = 0; i < 10; i++) {
  //   bodies.push(new Body(bodies.length, evt.x + i, evt.y + i, 0, 0, 10));
  // }
  bodies.push(new Body(bodies.length, evt.x, evt.y, 0, 0, 2));
}
