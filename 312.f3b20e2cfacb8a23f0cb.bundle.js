(window.webpackJsonp=window.webpackJsonp||[]).push([[312,360],{1483:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function buildLocalizeFn(args){return function(dirtyIndex,dirtyOptions){var valuesArray,options=dirtyOptions||{};if("formatting"===(options.context?String(options.context):"standalone")&&args.formattingValues){var defaultWidth=args.defaultFormattingWidth||args.defaultWidth,width=options.width?String(options.width):defaultWidth;valuesArray=args.formattingValues[width]||args.formattingValues[defaultWidth]}else{var _defaultWidth=args.defaultWidth,_width=options.width?String(options.width):args.defaultWidth;valuesArray=args.values[_width]||args.values[_defaultWidth]}return valuesArray[args.argumentCallback?args.argumentCallback(dirtyIndex):dirtyIndex]}},module.exports=exports.default},1569:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__(1483));var _default={ordinalNumber:function ordinalNumber(dirtyNumber){return Number(dirtyNumber)+"."},era:(0,_index.default)({values:{narrow:["k.a.","k.o."],abbreviated:["k.a.","k.o."],wide:["kristo aurretik","kristo ondoren"]},defaultWidth:"wide"}),quarter:(0,_index.default)({values:{narrow:["1","2","3","4"],abbreviated:["1H","2H","3H","4H"],wide:["1. hiruhilekoa","2. hiruhilekoa","3. hiruhilekoa","4. hiruhilekoa"]},defaultWidth:"wide",argumentCallback:function(quarter){return Number(quarter)-1}}),month:(0,_index.default)({values:{narrow:["u","o","m","a","m","e","u","a","i","u","a","a"],abbreviated:["urt","ots","mar","api","mai","eka","uzt","abu","ira","urr","aza","abe"],wide:["urtarrila","otsaila","martxoa","apirila","maiatza","ekaina","uztaila","abuztua","iraila","urria","azaroa","abendua"]},defaultWidth:"wide"}),day:(0,_index.default)({values:{narrow:["i","a","a","a","o","o","l"],short:["ig","al","as","az","og","or","lr"],abbreviated:["iga","ast","ast","ast","ost","ost","lar"],wide:["igandea","astelehena","asteartea","asteazkena","osteguna","ostirala","larunbata"]},defaultWidth:"wide"}),dayPeriod:(0,_index.default)({values:{narrow:{am:"a",pm:"p",midnight:"ge",noon:"eg",morning:"goiza",afternoon:"arratsaldea",evening:"arratsaldea",night:"gaua"},abbreviated:{am:"AM",pm:"PM",midnight:"gauerdia",noon:"eguerdia",morning:"goiza",afternoon:"arratsaldea",evening:"arratsaldea",night:"gaua"},wide:{am:"a.m.",pm:"p.m.",midnight:"gauerdia",noon:"eguerdia",morning:"goiza",afternoon:"arratsaldea",evening:"arratsaldea",night:"gaua"}},defaultWidth:"wide",formattingValues:{narrow:{am:"a",pm:"p",midnight:"ge",noon:"eg",morning:"goizean",afternoon:"arratsaldean",evening:"arratsaldean",night:"gauean"},abbreviated:{am:"AM",pm:"PM",midnight:"gauerdia",noon:"eguerdia",morning:"goizean",afternoon:"arratsaldean",evening:"arratsaldean",night:"gauean"},wide:{am:"a.m.",pm:"p.m.",midnight:"gauerdia",noon:"eguerdia",morning:"goizean",afternoon:"arratsaldean",evening:"arratsaldean",night:"gauean"}},defaultFormattingWidth:"wide"})};exports.default=_default,module.exports=exports.default}}]);
//# sourceMappingURL=312.f3b20e2cfacb8a23f0cb.bundle.js.map