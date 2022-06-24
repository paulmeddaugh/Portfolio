
let car;
let velocity = 0;
let angle = Math.PI / 2; // 90

let carX;
let carY;

let driving = false;

let background;
let trailing;
let trailingctx;
let header;
let track;

let trailingp1;
let trailingp2;

const VELOCITY_CHANGE = .3;
const DRIVE_RATE = 35;
const FRICTION = 0.005;
const TURN_ANGLE_CAP = Math.PI / 15;

window.addEventListener("keydown", driveCar);
window.addEventListener("keyup", () => {driving = false;});

window.addEventListener("load", () => {

    header = document.getElementsByClassName('header')[0];
    track = document.getElementById('track');
    trailing = document.getElementById('trailingEffect');
    trailingctx = trailing.getContext('2d');

    background = document.getElementById('background');
    background.width = document.body.clientWidth;
    background.height = document.body.clientHeight - parseInt(window.getComputedStyle(header).height);
    trailing.width = background.width;
    trailing.height = background.height;

    // background.getContext('2d').fillStyle = 'lightyellow';
    // background.getContext('2d').fillRect(0, 0, background.width, background.height);
    // background.getContext('2d').drawImage(track, 0, 0);

    car = document.getElementById('car');
    car.tabIndex = 3;
    car.style.left = (carX = (document.body.clientWidth / 2 - car.clientWidth / 2)) + "px";
    car.style.top = (carY = (document.body.clientHeight / 2 - car.clientHeight / 2)) + "px";

    trailingctx.strokeStyle = 'red';
    trailingctx.lineWidth = 1;
    
    trailingp1 = {x: parseInt(window.getComputedStyle(car).left) + 18,
        y: parseInt(window.getComputedStyle(car).top) - 3};
    trailingp2 = trailingp1;

    animateCar();
});

function animateCar (e) {

    velocity = (velocity - FRICTION > 0) ? velocity - FRICTION : (velocity + FRICTION < 0) ? velocity + FRICTION : 0;

    carX += velocity * Math.cos(angle);
    carY += velocity * Math.sin(angle);

    car.style.left = carX + "px";
    car.style.top = carY + "px";
    car.style.transform = "rotate(" + (angle - Math.PI / 2) * (180 / Math.PI)  + "deg)";

    trailingctx.fillStyle = 'rgb(255, 255, 255, 0.1)';
    trailingctx.fillRect(0, 0, background.width, background.height);

    let centerX = parseInt(window.getComputedStyle(car).left) + (parseInt(window.getComputedStyle(car).width) / 2);
    let centerY = parseInt(window.getComputedStyle(car).top) - (parseInt(window.getComputedStyle(car).height) / 2);
    
    let newp1 = {x: centerX, y: centerY - 3};
    let newp2 = {x: parseInt(window.getComputedStyle(car).left) + 18,
                  y: parseInt(window.getComputedStyle(car).top) - 3};

    trailingctx.beginPath();
    trailingctx.moveTo(trailingp1.x, trailingp1.y);
    trailingctx.lineTo(newp1.x, newp1.y);
    // trailingctx.moveTo(trailingp2.x, trailingp2.y);
    // trailingctx.lineTo(newp2.x, newp2.y);
    trailingctx.closePath();
    trailingctx.stroke();

    trailingp1 = newp1;
    trailingp2 = newp2;

    requestAnimationFrame(animateCar);
}

function driveCar (e) {

    // When held down, only calls the drive function from inside itself with setTimeout, 
    // not the event handler
    if (driving) return;
    driving = true;

    const drive = () => {
        if (!driving) return;

        switch (e.key) {
            case 'ArrowUp':
                velocity -= VELOCITY_CHANGE; break;
            case 'ArrowDown':
                if (velocity + 1 > 1 && velocity + VELOCITY_CHANGE + 1 < 1) driving = false;
                velocity = (velocity < 3) ? velocity + VELOCITY_CHANGE : 3; break;
            case 'ArrowLeft':
                if (velocity != 0) {
                    let change = (Math.PI / 18) / (velocity / 2);
                    // makes sure change of angle isn't over TURN_ANGLE_CAP
                    angle += (Math.abs(change) < TURN_ANGLE_CAP) ? change : 
                        (change + 1 > 1) ? TURN_ANGLE_CAP : -TURN_ANGLE_CAP;
                    break;
                } 
            case 'ArrowRight':
                if (velocity != 0) {
                    let change = (Math.PI / 18) / (velocity / 2);
                    // makes sure change of angle isn't over TURN_ANGLE_CAP
                    angle -= (Math.abs(change) < TURN_ANGLE_CAP) ? change : 
                        (change + 1 > 1) ? TURN_ANGLE_CAP : -TURN_ANGLE_CAP;
                } 
        }
    
        setTimeout(() => {
            if (driving) drive();
        }, DRIVE_RATE);
    };

    drive();
}

function decreaseVelocity () {
    
    setTimeout(() => {
        if (driving) decreaseVelocity();
    }, DRIVE_RATE);
}

function changeAngle (left) {
    if (driving)angle = (left) ? angle - VELOCITY_CHANGE : angle + VELOCITY_CHANGE
    setTimeout(() => {
        if (driving) changeAngle(left);
    }, DRIVE_RATE);
}