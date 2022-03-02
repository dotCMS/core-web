import {
    codeIcon,
    headerIcons,
    lineIcon,
    olIcon,
    pIcon,
    quoteIcon,
    ulIcon
} from './suggestion-icons';
import { SafeUrl } from '@angular/platform-browser';

const headings = [...Array(3).keys()].map((level) => {
    const size = level + 1;
    return {
        label: `Heading ${size}`,
        icon: sanitizeUrl(headerIcons[level])
    };
});

const paragraph = [
    {
        label: 'Paragraph',
        icon: sanitizeUrl(pIcon)
    }
];

const list = [
    {
        label: 'List Ordered',
        icon: sanitizeUrl(olIcon)
    },
    {
        label: 'List Unordered',
        icon: sanitizeUrl(ulIcon)
    }
];

const block = [
    {
        label: 'Blockquote',
        icon: sanitizeUrl(quoteIcon)
    },
    {
        label: 'Code Block',
        icon: sanitizeUrl(codeIcon)
    },
    {
        label: 'Horizontal Line',
        icon: sanitizeUrl(lineIcon)
    }
];

function sanitizeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
}
