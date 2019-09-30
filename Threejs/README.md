**_These projects are created using Three.js data visualization library_**

_What is Three.js library?_
Three.js is a 3D library that makes displaying 3D content on a web page possible with webGL.

- To display anything with three.js, we need three things:
  - scene
  - camera
  - renderer

**Scene:** A scene holds all the elements such as objects, cameras and lights
**Camera:** The Camera determines what you will see in the output. You may need _Perspective Camera_ or a _Orthographic Camera_.

- The first attribute in Prospective Camera is **FOV** (field of view). FOV is the extent of the scene that is seen on the display at any given moment. The value is in degrees.
- The second id the **aspect ratio** which is determined by width of the element divided by its height.
- The next two attributes are **near** and **far** clipping plane. What that means, is that objects further away from the camera than the value of far or closer than near won't be rendered.

**Renderer:** This is where the magic happens. In addition to the WebGLRenderer we use here, three.js comes with a few others, often used as fallbacks for users with older browsers or for those who don't have WebGL support for some reason.

In addition to creating the renderer instance, we also need to set the size at which we want it to render our app. It's a good idea to use the width and height of the area we want to fill with our app - in this case, the width and height of the browser window. For performance intensive apps, you can also give setSize smaller values, like window.innerWidth/2 and window.innerHeight/2, which will make the app render at half size.

If you wish to keep the size of your app but render it at a lower resolution, you can do so by calling setSize with false as updateStyle (the third argument). For example, setSize(window.innerWidth/2, window.innerHeight/2, false) will render your app at half resolution, given that your <canvas> has 100% width and height.

At last, we add the renderer element to our HTML document. The renderer uses <canvas> element to display the scene to us.
