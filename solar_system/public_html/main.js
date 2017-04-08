// global THREEx, THREE 

var container;
var camera, scene, renderer;

var clock = new THREE.Clock();
var angle = 0;
var planets = [];

var track=[];
var mtrack;

var keyboard = new THREEx.KeyboardState();
var key;
var shift=0;

init();
animate();


function init()
{
    container = document.getElementById('container');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 500, 0);
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer({antialias: false});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xFFFFFF, 1);

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    addSphere(0, 0, 0, 700, 1, 'Texture/starmap.jpg', null, false);
    addSphere(0, 0, 0, 10 * 4, 1.5, 'Texture/sunmap.jpg', null, false);
    addSphere(70, 0, 0, 10 * 0.38, 0.8, 'Texture/mercurymap.jpg', 'Texture/mercurybump.jpg', true);
    addSphere(110, 0, 0, 10 * 0.72, 0.65, 'Texture/venusmap.jpg', 'Texture/venusbump.jpg', true);
    addSphere(150, 0, 0, 10 * 1, 0.6, 'Texture/earthmap1k.jpg', 'Texture/earthbump1k.jpg', true);
    addSphere(165, 0, 0, 10 * 0.25, 0.85, 'Texture/moonmap1k.jpg', 'Texture/moonbump1k.jpg', true);
    lights();
    Track();
    MTrack();
   // EarthCloud ();
    

}

function addSphere(x, y, z, r, k, path, pathb, light)
{
    var geometry = new THREE.SphereGeometry(r, 32, 32);

    var texture = new THREE.ImageUtils.loadTexture(path);
    texture.minFilter = THREE.NearestFilter;
    

    if (light)
        var material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
    else
        var material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
     material.bumpMap = THREE.ImageUtils.loadTexture(pathb);
    material.bumpScale = 2;

    var sphere = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);

    var planet = {};

    planet.sphere = sphere;
    planet.angle1 = 0;
    planet.angle2 = 1;
    planet.radius = x;
    planet.k = k;

    planets.push(planet);
    /*
    var geometry = new THREE.SphereGeometry(0.51,32,32);
    var material = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvasResult),
        side:THREE.DoubleSide,
        transparent: true,
        opacity:0.8,
    });
     var mesh = new THREE.Mesh(geometry,material);
    return mesh;*/

    scene.add(sphere);
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
    move();

}

function render()
{
    KeyboardState();
    renderer.render(scene, camera);
}

function move()
{
    var dt = clock.getDelta();
    for (var i = 2; i < planets.length - 1; i++)
    {
        planets[i].angle1 += dt * planets[i].k;

        planets[i].sphere.position.x = planets[i].radius * Math.cos(planets[i].angle1);
        planets[i].sphere.position.z = planets[i].radius * Math.sin(planets[i].angle1);
        planets[i].sphere.rotateOnAxis(new THREE.Vector3(0, 1, 0), planets[i].angle2 * dt);
    }
    planets[5].angle1 += dt * planets[5].k;
    planets[5].sphere.position.set(15 * Math.cos(planets[5].angle1) + planets[4].sphere.position.x, 0,
            15 * Math.sin(planets[5].angle1) + planets[4].sphere.position.z);
    planets[5].sphere.rotateOnAxis(new THREE.Vector3(0, 1, 0), planets[5].angle2 * dt);

    mtrack.position.copy(planets[4].sphere.position);

}

function Track()
{
    for (var i = 2; i < planets.length - 1; i++)
    {
        var lineGeometry = new THREE.Geometry();
        var vertArray = lineGeometry.vertices;
        var x = 0;
        var z = 0;
        for (var j = 0; j < 360; j++)
        {
            x = planets[i].radius * Math.cos(j * Math.PI / 180);
            z = planets[i].radius * Math.sin(j * Math.PI / 180);
            vertArray.push(new THREE.Vector3(x, 0, z));
            lineGeometry.computeLineDistances();
        }
        var lineMaterial = new THREE.LineDashedMaterial({color: 0xcccc00, dashSize: 10, gapSize: 5});
        var line = new THREE.Line(lineGeometry, lineMaterial);
        track.push(line);
        scene.add(line);
    }
}

function MTrack()
{
    var lineGeometry = new THREE.Geometry();
    var vertArray = lineGeometry.vertices;
    for (var j = 0; j < 360; j++)
    {
        x = planets[4].radius * Math.cos(j * Math.PI / 180) / 10;
        z = planets[4].radius * Math.sin(j * Math.PI / 180) / 10;
        vertArray.push(new THREE.Vector3(x + Math.cos(planets[5].angle1), 0,
                z + Math.sin(planets[5].angle1) + planets[4].sphere.position.z));
    }
    lineGeometry.computeLineDistances();
    var lineMaterial = new THREE.LineDashedMaterial({color: 0xcccc00, dashSize: 3, gapSize: 2});
    mtrack = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(mtrack);
}

