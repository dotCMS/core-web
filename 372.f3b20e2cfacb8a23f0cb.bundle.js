(window.webpackJsonp=window.webpackJsonp||[]).push([[372],{1525:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){var result;options=options||{},result="string"==typeof formatDistanceLocale[token]?formatDistanceLocale[token]:1===count?formatDistanceLocale[token].one:11===count&&formatDistanceLocale[token].eleven?formatDistanceLocale[token].eleven:formatDistanceLocale[token].other.replace("{{count}}",count);if(options.addSuffix)return options.comparison>0?"en "+result:"fa "+result;return result};var formatDistanceLocale={lessThanXSeconds:{one:"menys d'un segon",eleven:"menys d'onze segons",other:"menys de {{count}} segons"},xSeconds:{one:"1 segon",other:"{{count}} segons"},halfAMinute:"mig minut",lessThanXMinutes:{one:"menys d'un minut",eleven:"menys d'onze minuts",other:"menys de {{count}} minuts"},xMinutes:{one:"1 minut",other:"{{count}} minuts"},aboutXHours:{one:"aproximadament una hora",other:"aproximadament {{count}} hores"},xHours:{one:"1 hora",other:"{{count}} hores"},xDays:{one:"1 dia",other:"{{count}} dies"},aboutXWeeks:{one:"aproximadament una setmana",other:"aproximadament {{count}} setmanes"},xWeeks:{one:"1 setmana",other:"{{count}} setmanes"},aboutXMonths:{one:"aproximadament un mes",other:"aproximadament {{count}} mesos"},xMonths:{one:"1 mes",other:"{{count}} mesos"},aboutXYears:{one:"aproximadament un any",other:"aproximadament {{count}} anys"},xYears:{one:"1 any",other:"{{count}} anys"},overXYears:{one:"més d'un any",eleven:"més d'onze anys",other:"més de {{count}} anys"},almostXYears:{one:"gairebé un any",other:"gairebé {{count}} anys"}};module.exports=exports.default}}]);
//# sourceMappingURL=372.f3b20e2cfacb8a23f0cb.bundle.js.map