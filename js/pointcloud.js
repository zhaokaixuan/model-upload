function generatePointCloud(vertices,color) {
    
    var geometry = new THREE.Geometry();
    var colors = [];
    var k = 0;
    var stride = 4;
    for (var i = 0,l = vertices.length/4; i < l; i++) {
        var v = new THREE.Vector3( vertices[ stride * k + 1 ], 
            vertices[ stride * k +2], vertices[ stride *k]);
        yCoords.push(vertices[ stride * k +2]);
        geometry.vertices.push( v );
        colors.push( color.clone() );
        k++;
    }

    console.log('size:',geometry.vertices.length);
    geometry.colors = normalizeColors(vertices, color);
    geometry.computeBoundingBox();

    var material = new THREE.PointsMaterial( { size: pointSize, sizeAttenuation: false,
         vertexColors: THREE.VertexColors} );
    var pointCloud = new THREE.Points( geometry, material );  
    return pointCloud;
}

function normalizeColors(vertices, color) {
    var maxColor = Number.NEGATIVE_INFINITY;
    var minColor = Number.POSITIVE_INFINITY;
    intensities = [];
    normalizedIntensities = [];
    colors = [];

    k = 0;
    var stride =4;

    for (var i=0,l = vertices.length / 4; i < l; i++) {
        if ( vertices[stride * k + 2] > maxColor ) {
            maxColor = vertices[ stride * k + 2];
        }
        if ( vertices[ stride * k + 2] < minColor ) {
            minColor = vertices[ stride * k + 2];
        }
        intensities.push( vertices[ stride * k + 2]);
        k++;
    }

    mean = calculateMean( intensities );
    sd = standardDeviation( intensities );
    filteredIntensities = filter(intensities, mean, 1 * sd);
    min = getMinElement( filteredIntensities );
    max = getMaxElement( filteredIntensities );

    for ( var i= 0; i < intensities.length; i++ ) {
        var intensity = intensities[i];
        if ( intensities[i] - mean >= 2 * sd ) {
            intensity = 1;
        } else if ( mean - intensities[i] >= 2 * sd ) {
            intensity =0;
        } else {
            intensity = ( intensities[i] - min ) / ( max - min );
        }
        normalizedIntensities.push( intensities[i] );
        colors[i] = ( new THREE.Color( intensity, 0, 1 - intensity).multiplyScalar(intensity * 5) )
    }
    return colors;
}