(window.webpackJsonp=window.webpackJsonp||[]).push([[412],{1613:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatRelative(token,date,baseDate,options){var format=formatRelativeLocale[token];if("function"==typeof format)return format(date,baseDate,options);return format};var accusativeWeekdays=["vasárnap","hétfőn","kedden","szerdán","csütörtökön","pénteken","szombaton"];function week(isFuture){return function(date,_baseDate,_options){var day=date.getUTCDay();return(isFuture?"":"'múlt' ")+"'"+accusativeWeekdays[day]+"' p'-kor'"}}var formatRelativeLocale={lastWeek:week(!1),yesterday:"'tegnap' p'-kor'",today:"'ma' p'-kor'",tomorrow:"'holnap' p'-kor'",nextWeek:week(!0),other:"P"};module.exports=exports.default}}]);
//# sourceMappingURL=412.f3b20e2cfacb8a23f0cb.bundle.js.map