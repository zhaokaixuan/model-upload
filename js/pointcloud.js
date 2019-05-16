function generatePointCloud(vertices,color) {
    
    var geometry = new THREE.Gemetry();
    var colors = [];
    var k = 0;
    var stride = 4;
    for (var i = 0,l = vertices.length/4; i < l; i++) {
        var v = new THREE.Vector3( vertices[ stride * k + 1 ], 
            vertices[ stride * k +2], vertices[ stride *k]);
        yCoords.push(vertices[ stride * k +2]);
        geometry.vertices.push( v );
        colors.push( color.color() );
        k++;
    }

    console.log('size:',geometry.vertices.length);
    geometry.colors = normalizeColors(vertices, color);
}

function normalizeColors(vertices, color) {
    var maxColor = Number.NEGATIVE_INFINITY;
    var minColor = Number.POSITIVE_INFINITY;
    intensities = [];
    normalizedIntensities = [];
    colors = [];
}