(window.webpackJsonp=window.webpackJsonp||[]).push([[242,324],{1364:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function buildFormatLongFn(args){return function(){var options=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},width=options.width?String(options.width):args.defaultWidth,format=args.formats[width]||args.formats[args.defaultWidth];return format}},module.exports=exports.default},1703:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__(1364));var _default={date:(0,_index.default)({formats:{full:"วันEEEEที่ do MMMM y",long:"do MMMM y",medium:"d MMM y",short:"dd/MM/yyyy"},defaultWidth:"full"}),time:(0,_index.default)({formats:{full:"H:mm:ss น. zzzz",long:"H:mm:ss น. z",medium:"H:mm:ss น.",short:"H:mm น."},defaultWidth:"medium"}),dateTime:(0,_index.default)({formats:{full:"{{date}} 'เวลา' {{time}}",long:"{{date}} 'เวลา' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},defaultWidth:"full"})};exports.default=_default,module.exports=exports.default}}]);
//# sourceMappingURL=242.4179525aeb5a6a6e2c75.bundle.js.map