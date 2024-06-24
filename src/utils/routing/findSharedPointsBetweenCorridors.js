const { findSharedPoints } = require("./utils");

function findSharedPointsBetweenCorridors(corridorCoordinates) {
    const sharedPointsBetweenCorridors = [];

    Object.keys(corridorCoordinates).forEach((corridor1Name, index1) => {
        const corridor1 = corridorCoordinates[corridor1Name];

        for (
            let index2 = index1 + 1;
            index2 < Object.keys(corridorCoordinates).length;
            index2++
        ) {
            const corridor2Name = Object.keys(corridorCoordinates)[index2];
            const corridor2 = corridorCoordinates[corridor2Name];

            const sharedPoints = findSharedPoints(corridor1, corridor2);

            if (sharedPoints.length > 0) {
                sharedPointsBetweenCorridors.push({
                    corridor1: corridor1Name,
                    corridor2: corridor2Name,
                    sharedPoints: sharedPoints,
                });
            }
        }
    });

    return sharedPointsBetweenCorridors;
}

module.exports = findSharedPointsBetweenCorridors;
