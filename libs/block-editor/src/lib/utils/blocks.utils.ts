/**
 * Convert a string list to array
 * delete repeated strings and remove all the spaces
 * @param string
 * @param separator
 */
export const stringListToArray = (string: string, separator = ',') => {
    return [...new Set(string.split(','))].map((item) => item.trim());
};
