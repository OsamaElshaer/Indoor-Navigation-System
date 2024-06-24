const { calculatePointsBetweenNodes } = require("./utils");

function extractCorridorCoordinates(geojson) {
    const corridorCoordinates = {};

    geojson.features.forEach((feature) => {
        if (feature.properties.category === "pathway") {
            const corridorName = feature.properties.name;
            const coordinates = feature.geometry.coordinates[0];
            const corridorSides = [];

            for (let i = 0; i < coordinates.length - 1; i++) {
                const start = coordinates[i];
                const end = coordinates[i + 1];
                const segment = [start, end]; // Pair of points

                const pointsBetween = calculatePointsBetweenNodes(
                    start,
                    end,
                    10
                );

                corridorSides.push({
                    side: `Side ${i + 1}`,
                    pairs: segment,
                    coordinates: pointsBetween,
                });
            }

            corridorCoordinates[corridorName] = corridorSides;
        }
    });

    return corridorCoordinates;
}

module.exports = extractCorridorCoordinates;
