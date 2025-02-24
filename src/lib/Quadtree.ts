import P5 from "p5";
import { P5Instance } from "./p5Instance";
import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { mapDepthToColor } from "./utils";

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

  insert(point: Point): boolean {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (!this.hasChildren()) {
      if (this.points.length < this.capacity) {
        this.points.push(point);
        return true;
      }

      this.subdivide();
    }

    return (
      this.northeast!.insert(point) ||
      this.northwest!.insert(point) ||
      this.southeast!.insert(point) ||
      this.southwest!.insert(point)
    );

    return false;
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
    for (const p of this.points) {
      const inserted =
        this.northeast.insert(p) ||
        this.northwest.insert(p) ||
        this.southeast.insert(p) ||
        this.southwest.insert(p);

      if (!inserted) {
        throw RangeError("capacity must be greater than 0");
      }
    }

    this.points = [];
  }

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
