import P5 from "p5";
import { HEIGHT, WIDTH } from "../const";

let mx = 1;
let my = 1;
let easing = 0.05;
let radius = 24;
let edge = 100;
let inner = edge + radius;

function setup(p5: P5) {
  p5.createCanvas(WIDTH, HEIGHT);
  p5.noStroke();
  p5.ellipseMode(p5.RADIUS);
  p5.rectMode(p5.CORNERS);
}

function draw(p5: P5) {
  p5.background(0);

  if (p5.abs(p5.mouseX - mx) > 0.1) {
    mx = mx + (p5.mouseX - mx) * easing;
  }
  if (p5.abs(p5.mouseY - my) > 0.1) {
    my = my + (p5.mouseY - my) * easing;
  }

  mx = p5.constrain(mx, inner, p5.width - inner);
  my = p5.constrain(my, inner, p5.height - inner);
  p5.fill(237, 34, 93);
  p5.rect(edge, edge, p5.width - edge, p5.height - edge);
  p5.fill(255);
  p5.ellipse(mx, my, radius, radius);
}

function sketch(p5: P5) {
  p5.setup = () => {
    setup(p5);
  };

  p5.draw = () => {
    draw(p5);
  };
}

new P5(sketch);
