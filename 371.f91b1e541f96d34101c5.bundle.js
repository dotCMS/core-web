(window.webpackJsonp=window.webpackJsonp||[]).push([[371],{1524:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatRelative(token,date,_baseDate,_options){var format=formatRelativeLocale[token];if("function"==typeof format)return format(date);return format};var formatRelativeLocale={lastWeek:function(date){switch(date.getUTCDay()){case 0:return"'prošle nedjelje u' p";case 3:return"'prošle srijede u' p";case 6:return"'prošle subote u' p";default:return"'prošli' EEEE 'u' p"}},yesterday:"'juče u' p",today:"'danas u' p",tomorrow:"'sutra u' p",nextWeek:function(date){switch(date.getUTCDay()){case 0:return"'sljedeće nedjelje u' p";case 3:return"'sljedeću srijedu u' p";case 6:return"'sljedeću subotu u' p";default:return"'sljedeći' EEEE 'u' p"}},other:"P"};module.exports=exports.default}}]);
//# sourceMappingURL=371.f91b1e541f96d34101c5.bundle.js.map