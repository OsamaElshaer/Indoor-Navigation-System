// Example GeoJSON data
const geojson = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                name: "Living Room",
                category: "room",
                area: 300,
                capacity: 15,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [50, 50],
                        [250, 50],
                        [250, 200],
                        [50, 200],
                        [50, 50],
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
                capacity: 8,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [260, 50],
                        [360, 50],
                        [360, 150],
                        [260, 150],
                        [260, 50],
                    ],
                ],
            },
        },
        {
            type: "Feature",
            properties: {
                name: "Bedroom",
                category: "room",
                area: 200,
                capacity: 10,
            },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [50, 210],
                        [250, 210],
                        [250, 360],
                        [50, 360],
                        [50, 210],
                    ],
                ],
            },
        },
    ],
};

// Function to calculate centroid of a polygon
function calculateCentroid(coordinates) {
    const numPoints = coordinates.length;
    let x = 0;
    let y = 0;

    coordinates.forEach((coord) => {
        x += coord[0];
        y += coord[1];
    });

    x /= numPoints;
    y /= numPoints;

    return { x, y };
}

// Function to extract nodes with centroid coordinates
function extractNodesWithCoordinates(geojson) {
    const nodes = {};

    // Iterate through features
    geojson.features.forEach((feature) => {
        const properties = feature.properties;
        const geometry = feature.geometry;

        // Calculate centroid based on geometry type
        let centroid;
        if (geometry.type === "Polygon") {
            // For polygons, calculate centroid of the exterior ring
            const coordinates = geometry.coordinates[0]; // Assuming exterior ring
            centroid = calculateCentroid(coordinates);
        } else {
            throw new Error(`Unsupported geometry type: ${geometry.type}`);
        }

        // Store node with centroid coordinates
        nodes[properties.name] = {
            x: centroid.x,
            y: centroid.y,
        };
    });

    return nodes;
}

// Extract nodes with centroid coordinates
const nodes = extractNodesWithCoordinates(geojson);
console.log("Nodes:", nodes);

// Function to calculate Euclidean distance between two points
function calculateDistance(node1, node2) {
    return Math.sqrt(
        Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
    );
}

// Function to create adjacency list based on spatial proximity (Euclidean distance)
function createAdjacencyList(nodes) {
    const adjacencyList = {};

    // Iterate through nodes
    Object.keys(nodes).forEach((nodeName1) => {
        const connections = [];

        // Check distance to all other nodes
        Object.keys(nodes).forEach((nodeName2) => {
            if (nodeName1 !== nodeName2) {
                const distance = calculateDistance(
                    nodes[nodeName1], // Using centroid for simplicity
                    nodes[nodeName2] // Using centroid for simplicity
                );
                // For simplicity, let's assume a threshold distance for adjacency
                if (distance < 200) {
                    // Adjust the distance threshold as needed
                    connections.push(nodeName2);
                }
            }
        });

        // Add node with its connections to adjacency list
        adjacencyList[nodeName1] = connections;
    });

    return adjacencyList;
}

// Create adjacency list
const adjacencyList = createAdjacencyList(nodes);
console.log("Adjacency List:", adjacencyList);

// Function to find a route between two nodes using Breadth-First Search (BFS)
function findRoute(adjacencyList, startNode, endNode) {
    const queue = [[startNode]];
    const visited = new Set([startNode]);

    while (queue.length > 0) {
        const path = queue.shift();
        const currentNode = path[path.length - 1];

        if (currentNode === endNode) {
            return path;
        }

        for (const neighbor of adjacencyList[currentNode]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([...path, neighbor]);
            }
        }
    }

    return null; // If no path found
}

// Function to calculate points between two nodes
function calculatePointsBetweenNodes(node1, node2, n) {
    const points = [];
    const x1 = node1.x;
    const y1 = node1.y;
    const x2 = node2.x;
    const y2 = node2.y;

    // Calculate distance between the two nodes
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // Calculate intermediate points
    for (let i = 0; i <= n; i++) {
        const xi = x1 + (i / n) * (x2 - x1);
        const yi = y1 + (i / n) * (y2 - y1);
        points.push([xi, yi]);
    }

    return points;
}

// Example usage: Find a route from "Living Room" to "Bedroom"
const startNode = "Living Room";
const endNode = "Bedroom";
const routeNodes = findRoute(adjacencyList, startNode, endNode);

// Calculate points along the route between nodes
const numberOfPoints = 10; // Number of intermediate points
const routePoints = [];

// Iterate through the nodes in the route (skip the first node as it's the starting point)
for (let i = 1; i < routeNodes.length; i++) {
    const currentNode = routeNodes[i];
    const previousNode = routeNodes[i - 1];

    // Find corresponding coordinates from nodes data
    const node1 = nodes[previousNode];
    const node2 = nodes[currentNode];

    // Calculate points between node1 and node2
    const pointsBetweenNodes = calculatePointsBetweenNodes(
        node1,
        node2,
        numberOfPoints
    );

    // Add points to the routePoints array
    routePoints.push(...pointsBetweenNodes);
}

// Log the calculated route points
console.log("Route Points:", routePoints);
