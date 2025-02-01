
/**
 * 
 * @param {string} path 
 * @returns {object}
 */
function getJSON(path) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send();
    return JSON.parse(xhr.responseText);
}

function checkMouseTouching({ mx, my, x, y, w, h }) {
    return mx >= x && mx <= x + w && my >= y && my <= y + h;
}

function checkCollide({ x1, y1, w1, h1 }, { x2, y2, w2, h2 }) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}