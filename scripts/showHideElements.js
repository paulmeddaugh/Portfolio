import { carWithin } from "./car.js";
import { getElementBounds } from "./utility.js";

let hilightedFig = false;
let highlightedLink = false;
let titleHighlighted = false;

/**
 * Manually adds the classes that animate hovering over a project when the car drives within one.
 */
 export function showHideLinks() {
    let fig = carWithinFigure();
    if (hilightedFig == fig) return;

    // Adds highlight classes if the first time in a fig
    if (!hilightedFig && fig) {
        let figChildren = fig.children;
        for (let i = 0; i < figChildren.length; i++) {
            if (figChildren[i].tagName == 'A' ) {
                figChildren[i].classList.add('textHover'); // opacity to 1
            } else {
                figChildren[i].classList.add('imgHover'); // opacity to .3
            }
        }
        hilightedFig = fig;

    // Removes highlight classes if first time out of highlighted fig
    } else if (hilightedFig && !fig) {
        let figChildren = hilightedFig.children;
        for (let i = 0; i < figChildren.length; i++) {
            if (figChildren[i].tagName == 'A' ) {
                figChildren[i].classList.remove('textHover');
            } else {
                figChildren[i].classList.remove('imgHover');
            }
        }
        hilightedFig = false;
    }
}

/**
 * Checks if the car is within a figure.
 * 
 * @returns If within a figure, returns the figure the car is within. Otherwise, returns false.
 */
export function carWithinFigure() {
    for (let fig of document.getElementsByTagName('figure')) {
        if (fig.id == 'bigPicture') continue;
        let figRect = getElementBounds(fig);
        if (carWithin(figRect)) return fig;
    }

    return false;
}

export function highlightHeaderLinks () {

    let link = carWithinHeaderLink();

    if (highlightedLink && highlightedLink != link) {
        highlightedLink.style.border = '2px solid transparent';
        highlightedLink.style.background = 'white';
        highlightedLink = false;
    }
    if (link && link != highlightedLink) {
        link.style.border = '2px solid gold';
        link.style.background = '#fffade';
        highlightedLink = link;
    }
}

export function carWithinHeaderLink () {
    for (let l of document.getElementsByClassName('headerLinkContainer')) {
        if (carWithin(getElementBounds(l))) {
            return l;
        }
    }

    return null;
}

export function highlightTitle () {
    let title = document.getElementsByClassName('headerTitle');

    let within = carWithin(getElementBounds(title));

    if (!titleHighlighted && within) {
        title.style.fontWeight = 'bold';
        titleHighlighted = true;
    } else if (titleHighlighted && !within) {
        title.style.fontWeight = 'none';
        titleHighlighted = false;
    }
}