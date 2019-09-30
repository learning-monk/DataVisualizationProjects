**cube:**

- To create a cube, we need a _BoxGeometry_. This is an object that contains all the points (vertices) and fill (faces) of the cube.
- Three.js comes with several materials, but we'll stick to the _MeshBasicMaterial_ for now.
- The third thing we need is a _Mesh_. A mesh is an object that takes a geometry, and applies a material to it, which we then can insert to our scene, and move freely around.

**animate()**
This will create a loop that causes the renderer to draw the scene every time the screen is refreshed (on a typical screen this means 60 times per second).
