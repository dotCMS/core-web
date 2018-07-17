// tslint:disable:max-line-length

const animation = '100ms ease-in';
const COLOR_MAIN = `var(--color-main)`;
const COLOR_MAIN_MOD = `var(--color-main_mod)`;
const grayLight = '#c5c5c5';
const MDSHADOW1 = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';
const MDSHADOW3 = '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)';
const white = '#fff';


export const DOTEDIT_CONTAINER__TOOLBAR = `
    margin: -15px 8px 0 0 !important;
    float: right !important;
    font-size: 0 !important;
`;

export const DOTEDIT_MENU = `
    position: relative !important;
`;

const DOTEDIT_CONTAINER__TOOLBAR__BUTTON = `
    box-shadow: ${MDSHADOW1} !important;
    border: none !important;
    border-radius: 16px !important;
    cursor: pointer !important;
    font-size: 0 !important;
    height: 32px !important;
    outline: none !important;
    position: relative !important;
    width: 32px !important;
    z-index: 2147483646 !important;
`;

const DOTEDIT_CONTENTLET__TOOLBAR__BUTTON__DISABLED = `
    background-color: ${grayLight} !important;
`;

const DOTEDIT_CONTENTLET__TOOLBAR__BUTTON = `
    background-color: ${white} !important;
    margin-right: 8px !important;
`;

const DOTEDIT_CONTENTLET__TOOLBAR__BUTTON__HOVER = `
    background-color: ${COLOR_MAIN_MOD} !important;
    box-shadow: ${MDSHADOW3} !important;
`;

const DOTEDIT_CONTENTLET__TOOLBAR__BUTTON__BLUR = `
    background-color: ${COLOR_MAIN} !important;
    box-shadow: ${MDSHADOW1} !important;
`;

const DOTEDIT_CONTAINER = `
    background-position: center !important;
    background-repeat: no-repeat !important;
    transition: background-color ${animation},
                box-shadow ${animation},
                color ${animation} !important;
`;

const DOTEDIT_CONTENTLET__DISABLED = `
    opacity: 0.25 !important;
    pointer-events: none !important;
`;

const DOTEDIT_CONTENTLET__BUTTON__HOVER = `
    box-shadow: ${MDSHADOW3} !important;
`;

const DOTEDIT_CONTENTLET__BUTTON__BLUR = `
    box-shadow: ${MDSHADOW1} !important;
`;

const DOTEDIT_CONTENTLET__BUTTON__LAST = `
    margin-right: 0 !important;
`;

const DOTEDIT_CONTAINER__ADD = `
    background-color: var(--color-main) !important;
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjRkZGRkZGIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTE5IDEzaC02djZoLTJ2LTZINXYtMmg2VjVoMnY2aDZ2MnoiLz4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==) !important;
`;

const DOTEDIT_CONTENTLET__DRAG = `
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNDQ0NDQ0IiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgIDxkZWZzPiAgICAgICAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBpZD0iYSIvPiAgICA8L2RlZnM+ICAgIDxjbGlwUGF0aCBpZD0iYiI+ICAgICAgICA8dXNlIG92ZXJmbG93PSJ2aXNpYmxlIiB4bGluazpocmVmPSIjYSIvPiAgICA8L2NsaXBQYXRoPiAgICA8cGF0aCBjbGlwLXBhdGg9InVybCgjYikiIGQ9Ik0yMCA5SDR2MmgxNlY5ek00IDE1aDE2di0ySDR2MnoiLz48L3N2Zz4=) !important;
    cursor: move !important;
    touch-action: none !important;
`;

const DOTEDIT_CONTENTLET__EDIT = `
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNDQ0NDQ0IiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTMgMTcuMjVWMjFoMy43NUwxNy44MSA5Ljk0bC0zLjc1LTMuNzVMMyAxNy4yNXpNMjAuNzEgNy4wNGMuMzktLjM5LjM5LTEuMDIgMC0xLjQxbC0yLjM0LTIuMzRjLS4zOS0uMzktMS4wMi0uMzktMS40MSAwbC0xLjgzIDEuODMgMy43NSAzLjc1IDEuODMtMS44M3oiLz4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==) !important;
`;

const DOTEDIT_CONTENTLET__REMOVE = `
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNDQ0NDQ0IiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTE5IDYuNDFMMTcuNTkgNSAxMiAxMC41OSA2LjQxIDUgNSA2LjQxIDEwLjU5IDEyIDUgMTcuNTkgNi40MSAxOSAxMiAxMy40MSAxNy41OSAxOSAxOSAxNy41OSAxMy40MSAxMnoiLz4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==) !important;
`;

