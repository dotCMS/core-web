(window.webpackJsonp=window.webpackJsonp||[]).push([[411],{1611:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatDistance(token,count,options){options=options||{};var result,adverb=token.match(/about|over|almost|lessthan/i),unit=token.replace(adverb,"");result=function translate(number,addSuffix,key,comparison){var translated=addSuffix?withSuffixes[key][comparison]:withoutSuffixes[key];if("halfaminute"===key)return translated;return number+translated}(count,options.addSuffix,unit.toLowerCase(),options.comparison),adverb&&(result=translations[adverb[0].toLowerCase()]+" "+result);return result};var translations={about:"körülbelül",over:"több mint",almost:"majdnem",lessthan:"kevesebb mint"},withoutSuffixes={xseconds:" másodperc",halfaminute:"fél perc",xminutes:" perc",xhours:" óra",xdays:" nap",xweeks:" hét",xmonths:" hónap",xyears:" év"},withSuffixes={xseconds:{"-1":" másodperccel ezelőtt",1:" másodperc múlva",0:" másodperce"},halfaminute:{"-1":"fél perccel ezelőtt",1:"fél perc múlva",0:"fél perce"},xminutes:{"-1":" perccel ezelőtt",1:" perc múlva",0:" perce"},xhours:{"-1":" órával ezelőtt",1:" óra múlva",0:" órája"},xdays:{"-1":" nappal ezelőtt",1:" nap múlva",0:" napja"},xweeks:{"-1":" héttel ezelőtt",1:" hét múlva",0:" hete"},xmonths:{"-1":" hónappal ezelőtt",1:" hónap múlva",0:" hónapja"},xyears:{"-1":" évvel ezelőtt",1:" év múlva",0:" éve"}};module.exports=exports.default}}]);
//# sourceMappingURL=411.f3b20e2cfacb8a23f0cb.bundle.js.map