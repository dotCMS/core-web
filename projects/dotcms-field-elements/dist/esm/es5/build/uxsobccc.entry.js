import{h}from"../dotcmsfields.core.js";import{a as Fragment}from"./chunk-1d89c98b.js";import{a as getOriginalStatus,b as checkProp,n as getDotOptionsFromFieldValue,c as getClassNames,h as getHintId,i as getErrorClass,k as getId,d as getTagHint,e as getTagError,f as updateStatus}from"./chunk-62cd3eff.js";import{a as getDotAttributesFromElement,b as setDotAttributesToElement}from"./chunk-4205a04e.js";var DotMultiSelectComponent=function(){function t(){this.disabled=!1,this.name="",this.label="",this.hint="",this.options="",this.required=!1,this.requiredMessage="This field is required",this.size="3",this.value="",this._dotTouched=!1,this._dotPristine=!0}return t.prototype.componentWillLoad=function(){this.validateProps(),this.emitInitialValue(),this.status=getOriginalStatus(this.isValid()),this.emitStatusChange()},t.prototype.componentDidLoad=function(){var t=this,e=this.el.querySelector("select");setTimeout(function(){var i=getDotAttributesFromElement(Array.from(t.el.attributes),[]);setDotAttributesToElement(e,i)},0)},t.prototype.optionsWatch=function(){var t=checkProp(this,"options");this._options=getDotOptionsFromFieldValue(t)},t.prototype.hostData=function(){return{class:getClassNames(this.status,this.isValid(),this.required)}},t.prototype.reset=function(){this.value="",this.status=getOriginalStatus(this.isValid()),this.emitInitialValue(),this.emitStatusChange()},t.prototype.render=function(){var t=this;return h(Fragment,null,h("dot-label",{label:this.label,required:this.required,name:this.name},h("select",{multiple:!0,"aria-describedby":getHintId(this.hint),size:+this.size,class:getErrorClass(this.status.dotValid),id:getId(this.name),disabled:this.shouldBeDisabled(),onChange:function(){return t.setValue()}},this._options.map(function(e){return h("option",{selected:t.value===e.value||null,value:e.value},e.label)}))),getTagHint(this.hint),getTagError(!this.isValid(),this.requiredMessage))},t.prototype.validateProps=function(){this.optionsWatch()},t.prototype.shouldBeDisabled=function(){return!!this.disabled||null},t.prototype.setValue=function(){this.value=this.getValueFromMultiSelect(),this.status=updateStatus(this.status,{dotTouched:!0,dotPristine:!1,dotValid:this.isValid()}),this.emitValueChange(),this.emitStatusChange()},t.prototype.getValueFromMultiSelect=function(){var t=this.el.querySelectorAll("option:checked"),e=Array.from(t).map(function(t){return t.value});return Array.from(e).join(",")},t.prototype.emitInitialValue=function(){this.value||(this.value=this._options.length?this._options[0].value:"",this.emitValueChange())},t.prototype.emitStatusChange=function(){this.statusChange.emit({name:this.name,status:this.status})},t.prototype.isValid=function(){return!this.required||!!this.value},t.prototype.emitValueChange=function(){this.valueChange.emit({name:this.name,value:this.value})},Object.defineProperty(t,"is",{get:function(){return"dot-multi-select"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{_options:{state:!0},disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},el:{elementRef:!0},hint:{type:String,attr:"hint",reflectToAttr:!0},label:{type:String,attr:"label",reflectToAttr:!0},name:{type:String,attr:"name",reflectToAttr:!0},options:{type:String,attr:"options",reflectToAttr:!0,watchCallbacks:["optionsWatch"]},required:{type:Boolean,attr:"required",reflectToAttr:!0},requiredMessage:{type:String,attr:"required-message",reflectToAttr:!0},reset:{method:!0},size:{type:String,attr:"size",reflectToAttr:!0},status:{state:!0},value:{type:String,attr:"value",reflectToAttr:!0,mutable:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"valueChange",method:"valueChange",bubbles:!0,cancelable:!0,composed:!0},{name:"statusChange",method:"statusChange",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return""},enumerable:!0,configurable:!0}),t}();export{DotMultiSelectComponent as DotMultiSelect};