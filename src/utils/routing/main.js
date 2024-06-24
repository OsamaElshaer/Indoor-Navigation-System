const extractNodes = require("./extractNodes");
const buildAdjacencyList = require("./buildAdjacencyList");
const extractCorridorCoordinates = require("./extractCorridorCoordinates");
const geojson = require("./geojson");
const nodes = extractNodes(geojson);

const corridorCoordinates = extractCorridorCoordinates(geojson);

const adjacencyList = buildAdjacencyList(nodes, corridorCoordinates);

console.log("Nodes:", nodes);
console.log("Corridor Coordinates:", corridorCoordinates);
console.log("Adjacency List:", adjacencyList);
