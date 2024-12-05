function geoJsonToMatrix(geojson) {
    // Calculate the bounds of the matrix
    let maxX = 0;
    let maxY = 0;

    geojson.features.forEach((feature) => {
        const { coordinates } = feature.geometry;
        coordinates[0].forEach((coord) => {
            maxX = Math.max(maxX, Math.ceil(coord[0]));
            maxY = Math.max(maxY, Math.ceil(coord[1]));
        });
    });

    // Initialize the matrix with '0' (default for rooms)
    let matrix = Array.from({ length: maxY + 1 }, () =>
        Array(maxX + 1).fill(0)
    );

    // Helper function to mark a polygon as a specific value
    function markPolygonAsValue(polygon, value) {
        const coordinates = polygon[0]; // Outer ring of the polygon

        // Calculate bounds of the polygon
        let minX = Math.min(
            ...coordinates.map((coord) => Math.floor(coord[0]))
        );
        let maxX = Math.max(...coordinates.map((coord) => Math.ceil(coord[0])));
        let minY = Math.min(
            ...coordinates.map((coord) => Math.floor(coord[1]))
        );
        let maxY = Math.max(...coordinates.map((coord) => Math.ceil(coord[1])));

        // Mark the area in the matrix
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                matrix[y][x] = value;
            }
        }
    }

    // Process each feature in the GeoJSON
    geojson.features.forEach((feature) => {
        const { category } = feature.properties;
        const { coordinates } = feature.geometry;

        // If it's a corridor, mark as '1'; otherwise, keep as '0'
        if (category === "pathway") {
            markPolygonAsValue(coordinates, 1);
        }
    });

    return matrix;
}

module.exports = geoJsonToMatrix;
