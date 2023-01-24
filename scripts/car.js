import { MOBILE } from './index.js';
import { Point, Rectangle } from './shapes.js';
import { getElementBounds } from './utility.js'; 
import { Predict } from './predict.js';
import { carWithinFigure, showHideLinks, carWithinHeaderLink, highlightHeaderLinks, highlightTitle } from './showHideElements.js';
import { highlightInstructions } from './instructions.js';

let car, carImg;
let initialScroll = false;

let randomCarObjectCount = 1; // 7 total, 0 is initial blue car image

export let carProps = (() => {
    let velocity = 0;
    let angle = Math.PI / 2; // 90
    let point = new Point();
    let drivingDirections = {};
    let VELOCITY_FORWARD = .25;
    let VELOCITY_REVERSE = .2;

    const API = {

        getVelocity() {return velocity;},
        setVelocity(vel) {velocity = vel;},

        getPoint() {return new Point(point.x, point.y);},
        setPoint(p) {point = new Point(p.x, p.y);},

        getAngle() {return angle;},
        setAngle(a) {angle = a;},

        getDrivingDirections() {return JSON.parse(JSON.stringify(drivingDirections));},
        /**
         * Sets the directions to drive the car.
         * 
         * @param directions An object holding up to all four of the properties 'ArrowUp', 'ArrowDown', 
         * 'ArrowLeft' or 'ArrowRight' with boolean values for driving in those directions.
         */
        setDrivingDirections(directions) {

            const conditions = [ 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight' ];
        
            for (const prop in directions) {
                if (conditions.includes(prop)) {
                    drivingDirections[prop] = directions[prop];
                }
            }
        },
        clearDrivingDirections() {drivingDirections = {};},

        getVelocityForward() {return VELOCITY_FORWARD;},
        setVelocityForward(rate) {VELOCITY_FORWARD = rate;},

        getVelocityReverse() {return VELOCITY_REVERSE;},
        setVelocityReverse(rate) {VELOCITY_REVERSE = rate;},
    }

    return API;
})();

const DRIVE_RATE = 35;
const FRICTION = 0.005;
const TURN_ANGLE_CAP = Math.PI / 10;

const calculateFPS = false;
const AVERAGE_RANGE_FPS = 5;
const AVERAGE_CALC_PER_SEC = 4;
let aveFPS = 0, totalFPS = 1, lastFPS = 1, currentFPS = 0, FPSindex = AVERAGE_RANGE_FPS - 1;

window.addEventListener("keydown", driveCar);
window.addEventListener("keyup", keyup);
window.addEventListener("click", driveCarToPoint);
window.addEventListener("load", () => {

    setCarAcceleration();

    car = document.getElementById('car');
    carImg = document.getElementById('carImg');
    placeCarInCenter(false);

    // Calculates the frames per second
    if (calculateFPS) {
        setInterval(() => {
            currentFPS *= AVERAGE_CALC_PER_SEC;
            totalFPS = (totalFPS - lastFPS) + currentFPS;
            aveFPS = totalFPS / (AVERAGE_RANGE_FPS - FPSindex);
            if (!FPSindex) lastFPS = currentFPS;
            else FPSindex--;
            currentFPS = 0;
        }, 1000 / AVERAGE_CALC_PER_SEC);
    }

    if (!MOBILE && !window.navigator.userAgent.match(/Edg/)) {
        animateCar();
    } else {
        const instructions = document.getElementById('instructions');
        if (window.navigator.userAgent.match(/Edg/)) {
            changeInstructionsText("Try in Chrome or Firefox to navigate driving a car.");
        } else {
            changeInstructionsText("Try viewing in Chrome or Firefox on deskop to navigate driving a car.");
        }
        
        function changeInstructionsText (text) {
            instructions.children[0].innerHTML = text;
            instructions.style.font = '10pt Arial';
        }
        car.style.display = 'none';
    }
});

/**
 * Places the car in the center of the window, with or without considering scrolling. Called when 
 * loading and resizing.
 * 
 * @param withScrolling If true, places car in the center of the window, regardless of scrolling the user
 * may have done. If false, places car in the center at the top of the document without considering
 * the scrollbar (used for loading). Defaults to true.
 */
 export function placeCarInCenter(withScrolling = true) {
    let point = new Point(
        document.body.offsetWidth / 2,
        (window.innerHeight) / 2 + ((withScrolling) ? window.scrollY : 0) - car.clientHeight / 2
    );

    carProps.setPoint(point);
    car.style.left = point.x + "px";
    car.style.top = point.y + "px";
}

function setCarAcceleration() {
    // Sets the speed of the car based on the width of the browser
    carProps.setVelocityForward((!MOBILE) ? window.innerWidth / 4200 : .6);
    carProps.setVelocityReverse((!MOBILE) ? window.innerWidth / 3800 : .6);
}

/**
 * Updates the position of the car. Best if used with requestAnimationFrame
 */
 export function animateCar () {

    if (calculateFPS) currentFPS++;

    let velocity = carProps.getVelocity();

    let angle = carProps.getAngle();
    let carPoint = carProps.getPoint(), newPoint;

    carProps.setVelocity((velocity - FRICTION > 0) ? velocity - FRICTION :
        (velocity + FRICTION < 0) ? velocity + FRICTION : 0);

    carProps.setPoint(newPoint = new Point(
        carPoint.x + velocity * Math.cos(angle),
        carPoint.y + velocity * Math.sin(angle)
    ));

    // Scrolls the window if the car reaches a 'y' co-or close to the window top or bottom
    const scrollMargin = -75;
    let scrollingPosBottom = parseInt(window.innerHeight) - 65 + window.scrollY + scrollMargin;
    let scrollingPosTop = window.scrollY - scrollMargin;
    if (newPoint.y > scrollingPosBottom && carProps.getVelocity() != 0) {
        window.scroll({
            top: (newPoint.y - scrollingPosBottom) + window.scrollY, 
            left: 0,
        });
    } else if (newPoint.y < scrollingPosTop && carProps.getVelocity() != 0) {
        window.scroll({
            top: (newPoint.y - scrollingPosTop) + window.scrollY, 
            left: 0,
        });
    }
    car.style.left = newPoint.x + "px";
    car.style.top = newPoint.y + "px";
    carImg.style.transform = "rotate(" + (angle - Math.PI / 2) * (180 / Math.PI)  + "deg)";

    let boundary;
    if (boundary = outOfBounds()) {
        placeInBounds(boundary);
    }

    // let wall = hitAWall();
    // if (wall) {
    //     let rect = getElementBounds(wall);
    //     placeInBounds(rect);
    // }

    showHideLinks();
    highlightHeaderLinks();
    //highlightTitle();

    requestAnimationFrame(animateCar);
}

/**
 * Checks if the car is within a rectangle, taking as parameters a starting p1 and ending p2, or simply
 * a {@link Rectangle} object of bounds to check within.
 * 
 * @param {*} p1 a {@link Point} object of the beginning point of the rectangle, or a {@link Rectangle} object.
 * @param {Point} p2 a {@link Point} object of the ending point of the rectangle.
 */
 export function carWithin(p1, p2) {

    const carPoint = carProps.getPoint();

    if (p1 instanceof Rectangle) {
        return p1.pointWithin(carPoint);
    }

    if ((p1.x <= carPoint.x && p2.x >= carPoint.x) && (p1.y <= carPoint.y && p2.y >= carPoint.y)) {
        return true;
    }
}

export /**
 * Places the car at the closest point out of a boundary, back within bounds.
 * 
 * @param {Rectangle} boundary A {@link Rectangle} of the boundary to place the car at its edge back within
 * bounds.
 */
 function placeInBounds(boundary) {

    let carPoint = carProps.getPoint();
    let p1 = boundary.p1, p2 = boundary.p2;
    let closestX = (Math.abs(carPoint.x - p1.x) < Math.abs(carPoint.x - p2.x)) ? p1.x : p2.x;
    let closestY = (Math.abs(carPoint.y - p1.y) < Math.abs(carPoint.y - p2.y)) ? p1.y : p2.y;
    if (Math.abs(carPoint.x - closestX) < Math.abs(carPoint.y - closestY)) {
        carPoint.x = closestX;
    } else {
        carPoint.y = closestY;
    }
    carProps.setVelocity(0);
    carProps.setPoint(carPoint);
}

/**
 * Checks if the car is out of bounds, doing so by essentially creating walls on each side of a certian
 * thickness. This boundery-ing wall, as a {@link Rectangle}, is returned if the car is out of bounds. 
 * 
 * @returns A {@link Rectangle} object of the boundary 'wall' within if out of bounds. Otherwise, returns
 * false.
 */
 export function outOfBounds() {
    let x2 = document.body.clientWidth, y2 = document.body.clientHeight;
    let boundary;
    let borderSize = 40;
    const NORTH_OFFSET = 25, EAST_OFFSET = 27, SOUTH_OFFSET = 28, WEST_OFFSET = 25;
    
    // north
    if (carWithin(boundary = new Rectangle(new Point(0, -borderSize), new Point(x2, NORTH_OFFSET)))) return boundary;

    // east
    if (carWithin(boundary = new Rectangle(new Point(x2 - EAST_OFFSET, 0), new Point(x2 + borderSize, y2)))) return boundary;

    // south
    if (carWithin(boundary = new Rectangle(new Point(0, y2 - SOUTH_OFFSET), new Point(x2, y2 + borderSize)))) return boundary;

    // west
    if (carWithin(boundary = new Rectangle(new Point(-borderSize, 0), new Point(WEST_OFFSET, y2)))) return boundary;

    return false;
}

export function driveCar (e) {

    e.preventDefault();

    const key = e.key;
    if (e.repeat) return; // the repeat event when key is held down

    if (key == 'Enter') {
        let fig, link;
        if (fig = carWithinFigure()) {
            window.location.href = fig.getElementsByTagName('A')[0].href;
        } else if (link = carWithinHeaderLink()) {
            window.location.href = link.children[0].href;
        } else {

            ({ // If 'Enter' pressed on no linkable object, performs a random action
                0: () => changeCarImage(randomCarObjectCount - 1), 
                1: () => changeCarImage(randomCarObjectCount - 1),
                2: () => changeCarImage(randomCarObjectCount - 1), 
                3: () => changeCarImage(randomCarObjectCount - 1),
                4: () => changeCarImage(randomCarObjectCount - 1),
                5: () => dropObject('gear'), 
                6: () => {dropObject('wheel'); randomCarObjectCount = 0;},
            })[randomCarObjectCount++]();

            function changeCarImage (imgNumber) {
                carImg.src = `./resources/carImages/car${imgNumber}.png`;
            }

            function dropObject (fileName) {
                const img = document.createElement('img');
                img.src = './resources/carImages/' + fileName + '.png';
                img.classList.add('carParts');
                const carPoint = carProps.getPoint(), carSize = car.getBoundingClientRect();
                img.style.left = (carPoint.x - (carSize.width / 3)) + 'px';
                img.style.top = (carPoint.y - (carSize.height / 3)) + 'px';
                img.addEventListener("click", () => img.remove());

                document.body.appendChild(img);
            }
        }
    }

    carProps.setDrivingDirections(Object.defineProperty({}, e.key, {value: true, enumerable: true}));
    drive(key);
}

let drive = (key) => {

    // Keeps driving until keyup event changes drivingDirection
    if (carProps.getDrivingDirections()[key] != true) {
        return;
    }

    let velocity = carProps.getVelocity();
    let angle = carProps.getAngle();
    const VELOCITY_FORWARD = carProps.getVelocityForward();
    const VELOCITY_REVERSE = carProps.getVelocityReverse();

    let angChange;
    switch (key) {
        case 'ArrowUp':
            carProps.setVelocity(velocity - VELOCITY_FORWARD); break;
        case 'ArrowDown':
            carProps.setVelocity((velocity < 3) ? velocity + VELOCITY_REVERSE : 3); break;
        case 'ArrowLeft':
            if (velocity == 0) break;

            angChange = (Math.PI / 18) / // decreases angle change when velocity is low
                ((velocity < 1.25 && velocity > -1.25) ? TURN_ANGLE_CAP + 1 / (velocity * 2) : velocity / 2.5);

            carProps.setAngle(angle + ((Math.abs(angChange) < TURN_ANGLE_CAP) ? 
                angChange : TURN_ANGLE_CAP * Math.sign(angChange)));
            break;
        case 'ArrowRight':
            if (velocity == 0) break;
            
            angChange = (Math.PI / 18) / // decreases angle change when velocity is low
                ((velocity < 1.25 && velocity > -1.25) ? TURN_ANGLE_CAP + 1 / (velocity * 2) : velocity / 2.5);

            carProps.setAngle(angle - ((Math.abs(angChange) < TURN_ANGLE_CAP) ? 
                angChange : TURN_ANGLE_CAP * Math.sign(angChange)));
    }

    setTimeout(() => {
        drive(key);
    }, DRIVE_RATE);
};

function keyup (e) {
    carProps.setDrivingDirections(Object.defineProperty({}, e.key, {value: false, enumerable: true}));
}

export function driveCarToPoint(e) {
    if (!MOBILE) return;

    carProps.clearDrivingDirections();

    let carCenter = getElementBounds(car).getParallelogram().getCenterPoint();
    let ePoint = new Point(e.clientX, e.clientY);

    carProps.setAngle(Math.atan2(ePoint.y - carCenter.y, ePoint.x - carCenter.x) + Math.PI);
    let dist = new Rectangle(carProps.getPoint(), ePoint).getDiagonalDistance();
    let fullBreak = getBreakDistanceAndTime(velocity);

    let forward = new Predict(carProps.getVelocity(), 0, 0);
    let reverse = new Predict(carProps.getVelocity(), fullBreak.distance, fullBreak.time);
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
    carProps.setDrivingDirections({ ArrowDown: false, ArrowUp: true, ArrowLeft: false, ArrowRight: false});
    requestAnimationFrame(() => drive('ArrowUp'));

    setTimeout(() => {

        let directions = carProps.getDrivingDirections();
        if (directions.ArrowDown != false ||  // User took control
            directions.ArrowUp != true) return;

        carProps.setDrivingDirections({ ArrowUp: false, ArrowDown: true });
        if (!(velocity <= carProps.getVelocityForward())) requestAnimationFrame(() => drive('ArrowDown'));
        // console.log("forward predict: " + forward.velocity + ", velocity: " + velocity);

    }, forward.time);

    setTimeout(() => {
        
        let directions = carProps.getDrivingDirections();
        if (directions.ArrowUp != false || directions.ArrowDown != true) return;
        
        carProps.setDrivingDirections({ ArrowDown: false });
        // console.log("reverse predict: " + reverse.velocity + ", velocity: " + velocity);
        carProps.setVelocity(0);

    }, forward.time + reverse.time);
}

function getBreakDistanceAndTime(velocity) {

    let predict = new Predict();

    while (predict.velocity < velocity) {
        predict.reverse(); // Predicts values prior to an 'ArrowDown' velocity decrement to the car
    }

    return predict;
}

window.addEventListener("resize", () => {
    placeCarInCenter();
    setCarAcceleration();

    carProps.setAngle(Math.PI / 2);
    carProps.setVelocity(0);
});

window.addEventListener("scroll", () => {
    if (!initialScroll) {
        // Removes the arrow down animation from the page on first scroll
        document.getElementById('arrowDownContainer').style.opacity = 0;
        setTimeout(() => document.getElementById('arrowDownContainer').style.display = 'none', 500);
        initialScroll = true;
    }
});