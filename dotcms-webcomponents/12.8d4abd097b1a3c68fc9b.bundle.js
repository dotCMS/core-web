(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{740:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"dot_checkbox",(function(){return DotCheckboxComponent}));__webpack_require__(120),__webpack_require__(5),__webpack_require__(160),__webpack_require__(41),__webpack_require__(25),__webpack_require__(6),__webpack_require__(7),__webpack_require__(23),__webpack_require__(53),__webpack_require__(337),__webpack_require__(54),__webpack_require__(42),__webpack_require__(155),__webpack_require__(26),__webpack_require__(17),__webpack_require__(101),__webpack_require__(31),__webpack_require__(228),__webpack_require__(47),__webpack_require__(77);var _index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__=__webpack_require__(154),_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__=__webpack_require__(763),_checkProp_286e406e_js__WEBPACK_IMPORTED_MODULE_22__=__webpack_require__(766),_index_0293c689_js__WEBPACK_IMPORTED_MODULE_23__=__webpack_require__(767);function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}var DotCheckboxComponent=function(){function DotCheckboxComponent(hostRef){!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,DotCheckboxComponent),Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.g)(this,hostRef),this.dotValueChange=Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.c)(this,"dotValueChange",7),this.dotStatusChange=Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.c)(this,"dotStatusChange",7),this.name="",this.label="",this.hint="",this.options="",this.required=!1,this.disabled=!1,this.requiredMessage="This field is required",this.value=""}var _reset;return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Constructor}(DotCheckboxComponent,[{key:"componentWillLoad",value:function componentWillLoad(){this.value=this.value||"",this.validateProps(),this.emitValueChange(),this.status=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.e)(this.isValid()),this.emitStatusChange()}},{key:"componentDidLoad",value:function componentDidLoad(){var _this=this,attrException=["dottype"],htmlElements=this.el.querySelectorAll('input[type="checkbox"]');setTimeout((function(){var attrs=Object(_index_0293c689_js__WEBPACK_IMPORTED_MODULE_23__.g)(Array.from(_this.el.attributes),attrException);htmlElements.forEach((function(htmlElement){Object(_index_0293c689_js__WEBPACK_IMPORTED_MODULE_23__.h)(htmlElement,attrs)}))}),0)}},{key:"optionsWatch",value:function optionsWatch(){var validOptions=Object(_checkProp_286e406e_js__WEBPACK_IMPORTED_MODULE_22__.a)(this,"options");this._options=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.f)(validOptions)}},{key:"valueWatch",value:function valueWatch(){this.value=this.value||""}},{key:"reset",value:(_reset=function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}(regeneratorRuntime.mark((function _callee(){return regeneratorRuntime.wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:this.value="",this.status=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.e)(this.isValid()),this.emitValueChange(),this.emitStatusChange();case 4:case"end":return _context.stop()}}),_callee,this)}))),function reset(){return _reset.apply(this,arguments)})},{key:"render",value:function render(){var _this2=this,classes=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.g)(this.status,this.isValid(),this.required);return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.e)(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.a,{class:Object.assign({},classes)},Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.e)("dot-label",{label:this.label,required:this.required,name:this.name},Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.e)("div",{"aria-describedby":Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.b)(this.hint),tabIndex:this.hint?0:null,class:"dot-checkbox__items"},this._options.map((function(item){var trimmedValue=item.value.trim();return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.e)("label",null,Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.e)("input",{class:Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.h)(_this2.isValid()),name:Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.j)(_this2.name),type:"checkbox",disabled:_this2.disabled||null,checked:_this2.value.indexOf(trimmedValue)>=0||null,onInput:function onInput(event){return _this2.setValue(event)},value:trimmedValue}),item.label)})))),Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.a)(this.hint),Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.c)(!this.isValid(),this.requiredMessage))}},{key:"validateProps",value:function validateProps(){this.optionsWatch()}},{key:"setValue",value:function setValue(event){this.value=this.getValueFromCheckInputs(event.target.value.trim(),event.target.checked),this.status=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_21__.o)(this.status,{dotTouched:!0,dotPristine:!1,dotValid:this.isValid()}),this.emitValueChange(),this.emitStatusChange()}},{key:"getValueFromCheckInputs",value:function getValueFromCheckInputs(value,checked){var valueArray=this.value.trim().length?this.value.split(","):[],valuesSet=new Set(valueArray);return checked?valuesSet.add(value):valuesSet.delete(value),Array.from(valuesSet).join(",")}},{key:"emitStatusChange",value:function emitStatusChange(){this.dotStatusChange.emit({name:this.name,status:this.status})}},{key:"isValid",value:function isValid(){return!this.required||!!this.value}},{key:"emitValueChange",value:function emitValueChange(){this.dotValueChange.emit({name:this.name,value:this.value})}},{key:"el",get:function get(){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_20__.d)(this)}}],[{key:"watchers",get:function get(){return{options:["optionsWatch"],value:["valueWatch"]}}}]),DotCheckboxComponent}();DotCheckboxComponent.style=".dot-checkbox__items{display:flex;flex-direction:column}.dot-checkbox__items label{display:flex;align-items:center}.dot-checkbox__items input{margin:0 0.25rem 0 0}"},763:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return getTagHint})),__webpack_require__.d(__webpack_exports__,"b",(function(){return getHintId})),__webpack_require__.d(__webpack_exports__,"c",(function(){return getTagError})),__webpack_require__.d(__webpack_exports__,"d",(function(){return getStringFromDotKeyArray})),__webpack_require__.d(__webpack_exports__,"e",(function(){return getOriginalStatus})),__webpack_require__.d(__webpack_exports__,"f",(function(){return getDotOptionsFromFieldValue})),__webpack_require__.d(__webpack_exports__,"g",(function(){return getClassNames})),__webpack_require__.d(__webpack_exports__,"h",(function(){return getErrorClass})),__webpack_require__.d(__webpack_exports__,"i",(function(){return isStringType})),__webpack_require__.d(__webpack_exports__,"j",(function(){return getId})),__webpack_require__.d(__webpack_exports__,"k",(function(){return isFileAllowed})),__webpack_require__.d(__webpack_exports__,"l",(function(){return isValidURL})),__webpack_require__.d(__webpack_exports__,"m",(function(){return getLabelId})),__webpack_require__.d(__webpack_exports__,"n",(function(){return nextTick})),__webpack_require__.d(__webpack_exports__,"o",(function(){return updateStatus}));__webpack_require__(42),__webpack_require__(156),__webpack_require__(53),__webpack_require__(76),__webpack_require__(155),__webpack_require__(228),__webpack_require__(28),__webpack_require__(23),__webpack_require__(26),__webpack_require__(17),__webpack_require__(25),__webpack_require__(31),__webpack_require__(158),__webpack_require__(159),__webpack_require__(121),__webpack_require__(64),__webpack_require__(98),__webpack_require__(29),__webpack_require__(39),__webpack_require__(27),__webpack_require__(22),__webpack_require__(32),__webpack_require__(36),__webpack_require__(24),__webpack_require__(5),__webpack_require__(41);var _index_dc31274d_js__WEBPACK_IMPORTED_MODULE_26__=__webpack_require__(154);function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function nextTick(fn){var id=window.requestAnimationFrame((function(){fn&&fn(),window.cancelAnimationFrame(id)}))}function getClassNames(status,isValid,required){return{"dot-valid":isValid,"dot-invalid":!isValid,"dot-pristine":status.dotPristine,"dot-dirty":!status.dotPristine,"dot-touched":status.dotTouched,"dot-untouched":!status.dotTouched,"dot-required":required}}function isStringType(val){return"string"==typeof val&&!!val}function getDotOptionsFromFieldValue(rawString){return isStringType(rawString)&&function isKeyPipeValueFormatValid(rawString){for(var regex=/([^|,]*)\|([^|,]*)/,items=rawString.split(","),valid=!0,i=0,total=items.length;i<total;i++)if(!regex.test(items[i])){valid=!1;break}return valid}(rawString=rawString.replace(/(?:\\[rn]|[\r\n]+)+/g,","))?rawString.split(",").filter((function(item){return!!item.length})).map((function(item){var _item$split2=_slicedToArray(item.split("|"),2);return{label:_item$split2[0],value:_item$split2[1]}})):[]}function getErrorClass(valid){return valid?void 0:"dot-field__error"}function getHintId(name){var value=slugify(name);return value?"hint-".concat(value):void 0}function getId(name){var value=slugify(name);return name?"dot-".concat(slugify(value)):void 0}function getLabelId(name){var value=slugify(name);return value?"label-".concat(value):void 0}function getOriginalStatus(isValid){return{dotValid:void 0===isValid||isValid,dotTouched:!1,dotPristine:!0}}function getStringFromDotKeyArray(values){return values.map((function(item){return"".concat(item.key,"|").concat(item.value)})).join(",")}function updateStatus(state,change){return Object.assign(Object.assign({},state),change)}function getTagError(show,message){return show&&isStringType(message)?Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_26__.e)("span",{class:"dot-field__error-message"},message):null}function getTagHint(hint){return isStringType(hint)?Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_26__.e)("span",{class:"dot-field__hint",id:getHintId(hint)},hint):null}function isValidURL(url){try{return!!new URL(url)}catch(e){return!1}}function isFileAllowed(name,type,allowedExtensions){if(""===allowedExtensions)return!0;var fileExt=function getFileExtension(filename){return/(?:\.([^.]+))?$/.exec(filename)[1]}(name);return!!allowedExtensions.split(",").find((function(allowedExt){if("*"===allowedExt)return!0;if(allowedExt.includes("/*")){var extType=allowedExt.split("/*").filter(Boolean).join("");return type.includes(extType)}return allowedExt.includes(fileExt)}))}function slugify(text){return text?text.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,""):null}},764:function(module,exports,__webpack_require__){var DESCRIPTORS=__webpack_require__(16),global=__webpack_require__(1),uncurryThis=__webpack_require__(4),isForced=__webpack_require__(122),inheritIfRequired=__webpack_require__(235),createNonEnumerableProperty=__webpack_require__(79),defineProperty=__webpack_require__(30).f,getOwnPropertyNames=__webpack_require__(99).f,isPrototypeOf=__webpack_require__(78),isRegExp=__webpack_require__(236),toString=__webpack_require__(21),regExpFlags=__webpack_require__(233),stickyHelpers=__webpack_require__(237),redefine=__webpack_require__(33),fails=__webpack_require__(8),hasOwn=__webpack_require__(18),enforceInternalState=__webpack_require__(43).enforce,setSpecies=__webpack_require__(234),wellKnownSymbol=__webpack_require__(10),UNSUPPORTED_DOT_ALL=__webpack_require__(333),UNSUPPORTED_NCG=__webpack_require__(334),MATCH=wellKnownSymbol("match"),NativeRegExp=global.RegExp,RegExpPrototype=NativeRegExp.prototype,SyntaxError=global.SyntaxError,getFlags=uncurryThis(regExpFlags),exec=uncurryThis(RegExpPrototype.exec),charAt=uncurryThis("".charAt),replace=uncurryThis("".replace),stringIndexOf=uncurryThis("".indexOf),stringSlice=uncurryThis("".slice),IS_NCG=/^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/,re1=/a/g,re2=/a/g,CORRECT_NEW=new NativeRegExp(re1)!==re1,UNSUPPORTED_Y=stickyHelpers.UNSUPPORTED_Y,BASE_FORCED=DESCRIPTORS&&(!CORRECT_NEW||UNSUPPORTED_Y||UNSUPPORTED_DOT_ALL||UNSUPPORTED_NCG||fails((function(){return re2[MATCH]=!1,NativeRegExp(re1)!=re1||NativeRegExp(re2)==re2||"/a/i"!=NativeRegExp(re1,"i")})));if(isForced("RegExp",BASE_FORCED)){for(var RegExpWrapper=function RegExp(pattern,flags){var rawFlags,dotAll,sticky,handled,result,state,thisIsRegExp=isPrototypeOf(RegExpPrototype,this),patternIsRegExp=isRegExp(pattern),flagsAreUndefined=void 0===flags,groups=[],rawPattern=pattern;if(!thisIsRegExp&&patternIsRegExp&&flagsAreUndefined&&pattern.constructor===RegExpWrapper)return pattern;if((patternIsRegExp||isPrototypeOf(RegExpPrototype,pattern))&&(pattern=pattern.source,flagsAreUndefined&&(flags="flags"in rawPattern?rawPattern.flags:getFlags(rawPattern))),pattern=void 0===pattern?"":toString(pattern),flags=void 0===flags?"":toString(flags),rawPattern=pattern,UNSUPPORTED_DOT_ALL&&"dotAll"in re1&&(dotAll=!!flags&&stringIndexOf(flags,"s")>-1)&&(flags=replace(flags,/s/g,"")),rawFlags=flags,UNSUPPORTED_Y&&"sticky"in re1&&(sticky=!!flags&&stringIndexOf(flags,"y")>-1)&&(flags=replace(flags,/y/g,"")),UNSUPPORTED_NCG&&(pattern=(handled=function(string){for(var chr,length=string.length,index=0,result="",named=[],names={},brackets=!1,ncg=!1,groupid=0,groupname="";index<=length;index++){if("\\"===(chr=charAt(string,index)))chr+=charAt(string,++index);else if("]"===chr)brackets=!1;else if(!brackets)switch(!0){case"["===chr:brackets=!0;break;case"("===chr:exec(IS_NCG,stringSlice(string,index+1))&&(index+=2,ncg=!0),result+=chr,groupid++;continue;case">"===chr&&ncg:if(""===groupname||hasOwn(names,groupname))throw new SyntaxError("Invalid capture group name");names[groupname]=!0,named[named.length]=[groupname,groupid],ncg=!1,groupname="";continue}ncg?groupname+=chr:result+=chr}return[result,named]}(pattern))[0],groups=handled[1]),result=inheritIfRequired(NativeRegExp(pattern,flags),thisIsRegExp?this:RegExpPrototype,RegExpWrapper),(dotAll||sticky||groups.length)&&(state=enforceInternalState(result),dotAll&&(state.dotAll=!0,state.raw=RegExpWrapper(function(string){for(var chr,length=string.length,index=0,result="",brackets=!1;index<=length;index++)"\\"!==(chr=charAt(string,index))?brackets||"."!==chr?("["===chr?brackets=!0:"]"===chr&&(brackets=!1),result+=chr):result+="[\\s\\S]":result+=chr+charAt(string,++index);return result}(pattern),rawFlags)),sticky&&(state.sticky=!0),groups.length&&(state.groups=groups)),pattern!==rawPattern)try{createNonEnumerableProperty(result,"source",""===rawPattern?"(?:)":rawPattern)}catch(error){}return result},proxy=function(key){key in RegExpWrapper||defineProperty(RegExpWrapper,key,{configurable:!0,get:function(){return NativeRegExp[key]},set:function(it){NativeRegExp[key]=it}})},keys=getOwnPropertyNames(NativeRegExp),index=0;keys.length>index;)proxy(keys[index++]);RegExpPrototype.constructor=RegExpWrapper,RegExpWrapper.prototype=RegExpPrototype,redefine(global,"RegExp",RegExpWrapper)}setSpecies("RegExp")},766:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return checkProp})),__webpack_require__.d(__webpack_exports__,"b",(function(){return dotParseDate}));__webpack_require__(764),__webpack_require__(42),__webpack_require__(39),__webpack_require__(155),__webpack_require__(28),__webpack_require__(5),__webpack_require__(23),__webpack_require__(29),__webpack_require__(17),__webpack_require__(335),__webpack_require__(27),__webpack_require__(22),__webpack_require__(32),__webpack_require__(36),__webpack_require__(26),__webpack_require__(25),__webpack_require__(31),__webpack_require__(24),__webpack_require__(41),__webpack_require__(229),__webpack_require__(230),__webpack_require__(54),__webpack_require__(231),__webpack_require__(157),__webpack_require__(232),__webpack_require__(332),__webpack_require__(47);function _typeof(obj){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(obj){return typeof obj}:function _typeof(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj})(obj)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}(self)}function _wrapNativeSuper(Class){var _cache="function"==typeof Map?new Map:void 0;return(_wrapNativeSuper=function _wrapNativeSuper(Class){if(null===Class||!function _isNativeFunction(fn){return-1!==Function.toString.call(fn).indexOf("[native code]")}(Class))return Class;if("function"!=typeof Class)throw new TypeError("Super expression must either be null or a function");if(void 0!==_cache){if(_cache.has(Class))return _cache.get(Class);_cache.set(Class,Wrapper)}function Wrapper(){return _construct(Class,arguments,_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(Class.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(Wrapper,Class)})(Class)}function _construct(Parent,args,Class){return(_construct=_isNativeReflectConstruct()?Reflect.construct:function _construct(Parent,args,Class){var a=[null];a.push.apply(a,args);var instance=new(Function.bind.apply(Parent,a));return Class&&_setPrototypeOf(instance,Class.prototype),instance}).apply(null,arguments)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function _setPrototypeOf(o,p){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(o,p){return o.__proto__=p,o})(o,p)}function _getPrototypeOf(o){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)})(o)}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var DATE_REGEX=new RegExp("^\\d\\d\\d\\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])"),TIME_REGEX=new RegExp("^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])$");function dotValidateDate(date){return DATE_REGEX.test(date)?date:null}function dotValidateTime(time){return TIME_REGEX.test(time)?time:null}function dotParseDate(data){var _ref2=_slicedToArray(data?data.split(" "):"",2),dateOrTime=_ref2[0],time=_ref2[1];return{date:dotValidateDate(dateOrTime),time:dotValidateTime(time)||dotValidateTime(dateOrTime)}}var DotFieldPropError=function(_Error){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),superClass&&_setPrototypeOf(subClass,superClass)}(DotFieldPropError,_Error);var _super=function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return _possibleConstructorReturn(this,result)}}(DotFieldPropError);function DotFieldPropError(propInfo,expectedType){var _this;return function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,DotFieldPropError),(_this=_super.call(this,'Warning: Invalid prop "'.concat(propInfo.name,'" of type "').concat(_typeof(propInfo.value),'" supplied to "').concat(propInfo.field.type,'" with the name "').concat(propInfo.field.name,'", expected "').concat(expectedType,'".\nDoc Reference: https://github.com/dotCMS/core-web/blob/master/projects/dotcms-field-elements/src/components/').concat(propInfo.field.type,"/readme.md"))).propInfo=propInfo,_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Constructor}(DotFieldPropError,[{key:"getProps",value:function getProps(){return Object.assign({},this.propInfo)}}]),DotFieldPropError}(_wrapNativeSuper(Error));function stringValidator(propInfo){if("string"!=typeof propInfo.value)throw new DotFieldPropError(propInfo,"string")}var PROP_VALIDATION_HANDLING={date:function dateValidator(propInfo){if(!dotValidateDate(propInfo.value.toString()))throw new DotFieldPropError(propInfo,"Date")},dateRange:function dateRangeValidator(propInfo){var _propInfo$value$toStr2=_slicedToArray(propInfo.value.toString().split(","),2),start=_propInfo$value$toStr2[0],end=_propInfo$value$toStr2[1];if(!dotValidateDate(start)||!dotValidateDate(end))throw new DotFieldPropError(propInfo,"Date");!function areRangeDatesValid(start,end,propInfo){if(start>end)throw new DotFieldPropError(propInfo,"Date")}(new Date(start),new Date(end),propInfo)},dateTime:function dateTimeValidator(propInfo){if("string"!=typeof propInfo.value)throw new DotFieldPropError(propInfo,"Date/Time");if(!function isValidDateSlot(dateSlot,rawData){return!!rawData&&(rawData.split(" ").length>1?function isValidFullDateSlot(dateSlot){return!!dateSlot.date&&!!dateSlot.time}(dateSlot):function isValidPartialDateSlot(dateSlot){return!!dateSlot.date||!!dateSlot.time}(dateSlot))}(dotParseDate(propInfo.value),propInfo.value))throw new DotFieldPropError(propInfo,"Date/Time")},number:function numberValidator(propInfo){if(isNaN(Number(propInfo.value)))throw new DotFieldPropError(propInfo,"Number")},options:stringValidator,regexCheck:function regexValidator(propInfo){try{RegExp(propInfo.value.toString())}catch(e){throw new DotFieldPropError(propInfo,"valid regular expression")}},step:stringValidator,string:stringValidator,time:function timeValidator(propInfo){if(!dotValidateTime(propInfo.value.toString()))throw new DotFieldPropError(propInfo,"Time")},type:stringValidator,accept:stringValidator},FIELDS_DEFAULT_VALUE={options:"",regexCheck:"",value:"",min:"",max:"",step:"",type:"text",accept:null};function checkProp(component,propertyName,validatorType){var proInfo=function getPropInfo(element,propertyName){return{value:element[propertyName],name:propertyName,field:{name:element.name,type:element.el.tagName.toLocaleLowerCase()}}}(component,propertyName);try{return function validateProp(propInfo,validatorType){propInfo.value&&PROP_VALIDATION_HANDLING[validatorType||propInfo.name](propInfo)}(proInfo,validatorType),component[propertyName]}catch(error){return console.warn(error.message),FIELDS_DEFAULT_VALUE[propertyName]}}},767:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return DOT_ATTR_PREFIX})),__webpack_require__.d(__webpack_exports__,"b",(function(){return getErrorMessage})),__webpack_require__.d(__webpack_exports__,"c",(function(){return getFieldsFromLayout})),__webpack_require__.d(__webpack_exports__,"d",(function(){return shouldShowField})),__webpack_require__.d(__webpack_exports__,"e",(function(){return fieldMap})),__webpack_require__.d(__webpack_exports__,"f",(function(){return fieldCustomProcess})),__webpack_require__.d(__webpack_exports__,"g",(function(){return getDotAttributesFromElement})),__webpack_require__.d(__webpack_exports__,"h",(function(){return setDotAttributesToElement}));__webpack_require__(5),__webpack_require__(26),__webpack_require__(17),__webpack_require__(31),__webpack_require__(77),__webpack_require__(34),__webpack_require__(6),__webpack_require__(7),__webpack_require__(123),__webpack_require__(42),__webpack_require__(155),__webpack_require__(23),__webpack_require__(238),__webpack_require__(156),__webpack_require__(53),__webpack_require__(76),__webpack_require__(64),__webpack_require__(98),__webpack_require__(28),__webpack_require__(27),__webpack_require__(22),__webpack_require__(32),__webpack_require__(36),__webpack_require__(25),__webpack_require__(24),__webpack_require__(41),__webpack_require__(47);var _index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__=__webpack_require__(154),_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_28__=__webpack_require__(763);function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||_unsupportedIterableToArray(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||_unsupportedIterableToArray(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _unsupportedIterableToArray(o,minLen){if(o){if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(o,minLen):void 0}}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var DotFormFields={Text:function Text(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-textfield",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},"regex-check":field.regexCheck,required:field.required,value:field.defaultValue})},Textarea:function Textarea(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-textarea",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},"regex-check":field.regexCheck,required:field.required,value:field.defaultValue})},Checkbox:function Checkbox(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-checkbox",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Multi-Select":function MultiSelect(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-multi-select",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Key-Value":function KeyValue(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-key-value",{"field-type":field.fieldType,hint:field.hint,label:field.name,name:field.variable,required:field.required,value:field.defaultValue})},Select:function Select(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-select",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},Radio:function Radio(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-radio",{hint:field.hint,label:field.name,name:field.variable,options:field.values,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},Date:function Date(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-date",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},Time:function Time(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-time",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Date-and-Time":function DateAndTime(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-date-time",{hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required,value:field.defaultValue})},"Date-Range":function DateRange(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-date-range",{hint:field.hint,label:field.name,name:field.variable,required:field.required,value:field.defaultValue})},Tag:function Tag(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-tags",{data:function data(){return fetch("/api/v1/tags").then((function(data){return data.json()})).then((function(items){return Object.keys(items)})).catch((function(){return[]}))},hint:field.hint,label:field.name,name:field.variable,required:field.required,value:field.defaultValue})},Binary:function Binary(field){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_27__.e)("dot-binary-file",{accept:getFieldVariableValue(field.fieldVariables,"accept"),"max-file-length":getFieldVariableValue(field.fieldVariables,"maxFileLength"),hint:field.hint,label:field.name,name:field.variable,ref:function ref(el){setAttributesToTag(el,field.fieldVariables)},required:field.required})}},DOT_ATTR_PREFIX="dot";function setAttributesToTag(element,fieldVariables){fieldVariables.forEach((function(_ref){var key=_ref.key,value=_ref.value;element.setAttribute(key,value)}))}function setDotAttributesToElement(element,attributes){attributes.forEach((function(_ref2){var name=_ref2.name,value=_ref2.value;element.setAttribute(name.replace(DOT_ATTR_PREFIX,""),value)}))}function getDotAttributesFromElement(attributes,attrException){var exceptions=attrException.map((function(attr){return attr.toUpperCase()}));return attributes.filter((function(item){return!exceptions.includes(item.name.toUpperCase())&&function isDotAttribute(name){return name.startsWith(DOT_ATTR_PREFIX)}(item.name)}))}var shouldShowField=function shouldShowField(field,fieldsToShow){var fields2Show=fieldsToShow?fieldsToShow.split(","):[];return!fields2Show.length||fields2Show.includes(field.variable)},getFieldVariableValue=function getFieldVariableValue(fieldVariables,key){if(fieldVariables&&fieldVariables.length){var variable=_slicedToArray(fieldVariables.filter((function(item){return item.key.toUpperCase()===key.toUpperCase()})),1)[0];return variable&&variable.value}return null},getErrorMessage=function getErrorMessage(message){var messageObj;try{messageObj=JSON.parse(message)}catch(error){messageObj=message}return messageObj.errors&&messageObj.errors.length&&messageObj.errors[0].message?messageObj.errors[0].message:message},getFieldsFromLayout=function getFieldsFromLayout(layout){return layout.reduce((function(acc,_ref3){var columns=_ref3.columns;return acc.concat.apply(acc,_toConsumableArray(columns.map((function(col){return col.fields}))))}),[])},fieldParamsConversionFromBE={"Key-Value":function KeyValue(field){if(field.defaultValue&&"string"!=typeof field.defaultValue){var valuesArray=Object.keys(field.defaultValue).map((function(key){return{key:key,value:field.defaultValue[key]}}));field.defaultValue=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_28__.d)(valuesArray)}return DotFormFields["Key-Value"](field)}},fieldCustomProcess={"DOT-KEY-VALUE":function pipedValuesToObject(values){return Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_28__.i)(values)?values.split(",").reduce((function(acc,item){var _item$split2=_slicedToArray(item.split("|"),2),key=_item$split2[0],value=_item$split2[1];return Object.assign(Object.assign({},acc),function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}({},key,value))}),{}):null}},fieldMap={Time:DotFormFields.Time,Textarea:DotFormFields.Textarea,Text:DotFormFields.Text,Tag:DotFormFields.Tag,Select:DotFormFields.Select,Radio:DotFormFields.Radio,"Multi-Select":DotFormFields["Multi-Select"],"Key-Value":fieldParamsConversionFromBE["Key-Value"],"Date-and-Time":DotFormFields["Date-and-Time"],"Date-Range":DotFormFields["Date-Range"],Date:DotFormFields.Date,Checkbox:DotFormFields.Checkbox,Binary:DotFormFields.Binary}}}]);
//# sourceMappingURL=12.8d4abd097b1a3c68fc9b.bundle.js.map