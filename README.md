
Per this [forum post](https://discourse.processing.org/t/cant-access-p5-vector-methods-in-typescript-like-random2d-and-sub/38315/2), add this to your .ts files to get your IDE to respect global mode:
```ts
/// <reference path="../../node_modules/@types/p5/global.d.ts" />
```
