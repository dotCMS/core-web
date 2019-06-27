import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
    namespace: 'dotcmsFields',
    copy: [{ src: './dot-form.html', dest: '../www/dot-form.html' }],
    outputTargets: [
        { type: 'dist' },
        { type: 'docs' },
        {
            type: 'www',
            // buildDir: '/Users/fmontes/dev/dotcms/tomcat8/webapps/ROOT/custom-elements.dot-label__text',
            serviceWorker: null // disable service workers
        }
    ],
    plugins: [sass()]
};
