// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import addContext from 'mochawesome/addContext';

// now any cookie with the name 'JSESSIONID' or 'access_token'
// will not be cleared before each test runs
Cypress.Cookies.defaults({
    preserve: ['JSESSIONID', 'access_token']
});

Cypress.Cookies.debug(true);

// Adds screenshots & videos to failed tests report
Cypress.on('test:after:run', (test, runnable) => {
    if (test.state === 'failed') {
        const screenshot = `../screenshots/${Cypress.spec.name}/${runnable.parent.title} -- ${test.title} (failed).png`;
        addContext({ test }, screenshot);

        const video = `../videos/${Cypress.spec.name}.mp4`;
        addContext({ test }, video);
    }
});
