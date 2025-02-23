import P5 from "p5";

export class P5Instance {
  private static instance: P5;

  static setInstance(p5: P5) {
    P5Instance.instance = p5;
  }

  static getInstance(): P5 {
    return P5Instance.instance;
  }
}
