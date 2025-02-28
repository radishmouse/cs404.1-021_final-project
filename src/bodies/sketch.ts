import P5 from "p5";
import {
  ADD_SUN as ADD_DEFAULT_SUN,
  COLOR_SUN,
  HEIGHT,
  HOW_MANY,
  MASS_BODY_MAX,
  MASS_BODY_MIN,
  MASS_SUN,
  SHOW_QUAD_TREE,
  USE_BARNES_HUT,
  IS_GRAVITY_ON,
  WIDTH,
} from "../const";
import { Body } from "../lib/Body";
import { P5Instance } from "../lib/p5Instance";
import { QuadTree } from "../lib/Quadtree";
import { Rectangle } from "../lib/Rectangle";
import { Point } from "../lib/Point";

let quadtree: QuadTree;
const bodies: Body[] = [];
const suns: Body[] = [];
const p5Sketch = new P5(sketch);

const ACTION_ADD_BODY = "action_add_body";
const ACTION_ADD_SUN = "action_add_sun";
const actions: string[] = [];

let isPaused = false;

console.log(`Created new sketch`);
console.log(p5Sketch);

function sketch(p5: P5) {
  P5Instance.setInstance(p5);
  // A fixed sun, in the center of the sketch.
  if (ADD_DEFAULT_SUN) {
    suns.push(new Body(0, WIDTH / 2, HEIGHT / 2, 0, 0, MASS_SUN));
  }
  let count = 0;
  let fpsEl!: Element;
  const el = document.querySelector("#fps");
  if (el) {
    fpsEl = el;
  }

  p5.setup = () => {
    const canvas = p5.createCanvas(WIDTH, HEIGHT);
    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key === "z") {
        if (actions.length === 0) {
          return;
        }

        const last_action = actions.pop();
        if (last_action === ACTION_ADD_SUN) {
          suns.pop();
        } else if (last_action === ACTION_ADD_BODY) {
          bodies.pop();
        }
      }
    });
    canvas.mouseClicked(() => {
      if (p5.keyIsDown(p5.CONTROL)) {
        console.log("add sun");
        addSun(p5.mouseX, p5.mouseY);
      } else if (p5.keyIsDown(p5.ALT)) {
        console.log("pause/unpause");
        isPaused = !isPaused;
      } else {
        addBody(p5.mouseX, p5.mouseY);
      }
    });

    const boundary = new Rectangle(
      p5.width / 2,
      p5.height / 2,
      p5.width / 2,
      p5.height / 2,
    );
    quadtree = new QuadTree(boundary);
    for (let i = 0; i < HOW_MANY; i++) {
      // const pos = Vector.random2D();
      // const vel = pos.copy();
      // vel.setMag(p5.random(10, 15));
      // pos.setMag(p5.random(150, 200));
      // vel.rotate(p5.PI / 2);
      const m = p5.random(MASS_BODY_MIN, MASS_BODY_MAX);

      bodies.push(
        new Body(
          bodies.length, // "auto-incrementing" IDs
          p5.random(0, WIDTH), // initial x position
          p5.random(0, HEIGHT), // initial y position
          0, // initial x velocity
          0, // initial y velocity
          m, // mass
        ),
      );
    }
  };

  p5.draw = () => {
    p5.background(0);

    // Build a new quadtree of x,y point and mass of each Body.
    // This is an O(N logN) operation.
    quadtree.clear();
    for (const body of bodies) {
      quadtree.insert(new Point(body.pos.x, body.pos.y), body.mass);
    }

    // Calculate and apply the gravitational forces
    // for each Body.
    for (const body of bodies) {
      if (IS_GRAVITY_ON) {
        for (let sun of suns) {
          // We can add multiple "suns" to create
          // some additional gravity.
          sun.attract(body);
        }

        // There's a global const that determines if
        // we're in Barnes-Hut mode or pairwise-comparision mode.
        if (USE_BARNES_HUT) {
          // Start at the root, and accumulate the gravitational
          // forces exerted on this Body. This will
          // recursively call `calculateForce` as we work
          // down towards leaf nodes.
          const force = quadtree.calculateForce(body);

          // Apply the cummulative force on this Body.
          body.applyForce(force, isPaused);
        } else {
          // This is the N^2 version
          // that compares every Body to every
          // other Body.
          for (const neighbor of bodies) {
            if (body.id !== neighbor.id) {
              body.attract(neighbor, isPaused);
            }
          }
        }
      }
      if (!isPaused) {
        body.update();
      }
      body.show(2);
    }

    if (SHOW_QUAD_TREE && USE_BARNES_HUT) {
      quadtree.show();
    }
    count++;
    if (count >= 30) {
      fpsEl.textContent = `FPS: ${Math.floor(p5.frameRate())}`;
      count = 0;
    }
    for (let sun of suns) {
      sun.update();
      sun.show(0.25, COLOR_SUN);
    }
  };
}

function addBody(x: number, y: number) {
  // for (let i = 0; i < 10; i++) {
  //   bodies.push(new Body(bodies.length, evt.x + i, evt.y + i, 0, 0, 10));
  // }
  bodies.push(new Body(bodies.length, x, y, 0, 0, 25));
  actions.push(ACTION_ADD_BODY);
}

function addSun(x: number, y: number) {
  suns.push(new Body(suns.length, x, y, 0, 0, MASS_SUN));
  actions.push("sun");
  actions.push(ACTION_ADD_SUN);
}
