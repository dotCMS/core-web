(window.webpackJsonp=window.webpackJsonp||[]).push([[430],{1663:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatRelative(token,date,_baseDate,_options){var format=formatRelativeLocale[token];if("function"==typeof format)return format(date);return format};var formatRelativeLocale={lastWeek:function(date){var day=date.getUTCDay(),result="'läschte";return 2!==day&&4!==day||(result+="n"),result+="' eeee 'um' p"},yesterday:"'gëschter um' p",today:"'haut um' p",tomorrow:"'moien um' p",nextWeek:"eeee 'um' p",other:"P"};module.exports=exports.default}}]);
//# sourceMappingURL=430.f3b20e2cfacb8a23f0cb.bundle.js.map