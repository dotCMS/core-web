(self.webpackChunkdotcms_ui=self.webpackChunkdotcms_ui||[]).push([[909],{"./dist/libs/dotcms-webcomponents/dist/esm/dot-checkbox.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{dot_checkbox:()=>DotCheckboxComponent});__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/web.timers.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.promise.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.object.assign.js"),__webpack_require__("./node_modules/core-js/modules/es.array.map.js"),__webpack_require__("./node_modules/core-js/modules/es.string.trim.js"),__webpack_require__("./node_modules/core-js/modules/es.array.index-of.js"),__webpack_require__("./node_modules/core-js/modules/es.string.split.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"),__webpack_require__("./node_modules/core-js/modules/es.set.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.join.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");var _index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-094afd6e.js"),_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/utils-61ba0d04.js"),_checkProp_286e406e_js__WEBPACK_IMPORTED_MODULE_21__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/checkProp-286e406e.js"),_index_889b3269_js__WEBPACK_IMPORTED_MODULE_22__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-889b3269.js");function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}var DotCheckboxComponent=function(){function DotCheckboxComponent(hostRef){!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,DotCheckboxComponent),(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.r)(this,hostRef),this.dotValueChange=(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.c)(this,"dotValueChange",7),this.dotStatusChange=(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.c)(this,"dotStatusChange",7),this.name="",this.label="",this.hint="",this.options="",this.required=!1,this.disabled=!1,this.requiredMessage="This field is required",this.value=""}var _reset;return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}(DotCheckboxComponent,[{key:"componentWillLoad",value:function componentWillLoad(){this.value=this.value||"",this.validateProps(),this.emitValueChange(),this.status=(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.g)(this.isValid()),this.emitStatusChange()}},{key:"componentDidLoad",value:function componentDidLoad(){var _this=this,attrException=["dottype"],htmlElements=this.el.querySelectorAll('input[type="checkbox"]');setTimeout((function(){var attrs=(0,_index_889b3269_js__WEBPACK_IMPORTED_MODULE_22__.g)(Array.from(_this.el.attributes),attrException);htmlElements.forEach((function(htmlElement){(0,_index_889b3269_js__WEBPACK_IMPORTED_MODULE_22__.s)(htmlElement,attrs)}))}),0)}},{key:"optionsWatch",value:function optionsWatch(){var validOptions=(0,_checkProp_286e406e_js__WEBPACK_IMPORTED_MODULE_21__.c)(this,"options");this._options=(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.f)(validOptions)}},{key:"valueWatch",value:function valueWatch(){this.value=this.value||""}},{key:"reset",value:(_reset=function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}(regeneratorRuntime.mark((function _callee(){return regeneratorRuntime.wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:this.value="",this.status=(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.g)(this.isValid()),this.emitValueChange(),this.emitStatusChange();case 4:case"end":return _context.stop()}}),_callee,this)}))),function reset(){return _reset.apply(this,arguments)})},{key:"render",value:function render(){var _this2=this,classes=(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.a)(this.status,this.isValid(),this.required);return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.h)(_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.H,{class:Object.assign({},classes)},(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.h)("dot-label",{label:this.label,required:this.required,name:this.name},(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.h)("div",{"aria-describedby":(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.h)(this.hint),tabIndex:this.hint?0:null,class:"dot-checkbox__items"},this._options.map((function(item){var trimmedValue=item.value.trim();return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.h)("label",null,(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.h)("input",{class:(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.j)(_this2.isValid()),name:(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.k)(_this2.name),type:"checkbox",disabled:_this2.disabled||null,checked:_this2.value.indexOf(trimmedValue)>=0||null,onInput:function onInput(event){return _this2.setValue(event)},value:trimmedValue}),item.label)})))),(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.c)(this.hint),(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.b)(!this.isValid(),this.requiredMessage))}},{key:"validateProps",value:function validateProps(){this.optionsWatch()}},{key:"setValue",value:function setValue(event){this.value=this.getValueFromCheckInputs(event.target.value.trim(),event.target.checked),this.status=(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_20__.u)(this.status,{dotTouched:!0,dotPristine:!1,dotValid:this.isValid()}),this.emitValueChange(),this.emitStatusChange()}},{key:"getValueFromCheckInputs",value:function getValueFromCheckInputs(value,checked){var valueArray=this.value.trim().length?this.value.split(","):[],valuesSet=new Set(valueArray);return checked?valuesSet.add(value):valuesSet.delete(value),Array.from(valuesSet).join(",")}},{key:"emitStatusChange",value:function emitStatusChange(){this.dotStatusChange.emit({name:this.name,status:this.status})}},{key:"isValid",value:function isValid(){return!this.required||!!this.value}},{key:"emitValueChange",value:function emitValueChange(){this.dotValueChange.emit({name:this.name,value:this.value})}},{key:"el",get:function get(){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_19__.g)(this)}}],[{key:"watchers",get:function get(){return{options:["optionsWatch"],value:["valueWatch"]}}}]),DotCheckboxComponent}();DotCheckboxComponent.style=".dot-checkbox__items{display:flex;flex-direction:column}.dot-checkbox__items label{display:flex;align-items:center}.dot-checkbox__items input{margin:0 0.25rem 0 0}"},"./dist/libs/dotcms-webcomponents/dist/esm/index-889b3269.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{D:()=>DOT_ATTR_PREFIX,a:()=>getErrorMessage,b:()=>getFieldsFromLayout,c:()=>shouldShowField,d:()=>fieldMap,f:()=>fieldCustomProcess,g:()=>getDotAttributesFromElement,s:()=>setDotAttributesToElement});__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.promise.js"),__webpack_require__("./node_modules/core-js/modules/es.object.keys.js"),__webpack_require__("./node_modules/core-js/modules/es.array.for-each.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.for-each.js"),__webpack_require__("./node_modules/core-js/modules/es.array.reduce.js"),__webpack_require__("./node_modules/core-js/modules/es.string.split.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"),__webpack_require__("./node_modules/core-js/modules/es.object.assign.js"),__webpack_require__("./node_modules/core-js/modules/es.string.starts-with.js"),__webpack_require__("./node_modules/core-js/modules/es.string.replace.js"),__webpack_require__("./node_modules/core-js/modules/es.array.map.js"),__webpack_require__("./node_modules/core-js/modules/es.array.filter.js"),__webpack_require__("./node_modules/core-js/modules/es.array.includes.js"),__webpack_require__("./node_modules/core-js/modules/es.string.includes.js"),__webpack_require__("./node_modules/core-js/modules/es.array.concat.js"),__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js");var _index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-094afd6e.js"),_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_27__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/utils-61ba0d04.js");function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||_unsupportedIterableToArray(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||_unsupportedIterableToArray(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,minLen):void 0}}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var DotFormFields={Text:function Text(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-textfield",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},"regex-check":field.regexCheck,required:field.required,value:field.defaultValue})},Textarea:function Textarea(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-textarea",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},"regex-check":field.regexCheck,required:field.required,value:field.defaultValue})},Checkbox:function Checkbox(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-checkbox",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Multi-Select":function MultiSelect(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-multi-select",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Key-Value":function KeyValue(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-key-value",{"field-type":field.fieldType,hint:field.hint,label:field.name,name:field.variable,required:field.required,value:field.defaultValue})},Select:function Select(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-select",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},Radio:function Radio(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-radio",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},Date:function Date(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-date",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},Time:function Time(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-time",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Date-and-Time":function DateAndTime(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-date-time",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Date-Range":function DateRange(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-date-range",{hint:field.hint,label:field.name,name:field.variable,required:field.required,value:field.defaultValue})},Tag:function Tag(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-tags",{data:function data(){return fetch("/api/v1/tags").then((function(data){return data.json()})).then((function(items){return Object.keys(items)})).catch((function(){return[]}))},hint:field.hint,label:field.name,name:field.variable,required:field.required,value:field.defaultValue})},Binary:function Binary(field){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_26__.h)("dot-binary-file",{accept:getFieldVariableValue(field.fieldVariables,"accept"),"max-file-length":getFieldVariableValue(field.fieldVariables,"maxFileLength"),hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required})}},DOT_ATTR_PREFIX="dot";function setAttributesToTag(element,fieldVariables){fieldVariables.forEach((function(_ref){var key=_ref.key,value=_ref.value;element.setAttribute(key,value)}))}function setDotAttributesToElement(element,attributes){attributes.forEach((function(_ref2){var name=_ref2.name,value=_ref2.value;element.setAttribute(name.replace(DOT_ATTR_PREFIX,""),value)}))}function getDotAttributesFromElement(attributes,attrException){var exceptions=attrException.map((function(attr){return attr.toUpperCase()}));return attributes.filter((function(item){return!exceptions.includes(item.name.toUpperCase())&&function isDotAttribute(name){return name.startsWith(DOT_ATTR_PREFIX)}(item.name)}))}var shouldShowField=function shouldShowField(field,fieldsToShow){var fields2Show=fieldsToShow?fieldsToShow.split(","):[];return!fields2Show.length||fields2Show.includes(field.variable)},getFieldVariableValue=function getFieldVariableValue(fieldVariables,key){if(fieldVariables&&fieldVariables.length){var variable=_slicedToArray(fieldVariables.filter((function(item){return item.key.toUpperCase()===key.toUpperCase()})),1)[0];return variable&&variable.value}return null},getErrorMessage=function getErrorMessage(message){var messageObj;try{messageObj=JSON.parse(message)}catch(error){messageObj=message}return messageObj.errors&&messageObj.errors.length&&messageObj.errors[0].message?messageObj.errors[0].message:message},getFieldsFromLayout=function getFieldsFromLayout(layout){return layout.reduce((function(acc,_ref3){var columns=_ref3.columns;return acc.concat.apply(acc,_toConsumableArray(columns.map((function(col){return col.fields}))))}),[])},fieldParamsConversionFromBE={"Key-Value":function KeyValue(field){if(field.defaultValue&&"string"!=typeof field.defaultValue){var valuesArray=Object.keys(field.defaultValue).map((function(key){return{key,value:field.defaultValue[key]}}));field.defaultValue=(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_27__.d)(valuesArray)}return DotFormFields["Key-Value"](field)}},fieldCustomProcess={"DOT-KEY-VALUE":function pipedValuesToObject(values){return(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_27__.e)(values)?values.split(",").reduce((function(acc,item){var _Object$assign,_item$split2=_slicedToArray(item.split("|"),2),key=_item$split2[0],value=_item$split2[1];return Object.assign(Object.assign({},acc),((_Object$assign={})[key]=value,_Object$assign))}),{}):null}},fieldMap={Time:DotFormFields.Time,Textarea:DotFormFields.Textarea,Text:DotFormFields.Text,Tag:DotFormFields.Tag,Select:DotFormFields.Select,Radio:DotFormFields.Radio,"Multi-Select":DotFormFields["Multi-Select"],"Key-Value":fieldParamsConversionFromBE["Key-Value"],"Date-and-Time":DotFormFields["Date-and-Time"],"Date-Range":DotFormFields["Date-Range"],Date:DotFormFields.Date,Checkbox:DotFormFields.Checkbox,Binary:DotFormFields.Binary}},"./node_modules/core-js/internals/array-reduce.js":(module,__unused_webpack_exports,__webpack_require__)=>{var global=__webpack_require__("./node_modules/core-js/internals/global.js"),aCallable=__webpack_require__("./node_modules/core-js/internals/a-callable.js"),toObject=__webpack_require__("./node_modules/core-js/internals/to-object.js"),IndexedObject=__webpack_require__("./node_modules/core-js/internals/indexed-object.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),TypeError=global.TypeError,createMethod=function(IS_RIGHT){return function(that,callbackfn,argumentsLength,memo){aCallable(callbackfn);var O=toObject(that),self=IndexedObject(O),length=lengthOfArrayLike(O),index=IS_RIGHT?length-1:0,i=IS_RIGHT?-1:1;if(argumentsLength<2)for(;;){if(index in self){memo=self[index],index+=i;break}if(index+=i,IS_RIGHT?index<0:length<=index)throw TypeError("Reduce of empty array with no initial value")}for(;IS_RIGHT?index>=0:length>index;index+=i)index in self&&(memo=callbackfn(memo,self[index],index,O));return memo}};module.exports={left:createMethod(!1),right:createMethod(!0)}},"./node_modules/core-js/modules/es.array.reduce.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var $=__webpack_require__("./node_modules/core-js/internals/export.js"),$reduce=__webpack_require__("./node_modules/core-js/internals/array-reduce.js").left,arrayMethodIsStrict=__webpack_require__("./node_modules/core-js/internals/array-method-is-strict.js"),CHROME_VERSION=__webpack_require__("./node_modules/core-js/internals/engine-v8-version.js"),IS_NODE=__webpack_require__("./node_modules/core-js/internals/engine-is-node.js");$({target:"Array",proto:!0,forced:!arrayMethodIsStrict("reduce")||!IS_NODE&&CHROME_VERSION>79&&CHROME_VERSION<83},{reduce:function reduce(callbackfn){var length=arguments.length;return $reduce(this,callbackfn,length,length>1?arguments[1]:void 0)}})}}]);