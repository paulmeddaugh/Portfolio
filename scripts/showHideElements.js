import { carWithin } from "./car.js";
import { getElementBounds } from "./utility.js";

/** Pre-processed Rectangle objects of the figures that are checked for collision. */
let figures;
let hilightedFig = false;

let headerLinks;
let highlightedLink = false;
let titleHighlighted = false;

/**
 * Processes each figure to be represented as a Rectangle object that is checked for collision 
 * on a car animation frame.
 */
function loadFigureRectangles () {
    figures = [];
    
    for (let fig of document.getElementsByTagName('figure')) {
        if (fig.id == 'bigPicture') continue;
        figures.push({ rectangle: getElementBounds(fig), ref: fig });
    }
}

function loadHeaderLinkRectangles () {
    headerLinks = [];

    for (let l of document.getElementsByClassName('headerLinkContainer')) {
        headerLinks.push({ rectangle: getElementBounds(l), ref: l });
    }
}

function loadCollisionRectangles () {
    loadFigureRectangles();
    loadHeaderLinkRectangles();
}

window.addEventListener("load", loadCollisionRectangles);
window.addEventListener("resize", loadCollisionRectangles);

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
        if (fig.id == 'hiddenFields') {
            document.getElementsByClassName('quickAccessAccount')[0].classList.add('showAccount');
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
        if (hilightedFig.id == 'hiddenFields') {
            document.getElementsByClassName('quickAccessAccount')[0].classList.remove('showAccount');
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
    for (let figObj of figures) {
        if (carWithin(figObj.rectangle)) return figObj.ref;
    }

    return false;
}

export function highlightHeaderLinks () {

    let link = carWithinHeaderLink();

    if (highlightedLink && highlightedLink != link) {
        highlightedLink.style.border = '2px solid transparent';
        highlightedLink.style.background = 'initial';
        highlightedLink = false;
    }
    if (link && link != highlightedLink) {
        link.style.border = '2px solid gold';
        link.style.background = '#fffade';
        highlightedLink = link;
    }
}

export function carWithinHeaderLink () {
    for (let headerLinkObj of headerLinks) {
        if (carWithin(headerLinkObj.rectangle)) return headerLinkObj.ref;
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