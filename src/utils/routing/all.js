const geojson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                name: "Living Room",
                category: "room",
                area: 300,
                capacity: 10,
                entrances: [{ name: "Main Entrance", coordinates: [200, 50] }],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [0, 0],
                        [200, 0],
                        [200, 150],
                        [0, 150],
                        [0, 0],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Kitchen",
                category: "room",
                area: 150,
                capacity: 5,
                entrances: [
                    { name: "Kitchen Entrance", coordinates: [210, 70] },
                ],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [210, 0],
                        [310, 0],
                        [310, 100],
                        [210, 100],
                        [210, 0],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Bedroom 1",
                category: "room",
                area: 200,
                capacity: 8,
                entrances: [
                    { name: "Bedroom Entrance", coordinates: [50, 160] },
                ],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [0, 160],
                        [200, 160],
                        [200, 310],
                        [0, 310],
                        [0, 160],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Bedroom 2",
                category: "room",
                area: 180,
                capacity: 7,
                entrances: [
                    { name: "Bedroom Entrance", coordinates: [210, 140] },
                ],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [210, 110],
                        [380, 110],
                        [380, 250],
                        [210, 250],
                        [210, 110],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Bathroom",
                category: "room",
                area: 50,
                capacity: 2,
                entrances: [
                    { name: "Bathroom Entrance", coordinates: [210, 280] },
                ],
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [210, 260],
                        [300, 260],
                        [300, 310],
                        [210, 310],
                        [210, 260],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Corridor A",
                category: "pathway",
                capacity: 2,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [200, 0],
                        [210, 0],
                        [210, 310],
                        [200, 310],
                        [200, 0],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Corridor B",
                category: "pathway",
                capacity: 2,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [0, 150],
                        [0, 160],
                        [200, 160],
                        [200, 150],
                        [0, 150],
                    ],
                ],
            },
        },
    ],
};

// Utility functions
function calculatePointsBetweenNodes(node1, node2, step) {
    const points = [];
    const x1 = node1[0];
    const y1 = node1[1];
    const x2 = node2[0];
    const y2 = node2[1];

    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const numSteps = Math.floor(distance / step);

    for (let i = 0; i <= numSteps; i++) {
        const t = i / numSteps;
        const xi = x1 + t * dx;
        const yi = y1 + t * dy;
        points.push([Math.round(xi / 10) * 10, Math.round(yi / 10) * 10]);
    }

    return points;
}

function doSegmentsIntersect(p1, q1, p2, q2) {
    function orientation(p, q, r) {
        const val =
            (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
        if (val === 0) return 0;
        return val > 0 ? 1 : 2;
    }

    function onSegment(p, q, r) {
        if (
            q[0] <= Math.max(p[0], r[0]) &&
            q[0] >= Math.min(p[0], r[0]) &&
            q[1] <= Math.max(p[1], r[1]) &&
            q[1] >= Math.min(p[1], r[1])
        ) {
            return true;
        }
        return false;
    }

    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) return true;

    if (o1 === 0 && onSegment(p1, p2, q1)) return true;

    if (o2 === 0 && onSegment(p1, q2, q1)) return true;

    if (o3 === 0 && onSegment(p2, p1, q2)) return true;

    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    return false;
}

function findIntersectingCorridor(node1, node2, corridorCoordinates) {
    for (const corridorName in corridorCoordinates) {
        const sides = corridorCoordinates[corridorName];
        for (const side of sides) {
            const segment = side.pairs;

            if (doSegmentsIntersect(node1, node2, segment[0], segment[1])) {
                return side;
            }
        }
    }

    return null;
}

function findSharedPoints(corridor1, corridor2) {
    const sharedPoints = [];

    corridor1.forEach((side1) => {
        const points1 = new Set(
            side1.coordinates.map((coord) => coord.toString())
        );

        corridor2.forEach((side2) => {
            const points2 = new Set(
                side2.coordinates.map((coord) => coord.toString())
            );

            const intersection = side1.coordinates.filter((coord) =>
                points2.has(coord.toString())
            );

            if (intersection.length > 0) {
                sharedPoints.push({
                    side1: side1.side,
                    side2: side2.side,
                    points: intersection,
                });
            }
        });
    });

    return sharedPoints;
}

function mergeCorridors(corridor1, corridor2) {
    return [...corridor1, ...corridor2];
}

// Function to extract nodes
function extractNodes(geojson) {
    const nodes = {};

    geojson.features.forEach((feature) => {
        const properties = feature.properties;
        if (properties.entrances) {
            properties.entrances.forEach((entrance) => {
                const nodeName = `${properties.name}_${entrance.name}`;
                nodes[nodeName] = {
                    coordinates: entrance.coordinates,
                };
            });
        }
    });

    return nodes;
}

// Function to extract corridor coordinates
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
                    side: i,
                    coordinates: pointsBetween,
                    pairs: segment,
                });
            }

            corridorCoordinates[corridorName] = corridorSides;
        }
    });

    return corridorCoordinates;
}

// Function to find shared points between corridors
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

// Function to build adjacency list
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

// A* Algorithm Implementation
function heuristic(a, b) {
    const dx = Math.abs(a[0] - b[0]);
    const dy = Math.abs(a[1] - b[1]);
    return dx + dy;
}

function aStar(startNode, goalNode, nodes, adjacencyList) {
    const openSet = [startNode];
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    for (const node in nodes) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
    }

    gScore[startNode] = 0;
    fScore[startNode] = heuristic(
        nodes[startNode].coordinates,
        nodes[goalNode].coordinates
    );

    while (openSet.length > 0) {
        const current = openSet.reduce(
            (acc, node) => (fScore[node] < fScore[acc] ? node : acc),
            openSet[0]
        );

        if (current === goalNode) {
            const path = [];
            let temp = current;
            while (temp) {
                path.push(temp);
                temp = cameFrom[temp];
            }
            return path.reverse();
        }

        openSet.splice(openSet.indexOf(current), 1);

        adjacencyList[current].forEach((neighbor) => {
            const tentativeGScore =
                gScore[current] +
                heuristic(
                    nodes[current].coordinates,
                    nodes[neighbor].coordinates
                );
            if (tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] =
                    gScore[neighbor] +
                    heuristic(
                        nodes[neighbor].coordinates,
                        nodes[goalNode].coordinates
                    );
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        });
    }

    return null;
}

// Main execution
const nodes = extractNodes(geojson);
const corridorCoordinates = extractCorridorCoordinates(geojson);
const adjacencyList = buildAdjacencyList(nodes, corridorCoordinates);

console.log("Nodes:", nodes);
console.log("Corridor Coordinates:", corridorCoordinates);
console.log("Adjacency List:", adjacencyList);

// Find the shortest path using A* algorithm
const startNode = "Living Room_Main Entrance";
const goalNode = "Bathroom_Bathroom Entrance";
const shortestPath = aStar(startNode, goalNode, nodes, adjacencyList);

// Convert shortest path node names to coordinates
const shortestPathCoordinates = shortestPath.map(
    (node) => nodes[node].coordinates
);

console.log("Shortest Path Coordinates:", shortestPathCoordinates);
