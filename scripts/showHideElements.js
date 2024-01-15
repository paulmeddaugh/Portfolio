import { carWithin } from "./car.js";
import { Point } from "./shapes.js";
import { getElementBounds } from "./utility.js";

/** Pre-processed Rectangle objects of the figures that are checked for collision. */
let figures;
let hilightedFig = false;

let headerLinks;
let highlightedLink = false;
let titleHighlighted = false;

let sendEmailRect;
let isOverEmail = false;

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

function loadSendEmailRectangle () {
    const footerEmail = document.getElementById('footerEmail');

    sendEmailRect = getElementBounds(footerEmail);
    const { paddingLeft, paddingTop } = window.getComputedStyle(footerEmail);

    sendEmailRect.p2 = new Point(
        sendEmailRect.p2.x + parseInt(paddingLeft) * 2, 
        sendEmailRect.p2.y + parseInt(paddingTop) * 2
    );
}

function loadHeaderLinkRectangles () {
    headerLinks = [];

    for (let l of document.getElementsByClassName('headerLinkContainer')) {
        headerLinks.push({ rectangle: getElementBounds(l), ref: l });
    }
}

function loadCollisionRectangles () {
    loadFigureRectangles();
    loadSendEmailRectangle();
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
        fig.classList.add('hover');
        if (fig.id === 'hiddenFields') {
            document.getElementsByClassName('quickAccessAccount')[0].classList.add('showAccount');
        }
        hilightedFig = fig;

    // Removes highlight classes if first time out of highlighted fig
    } else if (hilightedFig && !fig) {
        hilightedFig.classList.remove('hover');
        if (hilightedFig.id === 'hiddenFields') {
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
function carWithinFigure() {
    for (let figObj of figures) {
        if (carWithin(figObj.rectangle)) return figObj.ref;
    }

    return false;
}

/**
 * Returns a reference for the highlightable figure tag the car is in if within one, and false otherwise.
 */
export function isCarWithinFigure () {
    return hilightedFig;
}

export function showHideButtonAnim () {
    // Adds animation
    if (carWithin(sendEmailRect) && !isOverEmail) {
        document.getElementById('footerEmail').style.boxShadow = '0px 0px 6px 0 royalblue';
        isOverEmail = true;
    }
    // Removes animation
    if (!carWithin(sendEmailRect) && isOverEmail) {
        document.getElementById('footerEmail').style.boxShadow = '';
        isOverEmail = false;
    }
}

/**
 * Returns a boolean value of if the car is over the 'Send An E-mail' button.
 */
export function isCarWithinEmailButton () {
    return isOverEmail;
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