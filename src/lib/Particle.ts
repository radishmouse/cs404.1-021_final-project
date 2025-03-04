import P5, { Vector } from "p5";
import { P5Instance } from "./p5Instance";
import {
  COLOR_PARTICLE,
  G,
  MAX_VELOCITY,
  USE_RAINBOW,
  RAINBOW_COLORS,
  SHOW_FORCES,
  MASS_BODY_MIN,
  MASS_BODY_MAX,
  MASS_SUN,
} from "../const";

export class Particle {
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
    vx: number = 0,
    vy: number = 0,
    m: number = -1,
  ) {
    this.p5 = P5Instance.getInstance();
    this.id = id;
    this.pos = new Vector(x, y);
    this.vel = new Vector(vx, vy);
    // Test that a body can move.
    // this.vel = new Vector(this.p5.random(-1, 1), this.p5.random(-1, 1));
    this.acc = new Vector(0, 0);
    if (m === -1) {
      m = this.p5.random(MASS_BODY_MIN, MASS_BODY_MAX);
    }
    this.mass = m;
    this.r = Math.sqrt(this.mass) * 2;
  }

  applyForce(force: Vector, isPaused: boolean = false) {
    if (isPaused) {
      return;
    }
    const f = this.p5.createVector();
    Vector.div(force, this.mass, f);
    this.acc.add(f);
  }

  attract(body: Particle, isPaused: boolean = false) {
    // Direction vector *from* other body to this body.
    // Note: we'll need to flip the direction later to make
    // this an attractive force.
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
    if (SHOW_FORCES) {
      this.p5.strokeWeight(1);
      this.p5.stroke(255, 255, 255, 50);
      this.p5.noFill();
      this.p5.line(this.pos.x, this.pos.y, body.pos.x, body.pos.y);
    }
    // Negate the force to make it attractive.
    force.mult(-1);

    // Apply the force to the other body.
    body.applyForce(force, isPaused);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(MAX_VELOCITY);
    this.acc.set(0, 0);
  }

  show(size: number = 1, colorName: string = COLOR_PARTICLE) {
    this.p5.noStroke();
    this.p5.strokeWeight(this.p5.constrain(size * (this.mass / 10), 0, 80));
    //fill(255, 200);
    //ellipse(this.pos.x, this.pos.y, this.r);
    if (USE_RAINBOW && this.mass !== MASS_SUN) {
      this.p5.stroke(RAINBOW_COLORS[this.id % RAINBOW_COLORS.length]);
    } else {
      this.p5.stroke(colorName);
    }
    // if (colorName) {
    // } else {
    //   this.p5.stroke(255, 0, 0);
    // }
    this.p5.point(this.pos.x, this.pos.y);
    // const halfSize = this.p5.constrain(size * (this.mass / 10), 0, 80) / 2;
    // this.p5.quad(
    //   this.pos.x,
    //   this.pos.y - halfSize, // top point
    //   this.pos.x + halfSize / 2,
    //   this.pos.y, // right point
    //   this.pos.x,
    //   this.pos.y + halfSize, // bottom point
    //   this.pos.x - halfSize / 2,
    //   this.pos.y, // left point
    // );
  }
}
