import { getElementBounds, mobileCheck, pointOnLine } from './utility.js';
import { resetCar } from './car.js';

export const MOBILE = mobileCheck();
let nameRect, headerTitleHidden = true;
let headerTitle, headerTop;

window.addEventListener("load", () => {
    setTimeout(() => {
        window.scroll({
            top: 0,
            left: 0
        });
    }, 5);

    function scrollTo (e) {
        const targetMap = {
            'projectsLink': 'projectHeader',
            'aboutLink': 'aboutMeHeader'
        }
        const { top } = document.getElementById(targetMap[e.target.id]).getBoundingClientRect();
        const HEADER_HEIGHT = 50;
        window.scroll({
            left: 0,
            top: top + window.scrollY - HEADER_HEIGHT,
            behavior: 'smooth',
        })
        setTimeout(() => {if (!MOBILE) resetCar()}, 500);
    }

    document.getElementById("projectsLink").addEventListener("click", scrollTo);
    document.getElementById("aboutLink").addEventListener("click", scrollTo);

    nameRect = getElementBounds(document.getElementById('name'));
    headerTitle = document.getElementById('headerTitle');
    headerTop = document.getElementById('headerBar');
});

// Re-processes representational header Rectancle object
window.addEventListener("resize", () => {
    nameRect = getElementBounds(document.getElementById('name'));
})

// Checks if header
window.addEventListener("scroll", () => {
    if (window.scrollY > Math.max(nameRect.p1.y, nameRect.p2.y) && headerTitleHidden) {
        // headerTop.style.opacity = 1;
        headerTop.style.backgroundColor = 'rgba(255, 255, 255, 0.873)';
        headerTitleHidden = false;
    }
    if (window.scrollY <= Math.max(nameRect.p1.y, nameRect.p2.y) && !headerTitleHidden) {
        // headerTop.style.opacity = 0;
        headerTop.style.backgroundColor = '#f8f8f8a1';
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