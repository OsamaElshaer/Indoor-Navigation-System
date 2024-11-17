function findShortestPathBFS(grid, start, target) {
    const rows = grid.length;
    const cols = grid[0].length;

    const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
    ];

    const isValid = (x, y) => {
        return x >= 0 && x < rows && y >= 0 && y < cols && grid[x][y] === 1;
    };

    const queue = [[start[0], start[1], []]];
    const visited = new Set();
    visited.add(start.toString());

    while (queue.length) {
        const [x, y, path] = queue.shift();

        const newPath = [...path, [x, y]];

        if (x === target[0] && y === target[1]) {
            return newPath;
        }

        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            const newPos = [newX, newY];

            if (isValid(newX, newY) && !visited.has(newPos.toString())) {
                visited.add(newPos.toString());
                queue.push([newX, newY, newPath]);
            }
        }
    }

    return [];
}

module.exports = findShortestPathBFS;
