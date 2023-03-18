import { getElementBounds, mobileCheck, pointOnLine } from './utility.js';
import { resetCar } from './car.js';

export const MOBILE = mobileCheck();
let nameRect, headerTitleHidden = true;

window.addEventListener("load", () => {
    setTimeout(() => {
        window.scroll({
            top: 0,
            left: 0
        });
    }, 5);

    function scrollTo (e) {
        const targetMap = {
            'projectHeader': 'projectGrid',
            'aboutHeader': 'aboutMeHeader'
        }
        const { top } = document.getElementById(targetMap[e.target.id]).getBoundingClientRect();
        const HEADER_HEIGHT = 45;
        window.scroll({
            left: 0,
            top: top + window.scrollY - HEADER_HEIGHT,
            behavior: 'smooth',
        })
        setTimeout(() => resetCar(), 500);
    }

    document.getElementById("projectHeader").addEventListener("click", scrollTo);
    document.getElementById("aboutHeader").addEventListener("click", scrollTo);

    nameRect = getElementBounds(document.getElementById('name'));
});

// Re-processes representational header Rectancle object
window.addEventListener("resize", () => {
    nameRect = getElementBounds(document.getElementById('name'));
})

// Checks if header
window.addEventListener("scroll", () => {
    if (window.scrollY > Math.max(nameRect.p1.y, nameRect.p2.y) && headerTitleHidden) {
        document.getElementById('headerTitle').style.opacity = 1;
        document.getElementsByClassName('header-t')[0].style.backgroundColor = 'rgba(255, 255, 255, 0.873)';
        headerTitleHidden = false;
    }
    if (window.scrollY <= Math.max(nameRect.p1.y, nameRect.p2.y) && !headerTitleHidden) {
        document.getElementById('headerTitle').style.opacity = 0;
        document.getElementsByClassName('header-t')[0].style.backgroundColor = 'transparent';
        headerTitleHidden = true;
    }
})

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