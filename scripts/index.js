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
        alert("Snow Finder can only run on desktop unfortunately as it was written in Java.");
        e.preventDefault();
    }
});