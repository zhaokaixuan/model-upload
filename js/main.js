if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer, scene, camera, stats;

//数据
var evaluation;
var boundingBoxes = [];
var yCoords = [];
var data;//点云集

function init() {
    var container = document.getElementById('container');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeigh, 1, 10000);
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

    evaluation = new Evaluation();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

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