function KeyboardState()
{
    if (keyboard.pressed("0"))
    {
        key = 0;
        shift = 0;
    }
    else if (keyboard.pressed("1"))
    {
        key = 1;
        shift = 0;
    }
    else if (keyboard.pressed("2"))
    {
        key = 2;
        shift = 0;
    }
    else if (keyboard.pressed("3"))
    {
        key = 3;
        shift = 0;
    }
    else if (keyboard.pressed("4"))
    {
        key = 4;
        shift = 0;
    }
    if (key === 0)
    {
        camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,1,40000);
        camera.position.set(0,500,0);
        camera.lookAt(scene.position);
        key=0;
    }
    else if (key ==1)
    {
        rotate(2);
        if ((keyboard.pressed("r")) && (key != 0))
            shift -= 0.05;
        if ((keyboard.pressed("l"))&&(key!=0))
            shift += 0.05;
    }
    
    else if (key ==2)
    {
        rotate(3);
        if ((keyboard.pressed("r")) && (key != 0))
            shift -= 0.05;
        if ((keyboard.pressed("l"))&&(key!=0))
            shift += 0.05;
    }
    
    else if (key ==3)
    {
        rotate(4);
        if ((keyboard.pressed("r")) && (key != 0))
            shift -= 0.05;
        if ((keyboard.pressed("l"))&&(key!=0))
            shift += 0.05;
    }
    
    else if (key ==4)
    {
        rotate(5);
        if ((keyboard.pressed("r")) && (key != 0))
            shift -= 0.05;
        if ((keyboard.pressed("l"))&&(key!=0))
            shift += 0.05;
    }
}

function rotate (i)
{
    camera.position.x = (planets[i].sphere.position.x)+i*6*Math.cos(planets[i].angle1+shift);
    camera.position.z=(planets[i].sphere.position.z)+i*6*Math.sin(planets[i].angle1+shift);
    camera.position.y=i*5;
    camera.lookAt(new THREE.Vector3(planets[i].sphere.position.x,0,planets[i].sphere.position.z));
    
}

function lights()
{
    var pointlight = new THREE.PointLight(0xa3a3a3, 2, 2000);
    pointlight.position.set(0, 0, 0);
    scene.add(pointlight);

    var light = new THREE.AmbientLight(0x202020); // soft white light
    scene.add(light);
}

function EarthCloud ()
{
    var canvasResult = document.createElement('canvas');
    canvasResult.width = 1024;
    canvasResult.height = 512;
    var contextResult = canvasResult.getContext('2d');
    
    var imageMap = new Image();
    imageMap.addEventListener("load",function()
    {
        var canvasMap = document.createElement('canvas');
        canvasMap.width=imageMap.width;
        canvasMap.height=imageMap.height;
        var contextMap=canvasMap.getContext('2d');
        contextMap.drawImage(imageMap,0,0);
        var dataMap = contextMap.getImageData(0,0,canvasMap.width, canvasMap.height);
        
        var imageTrans = new Image();
        imageTrans.addEventListener("load",function ()
        {
            var canvasTrans = document.createElement('canvas');
            canvasTrans.width=imageTrans.width;
            canvasTrans.height=imageTrans.height;
            var contextTrans = canvasTrans.getContext('2d');
            contextTrans.drawImage(imageTrans,0,0);
            var dataTrans = contextTrans.getImageData(0,0, canvasTrans.width, canvasTrans.height);
            
            var dataResult = contextMap.createImageData(canvasMap.width,canvas.height);
            for(var y =0, offset = 0; y<imageMap.height;y++)
                for (var x=0;x<imageMap.width;x++,offset+=4)
            {
                dataResult.data[offset+0]=dataMap.data[offset+0];
                dataResult.data[offset+1]=dataMap.data[offset+1];
                dataResult.data[offset+2]=dataMap.data[offset+2];
                dataResult.data[offset+3]=255-dataTrans.data[offset+0];
            }
            contextResult.putImageData(dataResult,0,0);
            material.map.needsUpdate = true;
        });
        imageTrans.src = 'Texture/earth/earthcloudmaptrans.jpg';
    }, false);
    imageMap.src = 'Texture/earth/earthcloudmap.jpg';
  
   
}