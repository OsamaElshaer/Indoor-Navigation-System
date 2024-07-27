let geojson = {
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
        {
            type: "Feature",
            properties: {
                name: "Corridor C",
                category: "pathway",
                capacity: 2,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [210, 150],
                        [210, 160],
                        [300, 160],
                        [300, 150],
                        [200, 150],
                    ],
                ],
            },
        },
    ],
};

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

function extractCorridorboundaries(geojson) {
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
                    1
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

function pointInPolygon(point, polygon) {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        const intersect =
            yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }

    return inside;
}

function generateGrid(bbox, step) {
    const [minX, minY, maxX, maxY] = bbox;
    const points = [];

    for (let x = minX; x <= maxX; x += step) {
        for (let y = minY; y <= maxY; y += step) {
            points.push([x, y]);
        }
    }

    return points;
}

function getBoundingBox(polygon) {
    let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;

    polygon.forEach(([x, y]) => {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
    });

    return [minX, minY, maxX, maxY];
}

function extractInteriorPoints(geojson, step) {
    const interiorPointsByCorridor = {};

    geojson.features
        .filter((feature) => feature.properties.category === "pathway")
        .forEach((feature) => {
            const corridorName = feature.properties.name;
            const polygon = feature.geometry.coordinates[0]; // Get the outer ring of the polygon
            const bbox = getBoundingBox(polygon);
            const gridPoints = generateGrid(bbox, step);

            interiorPointsByCorridor[corridorName] = gridPoints.filter(
                (point) => pointInPolygon(point, polygon)
            );
        });

    return interiorPointsByCorridor;
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

class UnionFind {
    constructor(elements) {
        this.parent = {};
        this.rank = {};

        elements.forEach((e) => {
            this.parent[e] = e;
            this.rank[e] = 0;
        });
    }

    find(element) {
        if (this.parent[element] !== element) {
            this.parent[element] = this.find(this.parent[element]);
        }
        return this.parent[element];
    }

    union(element1, element2) {
        const root1 = this.find(element1);
        const root2 = this.find(element2);

        if (root1 !== root2) {
            if (this.rank[root1] > this.rank[root2]) {
                this.parent[root2] = root1;
            } else if (this.rank[root1] < this.rank[root2]) {
                this.parent[root1] = root2;
            } else {
                this.parent[root2] = root1;
                this.rank[root1] += 1;
            }
        }
    }
}

function findConnectedCorridors(corridorCoordinates) {
    const corridors = Object.keys(corridorCoordinates);
    const uf = new UnionFind(corridors);

    corridors.forEach((corridor1, index1) => {
        for (let index2 = index1 + 1; index2 < corridors.length; index2++) {
            const corridor2 = corridors[index2];
            const sharedPoints = findSharedPoints(
                corridorCoordinates[corridor1],
                corridorCoordinates[corridor2]
            );

            if (sharedPoints.length > 0) {
                uf.union(corridor1, corridor2);
            }
        }
    });

    const connectedCorridors = {};
    corridors.forEach((corridor) => {
        const root = uf.find(corridor);
        if (!connectedCorridors[root]) {
            connectedCorridors[root] = [];
        }
        connectedCorridors[root].push(corridor);
    });

    return connectedCorridors;
}

function mergeInteriorPoints(connectedCorridors, interiorPointsByCorridor) {
    const mergedInteriorPoints = {};

    Object.values(connectedCorridors).forEach((group) => {
        const mergedName = group.join("-");
        mergedInteriorPoints[mergedName] = group.reduce((acc, corridor) => {
            const points = interiorPointsByCorridor[corridor] || [];
            return acc.concat(points);
        }, []);
    });

    return mergedInteriorPoints;
}

const corridorBoundaries = extractCorridorboundaries(geojson);

const connectedCorridors = findConnectedCorridors(corridorBoundaries);

const step = 1; // Adjust step size as needed
const interiorPointsByCorridor = extractInteriorPoints(geojson, step);

const mergedInteriorPoints = mergeInteriorPoints(
    connectedCorridors,
    interiorPointsByCorridor
);
const grid = mergedInteriorPoints["Corridor A-Corridor B-Corridor C"];

function createGraph(grid) {
    const graph = {};
    const directions = [
        [-1, 0],
        [1, 0], // Up, Down
        [0, -1],
        [0, 1], // Left, Right
    ];

    function isValidCell(x, y) {
        return true; // Adjust as needed based on your specific grid boundaries
    }

    grid.forEach(([x, y]) => {
        const nodeId = `${x},${y}`;
        graph[nodeId] = [];

        // Check adjacent cells (up, down, left, right)
        directions.forEach(([dx, dy]) => {
            const nx = x + dx;
            const ny = y + dy;
            const neighborId = `${nx},${ny}`;
            if (isValidCell(nx, ny)) {
                graph[nodeId].push(neighborId);
                if (!graph[neighborId]) {
                    graph[neighborId] = []; // Initialize if neighborId is not in graph
                }
                graph[neighborId].push(nodeId); // Bidirectional connection for corridors
            }
        });
    });

    return graph;
}
const graph = createGraph(grid);

function astar(graph, start, end) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = { [start]: 0 };

    // Function to calculate the Manhattan distance heuristic
    function heuristic(node1, node2) {
        const [x1, y1] = node1.split(",").map(Number);
        const [x2, y2] = node2.split(",").map(Number);
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    while (openSet.length > 0) {
        // Find node with lowest fScore in openSet
        const current = openSet.reduce(
            (minNode, node) =>
                gScore[node] < gScore[minNode] ? node : minNode,
            openSet[0]
        );

        if (current === end) {
            // Reconstruct path
            const path = [end];
            let step = end;
            while (cameFrom[step]) {
                step = cameFrom[step];
                path.unshift(step);
            }
            return path;
        }

        openSet.splice(openSet.indexOf(current), 1);

        for (const neighbor of graph[current]) {
            const tentativeGScore = gScore[current] + 1; // Uniform cost assumed

            if (
                !gScore.hasOwnProperty(neighbor) ||
                tentativeGScore < gScore[neighbor]
            ) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return []; // No path found
}

const start = "250,159";
const end = "259,152";

const path = astar(graph, start, end);
console.log("Shortest Path:", path);
