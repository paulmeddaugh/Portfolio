import { carWithin } from './car.js';
import { getElementBounds } from './utility.js';
import { MOBILE } from './index.js';

let instructions, closeInstructions;
let instructionsHighlighted = false;

const INSTRUCTIONS_FADE_OUT_SECS = 10;
const INSTRUCTIONS_FADE_OUT_MOBILE_SECS = 5;

const INSTRUCTIONS_LOWER = true;
const INSTRUCTIONS_LOWER_SEC = 0;
const INSTRUCTIONS_LOWER_TO = '68%';
const INSTRUCTIONS_MOBILE_LOWER_TO = '92%';

window.addEventListener("load", () => {

    instructions = document.getElementById('instructions');
    closeInstructions = document.getElementById('closeInstructions');

    // Shows and hides instructions
    if (MOBILE) showMobileInfo();
    setInstructionTimeouts();
});

export function highlightInstructions () {
    let instructions = document.getElementById('instructions');

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
    instructions.style.opacity = 0;
    setTimeout(() => { // Lets transition happen
        instructions.style.zIndex = 0;
    }, 1000);
    
    e.stopPropagation();
});

function setInstructionTimeouts() {

    // Transition eases instructions to display on load
    instructions.style.opacity = 1;
    if (INSTRUCTIONS_LOWER) setTimeout(() => {
        instructions.style.top = (!MOBILE ? INSTRUCTIONS_LOWER_TO : INSTRUCTIONS_MOBILE_LOWER_TO);
    }, INSTRUCTIONS_LOWER_SEC * 1000);

    // Closes instructions
    setTimeout(() => {
        instructions.style.opacity = 0;
        setTimeout(() => { // Lets transition happen
            instructions.style.zIndex = 0;
            instructions.style.display = 'none';
        }, 1000);
    }, (!MOBILE ? INSTRUCTIONS_FADE_OUT_SECS : INSTRUCTIONS_FADE_OUT_MOBILE_SECS) * 1000);
}

/**
 * 'Highlights' the element by changing its border and background to a gold theme.
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
 * 'Un-highlights' an element by changing its border and background color to display white.
 * 
 * @param {*} element The element to un-highlight.
 */
 export function unhighlight(element) {
    element.style.border = '1px solid lightgrey';
    element.style.background = 'white';
    if (element.children[1].id == 'closeInstructions') {
        element.children[1].style.opacity = 0;
    }
}

export function showMobileInfo () {
    instructions.style.fontFamily = 'Corbel Light';
    instructions.style.width = '92%';
    instructions.style.background = 'white';
    instructions.style.height = '10%';
    instructions.children[0].innerHTML = "Try viewing on deskop to navigate driving a car.";
}