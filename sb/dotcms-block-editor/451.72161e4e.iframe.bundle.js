(self.webpackChunkdotcms_ui=self.webpackChunkdotcms_ui||[]).push([[451],{"./dist/libs/dotcms-webcomponents/dist/esm/dot-binary-file-preview_3.entry.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{dot_binary_file_preview:()=>DotBinaryFilePreviewComponent,dot_binary_text_field:()=>DotBinaryTextFieldComponent,dot_binary_upload_button:()=>DotBinaryUploadButtonComponent});__webpack_require__("./node_modules/core-js/modules/es.array.last-index-of.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.object.define-property.js");var _index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-094afd6e.js"),_dot_binary_message_error_model_565259c3_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/dot-binary-message-error.model-565259c3.js"),_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/utils-61ba0d04.js");function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}function _createClass(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Object.defineProperty(Constructor,"prototype",{writable:!1}),Constructor}var DotBinaryFilePreviewComponent=function(){function DotBinaryFilePreviewComponent(hostRef){_classCallCheck(this,DotBinaryFilePreviewComponent),(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.r)(this,hostRef),this.delete=(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.c)(this,"delete",7),this.fileName="",this.previewUrl="",this.deleteLabel="Delete"}return _createClass(DotBinaryFilePreviewComponent,[{key:"render",value:function render(){var _this=this;return this.fileName?(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)(_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.H,null,this.getPreviewElement(),(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)("div",{class:"dot-file-preview__info"},(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)("span",{class:"dot-file-preview__name"},this.fileName),(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)("button",{type:"button",onClick:function onClick(){return _this.clearFile()}},this.deleteLabel))):null}},{key:"clearFile",value:function clearFile(){this.delete.emit(),this.fileName=null,this.previewUrl=null}},{key:"getPreviewElement",value:function getPreviewElement(){return this.previewUrl?(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)("img",{alt:this.fileName,src:this.previewUrl}):(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)("div",{class:"dot-file-preview__extension"},(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)("span",null,this.getExtention()))}},{key:"getExtention",value:function getExtention(){return this.fileName.substr(this.fileName.lastIndexOf("."))}},{key:"el",get:function get(){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.g)(this)}}]),DotBinaryFilePreviewComponent}();DotBinaryFilePreviewComponent.style="dot-binary-file-preview{display:flex}dot-binary-file-preview img,dot-binary-file-preview .dot-file-preview__extension{width:100px;height:100px}dot-binary-file-preview .dot-file-preview__info{display:flex;flex-direction:column;align-self:flex-end;padding-left:0.5rem}dot-binary-file-preview .dot-file-preview__info span{margin-bottom:1rem;word-break:break-all}dot-binary-file-preview .dot-file-preview__info button{align-self:flex-start;background-color:lightgray;border:0;padding:0.3rem 1.5rem;cursor:pointer}dot-binary-file-preview .dot-file-preview__extension{display:flex;align-items:center;justify-content:center;background-color:lightgray}dot-binary-file-preview .dot-file-preview__extension span{overflow:hidden;padding:0.5rem;text-overflow:ellipsis;font-size:2rem}";var DotBinaryTextFieldComponent=function(){function DotBinaryTextFieldComponent(hostRef){_classCallCheck(this,DotBinaryTextFieldComponent),(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.r)(this,hostRef),this.fileChange=(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.c)(this,"fileChange",7),this.lostFocus=(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.c)(this,"lostFocus",7),this.value=null,this.hint="",this.placeholder="",this.required=!1,this.disabled=!1}return _createClass(DotBinaryTextFieldComponent,[{key:"render",value:function render(){var _this2=this;return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)(_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.H,null,(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)("input",{type:"text","aria-describedby":(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_5__.h)(this.hint),class:(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_5__.j)(this.isValid()),disabled:this.disabled,placeholder:this.placeholder,value:this.value,onBlur:function onBlur(){return _this2.lostFocus.emit()},onKeyDown:function onKeyDown(event){return _this2.keyDownHandler(event)},onPaste:function onPaste(event){return _this2.pasteHandler(event)}}))}},{key:"keyDownHandler",value:function keyDownHandler(evt){"Backspace"===evt.key?this.handleBackspace():this.shouldPreventEvent(evt)&&evt.preventDefault()}},{key:"shouldPreventEvent",value:function shouldPreventEvent(evt){return!(evt.ctrlKey||evt.metaKey)}},{key:"handleBackspace",value:function handleBackspace(){this.value="",this.emitFile(null,this.required?_dot_binary_message_error_model_565259c3_js__WEBPACK_IMPORTED_MODULE_4__.D.REQUIRED:null)}},{key:"pasteHandler",value:function pasteHandler(event){event.preventDefault(),this.value="";var clipboardData=event.clipboardData;if(clipboardData.items.length)if(this.isPastingFile(clipboardData))this.handleFilePaste(clipboardData.items);else{var clipBoardFileName=clipboardData.items[0];this.handleURLPaste(clipBoardFileName)}}},{key:"handleFilePaste",value:function handleFilePaste(items){var clipBoardFile=items[1].getAsFile();(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_5__.i)(clipBoardFile.name,clipBoardFile.type,this.accept)?(this.value=clipBoardFile,this.emitFile(clipBoardFile)):this.emitFile(null,_dot_binary_message_error_model_565259c3_js__WEBPACK_IMPORTED_MODULE_4__.D.INVALID)}},{key:"handleURLPaste",value:function handleURLPaste(clipBoardFileName){var _this3=this;clipBoardFileName.getAsString((function(fileURL){(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_5__.l)(fileURL)?(_this3.value=fileURL,_this3.emitFile(fileURL)):_this3.emitFile(null,_dot_binary_message_error_model_565259c3_js__WEBPACK_IMPORTED_MODULE_4__.D.URLINVALID)}))}},{key:"isPastingFile",value:function isPastingFile(data){return!!data.files.length}},{key:"isValid",value:function isValid(){return!(this.required&&this.value)}},{key:"emitFile",value:function emitFile(file,errorType){this.fileChange.emit({file,errorType})}},{key:"el",get:function get(){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.g)(this)}}]),DotBinaryTextFieldComponent}();DotBinaryTextFieldComponent.style="";var DotBinaryUploadButtonComponent=function(){function DotBinaryUploadButtonComponent(hostRef){_classCallCheck(this,DotBinaryUploadButtonComponent),(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.r)(this,hostRef),this.fileChange=(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.c)(this,"fileChange",7),this.name="",this.required=!1,this.disabled=!1,this.buttonLabel=""}return _createClass(DotBinaryUploadButtonComponent,[{key:"componentDidLoad",value:function componentDidLoad(){this.fileInput=this.el.querySelector("dot-label input")}},{key:"render",value:function render(){var _this4=this;return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)(_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.H,null,(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)("input",{accept:this.accept,disabled:this.disabled,id:(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_5__.k)(this.name),onChange:function onChange(event){return _this4.fileChangeHandler(event)},required:this.required||null,type:"file"}),(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.h)("button",{type:"button",disabled:this.disabled,onClick:function onClick(){_this4.fileInput.click()}},this.buttonLabel))}},{key:"fileChangeHandler",value:function fileChangeHandler(event){var file=this.fileInput.files[0];(0,_utils_61ba0d04_js__WEBPACK_IMPORTED_MODULE_5__.i)(file.name,file.type,this.accept)?this.emitFile(file):(event.preventDefault(),this.emitFile(null,_dot_binary_message_error_model_565259c3_js__WEBPACK_IMPORTED_MODULE_4__.D.INVALID))}},{key:"emitFile",value:function emitFile(file,errorType){this.fileChange.emit({file,errorType})}},{key:"el",get:function get(){return(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_3__.g)(this)}}]),DotBinaryUploadButtonComponent}();DotBinaryUploadButtonComponent.style=""},"./dist/libs/dotcms-webcomponents/dist/esm/dot-binary-message-error.model-565259c3.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";var DotBinaryMessageError;__webpack_require__.d(__webpack_exports__,{D:()=>DotBinaryMessageError}),function(DotBinaryMessageError){DotBinaryMessageError[DotBinaryMessageError.REQUIRED=0]="REQUIRED",DotBinaryMessageError[DotBinaryMessageError.INVALID=1]="INVALID",DotBinaryMessageError[DotBinaryMessageError.URLINVALID=2]="URLINVALID"}(DotBinaryMessageError||(DotBinaryMessageError={}))},"./dist/libs/dotcms-webcomponents/dist/esm/utils-61ba0d04.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{a:()=>getClassNames,b:()=>getTagError,c:()=>getTagHint,d:()=>getStringFromDotKeyArray,e:()=>isStringType,f:()=>getDotOptionsFromFieldValue,g:()=>getOriginalStatus,h:()=>getHintId,i:()=>isFileAllowed,j:()=>getErrorClass,k:()=>getId,l:()=>isValidURL,m:()=>getLabelId,n:()=>nextTick,u:()=>updateStatus});__webpack_require__("./node_modules/core-js/modules/es.string.replace.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.exec.js"),__webpack_require__("./node_modules/core-js/modules/es.array.map.js"),__webpack_require__("./node_modules/core-js/modules/es.array.filter.js"),__webpack_require__("./node_modules/core-js/modules/es.string.split.js"),__webpack_require__("./node_modules/core-js/modules/es.array.join.js"),__webpack_require__("./node_modules/core-js/modules/es.object.assign.js"),__webpack_require__("./node_modules/core-js/modules/web.url.js"),__webpack_require__("./node_modules/core-js/modules/es.object.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.string.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.iterator.js"),__webpack_require__("./node_modules/core-js/modules/web.dom-collections.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.find.js"),__webpack_require__("./node_modules/core-js/modules/es.array.includes.js"),__webpack_require__("./node_modules/core-js/modules/es.string.includes.js"),__webpack_require__("./node_modules/core-js/modules/es.regexp.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.date.to-string.js"),__webpack_require__("./node_modules/core-js/modules/es.array.is-array.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.description.js"),__webpack_require__("./node_modules/core-js/modules/es.symbol.iterator.js"),__webpack_require__("./node_modules/core-js/modules/es.array.slice.js"),__webpack_require__("./node_modules/core-js/modules/es.function.name.js"),__webpack_require__("./node_modules/core-js/modules/es.array.from.js");var _index_094afd6e_js__WEBPACK_IMPORTED_MODULE_24__=__webpack_require__("./dist/libs/dotcms-webcomponents/dist/esm/index-094afd6e.js");function _slicedToArray(arr,i){return function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}(arr)||function _iterableToArrayLimit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null==_i)return;var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i)||function _unsupportedIterableToArray(o,minLen){if(!o)return;if("string"==typeof o)return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(o);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}(arr,i)||function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function nextTick(fn){var id=window.requestAnimationFrame((function(){fn&&fn(),window.cancelAnimationFrame(id)}))}function getClassNames(status,isValid,required){return{"dot-valid":isValid,"dot-invalid":!isValid,"dot-pristine":status.dotPristine,"dot-dirty":!status.dotPristine,"dot-touched":status.dotTouched,"dot-untouched":!status.dotTouched,"dot-required":required}}function isStringType(val){return"string"==typeof val&&!!val}function getDotOptionsFromFieldValue(rawString){return isStringType(rawString)&&function isKeyPipeValueFormatValid(rawString){for(var regex=/([^|,]*)\|([^|,]*)/,items=rawString.split(","),valid=!0,i=0,total=items.length;i<total;i++)if(!regex.test(items[i])){valid=!1;break}return valid}(rawString=rawString.replace(/(?:\\[rn]|[\r\n]+)+/g,","))?rawString.split(",").filter((function(item){return!!item.length})).map((function(item){var _item$split2=_slicedToArray(item.split("|"),2);return{label:_item$split2[0],value:_item$split2[1]}})):[]}function getErrorClass(valid){return valid?void 0:"dot-field__error"}function getHintId(name){var value=slugify(name);return value?"hint-"+value:void 0}function getId(name){var value=slugify(name);return name?"dot-"+slugify(value):void 0}function getLabelId(name){var value=slugify(name);return value?"label-"+value:void 0}function getOriginalStatus(isValid){return{dotValid:void 0===isValid||isValid,dotTouched:!1,dotPristine:!0}}function getStringFromDotKeyArray(values){return values.map((function(item){return item.key+"|"+item.value})).join(",")}function updateStatus(state,change){return Object.assign(Object.assign({},state),change)}function getTagError(show,message){return show&&isStringType(message)?(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_24__.h)("span",{class:"dot-field__error-message"},message):null}function getTagHint(hint){return isStringType(hint)?(0,_index_094afd6e_js__WEBPACK_IMPORTED_MODULE_24__.h)("span",{class:"dot-field__hint",id:getHintId(hint)},hint):null}function isValidURL(url){try{return!!new URL(url)}catch(e){return!1}}function isFileAllowed(name,type,allowedExtensions){if(""===allowedExtensions)return!0;var fileExt=function getFileExtension(filename){return/(?:\.([^.]+))?$/.exec(filename)[1]}(name);return!!allowedExtensions.split(",").find((function(allowedExt){if("*"===allowedExt)return!0;if(allowedExt.includes("/*")){var extType=allowedExt.split("/*").filter(Boolean).join("");return type.includes(extType)}return allowedExt.includes(fileExt)}))}function slugify(text){return text?text.toString().toLowerCase().replace(/\s+/g,"-").replace(/[^\w\-]+/g,"").replace(/\-\-+/g,"-").replace(/^-+/,"").replace(/-+$/,""):null}},"./node_modules/core-js/internals/array-last-index-of.js":(module,__unused_webpack_exports,__webpack_require__)=>{"use strict";var apply=__webpack_require__("./node_modules/core-js/internals/function-apply.js"),toIndexedObject=__webpack_require__("./node_modules/core-js/internals/to-indexed-object.js"),toIntegerOrInfinity=__webpack_require__("./node_modules/core-js/internals/to-integer-or-infinity.js"),lengthOfArrayLike=__webpack_require__("./node_modules/core-js/internals/length-of-array-like.js"),arrayMethodIsStrict=__webpack_require__("./node_modules/core-js/internals/array-method-is-strict.js"),min=Math.min,$lastIndexOf=[].lastIndexOf,NEGATIVE_ZERO=!!$lastIndexOf&&1/[1].lastIndexOf(1,-0)<0,STRICT_METHOD=arrayMethodIsStrict("lastIndexOf"),FORCED=NEGATIVE_ZERO||!STRICT_METHOD;module.exports=FORCED?function lastIndexOf(searchElement){if(NEGATIVE_ZERO)return apply($lastIndexOf,this,arguments)||0;var O=toIndexedObject(this),length=lengthOfArrayLike(O),index=length-1;for(arguments.length>1&&(index=min(index,toIntegerOrInfinity(arguments[1]))),index<0&&(index=length+index);index>=0;index--)if(index in O&&O[index]===searchElement)return index||0;return-1}:$lastIndexOf},"./node_modules/core-js/modules/es.array.last-index-of.js":(__unused_webpack_module,__unused_webpack_exports,__webpack_require__)=>{var $=__webpack_require__("./node_modules/core-js/internals/export.js"),lastIndexOf=__webpack_require__("./node_modules/core-js/internals/array-last-index-of.js");$({target:"Array",proto:!0,forced:lastIndexOf!==[].lastIndexOf},{lastIndexOf})}}]);
//# sourceMappingURL=451.72161e4e.iframe.bundle.js.map