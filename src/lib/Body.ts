import P5, { Vector } from "p5";
import { P5Instance } from "./p5Instance";
import { G, MAX_VELOCITY } from "../const";

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
    // this.vel = new Vector(this.p5.random(-1, 1), this.p5.random(-1, 1));
    this.acc = new Vector(0, 0);
    this.mass = m;
    this.r = Math.sqrt(this.mass) * 2;
  }

  applyForce(force: Vector) {
    const f = this.p5.createVector();
    Vector.div(force, this.mass, f);
    this.acc.add(f);
  }

  attract(body: Body) {
    // Direction vector from this body to the other body.
    const force = Vector.sub(body.pos, this.pos);

    // Squared distance between the bodies.
    // This is faster than calculating the actual distance.
    const distanceSq = force.magSq();

    // Use minimum distance based on bodies' radii to prevent excessive forces.
    const minDistance = this.r + body.r;

    // Max distance based on the sketch dimensions.
    const maxDistance = Math.max(this.p5.width, this.p5.height);

    // Constrain the distance to prevent extreme forces.
    const distance = this.p5.constrain(
      distanceSq,
      minDistance * minDistance,
      maxDistance,
    );

    // Calculate gravitational force using Newton's formula: F = G * (m1 * m2) / r²
    const strength = (G * (this.mass * body.mass)) / distance;

    // Set the force vector to the calculated strength.
    force.setMag(strength);

    // Negate the force to make it attractive.
    force.mult(-1);

    // Apply the force to the other body.
    body.applyForce(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(MAX_VELOCITY);
    this.acc.set(0, 0);
  }

  show(size: number = 1, colorName?: string) {
    this.p5.noStroke();
    this.p5.strokeWeight(this.p5.constrain(size * (this.mass / 10), 0, 80));
    //fill(255, 200);
    //ellipse(this.pos.x, this.pos.y, this.r);
    if (colorName) {
      this.p5.stroke(colorName);
    } else {
      this.p5.stroke(255, 0, 0);
    }
    this.p5.point(this.pos.x, this.pos.y);
  }
}
