
# How to run

## Install Node.js runtime

You'll need to install [Node.js](https://nodejs.org).


## Clone the repository

```shell
git clone https://github.com/radishmouse/cs404.1-021_final-project.git

cd cs404.1-021_final-project
```

## Install dependencies

```shell
npm run dev
```

## Open in browser

Go to `http://localhost:5173/` in your browser.

---

Initially set up via `pnpm`:

```shell
pnpm create vite barnes-hut-quadtree --template vanilla-ts
cd barnes-hut-quadtree
pnpm install p5
pnpm install --save-dev @types/p5
```

## Global mode

Per this [forum post](https://discourse.processing.org/t/cant-access-p5-vector-methods-in-typescript-like-random2d-and-sub/38315/2), add this to your .ts files to get your IDE to respect global mode:
```ts
/// <reference path="../../node_modules/@types/p5/global.d.ts" />
```
