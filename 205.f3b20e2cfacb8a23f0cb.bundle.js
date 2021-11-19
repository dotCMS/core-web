(window.webpackJsonp=window.webpackJsonp||[]).push([[205,361,362],{1484:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function buildMatchPatternFn(args){return function(string){var options=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},matchResult=string.match(args.matchPattern);if(!matchResult)return null;var matchedString=matchResult[0],parseResult=string.match(args.parsePattern);if(!parseResult)return null;var value=args.valueCallback?args.valueCallback(parseResult[0]):parseResult[0];value=options.valueCallback?options.valueCallback(value):value;var rest=string.slice(matchedString.length);return{value:value,rest:rest}}},module.exports=exports.default},1485:function(module,exports,__webpack_require__){"use strict";function findKey(object,predicate){for(var key in object)if(object.hasOwnProperty(key)&&predicate(object[key]))return key}function findIndex(array,predicate){for(var key=0;key<array.length;key++)if(predicate(array[key]))return key}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function buildMatchFn(args){return function(string){var options=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},width=options.width,matchPattern=width&&args.matchPatterns[width]||args.matchPatterns[args.defaultMatchWidth],matchResult=string.match(matchPattern);if(!matchResult)return null;var value,matchedString=matchResult[0],parsePatterns=width&&args.parsePatterns[width]||args.parsePatterns[args.defaultParseWidth],key=Array.isArray(parsePatterns)?findIndex(parsePatterns,(function(pattern){return pattern.test(matchedString)})):findKey(parsePatterns,(function(pattern){return pattern.test(matchedString)}));value=args.valueCallback?args.valueCallback(key):key,value=options.valueCallback?options.valueCallback(value):value;var rest=string.slice(matchedString.length);return{value:value,rest:rest}}},module.exports=exports.default},1650:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _index=_interopRequireDefault(__webpack_require__(1484)),_index2=_interopRequireDefault(__webpack_require__(1485));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var _default={ordinalNumber:(0,_index.default)({matchPattern:/^(\d+)(-?(ші|шы))?/i,parsePattern:/\d+/i,valueCallback:function(value){return parseInt(value,10)}}),era:(0,_index2.default)({matchPatterns:{narrow:/^((б )?з\.?\s?д\.?)/i,abbreviated:/^((б )?з\.?\s?д\.?)/i,wide:/^(біздің заманымызға дейін|біздің заманымыз|біздің заманымыздан)/i},defaultMatchWidth:"wide",parsePatterns:{any:[/^б/i,/^з/i]},defaultParseWidth:"any"}),quarter:(0,_index2.default)({matchPatterns:{narrow:/^[1234]/i,abbreviated:/^[1234](-?ші)? тоқ.?/i,wide:/^[1234](-?ші)? тоқсан/i},defaultMatchWidth:"wide",parsePatterns:{any:[/1/i,/2/i,/3/i,/4/i]},defaultParseWidth:"any",valueCallback:function(index){return index+1}}),month:(0,_index2.default)({matchPatterns:{narrow:/^(қ|а|н|с|м|мау|ш|т|қыр|қаз|қар|ж)/i,abbreviated:/^(қаң|ақп|нау|сәу|мам|мау|шіл|там|қыр|қаз|қар|жел)/i,wide:/^(қаңтар|ақпан|наурыз|сәуір|мамыр|маусым|шілде|тамыз|қыркүйек|қазан|қараша|желтоқсан)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^қ/i,/^а/i,/^н/i,/^с/i,/^м/i,/^м/i,/^ш/i,/^т/i,/^қ/i,/^қ/i,/^қ/i,/^ж/i],abbreviated:[/^қаң/i,/^ақп/i,/^нау/i,/^сәу/i,/^мам/i,/^мау/i,/^шіл/i,/^там/i,/^қыр/i,/^қаз/i,/^қар/i,/^жел/i],any:[/^қ/i,/^а/i,/^н/i,/^с/i,/^м/i,/^м/i,/^ш/i,/^т/i,/^қ/i,/^қ/i,/^қ/i,/^ж/i]},defaultParseWidth:"any"}),day:(0,_index2.default)({matchPatterns:{narrow:/^(ж|д|с|с|б|ж|с)/i,short:/^(жс|дс|сс|ср|бс|жм|сб)/i,wide:/^(жексенбі|дүйсенбі|сейсенбі|сәрсенбі|бейсенбі|жұма|сенбі)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^ж/i,/^д/i,/^с/i,/^с/i,/^б/i,/^ж/i,/^с/i],short:[/^жс/i,/^дс/i,/^сс/i,/^ср/i,/^бс/i,/^жм/i,/^сб/i],any:[/^ж[ек]/i,/^д[үй]/i,/^сe[й]/i,/^сә[р]/i,/^б[ей]/i,/^ж[ұм]/i,/^се[н]/i]},defaultParseWidth:"any"}),dayPeriod:(0,_index2.default)({matchPatterns:{narrow:/^Т\.?\s?[ДК]\.?|түн ортасында|((түсте|таңертең|таңда|таңертең|таңмен|таң|күндіз|күн|кеште|кеш|түнде|түн)\.?)/i,wide:/^Т\.?\s?[ДК]\.?|түн ортасында|((түсте|таңертең|таңда|таңертең|таңмен|таң|күндіз|күн|кеште|кеш|түнде|түн)\.?)/i,any:/^Т\.?\s?[ДК]\.?|түн ортасында|((түсте|таңертең|таңда|таңертең|таңмен|таң|күндіз|күн|кеште|кеш|түнде|түн)\.?)/i},defaultMatchWidth:"wide",parsePatterns:{any:{am:/^ТД/i,pm:/^ТК/i,midnight:/^түн орта/i,noon:/^күндіз/i,morning:/таң/i,afternoon:/түс/i,evening:/кеш/i,night:/түн/i}},defaultParseWidth:"any"})};exports.default=_default,module.exports=exports.default}}]);
//# sourceMappingURL=205.f3b20e2cfacb8a23f0cb.bundle.js.map