function geoJsonToMatrix(geojson) {
    let maxX = 0;
    let maxY = 0;
    geojson.features.forEach((feature) => {
        const { coordinates } = feature.geometry;
        coordinates[0].forEach((coord) => {
            maxX = Math.max(maxX, coord[0]);
            maxY = Math.max(maxY, coord[1]);
        });
    });

    // Initialize the matrix with '0' (for rooms)
    let matrix = Array.from({ length: maxY + 1 }, () =>
        Array(maxX + 1).fill(0)
    );

    // Function to mark the matrix for a polygon feature
    function markPolygonAsValue(polygon, value) {
        const coordinates = polygon[0]; // Get the outer ring of the polygon

        // Assuming rectangular polygons, we will fill in the area between the min and max x, y coordinates
        let minX = Math.min(...coordinates.map((coord) => coord[0]));
        let maxX = Math.max(...coordinates.map((coord) => coord[0]));
        let minY = Math.min(...coordinates.map((coord) => coord[1]));
        let maxY = Math.max(...coordinates.map((coord) => coord[1]));

        // Fill the corresponding cells in the matrix with the value
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

        // If the feature is a corridor, mark the area as '1', otherwise it stays '0'
        if (category === "pathway") {
            markPolygonAsValue(coordinates, 1);
        }
    });

    return matrix;
}


module.exports = geoJsonToMatrix;
