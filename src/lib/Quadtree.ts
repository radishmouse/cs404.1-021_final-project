import P5, { Vector } from "p5";
import { P5Instance } from "./p5Instance";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { mapDepthToColor } from "./utils";
import { G, SHOW_FORCES, THETA } from "../const";
import { Body } from "./Body";

export class QuadTree {
  p5: P5;
  boundary: Rectangle;
  capacity: number;
  points: Point[];
  depth: number;
  northwest?: QuadTree;
  northeast?: QuadTree;
  southwest?: QuadTree;
  southeast?: QuadTree;
  mass: number = 0;
  centerOfMassX: number = 0;
  centerOfMassY: number = 0;

  // Default to 1 point per cell.
  constructor(boundary: Rectangle, capacity: number = 1) {
    this.p5 = P5Instance.getInstance();
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.depth = 1;
  }

  hasChildren(): boolean {
    return (
      this.northeast !== undefined &&
      this.northwest !== undefined &&
      this.southeast !== undefined &&
      this.southwest !== undefined
    );
  }

  clear() {
    this.points = [];
    if (this.hasChildren()) {
      delete this.northwest;
      delete this.northeast;
      delete this.southwest;
      delete this.southeast;
    }
  }

  insert(point: Point, mass: number): boolean {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.hasChildren()) {
      if (this.points.length < this.capacity) {
        this.points.push(point);
        this.mass = mass;
        this.centerOfMassX = point.x;
        this.centerOfMassY = point.y;
        return true;
      }

      this.subdivide();
    }

    const inserted =
      this.northeast!.insert(point, mass) ||
      this.northwest!.insert(point, mass) ||
      this.southeast!.insert(point, mass) ||
      this.southwest!.insert(point, mass);

    if (inserted) {
      // Record the cummulative mass of descendents.
      this.mass =
        this.northeast!.mass +
        this.northwest!.mass +
        this.southeast!.mass +
        this.southwest!.mass;

      // Adjust center of mass X.
      this.centerOfMassX =
        (this.northeast!.centerOfMassX * this.northeast!.mass +
          this.northwest!.centerOfMassX * this.northwest!.mass +
          this.southeast!.centerOfMassX * this.southeast!.mass +
          this.southwest!.centerOfMassX * this.southwest!.mass) /
        this.mass;

      // Adjust center of mass Y.
      this.centerOfMassY =
        (this.northeast!.centerOfMassY * this.northeast!.mass +
          this.northwest!.centerOfMassY * this.northwest!.mass +
          this.southeast!.centerOfMassY * this.southeast!.mass +
          this.southwest!.centerOfMassY * this.southwest!.mass) /
        this.mass;
    }

