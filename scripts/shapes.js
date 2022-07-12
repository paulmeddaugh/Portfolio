export class Point {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * A class that contains a beginning {@link Point} and end {@link Point}, the point furthest away from the 
 * beginning, which construct a rectangle.
 */
export class Rectangle {
    p1 = new Point(0, 0);
    p2 = new Point(0, 0);

    /**
     * 
     * @param {Point} p1 the beginning point of the right-angled square.
     * @param {Point} p2 the second point of the square, which is furthest away from the first point.
     */
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    /**
     * Gets the {@link Parallelogram} object constructed from the two {@link Rectangle} points.
     * 
     * @returns a {@link Parallelogram} object containing all four points of the square.
     */
    getParallelogram () {
        return new Parallelogram(
            this.p1, 
            new Point(this.p2.x, this.p1.y), 
            this.p2, 
            new Point(this.p1.x, this.p2.y)
        );
    }

    /**
     * Returns the distance between the two points.
     * 
     * @returns the distance between the two {@link Point}'s as a Number.
     */
    getDiagonalDistance () {
        let xParen = (this.p2.x - this.p1.x) * (this.p2.x - this.p1.x);
        let yParen = (this.p2.y - this.p1.y) * (this.p2.y - this.p1.y);
        return Math.sqrt(xParen + yParen);
    }

    /**
     * Checks if a point is without the bounds of the square.
     * 
     * @param {Point} p the point to check if within the square.
     * @returns True if within the square's bounds and false if otherwise.
     */
    pointWithin (p) {
        if ((this.p1.x <= p.x && this.p2.x >= p.x) && (this.p1.y <= p.y && this.p2.y >= p.y)) {
            return true;
        }
    
        return false;
    }
}

/**
 * A class that contains four {@link Points} that construct a rectangle.
 */
export class Parallelogram {
    p1;
    p2;
    p3;
    p4;

    constructor(p1, p2, p3, p4) {
        this.p1 = p1 ?? new Point(0, 0);
        this.p2 = p2 ?? new Point(0, 0);
        this.p3 = p3 ?? new Point(0, 0);
        this.p4 = p4 ?? new Point(0, 0);
    }

    /**
     * Determines the center point of the Parallelogram.
     * 
     * @returns the center as a {@link Point}.
     */
    getCenterPoint () {
        // finds the furthest point from p1
        let furthestP = this.p2;
        let furthestDist = new Rectangle(this.p1, this.p2).getDiagonalDistance();
        for (let p of [this.p3, this.p4]) {
            let dist = new Rectangle(this.p1, p).getDiagonalDistance();
            if (furthestDist < dist) {
                furthestP = p;
                furthestDist = dist;
            }
        }

        return new Point(
            this.p1.x + (furthestP.x - this.p1.x) / 2,
            this.p1.y + (furthestP.y - this.p1.y) / 2
        );
    }

    rotate(radians) {
        
        let center = this.getCenterPoint();
        let dist = new Rectangle(this.p1, center).getDiagonalDistance();

        // rotates each of the four corners
        let rect = new Parallelogram(), arr = [this.p1, this.p2, this.p3, this.p4];
        for (let i = 0; i < arr.length; i++) {
            let angle = Math.atan2(arr[i].y - center.y, arr[i].x - center.x);
            rect['p' + String(i + 1)] = new Point(
                center.x - dist * Math.cos(angle + radians),
                center.y - dist * Math.sin(angle + radians)
            );
        }
        return rect;
    }
}