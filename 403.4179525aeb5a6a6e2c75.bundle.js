(window.webpackJsonp=window.webpackJsonp||[]).push([[403],{1567:function(module,exports,__webpack_require__){"use strict";function declension(scheme,count){if(void 0!==scheme.one&&1===count)return scheme.one;var rem10=count%10,rem100=count%100;return 1===rem10&&11!==rem100?scheme.singularNominative.replace("{{count}}",count):rem10>=2&&rem10<=4&&(rem100<10||rem100>20)?scheme.singularGenitive.replace("{{count}}",count):scheme.pluralGenitive.replace("{{count}}",count)}function buildLocalizeTokenFn(scheme){return function(count,options){return options.addSuffix?options.comparison>0?scheme.future?declension(scheme.future,count):declension(scheme.regular,count)+" кейін":scheme.past?declension(scheme.past,count):declension(scheme.regular,count)+" бұрын":declension(scheme.regular,count)}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){return options=options||{},formatDistanceLocale[token](count,options)};var formatDistanceLocale={lessThanXSeconds:buildLocalizeTokenFn({regular:{one:"1 секундтан аз",singularNominative:"{{count}} секундтан аз",singularGenitive:"{{count}} секундтан аз",pluralGenitive:"{{count}} секундтан аз"},future:{one:"бір секундтан кейін",singularNominative:"{{count}} секундтан кейін",singularGenitive:"{{count}} секундтан кейін",pluralGenitive:"{{count}} секундтан кейін"}}),xSeconds:buildLocalizeTokenFn({regular:{singularNominative:"{{count}} секунд",singularGenitive:"{{count}} секунд",pluralGenitive:"{{count}} секунд"},past:{singularNominative:"{{count}} секунд бұрын",singularGenitive:"{{count}} секунд бұрын",pluralGenitive:"{{count}} секунд бұрын"},future:{singularNominative:"{{count}} секундтан кейін",singularGenitive:"{{count}} секундтан кейін",pluralGenitive:"{{count}} секундтан кейін"}}),halfAMinute:function(_,options){return options.addSuffix?options.comparison>0?"жарты минут ішінде":"жарты минут бұрын":"жарты минут"},lessThanXMinutes:buildLocalizeTokenFn({regular:{one:"1 минуттан аз",singularNominative:"{{count}} минуттан аз",singularGenitive:"{{count}} минуттан аз",pluralGenitive:"{{count}} минуттан аз"},future:{one:"минуттан кем ",singularNominative:"{{count}} минуттан кем",singularGenitive:"{{count}} минуттан кем",pluralGenitive:"{{count}} минуттан кем"}}),xMinutes:buildLocalizeTokenFn({regular:{singularNominative:"{{count}} минут",singularGenitive:"{{count}} минут",pluralGenitive:"{{count}} минут"},past:{singularNominative:"{{count}} минут бұрын",singularGenitive:"{{count}} минут бұрын",pluralGenitive:"{{count}} минут бұрын"},future:{singularNominative:"{{count}} минуттан кейін",singularGenitive:"{{count}} минуттан кейін",pluralGenitive:"{{count}} минуттан кейін"}}),aboutXHours:buildLocalizeTokenFn({regular:{singularNominative:"шамамен {{count}} сағат",singularGenitive:"шамамен {{count}} сағат",pluralGenitive:"шамамен {{count}} сағат"},future:{singularNominative:"шамамен {{count}} сағаттан кейін",singularGenitive:"шамамен {{count}} сағаттан кейін",pluralGenitive:"шамамен {{count}} сағаттан кейін"}}),xHours:buildLocalizeTokenFn({regular:{singularNominative:"{{count}} сағат",singularGenitive:"{{count}} сағат",pluralGenitive:"{{count}} сағат"}}),xDays:buildLocalizeTokenFn({regular:{singularNominative:"{{count}} күн",singularGenitive:"{{count}} күн",pluralGenitive:"{{count}} күн"},future:{singularNominative:"{{count}} күннен кейін",singularGenitive:"{{count}} күннен кейін",pluralGenitive:"{{count}} күннен кейін"}}),aboutXWeeks:{one:"шамамен 1 апта",other:"шамамен {{count}} апта"},xWeeks:{one:"1 апта",other:"{{count}} апта"},aboutXMonths:buildLocalizeTokenFn({regular:{singularNominative:"шамамен {{count}} ай",singularGenitive:"шамамен {{count}} ай",pluralGenitive:"шамамен {{count}} ай"},future:{singularNominative:"шамамен {{count}} айдан кейін",singularGenitive:"шамамен {{count}} айдан кейін",pluralGenitive:"шамамен {{count}} айдан кейін"}}),xMonths:buildLocalizeTokenFn({regular:{singularNominative:"{{count}} ай",singularGenitive:"{{count}} ай",pluralGenitive:"{{count}} ай"}}),aboutXYears:buildLocalizeTokenFn({regular:{singularNominative:"шамамен {{count}} жыл",singularGenitive:"шамамен {{count}} жыл",pluralGenitive:"шамамен {{count}} жыл"},future:{singularNominative:"шамамен {{count}} жылдан кейін",singularGenitive:"шамамен {{count}} жылдан кейін",pluralGenitive:"шамамен {{count}} жылдан кейін"}}),xYears:buildLocalizeTokenFn({regular:{singularNominative:"{{count}} жыл",singularGenitive:"{{count}} жыл",pluralGenitive:"{{count}} жыл"},future:{singularNominative:"{{count}} жылдан кейін",singularGenitive:"{{count}} жылдан кейін",pluralGenitive:"{{count}} жылдан кейін"}}),overXYears:buildLocalizeTokenFn({regular:{singularNominative:"{{count}} жылдан астам",singularGenitive:"{{count}} жылдан астам",pluralGenitive:"{{count}} жылдан астам"},future:{singularNominative:"{{count}} жылдан астам",singularGenitive:"{{count}} жылдан астам",pluralGenitive:"{{count}} жылдан астам"}}),almostXYears:buildLocalizeTokenFn({regular:{singularNominative:"{{count}} жылға жақын",singularGenitive:"{{count}} жылға жақын",pluralGenitive:"{{count}} жылға жақын"},future:{singularNominative:"{{count}} жылдан кейін",singularGenitive:"{{count}} жылдан кейін",pluralGenitive:"{{count}} жылдан кейін"}})};module.exports=exports.default}}]);
//# sourceMappingURL=403.4179525aeb5a6a6e2c75.bundle.js.map