const DOTEDIT_CONTENTLET__CODE = `
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+ICAgIDxwYXRoIGQ9Ik05LjQgMTYuNkw0LjggMTJsNC42LTQuNkw4IDZsLTYgNiA2IDYgMS40LTEuNHptNS4yIDBsNC42LTQuNi00LjYtNC42TDE2IDZsNiA2LTYgNi0xLjQtMS40eiIvPjwvc3ZnPg==) !important;
`;

export const DOTEDIT_MENU__LIST = `
    background-color: #ffffff !important;
    box-shadow: ${MDSHADOW1} !important;
    font-family: Roboto, 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif !important;
    font-size: 13px !important;
    list-style: none !important;
    margin: 0 !important;
    min-width: 100px !important;
    opacity: 0;
    padding: 8px 0 !important;
    position: absolute !important;
    right: 0 !important;
    transition: all ${animation} !important;
    visibility: hidden;
    z-index:2147483647 !important;
`;

export const DOTEDIT_MENU__ITEM__BUTTON = `
    background-color: ${white} !important;
    color: inherit !important;
    cursor: pointer !important;
    display: block !important;
    line-height: 16px !important;
    padding: 8px !important;
    text-decoration: none !important;
    white-space: nowrap !important;
`;

export const getMenuItemButtonFunctions = (): string => {
    return `onmouseover="
                this.style.backgroundColor='#e7e7e7'";
            onmouseout="
                this.style.backgroundColor='${white}'"`;
};

// tslint:disable-next-line:cyclomatic-complexity
export const getContainerButton = (action: string, disabled?: boolean): string => {
    let styles = `
            ${DOTEDIT_CONTAINER__TOOLBAR__BUTTON}
            ${DOTEDIT_CONTAINER}
        `;

    switch (action) {
        case 'ADD':
            styles += ` ${DOTEDIT_CONTAINER__ADD}
                        ${disabled ? `${DOTEDIT_CONTENTLET__TOOLBAR__BUTTON__DISABLED}` : ''}`;
            break;

        case 'CODE':
            styles += `${DOTEDIT_CONTENTLET__CODE}
                        ${disabled ? `${DOTEDIT_CONTENTLET__TOOLBAR__BUTTON__DISABLED}` : ''}`;
            break;

        case 'DRAG':
            styles += ` ${DOTEDIT_CONTENTLET__TOOLBAR__BUTTON}
                        ${DOTEDIT_CONTENTLET__DRAG}`;
            break;

        case 'EDIT':
            styles += ` ${DOTEDIT_CONTENTLET__TOOLBAR__BUTTON}
                        ${DOTEDIT_CONTENTLET__EDIT}
                        ${disabled ? `${DOTEDIT_CONTENTLET__DISABLED}` : ''}`;
            break;

        case 'REMOVE':
            styles += ` ${DOTEDIT_CONTENTLET__TOOLBAR__BUTTON}
                        ${DOTEDIT_CONTENTLET__REMOVE}
                        ${DOTEDIT_CONTENTLET__BUTTON__LAST}`;
            break;

        default:
            styles += ``;
    }

    return styles;
};

const getTrimmedStyles = (styles: string): string => {
    return `'${styles.replace(/\s*;\s*/, '; ').trim().toString()}'`;
};

export const getContainerButtonFunctions = (): string => {
    return `onmouseover="
                replaceStyles(this.style.cssText, ${getTrimmedStyles(DOTEDIT_CONTENTLET__TOOLBAR__BUTTON__HOVER)}, this);"

            onmouseout="
                replaceStyles(this.style.cssText, ${getTrimmedStyles(DOTEDIT_CONTENTLET__TOOLBAR__BUTTON__BLUR)}, this);"`;
};

export const getContentletButtonFunctions = (): string => {
    return `onmouseover="
                replaceStyles(this.style.cssText, ${getTrimmedStyles(DOTEDIT_CONTENTLET__BUTTON__HOVER)}, this);"
            onmouseout="
                replaceStyles(this.style.cssText, ${getTrimmedStyles(DOTEDIT_CONTENTLET__BUTTON__BLUR)}, this);"`;
};