    return inserted;
  }

  subdivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.w;
    const h = this.boundary.h;

    const northeastBoundary = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2);
    this.northeast = new QuadTree(northeastBoundary, this.capacity);
    this.northeast.depth = this.depth + 1;
    const northwestBoundary = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2);
    this.northwest = new QuadTree(northwestBoundary, this.capacity);
    this.northwest.depth = this.depth + 1;
    const southeastBoundary = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.southeast = new QuadTree(southeastBoundary, this.capacity);
    this.southeast.depth = this.depth + 1;
    const southwestBoundary = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2);
    this.southwest = new QuadTree(southwestBoundary, this.capacity);
    this.southwest.depth = this.depth + 1;

    // Move points to children.
    // This improves performance by placing points
    // in the smallest available rectangle.
    // NOTE: This is only valid if capacity is == 1.
    if (this.capacity !== 1 || this.points.length > 1) {
      throw Error("Incorrect mass distributed during subdivide");
    }
    for (const p of this.points) {
      const inserted =
        this.northeast.insert(p, this.mass) ||
        this.northwest.insert(p, this.mass) ||
        this.southeast.insert(p, this.mass) ||
        this.southwest.insert(p, this.mass);

      if (!inserted) {
        console.error("could not further subdivide");
        console.error("discarding point");
        // throw RangeError("capacity must be greater than 0");
      }
    }

    this.points = [];
  }

  calculateForce(body: Body): Vector {
    // If empty, return a zero vector.
    if (!this.hasChildren() && this.points.length === 0) {
      return this.p5.createVector(0, 0);
    }

    // Assume that if this Quadtree's x,y point
    // is the same as the body's x,y point,
    // it's the same point (i.e., the same Body).
    if (
      this.points.length === 1 &&
      this.points[0].x === body.pos.x &&
      this.points[0].y === body.pos.y
    ) {
      return this.p5.createVector(0, 0);
    }

    // Determine the distance between this Quadtree node.
    // and the Body we'll exert force on.
    const d = this.p5.dist(
      this.centerOfMassX,
      this.centerOfMassY,
      body.pos.x,
      body.pos.y,
    );

    // Get the size of the area represented by
    // this Quadtree node.
    const s = this.boundary.w * 2; // width of the region

    // If the ratio of size to distance is less than
    // our cutoff point (THEATA), we treat this
    // region as a single Body.
    // Or, if there are no subdivisions,
    // then this Quadtree only represents a single Body.
    if (s / d < THETA || !this.hasChildren()) {
      // Direction vector *from* other body to this body.
      // Note: we'll need to flip the direction later to make
      // this an attractive force.
      const force = this.p5.createVector(
        body.pos.x - this.centerOfMassX,
        body.pos.y - this.centerOfMassY,
      );
      if (SHOW_FORCES) {
        this.p5.strokeWeight(1);
        this.p5.stroke(255, 255, 255, 50);
        this.p5.noFill();
        this.p5.line(
          this.centerOfMassX,
          this.centerOfMassY,
          body.pos.x,
          body.pos.y,
        );
      }
      // Squared distance between the bodies.
      // This is faster than calculating the actual distance.
      const distanceSq = force.magSq();

      // Use minimum distance based on bodies' radii to prevent excessive forces.
      const minDistance = body.r * 2;

      // Max distance based on the sketch dimensions.
      const maxDistance = Math.max(this.p5.width, this.p5.height);

      // Constrain the distance to prevent extreme forces.
      const distance = this.p5.constrain(
        distanceSq,
        minDistance * minDistance,
        maxDistance,
      );

      // Calculate gravitational force using Newton's formula: F = G * (m1 * m2) / r²
      const strength = (G * this.mass * body.mass) / distance;

      // Set the force vector to the calculated strength.
      force.setMag(strength);

      // Negate the force to make it attractive.
      force.mult(-1);

      // Return the force so that it can be
      // cummulatively applied.
      return force;
    }

    // Otherwise, recursively calculate forces from children
    const totalForce = this.p5.createVector(0, 0);
    if (this.hasChildren()) {
      totalForce.add(this.northeast!.calculateForce(body));
      totalForce.add(this.northwest!.calculateForce(body));
      totalForce.add(this.southeast!.calculateForce(body));
      totalForce.add(this.southwest!.calculateForce(body));
    }

    // Return the force so that it can be
    // cummulatively applied.
    return totalForce;
  }

  // Useful for Boids, but not for Barnes-Hut.
  query(range: Rectangle, found: Point[]) {
    if (!found) {
      found = [];
    }
    if (!range.intersects(this.boundary)) {
      return found;
    }

    if (this.hasChildren()) {
      this.northeast!.query(range, found);
      this.northwest!.query(range, found);
      this.southeast!.query(range, found);
      this.southwest!.query(range, found);
      return found;
    }

    for (const p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }
    return found;
  }

  show() {
    const colors = mapDepthToColor(this.depth);
    this.p5.strokeWeight(1);
    this.p5.stroke(colors[0], colors[1], colors[2]);

    // stroke(150, 0, 150);

    this.p5.noFill();
    this.p5.rectMode(this.p5.CENTER);

    if (this.hasChildren()) {
      this.southwest!.show();
      this.southeast!.show();
      this.northeast!.show();
      this.northwest!.show();
    }

    this.p5.rect(
      this.boundary.x,
      this.boundary.y,
      this.boundary.w * 2,
      this.boundary.h * 2,
    );
  }
}
