(window.webpackJsonp=window.webpackJsonp||[]).push([[361],{1487:function(module,exports,__webpack_require__){"use strict";function findKey(object,predicate){for(var key in object)if(object.hasOwnProperty(key)&&predicate(object[key]))return key}function findIndex(array,predicate){for(var key=0;key<array.length;key++)if(predicate(array[key]))return key}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function buildMatchFn(args){return function(string){var options=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},width=options.width,matchPattern=width&&args.matchPatterns[width]||args.matchPatterns[args.defaultMatchWidth],matchResult=string.match(matchPattern);if(!matchResult)return null;var value,matchedString=matchResult[0],parsePatterns=width&&args.parsePatterns[width]||args.parsePatterns[args.defaultParseWidth],key=Array.isArray(parsePatterns)?findIndex(parsePatterns,(function(pattern){return pattern.test(matchedString)})):findKey(parsePatterns,(function(pattern){return pattern.test(matchedString)}));value=args.valueCallback?args.valueCallback(key):key,value=options.valueCallback?options.valueCallback(value):value;var rest=string.slice(matchedString.length);return{value:value,rest:rest}}},module.exports=exports.default}}]);
//# sourceMappingURL=361.f91b1e541f96d34101c5.bundle.js.map