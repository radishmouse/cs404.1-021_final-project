import P5, { Vector } from "p5";
import { HEIGHT, HOW_MANY, WIDTH } from "../const";
import { Body } from "../lib/Body";
import { P5Instance } from "../lib/p5Instance";
import { QuadTree } from "../lib/Quadtree";
import { Rectangle } from "../lib/Rectangle";
import { Point } from "../lib/Point";

let quadtree: QuadTree;
const bodies: Body[] = [];
const suns: Body[] = [];
const p5Sketch = new P5(sketch);

console.log(`Created new sketch`);
console.log(p5Sketch);

function sketch(p5: P5) {
  P5Instance.setInstance(p5);
  // const testForce = p5.createVector(0, 0.05);

  suns.push(new Body(0, WIDTH / 2, HEIGHT / 2, 0, 0, 300));
  let count = 0;
  let fpsEl!: Element;
  const el = document.querySelector("#fps");
  if (el) {
    fpsEl = el;
  }

  p5.setup = () => {
    const canvas = p5.createCanvas(WIDTH, HEIGHT);
    canvas.mouseClicked(mouseClicked);
    canvas.doubleClicked(mouseDoubleClicked);
    const boundary = new Rectangle(
      p5.width / 2,
      p5.height / 2,
      p5.width / 2,
      p5.height / 2,
    );
    quadtree = new QuadTree(boundary);
    for (let i = 0; i < HOW_MANY; i++) {
      const pos = Vector.random2D();
      const vel = pos.copy();
      vel.setMag(p5.random(10, 15));
      pos.setMag(p5.random(150, 200));
      vel.rotate(p5.PI / 2);
      const m = p5.random(25, 50);

      bodies.push(
        new Body(
          bodies.length, // "auto-incrementing" IDs
          p5.random(0, WIDTH), // initial x position
          p5.random(0, HEIGHT), // initial y position
          vel.x, // initial x velocity
          vel.y, // initial y velocity
          m, // mass
        ),
      );
    }
  };

  p5.draw = () => {
    p5.background(0);
    quadtree.clear();
    for (const body of bodies) {
      quadtree.insert(new Point(body.pos.x, body.pos.y), body.mass);
    }

    for (const body of bodies) {
      for (let sun of suns) {
        sun.attract(body);
      }
      // This is the N^2 version
      for (const neighbor of bodies) {
        if (body.id !== neighbor.id) {
          body.attract(neighbor);
        }
      }

      // This is where we query the quadtree
      // Then, do the O(N logN) using the quadtree
      // query the quadtree for neighbors of body
      // for each neighbor (that !== body)
      // add the gravitational effect as a force for this body
      //
      body.update();
      body.show(2);
    }

    quadtree.show();
    count++;
    if (count >= 30) {
      fpsEl.textContent = `FPS: ${Math.floor(p5.frameRate())}`;
      count = 0;
    }
    for (let sun of suns) {
      sun.update();
      sun.show(0.25, "white");
    }
  };
}

function mouseClicked(evt: MouseEvent) {
  // for (let i = 0; i < 10; i++) {
  //   bodies.push(new Body(bodies.length, evt.x + i, evt.y + i, 0, 0, 10));
  // }
  bodies.push(new Body(bodies.length, evt.x, evt.y, 0, 0, 25));
}

function mouseDoubleClicked(evt: MouseEvent) {
  suns.push(new Body(suns.length, evt.x, evt.y, 0, 0, 600));
}
