(window.webpackJsonp=window.webpackJsonp||[]).push([[436],{1662:function(module,exports,__webpack_require__){"use strict";function declension(scheme,count,time){var group=function declensionGroup(scheme,count){return 1===count?scheme.one:count>=2&&count<=4?scheme.twoFour:scheme.other}(scheme,count);return(group[time]||group).replace("{{count}}",count)}function prefixPreposition(preposition){var translation="";return"almost"===preposition&&(translation="takmer"),"about"===preposition&&(translation="približne"),translation.length>0?translation+" ":""}function suffixPreposition(preposition){var translation="";return"lessThan"===preposition&&(translation="menej než"),"over"===preposition&&(translation="viac než"),translation.length>0?translation+" ":""}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){options=options||{};var preposition=function extractPreposition(token){return["lessThan","about","over","almost"].filter((function(preposition){return!!token.match(new RegExp("^"+preposition))}))[0]}(token)||"",key=function lowercaseFirstLetter(string){return string.charAt(0).toLowerCase()+string.slice(1)}(token.substring(preposition.length)),scheme=formatDistanceLocale[key];if(!options.addSuffix)return prefixPreposition(preposition)+suffixPreposition(preposition)+declension(scheme,count,"regular");return options.comparison>0?prefixPreposition(preposition)+"o "+suffixPreposition(preposition)+declension(scheme,count,"future"):prefixPreposition(preposition)+"pred "+suffixPreposition(preposition)+declension(scheme,count,"past")};var formatDistanceLocale={xSeconds:{one:{regular:"sekunda",past:"sekundou",future:"sekundu"},twoFour:{regular:"{{count}} sekundy",past:"{{count}} sekundami",future:"{{count}} sekundy"},other:{regular:"{{count}} sekúnd",past:"{{count}} sekundami",future:"{{count}} sekúnd"}},halfAMinute:{other:{regular:"pol minúty",past:"pol minútou",future:"pol minúty"}},xMinutes:{one:{regular:"minúta",past:"minútou",future:"minútu"},twoFour:{regular:"{{count}} minúty",past:"{{count}} minútami",future:"{{count}} minúty"},other:{regular:"{{count}} minút",past:"{{count}} minútami",future:"{{count}} minút"}},xHours:{one:{regular:"hodina",past:"hodinou",future:"hodinu"},twoFour:{regular:"{{count}} hodiny",past:"{{count}} hodinami",future:"{{count}} hodiny"},other:{regular:"{{count}} hodín",past:"{{count}} hodinami",future:"{{count}} hodín"}},xDays:{one:{regular:"deň",past:"dňom",future:"deň"},twoFour:{regular:"{{count}} dni",past:"{{count}} dňami",future:"{{count}} dni"},other:{regular:"{{count}} dní",past:"{{count}} dňami",future:"{{count}} dní"}},xWeeks:{one:{regular:"mesiac",past:"mesiacom",future:"mesiac"},twoFour:{regular:"{{count}} mesiace",past:"{{count}} mesiacmi",future:"{{count}} mesiace"},other:{regular:"{{count}} mesiacov",past:"{{count}} mesiacmi",future:"{{count}} mesiacov"}},xMonths:{one:{regular:"mesiac",past:"mesiacom",future:"mesiac"},twoFour:{regular:"{{count}} mesiace",past:"{{count}} mesiacmi",future:"{{count}} mesiace"},other:{regular:"{{count}} mesiacov",past:"{{count}} mesiacmi",future:"{{count}} mesiacov"}},xYears:{one:{regular:"rok",past:"rokom",future:"rok"},twoFour:{regular:"{{count}} roky",past:"{{count}} rokmi",future:"{{count}} roky"},other:{regular:"{{count}} rokov",past:"{{count}} rokmi",future:"{{count}} rokov"}}};module.exports=exports.default}}]);
//# sourceMappingURL=436.4179525aeb5a6a6e2c75.bundle.js.map