const URL_REGEX = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
);

export function isValidURL(url: string): boolean {
    return URL_REGEX.test(url);
}

export function  isFileAllowed(name: string, allowedFiles: string[]): boolean {
    const extension = name.substring(name.indexOf('.'), name.length);
    if (allowedFiles.length === 0 || allowedFiles.indexOf('*') === 0) {
        return true;
    } else {
        return allowedFiles.indexOf(extension) >= 0;
    }
}
