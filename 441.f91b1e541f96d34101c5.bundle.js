(window.webpackJsonp=window.webpackJsonp||[]).push([[441],{1698:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){options=options||{};var result,translation=formatDistanceLocale[token];result="string"==typeof translation?translation:0===count||count>1?translation.plural.replace("{{count}}",count):translation.singular;if(options.addSuffix)return options.comparison>0?"om "+result:result+" siden";return result};var formatDistanceLocale={lessThanXSeconds:{singular:"mindre enn ett sekund",plural:"mindre enn {{count}} sekunder"},xSeconds:{singular:"ett sekund",plural:"{{count}} sekunder"},halfAMinute:"et halvt minutt",lessThanXMinutes:{singular:"mindre enn ett minutt",plural:"mindre enn {{count}} minutter"},xMinutes:{singular:"ett minutt",plural:"{{count}} minutter"},aboutXHours:{singular:"omtrent en time",plural:"omtrent {{count}} timer"},xHours:{singular:"en time",plural:"{{count}} timer"},xDays:{singular:"en dag",plural:"{{count}} dager"},aboutXWeeks:{singular:"omtrent en uke",plural:"omtrent {{count}} uker"},xWeeks:{singular:"en uke",plural:"{{count}} uker"},aboutXMonths:{singular:"omtrent en måned",plural:"omtrent {{count}} måneder"},xMonths:{singular:"en måned",plural:"{{count}} måneder"},aboutXYears:{singular:"omtrent ett år",plural:"omtrent {{count}} år"},xYears:{singular:"ett år",plural:"{{count}} år"},overXYears:{singular:"over ett år",plural:"over {{count}} år"},almostXYears:{singular:"nesten ett år",plural:"nesten {{count}} år"}};module.exports=exports.default}}]);
//# sourceMappingURL=441.f91b1e541f96d34101c5.bundle.js.map