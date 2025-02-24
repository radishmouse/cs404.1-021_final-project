import { Point } from "./Point";

export class Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point: Point): boolean {
    const isWithinBounds =
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h;
    return isWithinBounds;
  }

  intersects(boundary: Rectangle) {
    const boundaryR = boundary.x + boundary.w;
    const boundaryL = boundary.x - boundary.w;
    const boundaryT = boundary.y - boundary.h;
    const boundaryB = boundary.y + boundary.h;

    const rangeR = this.x + this.w;
    const rangeL = this.x - this.w;
    const rangeT = this.y - this.h;
    const rangeB = this.y + this.h;

    const doesOverlap =
      boundaryR >= rangeL &&
      boundaryL <= rangeR &&
      boundaryT <= rangeB &&
      boundaryB >= rangeT;

    return doesOverlap;
  }
}
