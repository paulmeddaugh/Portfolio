import { Point, Rectangle } from "./shapes.js";

/**
 * Checks if the device is a mobile phone.
 * 
 * @returns true if mobile and false if otherwise.
 */
 export function mobileCheck() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hipDPR|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

/**
 * Memoizes the results of a function, providing caching for its results.
 * 
 * @param {function} fn The function to memoize.
 * @returns A function wrapping the function to memoize with caching.
 */
function memoize (fn) {
    let cache = {};
    return (...args) => {
        let n = args[0];
        if (n in cache) {
            return cache[n];
        }
        else {
            let result = fn(n);
            cache[n] = result;
            return result;
        }
    }
}

/**
 * Generates the beginning co-ordinates and ending co-ordinates of an element and returns the points in
 * a {@link Rectangle} object.
 * 
 * @param {*} el The element to find its beginning and ending point.
 * @returns A {@link Rectangle} object with the two {@link Point} objects.
 */
export function getElementBounds (el) {
    
    const rect = el.getBoundingClientRect();

    const p1 = new Point(rect.left + window.scrollX, rect.top + window.scrollY);
    const p2 = new Point(p1.x + parseInt(window.getComputedStyle(el).width),
                        p1.y + parseInt(window.getComputedStyle(el).height));
    return new Rectangle(p1, p2);
}

// Beta, attempted caching for getElementBounds(), doesn't work in Firefox
const clientRect = memoize((elId) => {

    const el = document.getElementById(elId);
    const rect = el.getBoundingClientRect();

    return { left: rect.left, top: rect.top };
});

/**
 * Determines if a point is to the left, on, or to the right of a line.
 * 
 * @param {Point} line1 The beginning point of the line.
 * @param {Point} line2 The ending point of the line.
 * @param {Point} p The point to determine its position with regard to the line.
 * @returns A number greater than 0 if on the left side of the line, 0 if on the line, and a number less
 * than 0 if on the right side of the line.
 */
export function pointOnLine(line1, line2, p) {
    Point.checkIfPoints({ line1, line2, p});

    return (line2.x - line1.x) * (p.y - line1.y) - (p.x - line1.x) * (line2.y - line1.y);
}

export function downloadFromURL (url) {
    fetch(url).then(res => res.blob()).then(file => {
        let tempUrl = URL.createObjectURL(file);
        const aTag = document.createElement('a');
        aTag.href = tempUrl;
        aTag.download = url.replace(/^.*[\\\/]/, '');
        document.body.appendChild(aTag);

        aTag.click();
        aTag.remove();
        URL.revokeObjectURL(tempUrl);
    }).catch(() => {
        alert('Failed to download ' + url);
    });
}