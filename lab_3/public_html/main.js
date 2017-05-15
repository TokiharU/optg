var trees = [];
var mixers = [];
var container;
var camera, scene, renderer;
var clock = new THREE.Clock();
var N = 100;
var count_normal = 25;
var models = [];
var tick = 0;
var delta;
var mn = 10;
init();
animate();

function init()
{
    container = document.getElementById('container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(628, 500, 1500);
    camera.lookAt(new THREE.Vector3(628, 0, 128));

    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xff7F50, 1);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    addTriangle();
    loadModel('models/trees/', 'Tree.obj', 'Tree.mtl');
    loadModel('models/trees/', 'Palma 001.obj', 'Palma 001.mtl');

    loadAnimatedModel('models/animated/flamingo.js', 20, 1);
    loadAnimatedModel('models/animated/parrot.js', 20, 2);
    track();
    lights();
}

function onWindowResize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render()
{
    delta = clock.getDelta();
    for (var i = 0; i < mixers.length; i++)
    {
        mixers[ i ].update(delta);

    }
    move();
    renderer.render(scene, camera);
}

function animate()
{
    requestAnimationFrame(animate);

    render();
}

function move()
{
    tick = delta;
    if (models !== null)
    {
        for (var i = 0; i < models.length; i++)
        {
            console.log(models[i].mesh.position.x);
            models[i].mesh.position.copy(models[i].track[Math.floor(models[i].phase)]);
            //models[i].mesh.position.x += models[i].mesh.position.distanceTo(models[i].track[Math.floor(models[i].phase)]);
            if (models[i].phase + 1 >= models[i].track.length)
                models[i].phase = 0;
            models[i].mesh.lookAt(models[i].track[Math.round(models[i].phase)]);
            models[i].phase += models[i].speed * tick;
            //models[i].phase++;
        }
    }
}

function loadModel(path, oname, mname)
{
    //функция, выполняемая в процессе загрузки модели
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    //функция, выполняющая обработку ошибок, возникших в процессе загрузки
    var onError = function (xhr) {
        console.log('error');
    };

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl(path);
    mtlLoader.setPath(path);


    //функция загрузки материала
    mtlLoader.load(mname, function (materials)
    {
        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(path);

        //функция загрузки модели
        objLoader.load(oname, function (object)
        {
            object.position.x = 0;
            object.position.y = 0;
            object.position.z = 0;

            object.scale.set(0.2, 0.2, 0.2);

            tree = object;

            console.log(tree);
            trees.push(tree);
            for (var i = 0; i < count_normal; i++)
            {
                var x = Math.random() * 20 * 50;
                var z = Math.random() * 20 * 50;
                tree.position.set(x, 0, z);

                scene.add(tree.clone());
            }
            //scene.add(tree);

        }, onProgress, onError);
    });
}

function loadAnimatedModel(path, y, sp)
{
    var loader = new THREE.JSONLoader();
    loader.load(path, function (geometry)
    {
        geometry.computeVertexNormals();
        geometry.computeMorphNormals();
        var material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            morphTargets: true,
            morphNormals: true,
            vertexColors: THREE.FaceColors,
            shading: THREE.SmoothShading
        });
        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = Math.random() * 20 * 50;
        mesh.position.z = Math.random() * 20 * 75;
        mesh.position.y = y;


        mesh.scale.set(0.5, 0.5, 0.5);
        scene.add(mesh);

        var model = {};
        model.mesh = mesh;
        model.track = track(mesh.position.x, mesh.position.y, mesh.position.z);
        model.phase = 0.0;
        model.speed = sp;

        models.push(model);

        var mixer = new THREE.AnimationMixer(mesh);
        mixer.clipAction(geometry.animations[ 0 ]).setDuration(1).play();
        mixers.push(mixer);
    });
}

function track(x, y, z)
{
    {
        var curve1 = new THREE.CubicBezierCurve3(
                new THREE.Vector3(x - 30, y, 0), //P0
                new THREE.Vector3(x - 15, y, z + 45), //P1
                new THREE.Vector3(x + 60, y, z + 45), //P2
                new THREE.Vector3(x + 30, y, 0) //P3
                );
        var curve2 = new THREE.CubicBezierCurve3(
                new THREE.Vector3(x + 30, y, 0), //P0
                new THREE.Vector3(x + 30, y, z - 45), //P1
                new THREE.Vector3(x - 30, y, z - 45), //P2
                new THREE.Vector3(x - 30, y, 0) //P3
                );
        var vertices;
        vertices = curve1.getPoints(25);
        vertices.concat(curve2.getPoints(25));


        return vertices;
    }
}

function lights()
{
    var pointlight = new THREE.PointLight(0xa3a3a3, 5, 2000);
    pointlight.position.set(20, 20, 500);
    scene.add(pointlight);

    var light = new THREE.AmbientLight(0x202020); // soft white light
    scene.add(light);
}

function addTriangle()
{
    var geometry = new THREE.Geometry();
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++)
            geometry.vertices.push(new THREE.Vector3(i * 10, 0.0, j * 10));
    }
    for (i = 0; i < N - 1; i++) {
        for (j = 0; j < N - 1; j++)
        {
            geometry.faces.push(new THREE.Face3((i + j * N), (i + 1 + j * N), (i + (j + 1) * N)));
            geometry.faces.push(new THREE.Face3((i + (j + 1) * N), ((i + 1) + j * N), (i + j * N)));
        }

        geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 0),
            new THREE.Vector2(1, 1)]);
        geometry.faceVertexUvs[0].push([new THREE.Vector2(0, 0),
            new THREE.Vector2(1, 1),
            new THREE.Vector2(0, 1)]);
        var tex = new THREE.ImageUtils.loadTexture('grasstile.jpg');
        var mat = new THREE.MeshBasicMaterial({
            //map: tex,
            //side: THREE.DoubleSide
            wireframe: true

        });
        var triangleMesh = new THREE.Mesh(geometry, mat);
        triangleMesh.position.set(0.0, 0.0, 0.0);

        scene.add(triangleMesh);
    }
}
