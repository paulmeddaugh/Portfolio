import { carWithin } from './car.js';
import { getElementBounds } from './utility.js';
import { MOBILE } from './index.js';

let instructions, closeInstructions;
let instructionsHighlighted = false;

window.addEventListener("load", () => {

    instructions = document.getElementById('instructions');
    closeInstructions = document.getElementById('closeInstructions');
    
    instructions.children[0].innerHTML = (!MOBILE) ? 
        "<img id='arrowKeys' src='../resources/arrowkeys.png' alt='Arrow Keys'><div id='driveText'> - Drive</div>" +
        "</br><img id='enter' src='../resources/enter.png' alt='Enter'><div> - Perform Action</div>" :
        "";

    // Hides instructions
    setInstructionTimeouts();
});

export function highlightInstructions () {
    let instructions = document.getElementById('instructions');
    let x = document.getElementById('closeInstructions');

    let within = carWithin(getElementBounds(instructions));

    if (!instructionsHighlighted && within) {
        highlight(instructions);
        instructionsHighlighted = true;
    } else if (instructionsHighlighted && !within) {
        unhighlight(instructions);
        instructionsHighlighted = false;
    }
}

document.getElementById('closeInstructions').addEventListener("click", (e) => {
    if (e.currentTarget.style.opacity > 0) {
        instructions.style.opacity = 0;
        e.stopPropagation();
    }
});

function setInstructionTimeouts() {

    // // Immediately highlights instructions
    instructions.style.opacity = 1;

    // Closes instructions
    setTimeout(() => {
        instructions.style.opacity = 0;
    }, 10000);
}

/**
 * Changes the border to '2px solid gold' and the background to a light gold color.
 * 
 * @param {*} element The element to highlight.
 */
 export function highlight(element) {
    element.style.border = '1px solid gold';
    element.style.background = '#fffade';
    if (element.children[1].id == 'closeInstructions') {
        element.children[1].style.opacity = 1;
    }
}

/**
 * Changes the border to '2px solid gold' and the background to a light gold color.
 * 
 * @param {*} element The element to highlight.
 */
 export function unhighlight(element) {
    element.style.border = '1px solid transparent';
    element.style.background = 'white';
    if (element.children[1].id == 'closeInstructions') {
        element.children[1].style.opacity = 0;
    }
}