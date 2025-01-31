
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