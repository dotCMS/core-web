(window.webpackJsonp=window.webpackJsonp||[]).push([[288,359],{1482:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function buildFormatLongFn(args){return function(){var options=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},width=options.width?String(options.width):args.defaultWidth,format=args.formats[width]||args.formats[args.defaultWidth];return format}},module.exports=exports.default},1752:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__(1482));var _default={date:(0,_index.default)({formats:{full:"EEEE d MMMM y",long:"d MMMM y",medium:"d MMM y",short:"y-MM-dd"},defaultWidth:"full"}),time:(0,_index.default)({formats:{full:"'kl'. HH:mm:ss zzzz",long:"HH:mm:ss z",medium:"HH:mm:ss",short:"HH:mm"},defaultWidth:"full"}),dateTime:(0,_index.default)({formats:{full:"{{date}} 'kl.' {{time}}",long:"{{date}} 'kl.' {{time}}",medium:"{{date}} {{time}}",short:"{{date}} {{time}}"},defaultWidth:"full"})};exports.default=_default,module.exports=exports.default}}]);
//# sourceMappingURL=288.f3b20e2cfacb8a23f0cb.bundle.js.map