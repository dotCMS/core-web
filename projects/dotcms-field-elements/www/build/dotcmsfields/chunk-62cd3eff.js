const t=window.dotcmsFields.h;function e(t,e,n){return{"dot-valid":e,"dot-invalid":!e,"dot-pristine":t.dotPristine,"dot-dirty":!t.dotPristine,"dot-touched":t.dotTouched,"dot-untouched":!t.dotTouched,"dot-required":n}}function n(t){return"string"==typeof t&&!!t}function r(t){return n(t)&&function(t){const e=/([^|,]*)\|([^|,]*)/,n=t.split(",");let r=!0;for(let t=0,o=n.length;t<o;t++)if(!e.test(n[t])){r=!1;break}return r}(t=t.replace(/(?:\\[rn]|[\r\n]+)+/g,","))?t.split(",").filter(t=>!!t.length).map(t=>{const[e,n]=t.split("|");return{label:e,value:n}}):[]}function o(t){return t?void 0:"dot-field__error"}function i(t){const e=g(t);return e?`hint-${e}`:void 0}function a(t){const e=g(t);return t?`dot-${g(e)}`:void 0}function u(t){const e=g(t);return e?`label-${e}`:void 0}function s(t){return{dotValid:void 0===t||t,dotTouched:!1,dotPristine:!0}}function c(t){return t.map(t=>`${t.key}|${t.value}`).join(",")}function l(t,e){return Object.assign({},t,e)}function d(e,r){return e&&n(r)?t("span",{class:"dot-field__error-message"},r):null}function f(e){return n(e)?t("span",{class:"dot-field__hint",id:i(e)},e):null}function p(t){try{return!!new URL(t)}catch(t){return!1}}function m(t,e){let n=e.split(",");n=n.map(t=>t.trim());const r=t?t.substring(t.indexOf("."),t.length):"";return""===n[0]||n.includes("*")||n.includes(r)}function g(t){return t?t.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,""):null}const h=new RegExp("^\\d\\d\\d\\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])"),w=new RegExp("^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])$");function v(t){return h.test(t)?t:null}function y(t){return w.test(t)?t:null}function b(t){const[e,n]=t?t.split(" "):"";return{date:v(e),time:y(n)||y(e)}}class $ extends Error{constructor(t,e){super(`Warning: Invalid prop "${t.name}" of type "${typeof t.value}" supplied to "${t.field.type}" with the name "${t.field.name}", expected "${e}".\nDoc Reference: https://github.com/dotCMS/core-web/blob/master/projects/dotcms-field-elements/src/components/${t.field.type}/readme.md`),this.propInfo=t}getProps(){return Object.assign({},this.propInfo)}}function x(t){if("string"!=typeof t.value)throw new $(t,"string")}const D={date:function(t){if(!v(t.value.toString()))throw new $(t,"Date")},dateRange:function(t){const[e,n]=t.value.toString().split(",");if(!v(e)||!v(n))throw new $(t,"Date");((t,e,n)=>{if(t>e)throw new $(n,"Date")})(new Date(e),new Date(n),t)},dateTime:function(t){if("string"!=typeof t.value)throw new $(t,"Date/Time");if(e=b(t.value),!((n=t.value)&&(n.split(" ").length>1?function(t){return!!t.date&&!!t.time}(e):function(t){return!!t.date||!!t.time}(e))))throw new $(t,"Date/Time");var e,n},number:function(t){if(isNaN(Number(t.value)))throw new $(t,"Number")},options:x,regexCheck:function(t){try{RegExp(t.value.toString())}catch(e){throw new $(t,"valid regular expression")}},step:x,string:x,time:function(t){if(!y(t.value.toString()))throw new $(t,"Time")},type:x,accept:x},T={options:"",regexCheck:"",value:"",min:"",max:"",step:"",type:"text",accept:null};function R(t,e,n){const r=function(e,n){return{value:t[n],name:n,field:{name:t.name,type:t.el.tagName.toLocaleLowerCase()}}}(0,e);try{return function(t,e){r.value&&D[e||r.name](r)}(0,n),t[e]}catch(t){return console.warn(t.message),T[e]}}export{s as a,R as b,e as c,f as d,d as e,l as f,m as g,i as h,o as i,p as j,a as k,c as l,n as m,r as n,b as o,u as p};