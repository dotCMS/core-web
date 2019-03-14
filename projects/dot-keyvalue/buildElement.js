const fs = require('fs-extra');
const concat = require('concat');
const createFile = require('create-file');

(async function build() {
    const outputDir = './dist-lib/dot-keyvalue';
    const indexFile = `
        <!doctype html>
        <html lang="en">
        <head>
        <title>Angular Elements Demo</title>
        <link href="styles.css" rel="stylesheet" type="text/css" media="all">
        </head>
        <body>
            <dot-keyvalue></dot-keyvalue>
            <script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.1.3/custom-elements-es5-adapter.js"></script>
            <script src="./dot-keyvalue.js"></script>
            <script>
                const keyvalue = document.querySelector('dot-keyvalue');
                keyvalue.variables = [{
                    clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
                    fieldId: 'ec8cc36f-6058-4ab5-9bfb-fc36ab011ee5',
                    id: 'fd39ccaa-ffbc-420f-9839-46eaad625f59',
                    key: 'a1',
                    value: 'asd1'
                }, {
                    clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
                    fieldId: 'ec8cc36f-6058-4ab5-9bfb-fc36ab011ee5',
                    id: 'fd39ccaa-ffbc-420f-9839-46eaad625f59',
                    key: 'b2',
                    value: 'bvc2'
                }, {
                    clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
                    fieldId: 'ec8cc36f-6058-4ab5-9bfb-fc36ab011ee3',
                    id: 'fd39ccaa-ffbc-420f-9839-46eaad625f59',
                    key: 'b3',
                    value: 'bvc3'
                }];
                keyvalue.labels = {
                    add: 'Add',
                    delete: 'Delete',
                    keyPlaceholder: 'Key',
                    title: 'Key and Value:',
                    valuePlaceholder: 'Value'
                };

                keyvalue.addEventListener('variablesEmitted', (event) => {
                    console.log(event.detail);
                    console.log("variablesEmitted emitted:" + event.detail);
                });
                //setTimeout(() => (keyvalue.value = 'Second Value'), 3000);
            </script>
        </body>
        </html>`;

    const files = [
        `${outputDir}/runtime.js`,
        `${outputDir}/polyfills.js`,
        // `${outputDir}/scripts.js`,
        `${outputDir}/main.js`
    ];
    await fs.ensureDir(`${outputDir}/elements`);
    await concat(files, `${outputDir}/elements/dot-keyvalue.js`);
    await fs.copyFile(
        `${outputDir}/styles.css`,
        `${outputDir}/elements/styles.css`
    );
    // await fs.copy('./dist/angular-elements/assets/', 'dist/assets/');

    await createFile(`${outputDir}/elements/index.html`, indexFile, function(err) {
        // file either already exists or is now created (including non existing directories)
    });
})();
