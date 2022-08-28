import { getElementBounds, mobileCheck, pointOnLine } from './utility.js';

export const MOBILE = mobileCheck();

window.addEventListener("load", () => {
    setTimeout(() => {
        window.scroll({
            top: 0,
            left: 0
        });
    }, 5);
});

document.getElementById('snowFinder').getElementsByTagName('A')[0].addEventListener('click', (e) => {
    if (MOBILE) {
        alert("Snow Finder is only a desktop application unfortunately.");
        e.preventDefault();
    }
});

window.addEventListener("mousemove", () => {
    changePointerEvents(true);
});

window.addEventListener('keydown', () => {
    changePointerEvents(false);
});

function changePointerEvents (on) {
    // Figures
    for (let f of document.getElementsByTagName('figure')) {
        if (f.id && f.id != 'bigPicture') {
            f.style.pointerEvents = (on) ? 'auto' : 'none';
        }
    }

    // Quick Access account dropdown
    document.getElementById('projHF').style.pointerEvents = (on) ? 'auto' : 'none';

    // Header links
    for (let h of document.getElementsByClassName('headerLinkContainer')) {
        h.style.pointerEvents = (on) ? 'auto' : 'none';
    }
}