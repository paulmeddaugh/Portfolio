import { pointOnLine } from "./utility.js";

export class Point {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static hasPointProperties(point) {
        return point.hasOwnProperty('x') && point.hasOwnProperty('y');
    }

    /**
     * Returns a boolean of, or throws an error, if the object does not hold property values with {@link Point} 
     * properties. The error thrown names the property key, which is the reason the checked objects are wrapped 
     * in the object.
     * 
     * @param {*} obj The object with property values to check if possessing {@link Point} property values 
     * (i.e. { point }).
     * @param {boolean} throwError Throws an error if true, simply returns 'false' if false. Defaults to true.
     */
    static checkIfPoints (obj, throwError = true) {
        for (const o in obj) {
            if (!Point.hasPointProperties(obj[o])) {
                if (throwError) {
                    throw new TypeError("'" + o + "' must be an object with 'x', 'y', and 'name' properties.");
                } else {
                    return false;
                }
            }
        }

        return true;
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
     * Constructs a Rectangle object using the two points furthest away from each other in the rectangle.
     * 
     * @param {Point} p1 The beginning point of the right-angled square.
     * @param {Point} p2 The second point of the square, which is furthest away from the first point.
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

    /**
     * Returns a boolean of, or throws an error, if the object does not hold property values of {@link Rectangle}s. 
     * The error thrown names the property key, which is the reason the checked objects are wrapped in the object.
     * 
     * @param {*} obj The object with property values to check if possessing {@link Rectangle} property values 
     * (i.e. { rect }).
     * @param {boolean} throwError Throws an error if true, simply returns 'false' if false. Defaults to true.
     */
    static checkIfRectangles(obj, throwError = true) {
        for (const o in obj) {
            if (!(obj[o] instanceof Rectangle)) {
                if (throwError) {
                    throw new TypeError("'" + o + "' must be an object with 'x', 'y', and 'name' properties.");
                } else {
                    return false;
                }
            }
        }

        return true;
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

    constructor(p1 = new Point(0, 0), p2 = new Point(0, 0), p3 = new Point(0, 0), p4 = new Point(0, 0)) {

        Point.checkIfPoints({ p1, p2, p3, p4 });

        // Assigns the points in order of top, right, bottom, and left
        this.p1 = this.p2 = this.p3 = this.p4 = p1 ?? new Point(0, 0);
        for (let p of [p2, p3, p4]) {
            // Top
            if (p.y < this.p1.y ||
                (p.y == this.p1.y && p.x < this.p1.x)) this.p1 = p;

            // Right
            if (p.x > this.p2.x ||
                (p.x == this.p2.x && p.y < this.p2.y)) this.p2 = p;
            
            // Bottom
            if (p.y > this.p3.y ||
                (p.y == this.p3.y && p.x > this.p3.x)) this.p3 = p;
            
            // Left
            if (p.x < this.p4.x ||
                (p.x == this.p4.x && p.y > this.p4.y)) this.p4 = p;
        }
    }

    /**
     * Determines the center point of the Parallelogram.
     * 
     * @returns The center as a {@link Point}.
     */
    getCenterPoint () {
        return new Point(
            this.p1.x + (this.p3.x - this.p1.x) / 2,
            this.p1.y + (this.p3.y - this.p1.y) / 2
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

    checkIfWithin(points) {

        if (!Array.isArray(points) && !Rectangle.checkIfRectangles({ points }, false)) return false;

        let para = new Parallelogram(this.p1, this.p2, this.p3, this.p4); // reorders if out of order
        if (Rectangle.checkIfRectangles({ points }, false)) points = [points.p1, points.p2];

        for (let p of points) {

            if (pointOnLine(para.p1, para.p2, p) > 0 && // right of line
                pointOnLine(para.p2, para.p3, p) > 0 && // right of line
                pointOnLine(para.p3, para.p4, p) > 0 && // right of line
                pointOnLine(para.p4, para.p1, p) > 0) { // right of line, inside parallelagram

                return true;
            }
        }

        return false;
    }

    printPoints() {
        for (let prop in this) {
            console.log(prop + ": (" + this[prop].x + ", " + this[prop].y + ")");
        }
    }
}