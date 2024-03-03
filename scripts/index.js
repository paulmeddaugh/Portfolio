import { getElementBounds, mobileCheck, pointOnLine } from './utility.js';
import { REMOVE_CAR_MIN_WIDTH } from './constants.js';
import { resetCar, carProps } from './car.js';

export const MOBILE = mobileCheck();
let nameRect, headerTitleHidden = true;
let headerTitle, headerTop;
let figureHoverTapped = null;
let headerBarBgColor = null;

window.addEventListener("load", () => {
    setTimeout(() => {
        window.scroll({
            top: 0,
            left: 0
        });
    }, 5);

    function scrollTo (e) {
        const scrollToId = ({
            'projectsLink': 'projectHeader',
            'aboutLink': 'aboutMeHeader'
        })[e.target.id];
        const { top } = document.getElementById(scrollToId).getBoundingClientRect();
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
    headerBarBgColor = getComputedStyle(headerTop).backgroundColor;

    carProps.useCarAnimation(true, 4.6);
});

// Re-processes representational header Rectancle object
window.addEventListener("resize", () => {
    nameRect = getElementBounds(document.getElementById('name'));

    const windowWidth = parseInt(window.innerWidth);
    if (windowWidth < REMOVE_CAR_MIN_WIDTH && carProps.isAnimatingCar()) {
        carProps.useCarAnimation(false);
    } else if (windowWidth > REMOVE_CAR_MIN_WIDTH && !carProps.isAnimatingCar()) {
        carProps.useCarAnimation(true);
    }
})

// Checks if header
window.addEventListener("scroll", () => {
    if (!(typeof nameRect?.p1?.y === 'number' && typeof nameRect?.p2?.y === 'number')) return;
    if (window.scrollY > Math.max(nameRect.p1.y, nameRect.p2.y) && headerTitleHidden) {
        headerTop.style.backgroundColor = 'rgba(255, 255, 255, 0.873)';
        headerTitleHidden = false;
    }
    if (window.scrollY <= Math.max(nameRect.p1.y, nameRect.p2.y) && !headerTitleHidden) {
        headerTop.style.backgroundColor = headerBarBgColor;
        headerTitleHidden = true;
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