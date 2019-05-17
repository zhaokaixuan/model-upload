if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer, scene, camera;
var move2D = false;
var mouse2D = new THREE.Vector2();
//数据
var evaluation;
var boundingBoxes = [];
var yCoords = [];
var data;//点云集
var pointcloud;

var isRecording = false;

var pointSize = 1;
// I dont konw
var intensities,mean,sd,filteredIntensities,min,max,colors,normalizedIntensities;

function init() {
    var container = document.getElementById('container');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 100,0);
    camera.lookAt( new THREE.Vector3(0,0,0));

    grid = new THREE.GridHelper(200, 20, 0xffffff,0xffffff);
    scene.add(grid);

    renderer = new THREE.WebGLRenderer( {preserveDrawingBuffer:true} );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    document.getElementById('file_input').addEventListener('change', upload_files, false);
    document.getElementById('move').addEventListener('click', moveMode, false);
    document.getElementById('record').addEventListener('click', toggleRecord, false);
    document.getElementById('move2D').addEventListener('click', move2DMode, false);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    evaluation = new Evaluation();
}
init()
function onWindowResize() {

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function moveMode(event) {
    event.preventDefault();
    assertRecordMode();
    if( isRecording ) {
        controls.enable = true;
        move2D = false;
        document.getElementById('move2D').className = "";
        document.getElementById('move').className = 'selected';
        controls.maxPolarAngle = 2 * Math.PI;
        controls.minPolarAngle = -2 * Math.PI;
        unprojectFromXZ();
        evaluator.resume_3D_time();
    }
}


function assertRecordMode() {
    if(!isRecording) {
        alert('resume recording to change modes')
    }
}


function toggleRecord(event) {
    if( isRecording ) {
        document.getElementById('record').innerHTML = 'Click to resume recording';
        evaluator.pause_recording();
        move2DMode(event);
        isRecording = false;
        //console.log('boxarr',boxarr);
    } else {
        isRecording = true;
        document.getElementById('record').innerHTML = "Click to pause recording";
        evaluator.resume_recording();
    }
}

function move2DMode(event) {
    event.preventDefault();
    if( isRecording ) {
        document.getElementById('move').className = "";
        document.getElementById('move2D').className = "selected";
        if (!move2D ) {
            camera.position.set(0, 100, 0);
            camera.lookAt( new THREE.Vector3(0, 0, 0) );
            controls.maxPolarAngle = 0;
            controls.minPolarAngle = 0;
            camera.updateProjectionMatrix();
            projectOntoXZ();
            controls.reset();
            evaluator.pause_3D_time();
        }
        controls.enabled = true;
        controls.update();
        move2D = true;
    }
}

function reset() {
    if(boundingBoxes){
        for(var i=0; i<boundingBoxes.length; i++){
            box =boundingBoxes[i];
            scene.remove(box.boxHelper);
            scene.remove(box.points);
            clearTable();
        }
        boundingBoxes = [];
        yCoords = null;
        yCoords = [];
    }
    evaluator = new Evaluator(camera.rotation.z,boundingBoxes,evaluation.get_filename());
}

function clearTable() {
    for(var i=0; i<boundingBoxes.length;i++){
        box = boundingBoxes[i];
        deleteRow(box.id);
    }
    id = 0;
}
function deleteRow(id) {
    var row = getRow(id);
    row.remove();
}

function show() {
    var rotation = 0;

    if(pointcloud !== undefined ) {
        scene.remove(pointcloud);
        rotation = pointcloud.rotation.y;
        pointcloud = null;
    }
    pointcloud = generatePointCloudForCluster();
    pointcloud.rotation.y = rotation;
    scene.add(pointcloud);
}

function generatePointCloudForCluster() {
    return generatePointCloud(data,new THREE.Color(0,1,0));
}
function render() {
    renderer.render( scene, camera );
    if( move2D ) {
        grid.rotation.y = camera.rotation.z;
    }
    update_footer( getCurrentPosition() );
}
function animate() {
    requestAnimationFrame( animate );
    render();
}


function getCurrentPosition() {
    var temp = new THREE.Vector3( mouse2D.x, mouse2D.y, 0);
    temp.unproject(camera);
    var dir = temp.sub( camera.position ).normalize();
    var distance = -camera.position.y / dir.y;
    var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
    return pos;
}

function update_footer( pos ) {
    var x = pos.z;
    var y = pos.x;
    document.getElementById('footer').children[0].innerHTML = "x: " + x + "\ny: " + y;
    //$("#footer").find("p").text("x: " + x + "\ny: " + y);
} 

function select2DMode() {
    camera.position.set( 0, 100, 0 );
    camera.lookAt( new THREE.Vector3(0, 0, 0 ) );
    camera.updateProjectionMatrix();
    projectOntoXZ();
    controls.maxPolarAngle = 0;
    controls.minPolarAngle = 0;
    controls.reset();
    controls.enable = false;
    controls.update();
    move2D = true;
}

function projectOntoXZ() {
    var count = 0;
    for ( var i =0; i < pointcloud.geometry.vertices.length; i++){
        var v = pointcloud.geometry.vertices[i];
        if ( colors[i].b > colors[i].r ) {
            count += 1;
            v.y = -0.000001;
        } else {
            v.y = 0;
        }
    }
    pointcloud.geometry.verticesNeedUpdate = true;
}

function unprojectFromXZ() {
    for ( var i = 0; i < pointcloud.geometry.vertices.length; i++ ) {
        var v = pointcloud.geometry.vertices[i];
        v.y = yCoords[i];
    }
    pointcloud.geometry.verticesNeedUpdate = true;
}
