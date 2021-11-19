(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{746:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"dot_form_column",(function(){return DotFormColumnComponent}));__webpack_require__(53),__webpack_require__(47);var _index_dc31274d_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(154),_index_0293c689_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(767);__webpack_require__(763);function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}var DotFormColumnComponent=function(){function DotFormColumnComponent(hostRef){!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,DotFormColumnComponent),Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_2__.g)(this,hostRef)}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Constructor}(DotFormColumnComponent,[{key:"render",value:function render(){var _this=this;return this.column.fields.map((function(field){return _this.getField(field)}))}},{key:"getField",value:function getField(field){return Object(_index_0293c689_js__WEBPACK_IMPORTED_MODULE_3__.d)(field,this.fieldsToShow)?this.getFieldTag(field):null}},{key:"getFieldTag",value:function getFieldTag(field){return _index_0293c689_js__WEBPACK_IMPORTED_MODULE_3__.e[field.fieldType]?_index_0293c689_js__WEBPACK_IMPORTED_MODULE_3__.e[field.fieldType](field):""}}]),DotFormColumnComponent}();DotFormColumnComponent.style="dot-form-column{flex:1;margin:1rem}dot-form-column:first-child{margin-left:0}dot-form-column:last-child{margin-right:0}"},763:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return getTagHint})),__webpack_require__.d(__webpack_exports__,"b",(function(){return getHintId})),__webpack_require__.d(__webpack_exports__,"c",(function(){return getTagError})),__webpack_require__.d(__webpack_exports__,"d",(function(){return getStringFromDotKeyArray})),__webpack_require__.d(__webpack_exports__,"e",(function(){return getOriginalStatus})),__webpack_require__.d(__webpack_exports__,"f",(function(){return getDotOptionsFromFieldValue})),__webpack_require__.d(__webpack_exports__,"g",(function(){return getClassNames})),__webpack_require__.d(__webpack_exports__,"h",(function(){return getErrorClass})),__webpack_require__.d(__webpack_exports__,"i",(function(){return isStringType})),__webpack_require__.d(__webpack_exports__,"j",(function(){return getId})),__webpack_require__.d(__webpack_exports__,"k",(function(){return isFileAllowed})),__webpack_require__.d(__webpack_exports__,"l",(function(){return isValidURL})),__webpack_require__.d(__webpack_exports__,"m",(function(){return getLabelId})),__webpack_require__.d(__webpack_exports__,"n",(function(){return nextTick})),__webpack_require__.d(__webpack_exports__,"o",(function(){return updateStatus}));__webpack_require__(42),__webpack_require__(156),__webpack_require__(53),__webpack_require__(76),__webpack_require__(155),__webpack_require__(228),__webpack_require__(28),__webpack_require__(23),__webpack_require__(26),__webpack_require__(17),__webpack_require__(25),__webpack_require__(31),__webpack_require__(158),__webpack_require__(159),__webpack_require__(121),__webpack_require__(64),__webpack_require__(98),__webpack_require__(29),__webpack_require__(39),__webpack_require__(27),__webpack_require__(22),__webpack_require__(32),__webpack_require__(36),__webpack_require__(24),__webpack_require__(5),__webpack_require__(41);var _index_dc31274d_js__WEBPACK_IMPORTED_MODULE_26__=__webpack_require__(154);function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function nextTick(fn){var id=window.requestAnimationFrame((function(){fn&&fn(),window.cancelAnimationFrame(id)}))}function getClassNames(status,isValid,required){return{"dot-valid":isValid,"dot-invalid":!isValid,"dot-pristine":status.dotPristine,"dot-dirty":!status.dotPristine,"dot-touched":status.dotTouched,"dot-untouched":!status.dotTouched,"dot-required":required}}function isStringType(val){return"string"==typeof val&&!!val}function getDotOptionsFromFieldValue(rawString){return isStringType(rawString)&&function isKeyPipeValueFormatValid(rawString){for(var regex=/([^|,]*)\|([^|,]*)/,items=rawString.split(","),valid=!0,i=0,total=items.length;i<total;i++)if(!regex.test(items[i])){valid=!1;break}return valid}(rawString=rawString.replace(/(?:\\[rn]|[\r\n]+)+/g,","))?rawString.split(",").filter((function(item){return!!item.length})).map((function(item){var _item$split2=_slicedToArray(item.split("|"),2);return{label:_item$split2[0],value:_item$split2[1]}})):[]}function getErrorClass(valid){return valid?void 0:"dot-field__error"}function getHintId(name){var value=slugify(name);return value?"hint-".concat(value):void 0}function getId(name){var value=slugify(name);return name?"dot-".concat(slugify(value)):void 0}function getLabelId(name){var value=slugify(name);return value?"label-".concat(value):void 0}function getOriginalStatus(isValid){return{dotValid:void 0===isValid||isValid,dotTouched:!1,dotPristine:!0}}function getStringFromDotKeyArray(values){return values.map((function(item){return"".concat(item.key,"|").concat(item.value)})).join(",")}function updateStatus(state,change){return Object.assign(Object.assign({},state),change)}function getTagError(show,message){return show&&isStringType(message)?Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_26__.e)("span",{class:"dot-field__error-message"},message):null}function getTagHint(hint){return isStringType(hint)?Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_26__.e)("span",{class:"dot-field__hint",id:getHintId(hint)},hint):null}function isValidURL(url){try{return!!new URL(url)}catch(e){return!1}}function isFileAllowed(name,type,allowedExtensions){if(""===allowedExtensions)return!0;var fileExt=function getFileExtension(filename){return/(?:\.([^.]+))?$/.exec(filename)[1]}(name);return!!allowedExtensions.split(",").find((function(allowedExt){if("*"===allowedExt)return!0;if(allowedExt.includes("/*")){var extType=allowedExt.split("/*").filter(Boolean).join("");return type.includes(extType)}return allowedExt.includes(fileExt)}))}function slugify(text){return text?text.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,""):null}},767:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return DOT_ATTR_PREFIX})),__webpack_require__.d(__webpack_exports__,"b",(function(){return getErrorMessage})),__webpack_require__.d(__webpack_exports__,"c",(function(){return getFieldsFromLayout})),__webpack_require__.d(__webpack_exports__,"d",(function(){return shouldShowField})),__webpack_require__.d(__webpack_exports__,"e",(function(){return fieldMap})),__webpack_require__.d(__webpack_exports__,"f",(function(){return fieldCustomProcess})),__webpack_require__.d(__webpack_exports__,"g",(function(){return getDotAttributesFromElement})),__webpack_require__.d(__webpack_exports__,"h",(function(){return setDotAttributesToElement}));__webpack_require__(5),__webpack_require__(26),__webpack_require__(17),__webpack_require__(31),__webpack_require__(77),__webpack_require__(34),__webpack_require__(6),__webpack_require__(7),__webpack_require__(123),__webpack_require__(42),__webpack_require__(155),__webpack_require__(23),__webpack_require__(238),__webpack_require__(156),__webpack_require__(53),__webpack_require__(76),__webpack_require__(64),__webpack_require__(98),__webpack_require__(28),__webpack_require__(27),__webpack_require__(22),__webpack_require__(32),__webpack_require__(36),__webpack_require__(25),__webpack_require__(24),__webpack_require__(41),__webpack_require__(47);var _index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__=__webpack_require__(154),_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_28__=__webpack_require__(763);function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||_unsupportedIterableToArray(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||_unsupportedIterableToArray(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,minLen):void 0}}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var DotFormFields={Text:function Text(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-textfield",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},"regex-check":field.regexCheck,required:field.required,value:field.defaultValue})},Textarea:function Textarea(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-textarea",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},"regex-check":field.regexCheck,required:field.required,value:field.defaultValue})},Checkbox:function Checkbox(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-checkbox",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Multi-Select":function MultiSelect(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-multi-select",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Key-Value":function KeyValue(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-key-value",{"field-type":field.fieldType,hint:field.hint,label:field.name,name:field.variable,required:field.required,value:field.defaultValue})},Select:function Select(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-select",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},Radio:function Radio(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-radio",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},Date:function Date(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-date",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},Time:function Time(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-time",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Date-and-Time":function DateAndTime(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-date-time",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Date-Range":function DateRange(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-date-range",{hint:field.hint,label:field.name,name:field.variable,required:field.required,value:field.defaultValue})},Tag:function Tag(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-tags",{data:function data(){return fetch("/api/v1/tags").then((function(data){return data.json()})).then((function(items){return Object.keys(items)})).catch((function(){return[]}))},hint:field.hint,label:field.name,name:field.variable,required:field.required,value:field.defaultValue})},Binary:function Binary(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-binary-file",{accept:getFieldVariableValue(field.fieldVariables,"accept"),"max-file-length":getFieldVariableValue(field.fieldVariables,"maxFileLength"),hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required})}},DOT_ATTR_PREFIX="dot";function setAttributesToTag(element,fieldVariables){fieldVariables.forEach((function(_ref){var key=_ref.key,value=_ref.value;element.setAttribute(key,value)}))}function setDotAttributesToElement(element,attributes){attributes.forEach((function(_ref2){var name=_ref2.name,value=_ref2.value;element.setAttribute(name.replace(DOT_ATTR_PREFIX,""),value)}))}function getDotAttributesFromElement(attributes,attrException){var exceptions=attrException.map((function(attr){return attr.toUpperCase()}));return attributes.filter((function(item){return!exceptions.includes(item.name.toUpperCase())&&function isDotAttribute(name){return name.startsWith(DOT_ATTR_PREFIX)}(item.name)}))}var shouldShowField=function shouldShowField(field,fieldsToShow){var fields2Show=fieldsToShow?fieldsToShow.split(","):[];return!fields2Show.length||fields2Show.includes(field.variable)},getFieldVariableValue=function getFieldVariableValue(fieldVariables,key){if(fieldVariables&&fieldVariables.length){var variable=_slicedToArray(fieldVariables.filter((function(item){return item.key.toUpperCase()===key.toUpperCase()})),1)[0];return variable&&variable.value}return null},getErrorMessage=function getErrorMessage(message){var messageObj;try{messageObj=JSON.parse(message)}catch(error){messageObj=message}return messageObj.errors&&messageObj.errors.length&&messageObj.errors[0].message?messageObj.errors[0].message:message},getFieldsFromLayout=function getFieldsFromLayout(layout){return layout.reduce((function(acc,_ref3){var columns=_ref3.columns;return acc.concat.apply(acc,_toConsumableArray(columns.map((function(col){return col.fields}))))}),[])},fieldParamsConversionFromBE={"Key-Value":function KeyValue(field){if(field.defaultValue&&"string"!=typeof field.defaultValue){var valuesArray=Object.keys(field.defaultValue).map((function(key){return{key:key,value:field.defaultValue[key]}}));field.defaultValue=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_28__.d)(valuesArray)}return DotFormFields["Key-Value"](field)}},fieldCustomProcess={"DOT-KEY-VALUE":function pipedValuesToObject(values){return Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_28__.i)(values)?values.split(",").reduce((function(acc,item){var _item$split2=_slicedToArray(item.split("|"),2),key=_item$split2[0],value=_item$split2[1];return Object.assign(Object.assign({},acc),function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}({},key,value))}),{}):null}},fieldMap={Time:DotFormFields.Time,Textarea:DotFormFields.Textarea,Text:DotFormFields.Text,Tag:DotFormFields.Tag,Select:DotFormFields.Select,Radio:DotFormFields.Radio,"Multi-Select":DotFormFields["Multi-Select"],"Key-Value":fieldParamsConversionFromBE["Key-Value"],"Date-and-Time":DotFormFields["Date-and-Time"],"Date-Range":DotFormFields["Date-Range"],Date:DotFormFields.Date,Checkbox:DotFormFields.Checkbox,Binary:DotFormFields.Binary}}}]);
//# sourceMappingURL=26.a80410dea3dbecb75762.bundle.js.map