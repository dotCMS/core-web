"use strict";(self.webpackChunkdotcms_ui=self.webpackChunkdotcms_ui||[]).push([[22439],{"./node_modules/date-fns/locale/hr/_lib/formatRelative/index.js":(module,exports)=>{Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function formatRelative(token,date,_baseDate,_options){var format=formatRelativeLocale[token];if("function"==typeof format)return format(date);return format};var formatRelativeLocale={lastWeek:function(date){switch(date.getUTCDay()){case 0:return"'prošlu nedjelju u' p";case 3:return"'prošlu srijedu u' p";case 6:return"'prošlu subotu u' p";default:return"'prošli' EEEE 'u' p"}},yesterday:"'jučer u' p",today:"'danas u' p",tomorrow:"'sutra u' p",nextWeek:function(date){switch(date.getUTCDay()){case 0:return"'iduću nedjelju u' p";case 3:return"'iduću srijedu u' p";case 6:return"'iduću subotu u' p";default:return"'prošli' EEEE 'u' p"}},other:"P"};module.exports=exports.default}}]);
//# sourceMappingURL=22439.f277d2a7.iframe.bundle.js.map