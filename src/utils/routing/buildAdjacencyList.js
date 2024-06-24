const { mergeCorridors } = require("../routing/utils");

const findSharedPointsBetweenCorridors = require("../routing/findSharedPointsBetweenCorridors");

function buildAdjacencyList(nodes, corridorCoordinates) {
    const adjacencyList = {};

    for (const node in nodes) {
        adjacencyList[node] = [];
    }

    const sharedPointsBetweenCorridors =
        findSharedPointsBetweenCorridors(corridorCoordinates);

    sharedPointsBetweenCorridors.forEach((shared) => {
        const { corridor1, corridor2, sharedPoints } = shared;

        corridorCoordinates[corridor1] = mergeCorridors(
            corridorCoordinates[corridor1],
            corridorCoordinates[corridor2]
        );

        delete corridorCoordinates[corridor2];
    });

    Object.keys(corridorCoordinates).forEach((corridorName) => {
        const sides = corridorCoordinates[corridorName];

        const allSidePoints = new Set();
        sides.forEach((side) => {
            side.coordinates.forEach((coord) => {
                allSidePoints.add(coord.toString());
            });
        });

        for (const node1 in nodes) {
            const node1Coordinates = nodes[node1].coordinates;

            if (allSidePoints.has(node1Coordinates.toString())) {
                for (const node2 in nodes) {
                    if (node1 !== node2) {
                        const node2Coordinates = nodes[node2].coordinates;

                        if (allSidePoints.has(node2Coordinates.toString())) {
                            adjacencyList[node1] = adjacencyList[node1] || [];
                            adjacencyList[node2] = adjacencyList[node2] || [];

                            if (!adjacencyList[node1].includes(node2)) {
                                adjacencyList[node1].push(node2);
                            }

                            if (!adjacencyList[node2].includes(node1)) {
                                adjacencyList[node2].push(node1);
                            }
                        }
                    }
                }
            }
        }
    });

    if ("Corridor A" in corridorCoordinates) {
        corridorCoordinates["Connected Corridor"] =
            corridorCoordinates["Corridor A"];
        delete corridorCoordinates["Corridor A"];
    }

    return adjacencyList;
}

module.exports = buildAdjacencyList;
