(window.webpackJsonp=window.webpackJsonp||[]).push([[401],{1589:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){var result;options=options||{},result="string"==typeof formatDistanceLocale[token]?formatDistanceLocale[token]:1===count?formatDistanceLocale[token].one:formatDistanceLocale[token].other.replace("{{count}}",count);if(options.addSuffix)return options.comparison>0?result+"માં":result+" પહેલાં";return result};var formatDistanceLocale={lessThanXSeconds:{one:"હમણાં",other:"​આશરે {{count}} સેકંડ"},xSeconds:{one:"1 સેકંડ",other:"{{count}} સેકંડ"},halfAMinute:"અડધી મિનિટ",lessThanXMinutes:{one:"આ મિનિટ",other:"​આશરે {{count}} મિનિટ"},xMinutes:{one:"1 મિનિટ",other:"{{count}} મિનિટ"},aboutXHours:{one:"​આશરે 1 કલાક",other:"​આશરે {{count}} કલાક"},xHours:{one:"1 કલાક",other:"{{count}} કલાક"},xDays:{one:"1 દિવસ",other:"{{count}} દિવસ"},aboutXWeeks:{one:"આશરે 1 અઠવાડિયું",other:"આશરે {{count}} અઠવાડિયા"},xWeeks:{one:"1 અઠવાડિયું",other:"{{count}} અઠવાડિયા"},aboutXMonths:{one:"આશરે 1 મહિનો",other:"આશરે {{count}} મહિના"},xMonths:{one:"1 મહિનો",other:"{{count}} મહિના"},aboutXYears:{one:"આશરે 1 વર્ષ",other:"આશરે {{count}} વર્ષ"},xYears:{one:"1 વર્ષ",other:"{{count}} વર્ષ"},overXYears:{one:"1 વર્ષથી વધુ",other:"{{count}} વર્ષથી વધુ"},almostXYears:{one:"લગભગ 1 વર્ષ",other:"લગભગ {{count}} વર્ષ"}};module.exports=exports.default}}]);
//# sourceMappingURL=401.f91b1e541f96d34101c5.bundle.js.map