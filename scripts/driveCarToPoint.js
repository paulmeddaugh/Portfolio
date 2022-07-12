import { MOBILE, driveCar, getCarProps, setCarProps, setDrivingDirections, carWithin } from './index.js';
import { Point, Rectangle, Parallelogram } from './shapes.js';
import { Predict } from './predict.js';
import { getElementBounds } from './utility.js';

const car = document.getElementById('car');

/* Remaining functions to make the driveCarToPoint() function work are down below. This function exists in 
*  index.js, originally split for readability, but was halted due to time. */
export function driveCarToPoint(e) {
    //if (!MOBILE) return;

    let carCenter = getElementBounds(car).getParallelogram().getCenterPoint();
    let ePoint = new Point(e.clientX, e.clientY);

    angle = Math.atan2(ePoint.y - carCenter.y, ePoint.x - carCenter.x) + Math.PI;
    let dist = new Rectangle(getCarProps().carPoint, ePoint).getDiagonalDistance();
    let fullBreak = getBreakDistanceAndTime(velocity);

    let forward = new Predict(velocity, 0, 0);
    let reverse = new Predict(velocity, fullBreak.distance, fullBreak.time);
    if (dist > fullBreak.distance) {

        while (forward.distance + reverse.distance < dist) {
            if (forward.velocity < reverse.velocity) {
                forward.forward(); // Predicts a forward movement of the car
            } else {
                reverse.reverse(); // Predicts prior to a reverse movement of the car
            }
        }
    } 

    // Begin driving the car
    setDrivingDirections({ north: true, south: false });
    requestAnimationFrame(() => driveCar({ key: 'ArrowUp' }));

    setTimeout(() => {
        setDrivingDirections({ north: false, south: true });
        requestAnimationFrame(() => driveCar({ key: 'ArrowDown' }));
        console.log("forward predict: " + forward.velocity + ", velocity: " + velocity);
        requestAnimationFrame(carStopAtPoint);
    }, forward.time);

    setTimeout(() => {
        setDrivingDirections({ south: false });
        console.log("reverse predict: " + reverse.velocity + ", velocity: " + velocity);
        velocity = 0;
    }, reverse.time);

    let carStopAtPoint = () => {
        let xBound = new Point(
            e.clientX,
            e.clientY - 40 * Math.sin(angle)
        );
        let yBound = new Point(
            e.clientX - 40 * Math.cos(angle),
            e.clientY - 40 * Math.sin(angle)
        );
        if (carWithin(xBound, yBound)) {
            velocity = 0;
        } else {
            requestAnimationFrame(carStopAtPoint);
        }
    }
}
function getBreakDistanceAndTime(velocity) {

    let predict = new Predict();

    while (predict.velocity < velocity) {
        predict.reverse();
    }

    return predict;
}

/**
 * Sets the current properties of the car. If any value if undefined or null, keeps the present value.
 * 
 * @param {number} vel The velocity to change the car as having.
 * @param {number} ang The angle of the car.
 * @param {Point} point The point to place the car.
 
 export function setCarProps (vel, ang, point) {
    velocity = vel ?? velocity;
    angle = ang ?? angle;
    carPoint = point ?? carPoint;
}

/**
 * Gets the current properties of the car.
 * 
 * @returns The current 'velocity', 'angle', and 'carPoint' of the car within an object.
 
export function getCarProps () {
    return { velocity, angle, carPoint };
}

/**
 * 
 * @param {string} direction An object holding up to all four main compass direction as properties to set 
 * the car to be driving in.
 
export function setDrivingDirection(direction) {
    if (typeof direction != String) throw new TypeError("'direction' must be a String.");

    for (let prop of direction) {
        switch (prop.toLowerCase()) {
            case 'north':
                direction['ArrowUp'] = direction[prop]; break;
            case 'south':
                direction['ArrowDown'] = direction[prop]; break;
            case 'east':
                direction['ArrowLeft'] = direction[prop]; break;
            case 'west':
                direction['ArrowRight'] = direction[prop];
        }
    }
} */