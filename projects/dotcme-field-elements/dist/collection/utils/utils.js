export function generateId() {
    return Date.now().valueOf();
}
export function getItemsFromString(rawString) {
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
