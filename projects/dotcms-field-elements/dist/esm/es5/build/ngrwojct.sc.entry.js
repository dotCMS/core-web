import{h}from"../dotcmsfields.core.js";import{a as Fragment}from"./chunk-1d89c98b.js";import{a as getOriginalStatus,b as checkProp,c as getClassNames,d as getTagHint,e as getTagError,f as updateStatus,g as isFileAllowed,h as getHintId,i as getErrorClass,j as isValidURL,k as getId}from"./chunk-62cd3eff.js";import{a as getDotAttributesFromElement,b as setDotAttributesToElement}from"./chunk-4205a04e.js";var DotBinaryMessageError;!function(e){e[e.REQUIRED=0]="REQUIRED",e[e.INVALID=1]="INVALID",e[e.URLINVALID=2]="URLINVALID"}(DotBinaryMessageError||(DotBinaryMessageError={}));var DotBinaryFileComponent=function(){function e(){this.name="",this.label="",this.placeholder="Drop or paste a file or url",this.hint="",this.required=!1,this.requiredMessage="This field is required",this.validationMessage="The field doesn't comply with the specified format",this.URLValidationMessage="The specified URL is not valid",this.disabled=!1,this.accept="",this.maxFileLength="",this.buttonLabel="Browse",this.errorMessage="",this.previewImageName="",this.previewImageUrl="",this.file=null,this.allowedFileTypes=[],this.errorMessageMap=new Map}return e.prototype.reset=function(){this.file="",this.binaryTextField.value="",this.errorMessage="",this.clearPreviewData(),this.status=getOriginalStatus(this.isValid()),this.emitStatusChange(),this.emitValueChange()},e.prototype.clearValue=function(){this.binaryTextField.value="",this.errorType=this.required?DotBinaryMessageError.REQUIRED:null,this.setValue(""),this.clearPreviewData()},e.prototype.componentWillLoad=function(){this.setErrorMessageMap(),this.validateProps(),this.status=getOriginalStatus(this.isValid()),this.emitStatusChange()},e.prototype.componentDidLoad=function(){var e=this;this.binaryTextField=this.el.querySelector("dot-binary-text-field");var t=["dottype"],i=this.el.querySelector('input[type="file"]');setTimeout(function(){var r=getDotAttributesFromElement(Array.from(e.el.attributes),t);setDotAttributesToElement(i,r)},0)},e.prototype.requiredMessageWatch=function(){this.errorMessageMap.set(DotBinaryMessageError.REQUIRED,this.requiredMessage)},e.prototype.validationMessageWatch=function(){this.errorMessageMap.set(DotBinaryMessageError.INVALID,this.validationMessage)},e.prototype.URLValidationMessageWatch=function(){this.errorMessageMap.set(DotBinaryMessageError.URLINVALID,this.URLValidationMessage)},e.prototype.optionsWatch=function(){this.accept=checkProp(this,"accept"),this.allowedFileTypes=this.accept?this.accept.split(","):[],this.allowedFileTypes=this.allowedFileTypes.map(function(e){return e.trim()})},e.prototype.fileChangeHandler=function(e){e.stopImmediatePropagation();var t=e.detail;this.errorType=t.errorType,this.setValue(t.file),this.isBinaryUploadButtonEvent(e.target)&&t.file&&(this.binaryTextField.value=t.file.name)},e.prototype.HandleDragover=function(e){e.preventDefault(),this.disabled||(this.el.classList.add("dot-dragover"),this.el.classList.remove("dot-dropped"))},e.prototype.HandleDragleave=function(e){e.preventDefault(),this.el.classList.remove("dot-dragover"),this.el.classList.remove("dot-dropped")},e.prototype.HandleDrop=function(e){e.preventDefault(),this.el.classList.remove("dot-dragover"),this.disabled||this.previewImageName||(this.el.classList.add("dot-dropped"),this.errorType=null,this.handleDroppedFile(e.dataTransfer.files[0]))},e.prototype.handleDelete=function(e){e.preventDefault(),this.setValue(""),this.clearPreviewData()},e.prototype.hostData=function(){return{class:getClassNames(this.status,this.isValid(),this.required)}},e.prototype.render=function(){return h(Fragment,null,h("dot-label",{label:this.label,required:this.required,name:this.name,tabindex:"0"},this.previewImageName?h("dot-binary-file-preview",{onClick:function(e){e.preventDefault()},fileName:this.previewImageName,previewUrl:this.previewImageUrl}):h("div",{class:"dot-binary__container"},h("dot-binary-text-field",{placeholder:this.placeholder,required:this.required,disabled:this.disabled,accept:this.allowedFileTypes.join(","),hint:this.hint,onLostFocus:this.lostFocusEventHandler.bind(this)}),h("dot-binary-upload-button",{name:this.name,accept:this.allowedFileTypes.join(","),disabled:this.disabled,required:this.required,buttonLabel:this.buttonLabel}))),getTagHint(this.hint),getTagError(this.shouldShowErrorMessage(),this.getErrorMessage()),h("dot-error-message",null,this.errorMessage))},e.prototype.lostFocusEventHandler=function(){this.status.dotTouched||(this.status=updateStatus(this.status,{dotTouched:!0}),this.emitStatusChange())},e.prototype.isBinaryUploadButtonEvent=function(e){return"dot-binary-upload-button"===e.localName},e.prototype.validateProps=function(){this.optionsWatch(),this.setPlaceHolder()},e.prototype.shouldShowErrorMessage=function(){return this.getErrorMessage()&&!this.status.dotPristine},e.prototype.getErrorMessage=function(){return this.errorMessageMap.get(this.errorType)},e.prototype.isValid=function(){return!(this.required&&!this.file)},e.prototype.setErrorMessageMap=function(){this.requiredMessageWatch(),this.validationMessageWatch(),this.URLValidationMessageWatch()},e.prototype.setValue=function(e){this.file=e,this.status=updateStatus(this.status,{dotTouched:!0,dotPristine:!1,dotValid:this.isValid()}),this.binaryTextField.value=null===e?"":this.binaryTextField.value,this.emitValueChange(),this.emitStatusChange()},e.prototype.emitStatusChange=function(){this.statusChange.emit({name:this.name,status:this.status})},e.prototype.emitValueChange=function(){this.valueChange.emit({name:this.name,value:this.file})},e.prototype.handleDroppedFile=function(e){isFileAllowed(e.name,this.allowedFileTypes.join(","))?(this.setValue(e),this.binaryTextField.value=e.name):(this.errorType=DotBinaryMessageError.INVALID,this.setValue(null))},e.prototype.setPlaceHolder=function(){this.placeholder=this.isWindowsOS()?"Drop a file or url":this.placeholder},e.prototype.isWindowsOS=function(){return window.navigator.platform.includes("Win")},e.prototype.clearPreviewData=function(){this.previewImageUrl="",this.previewImageName=""},Object.defineProperty(e,"is",{get:function(){return"dot-binary-file"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{accept:{type:String,attr:"accept",reflectToAttr:!0,mutable:!0,watchCallbacks:["optionsWatch"]},buttonLabel:{type:String,attr:"button-label",reflectToAttr:!0},clearValue:{method:!0},disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},el:{elementRef:!0},errorMessage:{type:String,attr:"error-message",reflectToAttr:!0,mutable:!0},hint:{type:String,attr:"hint",reflectToAttr:!0},label:{type:String,attr:"label",reflectToAttr:!0},maxFileLength:{type:String,attr:"max-file-length",reflectToAttr:!0,mutable:!0},name:{type:String,attr:"name",reflectToAttr:!0},placeholder:{type:String,attr:"placeholder",reflectToAttr:!0,mutable:!0},previewImageName:{type:String,attr:"preview-image-name",reflectToAttr:!0,mutable:!0},previewImageUrl:{type:String,attr:"preview-image-url",reflectToAttr:!0,mutable:!0},required:{type:Boolean,attr:"required",reflectToAttr:!0},requiredMessage:{type:String,attr:"required-message",watchCallbacks:["requiredMessageWatch"]},reset:{method:!0},status:{state:!0},URLValidationMessage:{type:String,attr:"u-r-l-validation-message",watchCallbacks:["URLValidationMessageWatch"]},validationMessage:{type:String,attr:"validation-message",watchCallbacks:["validationMessageWatch"]}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"valueChange",method:"valueChange",bubbles:!0,cancelable:!0,composed:!0},{name:"statusChange",method:"statusChange",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"listeners",{get:function(){return[{name:"fileChange",method:"fileChangeHandler"},{name:"dragover",method:"HandleDragover"},{name:"dragleave",method:"HandleDragleave"},{name:"drop",method:"HandleDrop"},{name:"delete",method:"handleDelete"}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"dot-binary-file.dot-dragover input{background-color:#f1f1f1}dot-binary-file .dot-binary__container button,dot-binary-file .dot-binary__container input{display:-ms-inline-flexbox;display:inline-flex;border:1px solid #d3d3d3;padding:15px;border-radius:0}dot-binary-file .dot-binary__container input[type=file]{display:none}dot-binary-file .dot-binary__container input{min-width:245px;text-overflow:ellipsis}dot-binary-file .dot-binary__container button{background-color:#d3d3d3}"},enumerable:!0,configurable:!0}),e}(),DotBinaryFilePreviewComponent=function(){function e(){this.fileName="",this.previewUrl="",this.deleteLabel="Delete"}return e.prototype.render=function(){var e=this;return this.fileName?h(Fragment,null,this.getPreviewElement(),h("div",{class:"dot-file-preview__info"},h("span",{class:"dot-file-preview__name"},this.fileName),h("button",{type:"button",onClick:function(){return e.clearFile()}},this.deleteLabel))):null},e.prototype.clearFile=function(){this.delete.emit(),this.fileName=null,this.previewUrl=null},e.prototype.getPreviewElement=function(){return this.previewUrl?h("img",{alt:this.fileName,src:this.previewUrl}):h("div",{class:"dot-file-preview__extension"},h("span",null,this.getExtention()))},e.prototype.getExtention=function(){return this.fileName.substr(this.fileName.lastIndexOf("."))},Object.defineProperty(e,"is",{get:function(){return"dot-binary-file-preview"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{deleteLabel:{type:String,attr:"delete-label",reflectToAttr:!0},el:{elementRef:!0},fileName:{type:String,attr:"file-name",reflectToAttr:!0,mutable:!0},previewUrl:{type:String,attr:"preview-url",reflectToAttr:!0,mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"delete",method:"delete",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"dot-binary-file-preview{display:-ms-flexbox;display:flex}dot-binary-file-preview .dot-file-preview__extension,dot-binary-file-preview img{width:100px;height:100px}dot-binary-file-preview .dot-file-preview__info{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-item-align:end;align-self:flex-end;padding-left:.5rem}dot-binary-file-preview .dot-file-preview__info span{margin-bottom:1rem;word-break:break-all}dot-binary-file-preview .dot-file-preview__info button{-ms-flex-item-align:start;align-self:flex-start;background-color:#d3d3d3;border:0;padding:.3rem 1.5rem;cursor:pointer}dot-binary-file-preview .dot-file-preview__extension{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background-color:#d3d3d3}dot-binary-file-preview .dot-file-preview__extension span{overflow:hidden;padding:.5rem;text-overflow:ellipsis;font-size:2rem}"},enumerable:!0,configurable:!0}),e}(),DotBinaryTextFieldComponent=function(){function e(){this.value=null,this.hint="",this.placeholder="",this.required=!1,this.disabled=!1}return e.prototype.render=function(){var e=this;return h(Fragment,null,h("input",{type:"text","aria-describedby":getHintId(this.hint),class:getErrorClass(this.isValid()),disabled:this.disabled,placeholder:this.placeholder,value:this.value,onBlur:function(){return e.lostFocus.emit()},onKeyDown:function(t){return e.keyDownHandler(t)},onPaste:function(t){return e.pasteHandler(t)}}))},e.prototype.keyDownHandler=function(e){"Backspace"===e.key?this.handleBackspace():this.shouldPreventEvent(e)&&e.preventDefault()},e.prototype.shouldPreventEvent=function(e){return!(e.ctrlKey||e.metaKey)},e.prototype.handleBackspace=function(){this.value="",this.emitFile(null,this.required?DotBinaryMessageError.REQUIRED:null)},e.prototype.pasteHandler=function(e){e.preventDefault(),this.value="";var t=e.clipboardData;t.items.length&&(this.isPastingFile(t)?this.handleFilePaste(t.items):this.handleURLPaste(t.items[0]))},e.prototype.handleFilePaste=function(e){var t=this,i=e[0],r=e[1].getAsFile();i.getAsString(function(e){isFileAllowed(e,t.accept)?(t.value=e,t.emitFile(r)):t.emitFile(null,DotBinaryMessageError.INVALID)})},e.prototype.handleURLPaste=function(e){var t=this;e.getAsString(function(e){isValidURL(e)?(t.value=e,t.emitFile(e)):t.emitFile(null,DotBinaryMessageError.URLINVALID)})},e.prototype.isPastingFile=function(e){return!!e.files.length},e.prototype.isValid=function(){return!(this.required&&this.value)},e.prototype.emitFile=function(e,t){this.fileChange.emit({file:e,errorType:t})},Object.defineProperty(e,"is",{get:function(){return"dot-binary-text-field"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{accept:{type:String,attr:"accept",reflectToAttr:!0},disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},el:{elementRef:!0},hint:{type:String,attr:"hint",reflectToAttr:!0},placeholder:{type:String,attr:"placeholder",reflectToAttr:!0},required:{type:Boolean,attr:"required",reflectToAttr:!0},status:{state:!0},value:{type:"Any",attr:"value",reflectToAttr:!0,mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"fileChange",method:"fileChange",bubbles:!0,cancelable:!0,composed:!0},{name:"lostFocus",method:"lostFocus",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return""},enumerable:!0,configurable:!0}),e}(),DotBinaryUploadButtonComponent=function(){function e(){this.name="",this.required=!1,this.disabled=!1,this.buttonLabel=""}return e.prototype.componentDidLoad=function(){this.fileInput=this.el.querySelector("dot-label input")},e.prototype.render=function(){var e=this;return h(Fragment,null,h("input",{accept:this.accept,disabled:this.disabled,id:getId(this.name),onChange:function(t){return e.fileChangeHandler(t)},required:this.required||null,type:"file"}),h("button",{type:"button",disabled:this.disabled,onClick:function(){e.fileInput.click()}},this.buttonLabel))},e.prototype.fileChangeHandler=function(e){var t=this.fileInput.files[0];isFileAllowed(t.name,this.accept)?this.emitFile(t):(e.preventDefault(),this.emitFile(null,DotBinaryMessageError.INVALID))},e.prototype.emitFile=function(e,t){this.fileChange.emit({file:e,errorType:t})},Object.defineProperty(e,"is",{get:function(){return"dot-binary-upload-button"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{accept:{type:String,attr:"accept",reflectToAttr:!0},buttonLabel:{type:String,attr:"button-label",reflectToAttr:!0},disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},el:{elementRef:!0},name:{type:String,attr:"name",reflectToAttr:!0},required:{type:Boolean,attr:"required",reflectToAttr:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"fileChange",method:"fileChange",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return""},enumerable:!0,configurable:!0}),e}();export{DotBinaryFileComponent as DotBinaryFile,DotBinaryFilePreviewComponent as DotBinaryFilePreview,DotBinaryTextFieldComponent as DotBinaryTextField,DotBinaryUploadButtonComponent as DotBinaryUploadButton};