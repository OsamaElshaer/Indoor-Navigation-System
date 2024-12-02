function heuristic(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function aStar(matrix, start, end) {
    let openSet = new Set([JSON.stringify(start)]);
    let cameFrom = {};
    let gScore = {};
    let fScore = {};

    const rows = matrix.length;
    const cols = matrix[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            gScore[JSON.stringify([r, c])] = Infinity;
            fScore[JSON.stringify([r, c])] = Infinity;
        }
    }

    gScore[JSON.stringify(start)] = 0;
    fScore[JSON.stringify(start)] = heuristic(start, end);

    while (openSet.size > 0) {
        let current = Array.from(openSet).reduce((a, b) =>
            fScore[a] < fScore[b] ? a : b
        );

        current = JSON.parse(current);

        if (current[0] === end[0] && current[1] === end[1]) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(JSON.stringify(current));

        const neighbors = [
            [current[0] - 1, current[1]],
            [current[0] + 1, current[1]],
            [current[0], current[1] - 1],
            [current[0], current[1] + 1],
        ];

        for (let neighbor of neighbors) {
            let [nr, nc] = neighbor;
            if (
                nr >= 0 &&
                nr < rows &&
                nc >= 0 &&
                nc < cols &&
                matrix[nr][nc] === 1
            ) {
                let tentative_gScore = gScore[JSON.stringify(current)] + 1;

                if (tentative_gScore < gScore[JSON.stringify(neighbor)]) {
                    cameFrom[JSON.stringify(neighbor)] = current;
                    gScore[JSON.stringify(neighbor)] = tentative_gScore;
                    fScore[JSON.stringify(neighbor)] =
                        gScore[JSON.stringify(neighbor)] +
                        heuristic(neighbor, end);
                    openSet.add(JSON.stringify(neighbor));
                }
            }
        }
    }

    return "No path found []";
}

function reconstructPath(cameFrom, current) {
    const totalPath = [current];
    while (JSON.stringify(current) in cameFrom) {
        current = cameFrom[JSON.stringify(current)];
        totalPath.push(current);
    }
    return totalPath.reverse();
}

module.exports = aStar;
