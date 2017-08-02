export default {
    entry: 'build-dotcms-js/dotcms-js.js',
    dest: 'build-dotcms-js/bundles/amazing.umd.js',
    sourceMap: true,
    format: 'umd',
    moduleName: 'ng.amazing',
    globals: {
        '@angular/core': 'ng.core',
        'rxjs/Observable': 'Rx',
        'rxjs/ReplaySubject': 'Rx',
        'rxjs/add/operator/map': 'Rx.Observable.prototype',
        'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
        'rxjs/add/observable/fromEvent': 'Rx.Observable',
        'rxjs/add/observable/of': 'Rx.Observable'
    }
}
