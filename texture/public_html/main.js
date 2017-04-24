/* global THREE, windows */

var container;
var camera, scene, renderer;
var geometry;
var N = 10;

init();
animate();

function init()
{
    container = document.getElementById('container');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 40, 0);
    camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

    geometry = new THREE.Geometry();

    for (var i = 0; i < N; i++)
        for (var j = 0; j < N; j++)
            geometry.vertices.push(new THREE.Vector3(i, 0, j));
    for (var i = 0; i < N; i++)
        for (var j = 0; j < N; j++)
        {
            geometry.faces.push(new THREE.Face3(j * N + i, j * N + i +1, (j+1) * N + i ));
            geometry.faces.push(new THREE.Face3((j+1) * N + i, (j+1) * N + i+1 + N, j * N + i + 1));
        }

    var triangleMaterial = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide
    });
    var triangleMesh = new THREE.Mesh(geometry, triangleMaterial);
    triangleMesh.position.set(0.0, 0.0, 0.0);

    scene.add(triangleMesh);

    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000088, 1);

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate()
{
    requestAnimationFrame(animate);
    render();
}
function render()
{
    renderer.render(scene, camera);
}