(window.webpackJsonp=window.webpackJsonp||[]).push([[355],{1454:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){var result;options=options||{},result="string"==typeof formatDistanceLocale[token]?formatDistanceLocale[token]:1===count?formatDistanceLocale[token].one:formatDistanceLocale[token].other.replace("{{count}}",count);if(options.addSuffix)return options.comparison>0?"in "+result:result+" ago";return result};var formatDistanceLocale={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"a second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"a minute",other:"{{count}} minutes"},aboutXHours:{one:"about an hour",other:"about {{count}} hours"},xHours:{one:"an hour",other:"{{count}} hours"},xDays:{one:"a day",other:"{{count}} days"},aboutXWeeks:{one:"about a week",other:"about {{count}} weeks"},xWeeks:{one:"a week",other:"{{count}} weeks"},aboutXMonths:{one:"about a month",other:"about {{count}} months"},xMonths:{one:"a month",other:"{{count}} months"},aboutXYears:{one:"about a year",other:"about {{count}} years"},xYears:{one:"a year",other:"{{count}} years"},overXYears:{one:"over a year",other:"over {{count}} years"},almostXYears:{one:"almost a year",other:"almost {{count}} years"}};module.exports=exports.default}}]);
//# sourceMappingURL=355.4179525aeb5a6a6e2c75.bundle.js.map