(window.webpackJsonp=window.webpackJsonp||[]).push([[433],{1673:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){options=options||{onlyNumeric:!1};var result,translation=formatDistanceLocale[token];result="string"==typeof translation?translation:0===count||count>1?options.onlyNumeric?translation.plural.replace("{{count}}",count):translation.plural.replace("{{count}}",count<13?wordMapping[count]:count):translation.singular;if(options.addSuffix)return options.comparison>0?"om "+result:result+" sidan";return result};var formatDistanceLocale={lessThanXSeconds:{singular:"mindre enn eitt sekund",plural:"mindre enn {{count}} sekund"},xSeconds:{singular:"eitt sekund",plural:"{{count}} sekund"},halfAMinute:"eit halvt minutt",lessThanXMinutes:{singular:"mindre enn eitt minutt",plural:"mindre enn {{count}} minutt"},xMinutes:{singular:"eitt minutt",plural:"{{count}} minutt"},aboutXHours:{singular:"omtrent ein time",plural:"omtrent {{count}} timar"},xHours:{singular:"ein time",plural:"{{count}} timar"},xDays:{singular:"ein dag",plural:"{{count}} dagar"},aboutXWeeks:{singular:"omtrent ei veke",plural:"omtrent {{count}} veker"},xWeeks:{singular:"ei veke",plural:"{{count}} veker"},aboutXMonths:{singular:"omtrent ein månad",plural:"omtrent {{count}} månader"},xMonths:{singular:"ein månad",plural:"{{count}} månader"},aboutXYears:{singular:"omtrent eitt år",plural:"omtrent {{count}} år"},xYears:{singular:"eitt år",plural:"{{count}} år"},overXYears:{singular:"over eitt år",plural:"over {{count}} år"},almostXYears:{singular:"nesten eitt år",plural:"nesten {{count}} år"}},wordMapping=["null","ein","to","tre","fire","fem","seks","sju","åtte","ni","ti","elleve","tolv"];module.exports=exports.default}}]);
//# sourceMappingURL=433.73550c60e13428026a5e.bundle.js.map