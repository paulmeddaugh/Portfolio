import { Point } from './shapes.js';

let car = document.getElementById('car');
let canvas = document.getElementById('background');
let ctx = canvas.getContext('2d');

let trailPoint;

window.addEventListener("load", () => {

    canvas = document.getElementById('background');
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    ctx = canvas.getContext('2d');
    drawBackground();

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.translate(0.5, 0.5);  // 1-pixel width lines, such as x of 10 to x of 20 draws from
    // between 9.5 and 10.5 to 19.5 and 20.5, which is rendered as a 2 pixel line instead.

    trailPoint = new Point(
        parseInt(window.getComputedStyle(car).left) + 18,
        parseInt(window.getComputedStyle(car).top) - 3
    );
});

function drawBackground() {
    // Re-draws the background constantly with little opacity to allow for trailing effects of what is drawn
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight);
    ctx.globalAlpha = 1;
}

/**
 * Draws two red backlights that fade over time.
 * Doesn't work.
 */
 export function drawTrail() {
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