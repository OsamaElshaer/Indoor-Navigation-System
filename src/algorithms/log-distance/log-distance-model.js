
function measureDistance(
    rssi,
    referenceRssi,
    referenceDistance,
    pathLossExponent,
    variance
) {
    let distance =
        referenceDistance *
        Math.pow(
            10,
            (referenceRssi - rssi - variance) / (10 * pathLossExponent)
        );

    return distance;
}

exports.measureDistance = measureDistance; 
