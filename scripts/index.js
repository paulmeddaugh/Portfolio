import { Point, Rectangle, Parallelogram } from './shapes.js';
import { mobileCheck } from './utility.js'; 

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

let hilightedFig = false;

let VELOCITY_FORWARD = .25;
let VELOCITY_BACKWARD = .2;
const DRIVE_RATE = 35;
const FRICTION = 0.005;
const TURN_ANGLE_CAP = Math.PI / 10.5;
const MOBILE = mobileCheck();

window.addEventListener("keydown", driveCar);
window.addEventListener("keyup", keyup);
window.addEventListener("load", () => {

    VELOCITY_FORWARD = (!MOBILE) ? document.body.clientWidth / 5200 : .6;
    VELOCITY_BACKWARD = (!MOBILE) ? document.body.clientWidth / 6500 : .5;
    console.log(VELOCITY_FORWARD + ", " + VELOCITY_BACKWARD);

    header = document.getElementsByClassName('header')[0];

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
    car.style.left = (carPoint.x = (document.body.clientWidth / 2 - car.clientWidth / 2)) + "px";
    car.style.top = (carPoint.y = (document.body.clientHeight / 2 - car.clientHeight / 2)) + "px";
    car.focus(); // chrome still keeps focus on url bar initially

    // createProjectFacingWalls();

    trailPoint = new Point(
        parseInt(window.getComputedStyle(car).left) + 18,
        parseInt(window.getComputedStyle(car).top) - 3
    );

    animateCar();
});

/**
 * Updates the position of the car, and draws its red light trailing
 */
function animateCar () {

    let { carP, vel } = determineNextCarProps(carPoint, velocity);
    velocity = vel; 
    carPoint.x = carP.x;
    carPoint.y = carP.y;

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

    requestAnimationFrame(animateCar);
}

function determineNextCarProps(carPoint, velocity) {
    let vel = (velocity - FRICTION > 0) ? velocity - FRICTION : (velocity + FRICTION < 0) ? velocity + FRICTION : 0;

    let x = carPoint.x + velocity * Math.cos(angle);
    let y = carPoint.y + velocity * Math.sin(angle);
    let carP = new Point(x, y);
    return { carP, vel };
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
function carWithin(p1, p2) {
    if (p1 instanceof Rectangle) {
        return p1.pointWithin(new Point(carPoint.x, carPoint.y));
    }

    if ((p1.x <= carPoint.x && p2.x >= carPoint.x) && (p1.y <= carPoint.y && p2.y >= carPoint.y)) {
        return true;
    }

    return false;
}

/**
 * Generates the beginning co-ordinates and ending co-ordinates of an element and returns the points in
 * a {@link Rectangle} object.
 * 
 * @param {*} wall the element to find its beginning an ending point.
 * @returns A {@link Rectangle} object with the two {@link Point} objects.
 */
function getElementBounds (wall) {
    let p1 = new Point(wall.getBoundingClientRect().left, wall.getBoundingClientRect().top);
    let p2 = new Point(p1.x + parseInt(window.getComputedStyle(wall).width),
                        p1.y + parseInt(window.getComputedStyle(wall).height));
    return new Rectangle(p1, p2);
}

/**
 * Places the car at the closest point out of a boundary, back within bounds.
 * 
 * @param {*} boundary a {@link Rectangle} object of the boundary to place the car at its edge back within
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
 * Manually adds the classes that animate hovering over a project when the car drives within one.
 */
function showHideLinks() {
    let fig = carWithinFigure();
    if (hilightedFig == fig) return;

    if (!hilightedFig && fig) {
        if (fig.getElementsByTagName('IMG')[0]) 
            fig.getElementsByTagName('IMG')[0].classList.add('imgHover');
        else
            fig.getElementsByClassName('projectText')[0].classList.add('imgHover');
        fig.getElementsByTagName('A')[0].classList.add('textHover');
        hilightedFig = fig;
    } else if (hilightedFig && !fig) {
        if (hilightedFig.getElementsByTagName('IMG')[0])
            hilightedFig.getElementsByTagName('IMG')[0].classList.remove('imgHover');
        else
            hilightedFig.getElementsByClassName('projectText')[0].classList.remove('imgHover');
        hilightedFig.getElementsByTagName('A')[0].classList.remove('textHover');
        hilightedFig = false;
    }
}

/**
 * Checks if the car is within a figure.
 * 
 * @returns If within a figure, returns the figure the car is within. Otherwise, returns false.
 */
function carWithinFigure() {
    for (let fig of document.getElementsByTagName('figure')) {
        let figRect = getElementBounds(fig);
        if (carWithin(figRect)) return fig;
    }

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
    }

    if (e.repeat) return; // the repeat event when key is held down
    drivingDirections[e.key] = true;

    let drive = (key) => {
        if (drivingDirections[key] !== true) return;
        
        let angChange;
        switch (key) {
            case 'ArrowUp':
                velocity -= VELOCITY_FORWARD; break;
            case 'ArrowDown':
                velocity = (velocity < 3) ? velocity + VELOCITY_BACKWARD : 3; break;
            case 'ArrowLeft':
                if (velocity == 0) break;

                angChange = (Math.PI / 18) / // 10 deg / half-velocity, spiked when slow
                    ((velocity < 1.25 && velocity > -1.25) ? TURN_ANGLE_CAP + 1 / (velocity * 2) : velocity / 2.5);
                angle += (Math.abs(angChange) < TURN_ANGLE_CAP) ? angChange : TURN_ANGLE_CAP * Math.sign(angChange);
                break;
            case 'ArrowRight':
                if (velocity == 0) break;
                
                angChange = (Math.PI / 18) / // 10 deg / half-velocity, spiked when slow
                    ((velocity < 1.25 && velocity > -1.25) ? TURN_ANGLE_CAP + 1 / (velocity * 2) : velocity / 2.5);
                angle -= (Math.abs(angChange) < TURN_ANGLE_CAP) ? angChange : TURN_ANGLE_CAP * Math.sign(angChange);
        }
    
        setTimeout(() => {
            requestAnimationFrame(() => drive(key));
        }, DRIVE_RATE);
    };
    requestAnimationFrame(() => drive(e.key));
}

function driveCarToPoint(e) {
    let carCenter = getElementBounds(car).getParallelogram().getCenterPoint();
    let ePoint = new Point(e.getX(), e.getY());
    angle = Math.atan2(ePoint.y - carCenter.y, ePoint.x - carCenter.y);
    let dist = new Rectangle(carPoint, ePoint).getDistance();
    let breakDist = determineStompBreakDist(velocity);
}

function determineStompBreakDist(vel) {

    let distTraveled = 0;

    while (vel > 0) {
        vel -= VELOCITY_BACKWARD;
        vel = determineNextCarProps(carPredict, vel).vel;
        distTraveled += vel;
    }

    return distTraveled;
}


function keyup (e) {
    drivingDirections[e.key] = false;
}