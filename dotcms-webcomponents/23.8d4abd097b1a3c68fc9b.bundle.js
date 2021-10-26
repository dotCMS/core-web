(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{750:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"dot_key_value",(function(){return DotKeyValueComponent}));__webpack_require__(120),__webpack_require__(5),__webpack_require__(53),__webpack_require__(76),__webpack_require__(28),__webpack_require__(23),__webpack_require__(157),__webpack_require__(47),__webpack_require__(17),__webpack_require__(77),__webpack_require__(27),__webpack_require__(22),__webpack_require__(32),__webpack_require__(36),__webpack_require__(26),__webpack_require__(25),__webpack_require__(31),__webpack_require__(41),__webpack_require__(24);var _index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__=__webpack_require__(154),_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__=__webpack_require__(763),_checkProp_286e406e_js__WEBPACK_IMPORTED_MODULE_21__=__webpack_require__(766);function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return _arrayLikeToArray(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}var mapToKeyValue=function mapToKeyValue(_ref){return{key:_ref.label,value:_ref.value}},DotKeyValueComponent=function(){function DotKeyValueComponent(hostRef){!function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,DotKeyValueComponent),Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__.g)(this,hostRef),this.dotValueChange=Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__.c)(this,"dotValueChange",7),this.dotStatusChange=Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__.c)(this,"dotStatusChange",7),this.value="",this.name="",this.label="",this.hint="",this.required=!1,this.requiredMessage="This field is required",this.disabled=!1,this.items=[]}var _reset;return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Constructor}(DotKeyValueComponent,[{key:"valueWatch",value:function valueWatch(){this.value=Object(_checkProp_286e406e_js__WEBPACK_IMPORTED_MODULE_21__.a)(this,"value","string"),this.items=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.f)(this.value).map(mapToKeyValue)}},{key:"reset",value:(_reset=function _asyncToGenerator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}(regeneratorRuntime.mark((function _callee(){return regeneratorRuntime.wrap((function _callee$(_context){for(;;)switch(_context.prev=_context.next){case 0:this.items=[],this.value="",this.status=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.e)(this.isValid()),this.emitChanges();case 4:case"end":return _context.stop()}}),_callee,this)}))),function reset(){return _reset.apply(this,arguments)})},{key:"deleteItemHandler",value:function deleteItemHandler(event){event.stopImmediatePropagation(),this.items=this.items.filter((function(_item,index){return index!==event.detail})),this.refreshStatus(),this.emitChanges()}},{key:"addItemHandler",value:function addItemHandler(_ref2){var detail=_ref2.detail;this.items=[].concat(_toConsumableArray(this.items),[detail]),this.refreshStatus(),this.emitChanges()}},{key:"componentWillLoad",value:function componentWillLoad(){this.validateProps(),this.setOriginalStatus(),this.emitStatusChange()}},{key:"render",value:function render(){var classes=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.g)(this.status,this.isValid(),this.required);return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__.e)(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__.a,{class:Object.assign({},classes)},Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__.e)("dot-label",{"aria-describedby":Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.b)(this.hint),tabIndex:this.hint?0:null,label:this.label,required:this.required,name:this.name},Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__.e)("key-value-form",{onLostFocus:this.blurHandler.bind(this),"add-button-label":this.formAddButtonLabel,disabled:this.isDisabled(),"key-label":this.formKeyLabel,"key-placeholder":this.formKeyPlaceholder,"value-label":this.formValueLabel,"value-placeholder":this.formValuePlaceholder}),Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__.e)("key-value-table",{onClick:function onClick(e){e.preventDefault()},"button-label":this.listDeleteLabel,disabled:this.isDisabled(),items:this.items})),Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.a)(this.hint),Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.c)(this.showErrorMessage(),this.getErrorMessage()))}},{key:"isDisabled",value:function isDisabled(){return this.disabled||null}},{key:"blurHandler",value:function blurHandler(){this.status.dotTouched||(this.status=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.o)(this.status,{dotTouched:!0}),this.emitStatusChange())}},{key:"validateProps",value:function validateProps(){this.valueWatch()}},{key:"setOriginalStatus",value:function setOriginalStatus(){this.status=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.e)(this.isValid())}},{key:"isValid",value:function isValid(){return!(this.required&&!this.items.length)}},{key:"showErrorMessage",value:function showErrorMessage(){return this.getErrorMessage()&&!this.status.dotPristine}},{key:"getErrorMessage",value:function getErrorMessage(){return this.isValid()?"":this.requiredMessage}},{key:"refreshStatus",value:function refreshStatus(){this.status=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.o)(this.status,{dotTouched:!0,dotPristine:!1,dotValid:this.isValid()})}},{key:"emitStatusChange",value:function emitStatusChange(){this.dotStatusChange.emit({name:this.name,status:this.status})}},{key:"emitValueChange",value:function emitValueChange(){var returnedValue=Object(_utils_35e848b2_js__WEBPACK_IMPORTED_MODULE_20__.d)(this.items);this.dotValueChange.emit({name:this.name,value:returnedValue})}},{key:"emitChanges",value:function emitChanges(){this.emitStatusChange(),this.emitValueChange()}},{key:"el",get:function get(){return Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_19__.d)(this)}}],[{key:"watchers",get:function get(){return{value:["valueWatch"]}}}]),DotKeyValueComponent}();DotKeyValueComponent.style=""},763:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return getTagHint})),__webpack_require__.d(__webpack_exports__,"b",(function(){return getHintId})),__webpack_require__.d(__webpack_exports__,"c",(function(){return getTagError})),__webpack_require__.d(__webpack_exports__,"d",(function(){return getStringFromDotKeyArray})),__webpack_require__.d(__webpack_exports__,"e",(function(){return getOriginalStatus})),__webpack_require__.d(__webpack_exports__,"f",(function(){return getDotOptionsFromFieldValue})),__webpack_require__.d(__webpack_exports__,"g",(function(){return getClassNames})),__webpack_require__.d(__webpack_exports__,"h",(function(){return getErrorClass})),__webpack_require__.d(__webpack_exports__,"i",(function(){return isStringType})),__webpack_require__.d(__webpack_exports__,"j",(function(){return getId})),__webpack_require__.d(__webpack_exports__,"k",(function(){return isFileAllowed})),__webpack_require__.d(__webpack_exports__,"l",(function(){return isValidURL})),__webpack_require__.d(__webpack_exports__,"m",(function(){return getLabelId})),__webpack_require__.d(__webpack_exports__,"n",(function(){return nextTick})),__webpack_require__.d(__webpack_exports__,"o",(function(){return updateStatus}));__webpack_require__(42),__webpack_require__(156),__webpack_require__(53),__webpack_require__(76),__webpack_require__(155),__webpack_require__(228),__webpack_require__(28),__webpack_require__(23),__webpack_require__(26),__webpack_require__(17),__webpack_require__(25),__webpack_require__(31),__webpack_require__(158),__webpack_require__(159),__webpack_require__(121),__webpack_require__(64),__webpack_require__(98),__webpack_require__(29),__webpack_require__(39),__webpack_require__(27),__webpack_require__(22),__webpack_require__(32),__webpack_require__(36),__webpack_require__(24),__webpack_require__(5),__webpack_require__(41);var _index_dc31274d_js__WEBPACK_IMPORTED_MODULE_26__=__webpack_require__(154);function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function nextTick(fn){var id=window.requestAnimationFrame((function(){fn&&fn(),window.cancelAnimationFrame(id)}))}function getClassNames(status,isValid,required){return{"dot-valid":isValid,"dot-invalid":!isValid,"dot-pristine":status.dotPristine,"dot-dirty":!status.dotPristine,"dot-touched":status.dotTouched,"dot-untouched":!status.dotTouched,"dot-required":required}}function isStringType(val){return"string"==typeof val&&!!val}function getDotOptionsFromFieldValue(rawString){return isStringType(rawString)&&function isKeyPipeValueFormatValid(rawString){for(var regex=/([^|,]*)\|([^|,]*)/,items=rawString.split(","),valid=!0,i=0,total=items.length;i<total;i++)if(!regex.test(items[i])){valid=!1;break}return valid}(rawString=rawString.replace(/(?:\\[rn]|[\r\n]+)+/g,","))?rawString.split(",").filter((function(item){return!!item.length})).map((function(item){var _item$split2=_slicedToArray(item.split("|"),2);return{label:_item$split2[0],value:_item$split2[1]}})):[]}function getErrorClass(valid){return valid?void 0:"dot-field__error"}function getHintId(name){var value=slugify(name);return value?"hint-".concat(value):void 0}function getId(name){var value=slugify(name);return name?"dot-".concat(slugify(value)):void 0}function getLabelId(name){var value=slugify(name);return value?"label-".concat(value):void 0}function getOriginalStatus(isValid){return{dotValid:void 0===isValid||isValid,dotTouched:!1,dotPristine:!0}}function getStringFromDotKeyArray(values){return values.map((function(item){return"".concat(item.key,"|").concat(item.value)})).join(",")}function updateStatus(state,change){return Object.assign(Object.assign({},state),change)}function getTagError(show,message){return show&&isStringType(message)?Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_26__.e)("span",{class:"dot-field__error-message"},message):null}function getTagHint(hint){return isStringType(hint)?Object(_index_dc31274d_js__WEBPACK_IMPORTED_MODULE_26__.e)("span",{class:"dot-field__hint",id:getHintId(hint)},hint):null}function isValidURL(url){try{return!!new URL(url)}catch(e){return!1}}function isFileAllowed(name,type,allowedExtensions){if(""===allowedExtensions)return!0;var fileExt=function getFileExtension(filename){return/(?:\.([^.]+))?$/.exec(filename)[1]}(name);return!!allowedExtensions.split(",").find((function(allowedExt){if("*"===allowedExt)return!0;if(allowedExt.includes("/*")){var extType=allowedExt.split("/*").filter(Boolean).join("");return type.includes(extType)}return allowedExt.includes(fileExt)}))}function slugify(text){return text?text.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,""):null}},764:function(module,exports,__webpack_require__){var DESCRIPTORS=__webpack_require__(16),global=__webpack_require__(1),uncurryThis=__webpack_require__(4),isForced=__webpack_require__(122),inheritIfRequired=__webpack_require__(235),createNonEnumerableProperty=__webpack_require__(79),defineProperty=__webpack_require__(30).f,getOwnPropertyNames=__webpack_require__(99).f,isPrototypeOf=__webpack_require__(78),isRegExp=__webpack_require__(236),toString=__webpack_require__(21),regExpFlags=__webpack_require__(233),stickyHelpers=__webpack_require__(237),redefine=__webpack_require__(33),fails=__webpack_require__(8),hasOwn=__webpack_require__(18),enforceInternalState=__webpack_require__(43).enforce,setSpecies=__webpack_require__(234),wellKnownSymbol=__webpack_require__(10),UNSUPPORTED_DOT_ALL=__webpack_require__(333),UNSUPPORTED_NCG=__webpack_require__(334),MATCH=wellKnownSymbol("match"),NativeRegExp=global.RegExp,RegExpPrototype=NativeRegExp.prototype,SyntaxError=global.SyntaxError,getFlags=uncurryThis(regExpFlags),exec=uncurryThis(RegExpPrototype.exec),charAt=uncurryThis("".charAt),replace=uncurryThis("".replace),stringIndexOf=uncurryThis("".indexOf),stringSlice=uncurryThis("".slice),IS_NCG=/^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/,re1=/a/g,re2=/a/g,CORRECT_NEW=new NativeRegExp(re1)!==re1,UNSUPPORTED_Y=stickyHelpers.UNSUPPORTED_Y,BASE_FORCED=DESCRIPTORS&&(!CORRECT_NEW||UNSUPPORTED_Y||UNSUPPORTED_DOT_ALL||UNSUPPORTED_NCG||fails((function(){return re2[MATCH]=!1,NativeRegExp(re1)!=re1||NativeRegExp(re2)==re2||"/a/i"!=NativeRegExp(re1,"i")})));if(isForced("RegExp",BASE_FORCED)){for(var RegExpWrapper=function RegExp(pattern,flags){var rawFlags,dotAll,sticky,handled,result,state,thisIsRegExp=isPrototypeOf(RegExpPrototype,this),patternIsRegExp=isRegExp(pattern),flagsAreUndefined=void 0===flags,groups=[],rawPattern=pattern;if(!thisIsRegExp&&patternIsRegExp&&flagsAreUndefined&&pattern.constructor===RegExpWrapper)return pattern;if((patternIsRegExp||isPrototypeOf(RegExpPrototype,pattern))&&(pattern=pattern.source,flagsAreUndefined&&(flags="flags"in rawPattern?rawPattern.flags:getFlags(rawPattern))),pattern=void 0===pattern?"":toString(pattern),flags=void 0===flags?"":toString(flags),rawPattern=pattern,UNSUPPORTED_DOT_ALL&&"dotAll"in re1&&(dotAll=!!flags&&stringIndexOf(flags,"s")>-1)&&(flags=replace(flags,/s/g,"")),rawFlags=flags,UNSUPPORTED_Y&&"sticky"in re1&&(sticky=!!flags&&stringIndexOf(flags,"y")>-1)&&(flags=replace(flags,/y/g,"")),UNSUPPORTED_NCG&&(pattern=(handled=function(string){for(var chr,length=string.length,index=0,result="",named=[],names={},brackets=!1,ncg=!1,groupid=0,groupname="";index<=length;index++){if("\\"===(chr=charAt(string,index)))chr+=charAt(string,++index);else if("]"===chr)brackets=!1;else if(!brackets)switch(!0){case"["===chr:brackets=!0;break;case"("===chr:exec(IS_NCG,stringSlice(string,index+1))&&(index+=2,ncg=!0),result+=chr,groupid++;continue;case">"===chr&&ncg:if(""===groupname||hasOwn(names,groupname))throw new SyntaxError("Invalid capture group name");names[groupname]=!0,named[named.length]=[groupname,groupid],ncg=!1,groupname="";continue}ncg?groupname+=chr:result+=chr}return[result,named]}(pattern))[0],groups=handled[1]),result=inheritIfRequired(NativeRegExp(pattern,flags),thisIsRegExp?this:RegExpPrototype,RegExpWrapper),(dotAll||sticky||groups.length)&&(state=enforceInternalState(result),dotAll&&(state.dotAll=!0,state.raw=RegExpWrapper(function(string){for(var chr,length=string.length,index=0,result="",brackets=!1;index<=length;index++)"\\"!==(chr=charAt(string,index))?brackets||"."!==chr?("["===chr?brackets=!0:"]"===chr&&(brackets=!1),result+=chr):result+="[\\s\\S]":result+=chr+charAt(string,++index);return result}(pattern),rawFlags)),sticky&&(state.sticky=!0),groups.length&&(state.groups=groups)),pattern!==rawPattern)try{createNonEnumerableProperty(result,"source",""===rawPattern?"(?:)":rawPattern)}catch(error){}return result},proxy=function(key){key in RegExpWrapper||defineProperty(RegExpWrapper,key,{configurable:!0,get:function(){return NativeRegExp[key]},set:function(it){NativeRegExp[key]=it}})},keys=getOwnPropertyNames(NativeRegExp),index=0;keys.length>index;)proxy(keys[index++]);RegExpPrototype.constructor=RegExpWrapper,RegExpWrapper.prototype=RegExpPrototype,redefine(global,"RegExp",RegExpWrapper)}setSpecies("RegExp")},766:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.d(__webpack_exports__,"a",(function(){return checkProp})),__webpack_require__.d(__webpack_exports__,"b",(function(){return dotParseDate}));__webpack_require__(764),__webpack_require__(42),__webpack_require__(39),__webpack_require__(155),__webpack_require__(28),__webpack_require__(5),__webpack_require__(23),__webpack_require__(29),__webpack_require__(17),__webpack_require__(335),__webpack_require__(27),__webpack_require__(22),__webpack_require__(32),__webpack_require__(36),__webpack_require__(26),__webpack_require__(25),__webpack_require__(31),__webpack_require__(24),__webpack_require__(41),__webpack_require__(229),__webpack_require__(230),__webpack_require__(54),__webpack_require__(231),__webpack_require__(157),__webpack_require__(232),__webpack_require__(332),__webpack_require__(47);function _typeof(obj){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(obj){return typeof obj}:function _typeof(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj})(obj)}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}function _possibleConstructorReturn(self,call){if(call&&("object"===_typeof(call)||"function"==typeof call))return call;if(void 0!==call)throw new TypeError("Derived constructors may only return object or undefined");return function _assertThisInitialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}(self)}function _wrapNativeSuper(Class){var _cache="function"==typeof Map?new Map:void 0;return(_wrapNativeSuper=function _wrapNativeSuper(Class){if(null===Class||!function _isNativeFunction(fn){return-1!==Function.toString.call(fn).indexOf("[native code]")}(Class))return Class;if("function"!=typeof Class)throw new TypeError("Super expression must either be null or a function");if(void 0!==_cache){if(_cache.has(Class))return _cache.get(Class);_cache.set(Class,Wrapper)}function Wrapper(){return _construct(Class,arguments,_getPrototypeOf(this).constructor)}return Wrapper.prototype=Object.create(Class.prototype,{constructor:{value:Wrapper,enumerable:!1,writable:!0,configurable:!0}}),_setPrototypeOf(Wrapper,Class)})(Class)}function _construct(Parent,args,Class){return(_construct=_isNativeReflectConstruct()?Reflect.construct:function _construct(Parent,args,Class){var a=[null];a.push.apply(a,args);var instance=new(Function.bind.apply(Parent,a));return Class&&_setPrototypeOf(instance,Class.prototype),instance}).apply(null,arguments)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function _setPrototypeOf(o,p){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(o,p){return o.__proto__=p,o})(o,p)}function _getPrototypeOf(o){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)})(o)}function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}var DATE_REGEX=new RegExp("^\\d\\d\\d\\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])"),TIME_REGEX=new RegExp("^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])$");function dotValidateDate(date){return DATE_REGEX.test(date)?date:null}function dotValidateTime(time){return TIME_REGEX.test(time)?time:null}function dotParseDate(data){var _ref2=_slicedToArray(data?data.split(" "):"",2),dateOrTime=_ref2[0],time=_ref2[1];return{date:dotValidateDate(dateOrTime),time:dotValidateTime(time)||dotValidateTime(dateOrTime)}}var DotFieldPropError=function(_Error){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),superClass&&_setPrototypeOf(subClass,superClass)}(DotFieldPropError,_Error);var _super=function _createSuper(Derived){var hasNativeReflectConstruct=_isNativeReflectConstruct();return function _createSuperInternal(){var result,Super=_getPrototypeOf(Derived);if(hasNativeReflectConstruct){var NewTarget=_getPrototypeOf(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return _possibleConstructorReturn(this,result)}}(DotFieldPropError);function DotFieldPropError(propInfo,expectedType){var _this;return function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,DotFieldPropError),(_this=_super.call(this,'Warning: Invalid prop "'.concat(propInfo.name,'" of type "').concat(_typeof(propInfo.value),'" supplied to "').concat(propInfo.field.type,'" with the name "').concat(propInfo.field.name,'", expected "').concat(expectedType,'".\nDoc Reference: https://github.com/dotCMS/core-web/blob/master/projects/dotcms-field-elements/src/components/').concat(propInfo.field.type,"/readme.md"))).propInfo=propInfo,_this}return function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Constructor}(DotFieldPropError,[{key:"getProps",value:function getProps(){return Object.assign({},this.propInfo)}}]),DotFieldPropError}(_wrapNativeSuper(Error));function stringValidator(propInfo){if("string"!=typeof propInfo.value)throw new DotFieldPropError(propInfo,"string")}var PROP_VALIDATION_HANDLING={date:function dateValidator(propInfo){if(!dotValidateDate(propInfo.value.toString()))throw new DotFieldPropError(propInfo,"Date")},dateRange:function dateRangeValidator(propInfo){var _propInfo$value$toStr2=_slicedToArray(propInfo.value.toString().split(","),2),start=_propInfo$value$toStr2[0],end=_propInfo$value$toStr2[1];if(!dotValidateDate(start)||!dotValidateDate(end))throw new DotFieldPropError(propInfo,"Date");!function areRangeDatesValid(start,end,propInfo){if(start>end)throw new DotFieldPropError(propInfo,"Date")}(new Date(start),new Date(end),propInfo)},dateTime:function dateTimeValidator(propInfo){if("string"!=typeof propInfo.value)throw new DotFieldPropError(propInfo,"Date/Time");if(!function isValidDateSlot(dateSlot,rawData){return!!rawData&&(rawData.split(" ").length>1?function isValidFullDateSlot(dateSlot){return!!dateSlot.date&&!!dateSlot.time}(dateSlot):function isValidPartialDateSlot(dateSlot){return!!dateSlot.date||!!dateSlot.time}(dateSlot))}(dotParseDate(propInfo.value),propInfo.value))throw new DotFieldPropError(propInfo,"Date/Time")},number:function numberValidator(propInfo){if(isNaN(Number(propInfo.value)))throw new DotFieldPropError(propInfo,"Number")},options:stringValidator,regexCheck:function regexValidator(propInfo){try{RegExp(propInfo.value.toString())}catch(e){throw new DotFieldPropError(propInfo,"valid regular expression")}},step:stringValidator,string:stringValidator,time:function timeValidator(propInfo){if(!dotValidateTime(propInfo.value.toString()))throw new DotFieldPropError(propInfo,"Time")},type:stringValidator,accept:stringValidator},FIELDS_DEFAULT_VALUE={options:"",regexCheck:"",value:"",min:"",max:"",step:"",type:"text",accept:null};function checkProp(component,propertyName,validatorType){var proInfo=function getPropInfo(element,propertyName){return{value:element[propertyName],name:propertyName,field:{name:element.name,type:element.el.tagName.toLocaleLowerCase()}}}(component,propertyName);try{return function validateProp(propInfo,validatorType){propInfo.value&&PROP_VALIDATION_HANDLING[validatorType||propInfo.name](propInfo)}(proInfo,validatorType),component[propertyName]}catch(error){return console.warn(error.message),FIELDS_DEFAULT_VALUE[propertyName]}}}}]);
//# sourceMappingURL=23.8d4abd097b1a3c68fc9b.bundle.js.map