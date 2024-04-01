function trilateration(beacons) {
    const [x1, y1, r1] = [beacons[0].x, beacons[0].y, beacons[0].distance];
    const [x2, y2, r2] = [beacons[1].x, beacons[1].y, beacons[1].distance];
    const [x3, y3, r3] = [beacons[2].x, beacons[2].y, beacons[2].distance];

    const A1 = 2 * (x2 - x1);
    const B1 = 2 * (y2 - y1);
    const C1 = r1 * r1 - r2 * r2 - x1 * x1 + x2 * x2 - y1 * y1 + y2 * y2;

    const A2 = 2 * (x3 - x1);
    const B2 = 2 * (y3 - y1);
    const C2 = r1 * r1 - r3 * r3 - x1 * x1 + x3 * x3 - y1 * y1 + y3 * y3;

    let x = (C1 * B2 - C2 * B1) / (A1 * B2 - A2 * B1);
    let y = (C1 * A2 - C2 * A1) / (B1 * A2 - B2 * A1);
    x = Number(x.toFixed(2));
    y = Number(y.toFixed(2));

    return { x, y };
}

module.exports.trilateration = trilateration;
