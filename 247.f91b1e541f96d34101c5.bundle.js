(window.webpackJsonp=window.webpackJsonp||[]).push([[247,359],{1484:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function buildFormatLongFn(args){return function(){var options=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},width=options.width?String(options.width):args.defaultWidth,format=args.formats[width]||args.formats[args.defaultWidth];return format}},module.exports=exports.default},1554:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__(1484));var _default={date:(0,_index.default)({formats:{full:"EEEE, do 'de' MMMM y",long:"y-MMMM-dd",medium:"y-MMM-dd",short:"yyyy-MM-dd"},defaultWidth:"full"}),time:(0,_index.default)({formats:{full:"Ho 'horo kaj' m:ss zzzz",long:"HH:mm:ss z",medium:"HH:mm:ss",short:"HH:mm"},defaultWidth:"full"}),dateTime:(0,_index.default)({formats:{any:"{{date}} {{time}}"},defaultWidth:"any"})};exports.default=_default,module.exports=exports.default}}]);
//# sourceMappingURL=247.f91b1e541f96d34101c5.bundle.js.map