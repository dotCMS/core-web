import { h } from '../mycomponent.core.js';

function generateId() {
    return Date.now().valueOf();
}
function getItemsFromString(rawString) {
    const items = rawString
        .replace(/(\\r\\n|\\n|\\r)/gi, '~')
        .split('~')
        .filter((item) => item.length > 0)
        .map((item) => {
        const splittedItem = item.split('|');
        return { label: splittedItem[0], value: splittedItem[1] };
    });
    return items;
}

var Fragment = (props, children) => [ ...children ];

export { getItemsFromString as a, generateId as b, Fragment as c };
