(window.webpackJsonp=window.webpackJsonp||[]).push([[420],{1636:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){var result;options=options||{},result="string"==typeof formatDistanceLocale[token]?formatDistanceLocale[token]:1===count?options.addSuffix&&formatDistanceLocale[token].oneWithSuffix?formatDistanceLocale[token].oneWithSuffix:formatDistanceLocale[token].one:options.addSuffix&&formatDistanceLocale[token].otherWithSuffix?formatDistanceLocale[token].otherWithSuffix.replace("{{count}}",count):formatDistanceLocale[token].other.replace("{{count}}",count);if(options.addSuffix)return options.comparison>0?result+"後":result+"前";return result};var formatDistanceLocale={lessThanXSeconds:{one:"1秒未満",other:"{{count}}秒未満",oneWithSuffix:"約1秒",otherWithSuffix:"約{{count}}秒"},xSeconds:{one:"1秒",other:"{{count}}秒"},halfAMinute:"30秒",lessThanXMinutes:{one:"1分未満",other:"{{count}}分未満",oneWithSuffix:"約1分",otherWithSuffix:"約{{count}}分"},xMinutes:{one:"1分",other:"{{count}}分"},aboutXHours:{one:"約1時間",other:"約{{count}}時間"},xHours:{one:"1時間",other:"{{count}}時間"},xDays:{one:"1日",other:"{{count}}日"},aboutXWeeks:{one:"約1週間",other:"約{{count}}週間"},xWeeks:{one:"1週間",other:"{{count}}週間"},aboutXMonths:{one:"約1か月",other:"約{{count}}か月"},xMonths:{one:"1か月",other:"{{count}}か月"},aboutXYears:{one:"約1年",other:"約{{count}}年"},xYears:{one:"1年",other:"{{count}}年"},overXYears:{one:"1年以上",other:"{{count}}年以上"},almostXYears:{one:"1年近く",other:"{{count}}年近く"}};module.exports=exports.default}}]);
//# sourceMappingURL=420.f3b20e2cfacb8a23f0cb.bundle.js.map