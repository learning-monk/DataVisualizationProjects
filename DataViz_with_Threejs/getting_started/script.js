function init() {
  // Create a scene that holds all our element such as objects, cameras and lights
  const scene = new THREE.Scene();

  // Camera determines what you will see in the output
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Create a renderer and set the size
  const renderer = new THREE.WebGLRenderer();
  // renderer.setClearColorHex(); //this line is not required
  renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // add the output of the renderer to the HTML element
  document.body.appendChild(renderer.domElement);

  // Create a cube
  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: false
  });
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // position the cube
  cube.position.z = 0;

  scene.add(cube);

  // Create a sphere
  const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    wireframe: true
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // position the sphere
  sphere.position.z = 2;

  scene.add(sphere);

  // Position and point camera to the center of the scene
  camera.position.z = 5;

  // render the scene
  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();
}

window.onload = init;
