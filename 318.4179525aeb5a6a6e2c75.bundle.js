(window.webpackJsonp=window.webpackJsonp||[]).push([[318,325],{1365:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function buildLocalizeFn(args){return function(dirtyIndex,dirtyOptions){var valuesArray,options=dirtyOptions||{};if("formatting"===(options.context?String(options.context):"standalone")&&args.formattingValues){var defaultWidth=args.defaultFormattingWidth||args.defaultWidth,width=options.width?String(options.width):defaultWidth;valuesArray=args.formattingValues[width]||args.formattingValues[defaultWidth]}else{var _defaultWidth=args.defaultWidth,_width=options.width?String(options.width):args.defaultWidth;valuesArray=args.values[_width]||args.values[_defaultWidth]}return valuesArray[args.argumentCallback?args.argumentCallback(dirtyIndex):dirtyIndex]}},module.exports=exports.default},1715:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__(1365));var _default={ordinalNumber:function ordinalNumber(dirtyNumber,_dirtyOptions){return String(dirtyNumber)},era:(0,_index.default)({values:{narrow:["ب","ك"],abbreviated:["ب","ك"],wide:["مىيلادىدىن بۇرۇن","مىيلادىدىن كىيىن"]},defaultWidth:"wide"}),quarter:(0,_index.default)({values:{narrow:["1","2","3","4"],abbreviated:["1","2","3","4"],wide:["بىرىنجى چارەك","ئىككىنجى چارەك","ئۈچىنجى چارەك","تۆتىنجى چارەك"]},defaultWidth:"wide",argumentCallback:function(quarter){return Number(quarter)-1}}),month:(0,_index.default)({values:{narrow:["ي","ف","م","ا","م","ى","ى","ا","س","ۆ","ن","د"],abbreviated:["يانۋار","فېۋىرال","مارت","ئاپرىل","ماي","ئىيۇن","ئىيول","ئاۋغۇست","سىنتەبىر","ئۆكتەبىر","نويابىر","دىكابىر"],wide:["يانۋار","فېۋىرال","مارت","ئاپرىل","ماي","ئىيۇن","ئىيول","ئاۋغۇست","سىنتەبىر","ئۆكتەبىر","نويابىر","دىكابىر"]},defaultWidth:"wide"}),day:(0,_index.default)({values:{narrow:["ي","د","س","چ","پ","ج","ش"],short:["ي","د","س","چ","پ","ج","ش"],abbreviated:["يەكشەنبە","دۈشەنبە","سەيشەنبە","چارشەنبە","پەيشەنبە","جۈمە","شەنبە"],wide:["يەكشەنبە","دۈشەنبە","سەيشەنبە","چارشەنبە","پەيشەنبە","جۈمە","شەنبە"]},defaultWidth:"wide"}),dayPeriod:(0,_index.default)({values:{narrow:{am:"ئە",pm:"چ",midnight:"ك",noon:"چ",morning:"ئەتىگەن",afternoon:"چۈشتىن كىيىن",evening:"ئاخشىم",night:"كىچە"},abbreviated:{am:"ئە",pm:"چ",midnight:"ك",noon:"چ",morning:"ئەتىگەن",afternoon:"چۈشتىن كىيىن",evening:"ئاخشىم",night:"كىچە"},wide:{am:"ئە",pm:"چ",midnight:"ك",noon:"چ",morning:"ئەتىگەن",afternoon:"چۈشتىن كىيىن",evening:"ئاخشىم",night:"كىچە"}},defaultWidth:"wide",formattingValues:{narrow:{am:"ئە",pm:"چ",midnight:"ك",noon:"چ",morning:"ئەتىگەندە",afternoon:"چۈشتىن كىيىن",evening:"ئاخشامدا",night:"كىچىدە"},abbreviated:{am:"ئە",pm:"چ",midnight:"ك",noon:"چ",morning:"ئەتىگەندە",afternoon:"چۈشتىن كىيىن",evening:"ئاخشامدا",night:"كىچىدە"},wide:{am:"ئە",pm:"چ",midnight:"ك",noon:"چ",morning:"ئەتىگەندە",afternoon:"چۈشتىن كىيىن",evening:"ئاخشامدا",night:"كىچىدە"}},defaultFormattingWidth:"wide"})};exports.default=_default,module.exports=exports.default}}]);
//# sourceMappingURL=318.4179525aeb5a6a6e2c75.bundle.js.map