export const EDIT_PAGE_CSS = `
    :root {
        --color-background: #3A3847;
        --color-main: #C336E5;
        --color-main_mod: #D369EC;
        --color-main_rgb: 195, 54, 229;
        --color-sec: #54428E;
        --color-sec_rgb: 84, 66, 142;
    }

    [data-dot-object="container"] {
        border: solid 1px #53c2f9;
        min-height: 120px;
        margin-bottom:40px;
    }

    [data-dot-object="container"].no {
        border-color: red;
        box-shadow: 0 0 20px red;
        border-radious: 2px;
        background-color: #ff00000f;
    }

    [data-dot-object="container"].disabled {
        border-color: ${grayLight};
    }

    [data-dot-object="contentlet"] {
        margin: 40px 16px 16px;
        position: relative;
        padding-top: 25px;
        min-height: 60px;
        transition: background ${animation};
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVQoU2NkIAIEH/6VxkhIHUjRWlu2WXgVwhSBDMOpEFkRToXoirAqxKYIQyEuRSgK8SmCKySkCKyQGEUghQCguSaB0AmkRwAAAABJRU5ErkJggg==");
    }

    [data-dot-object="container"]:hover [data-dot-object="contentlet"] {
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVQoU2NkIAIEH/r5n5GQOpCitXbsjHgVwhSBDMOpEFkRToXoirAqxKYIQyEuRSgK8SmCKySkCKyQGEUghQCQPycYlScX0wAAAABJRU5ErkJggg==");
    }

    div[data-dot-object="edit-content"] {
        background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNDQ0NDQ0IiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTMgMTcuMjVWMjFoMy43NUwxNy44MSA5Ljk0bC0zLjc1LTMuNzVMMyAxNy4yNXpNMjAuNzEgNy4wNGMuMzktLjM5LjM5LTEuMDIgMC0xLjQxbC0yLjM0LTIuMzRjLS4zOS0uMzktMS4wMi0uMzktMS40MSAwbC0xLjgzIDEuODMgMy43NSAzLjc1IDEuODMtMS44M3oiLz4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==) !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        border-radius: 16px !important;
        cursor: pointer !important;
        float: right !important;
        height: 32px !important;
        opacity: 0.7;
        position: relative !important;
        transition: all ${animation} !important;
        width: 32px !important;
        z-index: 2147483646 !important;
    }

    div[data-dot-object="edit-content"]:hover {
        background-color: rgba(68, 68, 68, 0.1) !important;
        opacity: 1;
    }

    .dotedit-contentlet__content {
        min-height: 100px;
        position: relative;
    }

    .dotedit-contentlet__content:after {
        content: "";
        display: table;
        clear: both;
    }

    .loader,
    .loader:after {
        border-radius: 50%;
        width: 32px;
        height: 32px;
    }

    .loader {
        display: inline-block;
        vertical-align: middle;
        font-size: 10px;
        position: relative;
        text-indent: -9999em;
        border-top: solid 5px rgba(0, 0, 0, 0.2);
        border-right: solid 5px rgba(0, 0, 0, 0.2);
        border-bottom: solid 5px rgba(0, 0, 0, 0.2);
        border-left: solid 5px #000;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation: load8 1.1s infinite linear;
        animation: load8 1.1s infinite linear;
        overflow: hidden;
    }

    .loader__overlay {
        align-items: center;
        background-color: rgba(255, 255, 255, 0.8);
        bottom: 0;
        display: flex;
        justify-content: center;
        left: 0;
        overflow: hidden;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 1;
    }

    @-webkit-keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
    @keyframes load8 {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    .dotedit-container__toolbar button:not([disabled]):hover,
    .dotedit-contentlet__toolbar button:not([disabled]):hover {
        box-shadow: ${MDSHADOW3};
    }

    .dotedit-container__toolbar button:active,
    .dotedit-contentlet__toolbar button:active {
        box-shadow: ${MDSHADOW1};
    }

    .dotedit-contentlet__toolbar {
        display: flex;
        font-size: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        top: -16px;
        transition: opacity ${animation};
    }

    [data-dot-object="contentlet"]:hover .dotedit-contentlet__toolbar {
        opacity: 1;
    }

    .dotedit-container__add:focus,
    .dotedit-contentlet__drag:focus,
    .dotedit-contentlet__edit:focus,
    .dotedit-contentlet__remove:focus,
    .dotedit-contentlet__code:focus {
        outline: none;
    }

    .dotedit-container__add:hover {
        background-color: var(--color-main_mod);
    }

    .dotedit-container__add:focus {
        background-color: var(--color-main_mod);
    }

    .dotedit-container__add:active {
        background-color: var(--color-main_mod);
    }

    .dotedit-menu__list.active {
        visibility: visible !important;
        opacity: 1 !important;
        z-index: 2147483647 !important;
    }

    .dotedit-menu__item a:hover {
        background-color: #e7e7e7;
        text-decoration: none;
    }

    .dotedit-menu__item[title]:hover:after {
        content: attr(title);
        position: absolute;
        top: 100%;
        left: 100%;
    }

    .dotedit-menu__item a,
    .dotedit-menu__item a:visited {
        color: inherit;
        text-decoration: none;
    }

    .dotedit-menu__item--disabled a,
    .dotedit-menu__item--disabled a:hover,
    .dotedit-menu__item--disabled a:active,
    .dotedit-menu__item--disabled a:focus,
    .dotedit-menu__item--disabled a:visited {
        color: ${grayLight};
        pointer-events: none;
        cursor: not-allowed;
    }
`;
