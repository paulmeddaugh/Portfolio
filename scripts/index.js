import { Point, Rectangle, Parallelogram } from './shapes.js';
import { mobileCheck, getElementBounds } from './utility.js'; 
import { Predict } from './predict.js';
import { carWithinFigure, showHideLinks, carWithinHeaderLink, highlightHeaderLinks } from './showHideElements.js'

let car;
let velocity = 0;
let angle = Math.PI / 2; // 90

let carPoint = new Point();

let canvas;
let ctx;
let header;

let trailPoint;
let trailingp2;

let drivingDirections = {};

const AVERAGE_RANGE_FPS = 5;
const AVERAGE_CALC_PER_SEC = 4;
let totalFPS = 1, lastFPS = 1, currentFPS = 0, FPSindex = AVERAGE_RANGE_FPS - 1;

export let VELOCITY_FORWARD = .25;
export let VELOCITY_REVERSE = .2;
export const DRIVE_RATE = 35;
const FRICTION = 0.005;
const TURN_ANGLE_CAP = Math.PI / 10;
const MOBILE = mobileCheck();

window.addEventListener("keydown", driveCar);
window.addEventListener("keyup", (e) => drivingDirections[e.key] = false);
window.addEventListener("click", driveCarToPoint);
window.addEventListener("load", () => {

    VELOCITY_FORWARD = (!MOBILE) ? document.body.clientWidth / 4200 : .6;
    VELOCITY_REVERSE = (!MOBILE) ? document.body.clientWidth / 5500 : .5;
    
    document.getElementById('instructions').children[0].innerHTML = (!MOBILE) ? 
        "Arrow Keys - Drive</br>'Enter' - Go to a Link" :
        "Tap - Drive to Link";

    canvas = document.getElementById('background');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    ctx = canvas.getContext('2d');
    drawBackground();

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.translate(0.5, 0.5);  // 1-pixel width lines, such as x of 10 to x of 20 draws from
    // between 9.5 and 10.5 to 19.5 and 20.5, which is rendered as a 2 pixel line instead.

    car = document.getElementById('car');
    placeCarInCenter();

    // createProjectFacingWalls();

    trailPoint = new Point(
        parseInt(window.getComputedStyle(car).left) + 18,
        parseInt(window.getComputedStyle(car).top) - 3
    );

    // Calculates the frames per second
    setInterval(() => {
        currentFPS *= AVERAGE_CALC_PER_SEC;
        totalFPS = (totalFPS - lastFPS) + currentFPS;
        //console.log(totalFPS / (AVERAGE_RANGE_FPS - FPSindex));
        if (!FPSindex) lastFPS = currentFPS;
        else FPSindex--;
        currentFPS = 0;
    }, 1000 / AVERAGE_CALC_PER_SEC);

    // Hides instructions
    setTimeout(() => {
        let instructions = document.getElementById('instructions');
        instructions.style.opacity = 0;
    }, 10000);

    animateCar();
});

function placeCarInCenter() {
    car.style.left = (carPoint.x = (document.body.clientWidth / 2 - car.clientWidth / 2)) + "px";
    car.style.top = (carPoint.y = (document.body.clientHeight / 2 - car.clientHeight / 2)) + "px";
    car.focus(); // chrome still keeps focus on url bar initially
}

/**
 * Updates the position of the car, and draws its red light trailing
 */
function animateCar () {

    currentFPS++;

    velocity = (vel - FRICTION > 0) ? vel - FRICTION : (vel + FRICTION < 0) ? vel + FRICTION : 0;
    carPoint = new Point(
        carPoint.x + velocity * Math.cos(angle),
        carPoint.y + velocity * Math.sin(angle)
    );

    car.style.left = carPoint.x + "px";
    car.style.top = carPoint.y + "px";
    car.style.transform = "rotate(" + (angle - Math.PI / 2) * (180 / Math.PI)  + "deg)";

    // Re-draws the background constantly with little opacity to allow for trailing effects of what is drawn
    ctx.globalAlpha = 0.15;
    drawBackground();
    ctx.globalAlpha = 1;

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

    requestAnimationFrame(animateCar);
}

function drawBackground() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight);
}

/**
 * Checks if the car is within a rectangle, taking as parameters a starting p1 and ending p2, or simply
 * a {@link Rectangle} object of bounds to check within.
 * 
 * @param {*} p1 a {@link Point} object of the beginning point of the rectangle, or a {@link Rectangle} object.
 * @param {Point} p2 a {@link Point} object of the ending point of the rectangle.
 */
export function carWithin(p1, p2) {

    if (p1 instanceof Rectangle) {
        return p1.pointWithin(new Point(carPoint.x, carPoint.y));
    }

    if ((p1.x <= carPoint.x && p2.x >= carPoint.x) && (p1.y <= carPoint.y && p2.y >= carPoint.y)) {
        return true;
    }

    return false;
}

/**
 * Places the car at the closest point out of a boundary, back within bounds.
 * 
 * @param {Rectangle} boundary A {@link Rectangle} of the boundary to place the car at its edge back within
 * bounds.
 */
function placeInBounds(boundary) {
    let p1 = boundary.p1, p2 = boundary.p2;
    let closestX = (Math.abs(carPoint.x - p1.x) < Math.abs(carPoint.x - p2.x)) ? p1.x : p2.x;
    let closestY = (Math.abs(carPoint.y - p1.y) < Math.abs(carPoint.y - p2.y)) ? p1.y : p2.y;
    if (Math.abs(carPoint.x - closestX) < Math.abs(carPoint.y - closestY)) {
        carPoint.x = closestX;
    } else {
        carPoint.y = closestY;
    }
    velocity = 0;
}

