(window.webpackJsonp=window.webpackJsonp||[]).push([[167],{1713:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatRelative(token,date,baseDate,options){var format=formatRelativeLocale[token];if("function"==typeof format)return format(token,date,baseDate,options);return format};var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__(1867));var adjectivesLastWeek={masculine:"ostatni",feminine:"ostatnia"},adjectivesThisWeek={masculine:"ten",feminine:"ta"},adjectivesNextWeek={masculine:"następny",feminine:"następna"},dayGrammaticalGender={0:"feminine",1:"masculine",2:"masculine",3:"feminine",4:"masculine",5:"masculine",6:"feminine"};function getAdjective(token,date,baseDate,options){var day=date.getUTCDay();return function getAdjectives(token,date,baseDate,options){if((0,_index.default)(date,baseDate,options))return adjectivesThisWeek;if("lastWeek"===token)return adjectivesLastWeek;if("nextWeek"===token)return adjectivesNextWeek;throw new Error("Cannot determine adjectives for token ".concat(token))}(token,date,baseDate,options)[dayGrammaticalGender[day]]}function dayAndTimeWithAdjective(token,date,baseDate,options){var adjective=getAdjective(token,date,baseDate,options);return"'".concat(adjective,"' eeee 'o' p")}var formatRelativeLocale={lastWeek:dayAndTimeWithAdjective,yesterday:"'wczoraj o' p",today:"'dzisiaj o' p",tomorrow:"'jutro o' p",nextWeek:dayAndTimeWithAdjective,other:"P"};module.exports=exports.default},1866:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function requiredArgs(required,args){if(args.length<required)throw new TypeError(required+" argument"+(required>1?"s":"")+" required, but only "+args.length+" present")},module.exports=exports.default},1867:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function isSameUTCWeek(dirtyDateLeft,dirtyDateRight,options){(0,_index2.default)(2,arguments);var dateLeftStartOfWeek=(0,_index.default)(dirtyDateLeft,options),dateRightStartOfWeek=(0,_index.default)(dirtyDateRight,options);return dateLeftStartOfWeek.getTime()===dateRightStartOfWeek.getTime()};var _index=_interopRequireDefault(__webpack_require__(1868)),_index2=_interopRequireDefault(__webpack_require__(1866));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}module.exports=exports.default},1868:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function startOfUTCWeek(dirtyDate,dirtyOptions){(0,_index3.default)(1,arguments);var options=dirtyOptions||{},locale=options.locale,localeWeekStartsOn=locale&&locale.options&&locale.options.weekStartsOn,defaultWeekStartsOn=null==localeWeekStartsOn?0:(0,_index.default)(localeWeekStartsOn),weekStartsOn=null==options.weekStartsOn?defaultWeekStartsOn:(0,_index.default)(options.weekStartsOn);if(!(weekStartsOn>=0&&weekStartsOn<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var date=(0,_index2.default)(dirtyDate),day=date.getUTCDay(),diff=(day<weekStartsOn?7:0)+day-weekStartsOn;return date.setUTCDate(date.getUTCDate()-diff),date.setUTCHours(0,0,0,0),date};var _index=_interopRequireDefault(__webpack_require__(1869)),_index2=_interopRequireDefault(__webpack_require__(1870)),_index3=_interopRequireDefault(__webpack_require__(1866));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}module.exports=exports.default},1869:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function toInteger(dirtyNumber){if(null===dirtyNumber||!0===dirtyNumber||!1===dirtyNumber)return NaN;var number=Number(dirtyNumber);if(isNaN(number))return number;return number<0?Math.ceil(number):Math.floor(number)},module.exports=exports.default},1870:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function toDate(argument){(0,_index.default)(1,arguments);var argStr=Object.prototype.toString.call(argument);return argument instanceof Date||"object"==typeof argument&&"[object Date]"===argStr?new Date(argument.getTime()):"number"==typeof argument||"[object Number]"===argStr?new Date(argument):("string"!=typeof argument&&"[object String]"!==argStr||"undefined"==typeof console||(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"),console.warn((new Error).stack)),new Date(NaN))};var _index=function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}(__webpack_require__(1866));module.exports=exports.default}}]);
//# sourceMappingURL=167.f3b20e2cfacb8a23f0cb.bundle.js.map