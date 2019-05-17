function calculateMean( arr ) {
    var total = 0;
    for (var i =0; i < arr.length; i++) {
        total += arr[i];
    }
    return total / arr.length;
}

function standardDeviation ( arr ) {
    var mean = calculateMean( arr );
    var variance = 0;
    for ( var i = 0; i < arr.length; i++) {
        variance += Math.pow( arr[i] - mean, 2);
    }
    variance = variance / arr.length;
    return Math.pow( variance, 0.5);
}

function filter ( arr, mean, thresh ) {
    var result = [];
    for ( var i = 0; i < arr.length; i++ ) {
        if ( Math.abs( arr[i] - mean ) < thresh ) {
            result.push( arr[i] );
        }
    }
    return result;
}

function getMinElement( arr ) {
    var min = Number.POSITIVE_INFINITY;
    for ( var i =0; i < arr.length; i++ ) {
        if ( arr[i] < min ) {
            min = arr[i];
        }
    }
    return min;
}

function getMaxElement( arr ) {
    var max = Number.NEGATIVE_INFINITY;
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] > max ) {
            max = arr[i];
        }
    }
    return max;
}