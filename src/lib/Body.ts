import P5, { Vector } from "p5";
import { P5Instance } from "./p5Instance";

export class Body {
  pos: Vector;
  vel: Vector;
  acc: Vector;
  mass: number;
  r: number;
  p5: P5;

  constructor(x: number, y: number, vx: number, vy: number, m: number) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(vx, vy);
    this.acc = new Vector(0, 0);
    this.mass = m;
    this.r = Math.sqrt(this.mass) * 2;
    this.p5 = P5Instance.getInstance();
  }

  applyForce(force: Vector) {
    force.div(this.mass);
    this.acc.add(force);
  }

  // attract(body: Body) {
  //   const force = Vector.sub(this.pos, body.pos);
  //   const distanceSq = constrain(n, low, high);
  // }
  //

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
    this.p5.stroke(255);
    this.p5.point(this.pos.x, this.pos.y);
  }
}
