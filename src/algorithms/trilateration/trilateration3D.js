function trilaterate(p1, p2, p3, return_middle) {
    function sqr(a) {
        return a * a;
    }

    function norm(a) {
        return Math.sqrt(sqr(a.x) + sqr(a.y) + sqr(a.z));
    }

    function dot(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    function vector_subtract(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z,
        };
    }

    function vector_add(a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
            z: a.z + b.z,
        };
    }

    function vector_divide(a, b) {
        return {
            x: a.x / b,
            y: a.y / b,
            z: a.z / b,
        };
    }

    function vector_multiply(a, b) {
        return {
            x: a.x * b,
            y: a.y * b,
            z: a.z * b,
        };
    }

    function vector_cross(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x,
        };
    }

    var ex, ey, ez, i, j, d, a, x, y, z, b, p4;

    ex = vector_divide(vector_subtract(p2, p1), norm(vector_subtract(p2, p1)));

    i = dot(ex, vector_subtract(p3, p1));
    a = vector_subtract(vector_subtract(p3, p1), vector_multiply(ex, i));
    ey = vector_divide(a, norm(a));
    ez = vector_cross(ex, ey);
    d = norm(vector_subtract(p2, p1));
    j = dot(ey, vector_subtract(p3, p1));

    x = (sqr(p1.r) - sqr(p2.r) + sqr(d)) / (2 * d);
    y = (sqr(p1.r) - sqr(p3.r) + sqr(i) + sqr(j)) / (2 * j) - (i / j) * x;

    b = sqr(p1.r) - sqr(x) - sqr(y);

    if (Math.abs(b) < 0.0000000001) {
        b = 0;
    }

    z = Math.sqrt(b);

    if (isNaN(z)) {
        return null;
    }

    a = vector_add(
        p1,
        vector_add(vector_multiply(ex, x), vector_multiply(ey, y))
    );
    p4a = vector_add(a, vector_multiply(ez, z));
    p4b = vector_subtract(a, vector_multiply(ez, z));

    if (z == 0 || return_middle) {
        return a;
    } else {
        return  p4b;
    }
}

console.log(
    trilaterate(
        {
            x: 5,
            y: 6,
            z: 4,
            r: 6,
        },
        {
            x: 2,
            y: 3,
            z: 3,
            r: 5,
        },
        {
            x: -1,
            y: 2,
            z: 5,
            r: 7,
        }
    )
);
module.exports = trilaterate;
