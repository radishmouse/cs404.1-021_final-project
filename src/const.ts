export const USE_BARNES_HUT_DEFAULT = true;
export const USE_GRAVITY_DEFAULT = false;
export const USE_RAINBOW = false;
export const SHOW_FORCES = true;

export const COLOR_PARTICLE = "#eee2d2";
export const COLOR_SUN = "#f2cc99";
export const COLOR_QUADTREE = "#a66e5a";

export const THETA = 1.9; // This is the cutoff
export const SHOW_QUAD_TREE = true;

export const ADD_DEFAULT_SUN = false;
export const PARTICLE_DEFAULT_SIZE = 2;
export const HOW_MANY = 0;
export const MAX_VELOCITY = 35;
export const G = 0.35;
// Values for Barnes-Hut, THETA = 0.5
// 30 FPS @500 bodies
// 20 FPS @800 bodies
// 15 FPS @1000 bodies
// 10 FPS @1200 bodies
// 8 FPS @1500 bodies

// Pairwise N^2, velocities 15-35
// 60 FPS, up to 200 bodies.
// 30 FPS @300 bodies
// 15 FPS @400 bodies
// 10 FPS @500 bodies (looks better with MAX_VELOCITY = 55)
// export const HOW_MANY = 300;
// export const G = 0.35;
// export const MAX_VELOCITY = 35;

export const WIDTH = 600;
export const HEIGHT = 600;
export const MASS_SUN = 600;
export const MASS_BODY_MIN = 25;
export const MASS_BODY_MAX = 50;

export const RAINBOW_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
];
