import * as BABYLON from 'https://cdn.babylonjs.com/babylon.js';
import 'https://cdn.babylonjs.com/loaders/babylonjs.loaders.min.js';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = async () => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.95, 0.95, 0.95, 1);

  // Camera
  const camera = new BABYLON.ArcRotateCamera("ArcCamera",
    Math.PI / 2, Math.PI / 3, 30, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  // Ánh sáng
  const light = new BABYLON.HemisphericLight("hemiLight",
    new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.9;

  // Sàn
  const groundMat = new BABYLON.StandardMaterial("groundMat", scene);
  const groundTexture = new BABYLON.Texture("assets/textures/floor.jpg", scene);
  groundMat.diffuseTexture = groundTexture;

  const ground = BABYLON.MeshBuilder.CreateGround("ground",
    { width: 50, height: 50 }, scene);
  ground.material = groundMat;

  // Tường vòm đơn giản
  const dome = BABYLON.MeshBuilder.CreateSphere("dome",
    { diameter: 50, slice: 0.5 }, scene);
  dome.position.y = 0;
  const domeMat = new BABYLON.StandardMaterial("domeMat", scene);
  domeMat.alpha = 0.1;
  dome.material = domeMat;

  // Thêm mannequin (GLB)
  const mannequinPaths = [
    "assets/mannequin1.glb",
    "assets/mannequin2.glb",
    "assets/mannequin3.glb",
    // thêm các mannequin khác
  ];

  mannequinPaths.forEach((path, index) => {
    BABYLON.SceneLoader.ImportMesh("", "", path, scene, (meshes) => {
      meshes.forEach(mesh => {
        mesh.position = new BABYLON.Vector3(index * 5 - 10, 0, 0);
        mesh.scaling = new BABYLON.Vector3(1.2, 1.2, 1.2);
      });
    });
  });

  // Thêm bệ đỡ
  for (let i = 0; i < mannequinPaths.length; i++) {
    const pedestal = BABYLON.MeshBuilder.CreateCylinder(`pedestal_${i}`,
      { diameter: 2, height: 0.5 }, scene);
    pedestal.position = new BABYLON.Vector3(i * 5 - 10, -0.25, 0);
    const pedestalMat = new BABYLON.StandardMaterial(`pedestalMat_${i}`, scene);
    pedestalMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    pedestal.material = pedestalMat;
  }

  return scene;
};

createScene().then(scene => {
  engine.runRenderLoop(() => {
    scene.render();
  });
});

window.addEventListener('resize', function () {
  engine.resize();
});