/**
 * Checks if the car is out of bounds, doing so by essentially creating walls on each side of a certian
 * thickness. This boundery-ing wall, as a {@link Rectangle}, is returned if the car is out of bounds. 
 * 
 * @returns A {@link Rectangle} object of the boundary 'wall' within.
 */
function outOfBounds() {
    let x2 = document.body.clientWidth, y2 = document.body.clientHeight;
    let boundary;
    let borderSize = 40;
    
    // north
    if (carWithin(boundary = new Rectangle(new Point(0, -borderSize), new Point(x2, 0)))) return boundary;

    // east
    if (carWithin(boundary = new Rectangle(new Point(x2, 0), new Point(x2 + borderSize, y2)))) return boundary;

    // south
    if (carWithin(boundary = new Rectangle(new Point(0, y2), new Point(x2, y2 + borderSize)))) return boundary;

    // west
    if (carWithin(boundary = new Rectangle(new Point(-borderSize, 0), new Point(0, y2)))) return boundary;

    return false;
}

/**
 * Draws two red backlights that fade over time.
 * Doesn't work.
 */
function drawTrail() {
    //let carPara = getElementBounds(car).getParallelogram().rotate(angle - Math.PI / 2);
    //console.log(carPara);

    let centerX = parseInt(window.getComputedStyle(car).left) + (parseInt(window.getComputedStyle(car).width) / 2);
    let centerY = parseInt(window.getComputedStyle(car).top) - (parseInt(window.getComputedStyle(car).height) / 2);

    let center = {
        x: centerX,
        y: centerY + parseInt(window.getComputedStyle(header).height)
    }
    let length = angle;
    let newp1 = new Point(center.x, center.y);
    let newp2 = new Point(
        parseInt(window.getComputedStyle(car).left), 
        parseInt(window.getComputedStyle(car).top)
    );

    ctx.beginPath();
    ctx.moveTo(trailPoint.x, trailPoint.y);
    ctx.lineTo(newp1.x, newp1.y);
    ctx.closePath();
    ctx.stroke();

    trailPoint = newp1;
    trailingp2 = newp2;
}

function driveCar (e) {

    if (e.key == 'Enter') {
        let fig = carWithinFigure();
        if (fig) window.location.href = fig.getElementsByTagName('A')[0].href;

        let link = carWithinHeaderLink();
        if (link) window.location.href = link.children[0].href;
    }

    if (e.repeat) return; // the repeat event when key is held down
    drivingDirections[e.key] = true;

    requestAnimationFrame(() => drive(e.key));
}

let drive = (key) => {
    if (drivingDirections[key] != true) {
        return;
    }
    
    let angChange;
    switch (key) {
        case 'ArrowUp':
            velocity -= VELOCITY_FORWARD; break;
        case 'ArrowDown':
            velocity = (velocity < 3) ? velocity + VELOCITY_REVERSE : 3; break;
        case 'ArrowLeft':
            if (velocity == 0) break;

            angChange = (Math.PI / 18) / // decreases angle change when velocity is low
                ((velocity < 1.25 && velocity > -1.25) ? TURN_ANGLE_CAP + 1 / (velocity * 2) : velocity / 2.5);
            angle += (Math.abs(angChange) < TURN_ANGLE_CAP) ? angChange : TURN_ANGLE_CAP * Math.sign(angChange);
            break;
        case 'ArrowRight':
            if (velocity == 0) break;
            
            angChange = (Math.PI / 18) / // decreases angle change when velocity is low
                ((velocity < 1.25 && velocity > -1.25) ? TURN_ANGLE_CAP + 1 / (velocity * 2) : velocity / 2.5);
            angle -= (Math.abs(angChange) < TURN_ANGLE_CAP) ? angChange : TURN_ANGLE_CAP * Math.sign(angChange);
    }

    setTimeout(() => {
        requestAnimationFrame(() => drive(key));
    }, DRIVE_RATE);
};


window.addEventListener("resize", () => {
    placeCarInCenter();
    angle = Math.PI / 2;
    velocity = 0;
});

function driveCarToPoint(e) {
    if (!MOBILE) return;

    drivingDirections = {};

    let carCenter = getElementBounds(car).getParallelogram().getCenterPoint();
    let ePoint = new Point(e.clientX, e.clientY);

    angle = Math.atan2(ePoint.y - carCenter.y, ePoint.x - carCenter.x) + Math.PI;
    let dist = new Rectangle(carPoint, ePoint).getDiagonalDistance();
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
    drivingDirections.ArrowDown = false;
    drivingDirections.ArrowUp = true;
    requestAnimationFrame(() => drive('ArrowUp'));

    setTimeout(() => {
        if (drivingDirections.ArrowDown != false ||
            drivingDirections.ArrowUp != true) return;
        drivingDirections.ArrowUp = false;
        drivingDirections.ArrowDown = true;
        requestAnimationFrame(() => drive('ArrowDown'));
        // console.log("forward predict: " + forward.velocity + ", velocity: " + velocity);
    }, forward.time);

    setTimeout(() => {
        if (drivingDirections.ArrowUp != false ||
            drivingDirections.ArrowDown != true) return;
        drivingDirections.ArrowDown = false;
        // console.log("reverse predict: " + reverse.velocity + ", velocity: " + velocity);
        velocity = 0;
    }, forward.time + reverse.time);
}
function getBreakDistanceAndTime(velocity) {

    let predict = new Predict();

    while (predict.velocity < velocity) {
        predict.reverse(); // Predicts values prior to an 'ArrowDown' velocity decrement to the car
    }

    return predict;
}