(window.webpackJsonp=window.webpackJsonp||[]).push([[403],{1592:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){if(options=options||{},"xDays"===token&&options.addSuffix&&count<=2){return options.comparison>0?{1:"מחר",2:"מחרתיים"}[count]:{1:"אתמול",2:"שלשום"}[count]}var result;result="string"==typeof formatDistanceLocale[token]?formatDistanceLocale[token]:1===count?formatDistanceLocale[token].one:2===count?formatDistanceLocale[token].two:formatDistanceLocale[token].other.replace("{{count}}",count);if(options.addSuffix)return options.comparison>0?"בעוד "+result:"לפני "+result;return result};var formatDistanceLocale={lessThanXSeconds:{one:"פחות משנייה",two:"פחות משתי שניות",other:"פחות מ־{{count}} שניות"},xSeconds:{one:"שנייה",two:"שתי שניות",other:"{{count}} שניות"},halfAMinute:"חצי דקה",lessThanXMinutes:{one:"פחות מדקה",two:"פחות משתי דקות",other:"פחות מ־{{count}} דקות"},xMinutes:{one:"דקה",two:"שתי דקות",other:"{{count}} דקות"},aboutXHours:{one:"כשעה",two:"כשעתיים",other:"כ־{{count}} שעות"},xHours:{one:"שעה",two:"שעתיים",other:"{{count}} שעות"},xDays:{one:"יום",two:"יומיים",other:"{{count}} ימים"},aboutXWeeks:{one:"כשבוע",two:"כשבועיים",other:"כ־{{count}} שבועות"},xWeeks:{one:"שבוע",two:"שבועיים",other:"{{count}} שבועות"},aboutXMonths:{one:"כחודש",two:"כחודשיים",other:"כ־{{count}} חודשים"},xMonths:{one:"חודש",two:"חודשיים",other:"{{count}} חודשים"},aboutXYears:{one:"כשנה",two:"כשנתיים",other:"כ־{{count}} שנים"},xYears:{one:"שנה",two:"שנתיים",other:"{{count}} שנים"},overXYears:{one:"יותר משנה",two:"יותר משנתיים",other:"יותר מ־{{count}} שנים"},almostXYears:{one:"כמעט שנה",two:"כמעט שנתיים",other:"כמעט {{count}} שנים"}};module.exports=exports.default}}]);
//# sourceMappingURL=403.f3b20e2cfacb8a23f0cb.bundle.js.map