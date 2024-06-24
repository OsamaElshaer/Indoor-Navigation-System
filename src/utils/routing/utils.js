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
module.exports = {
    mergeCorridors,
    calculatePointsBetweenNodes,
    doSegmentsIntersect,
    findIntersectingCorridor,
    findSharedPoints,
};
