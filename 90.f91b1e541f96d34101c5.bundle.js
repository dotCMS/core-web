(window.webpackJsonp=window.webpackJsonp||[]).push([[90],{769:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatRelative(token,date,baseDate,options){var format=formatRelativeLocale[token];if("function"==typeof format)return format(date,baseDate,options);return format};var formatRelativeLocale={lastWeek:function(date,_baseDate,_options){var weekday=date.getUTCDay();return"'"+(0===weekday||6===weekday?"último":"última")+"' eeee 'às' p"},yesterday:"'ontem às' p",today:"'hoje às' p",tomorrow:"'amanhã às' p",nextWeek:"eeee 'às' p",other:"P"};module.exports=exports.default}}]);
//# sourceMappingURL=90.f91b1e541f96d34101c5.bundle.js.map