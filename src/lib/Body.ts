import P5, { Vector } from "p5";
import { P5Instance } from "./p5Instance";

export class Body {
  p5: P5;
  id: number;
  pos: Vector;
  vel: Vector;
  acc: Vector;
  mass: number;
  r: number;

  constructor(
    id: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
    m: number,
  ) {
    this.p5 = P5Instance.getInstance();
    this.id = id;
    this.pos = new Vector(x, y);
    this.vel = new Vector(vx, vy);
    // Test that a body can move.
    this.vel = new Vector(this.p5.random(-1, 1), this.p5.random(0, 1));
    this.acc = new Vector(0, 0);
    this.mass = m;
    this.r = Math.sqrt(this.mass) * 2;
  }

  applyForce(force: Vector) {
    const f = this.p5.createVector();
    Vector.div(force, this.mass, f);
    this.acc.add(f);
  }

  // body: Body
  attract() {
    // const force = Vector.sub(this.pos, body.pos);
    // const distanceSq = constrain(n, low, high);
    const gravity = new Vector(0, 0.5);
    this.applyForce(gravity);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(15);
    this.acc.set(0, 0);
  }

  show() {
    this.p5.noStroke();
    this.p5.strokeWeight(8);
    //fill(255, 200);
    //ellipse(this.pos.x, this.pos.y, this.r);
    this.p5.stroke(255, 0, 0);
    this.p5.point(this.pos.x, this.pos.y);
  }
}
