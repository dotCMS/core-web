import{h}from"../dotcmsfields.core.js";import{a as Fragment}from"./chunk-1d89c98b.js";import{b as checkProp,n as getDotOptionsFromFieldValue,a as getOriginalStatus,c as getClassNames,h as getHintId,d as getTagHint,e as getTagError,f as updateStatus,l as getStringFromDotKeyArray}from"./chunk-62cd3eff.js";var mapToKeyValue=function(e){return{key:e.label,value:e.value}},DotKeyValueComponent=function(){function e(){this.disabled=!1,this.hint="",this.label="",this.name="",this.required=!1,this.requiredMessage="This field is required",this.value="",this.items=[]}return e.prototype.valueWatch=function(){this.value=checkProp(this,"value","string"),this.items=getDotOptionsFromFieldValue(this.value).map(mapToKeyValue)},e.prototype.reset=function(){this.items=[],this.value="",this.status=getOriginalStatus(this.isValid()),this.emitChanges()},e.prototype.deleteItemHandler=function(e){e.stopImmediatePropagation(),this.items=this.items.filter(function(t,a){return a!==e.detail}),this.refreshStatus(),this.emitChanges()},e.prototype.addItemHandler=function(e){this.items=this.items.concat([e.detail]),this.refreshStatus(),this.emitChanges()},e.prototype.componentWillLoad=function(){this.validateProps(),this.setOriginalStatus(),this.emitStatusChange()},e.prototype.hostData=function(){return{class:getClassNames(this.status,this.isValid(),this.required)}},e.prototype.render=function(){return h(Fragment,null,h("dot-label",{"aria-describedby":getHintId(this.hint),tabIndex:this.hint?0:null,label:this.label,required:this.required,name:this.name},h("key-value-form",{onLostFocus:this.blurHandler.bind(this),"add-button-label":this.formAddButtonLabel,disabled:this.isDisabled(),"key-label":this.formKeyLabel,"key-placeholder":this.formKeyPlaceholder,"value-label":this.formValueLabel,"value-placeholder":this.formValuePlaceholder}),h("key-value-table",{onClick:function(e){e.preventDefault()},"button-label":this.listDeleteLabel,disabled:this.isDisabled(),items:this.items})),getTagHint(this.hint),getTagError(this.showErrorMessage(),this.getErrorMessage()))},e.prototype.isDisabled=function(){return this.disabled||null},e.prototype.blurHandler=function(){this.status.dotTouched||(this.status=updateStatus(this.status,{dotTouched:!0}),this.emitStatusChange())},e.prototype.validateProps=function(){this.valueWatch()},e.prototype.setOriginalStatus=function(){this.status=getOriginalStatus(this.isValid())},e.prototype.isValid=function(){return!(this.required&&!this.items.length)},e.prototype.showErrorMessage=function(){return this.getErrorMessage()&&!this.status.dotPristine},e.prototype.getErrorMessage=function(){return this.isValid()?"":this.requiredMessage},e.prototype.refreshStatus=function(){this.status=updateStatus(this.status,{dotTouched:!0,dotPristine:!1,dotValid:this.isValid()})},e.prototype.emitStatusChange=function(){this.statusChange.emit({name:this.name,status:this.status})},e.prototype.emitValueChange=function(){var e=getStringFromDotKeyArray(this.items);this.valueChange.emit({name:this.name,value:e})},e.prototype.emitChanges=function(){this.emitStatusChange(),this.emitValueChange()},Object.defineProperty(e,"is",{get:function(){return"dot-key-value"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},el:{elementRef:!0},formAddButtonLabel:{type:String,attr:"form-add-button-label",reflectToAttr:!0},formKeyLabel:{type:String,attr:"form-key-label",reflectToAttr:!0},formKeyPlaceholder:{type:String,attr:"form-key-placeholder",reflectToAttr:!0},formValueLabel:{type:String,attr:"form-value-label",reflectToAttr:!0},formValuePlaceholder:{type:String,attr:"form-value-placeholder",reflectToAttr:!0},hint:{type:String,attr:"hint",reflectToAttr:!0},items:{state:!0},label:{type:String,attr:"label",reflectToAttr:!0},listDeleteLabel:{type:String,attr:"list-delete-label",reflectToAttr:!0},name:{type:String,attr:"name",reflectToAttr:!0},required:{type:Boolean,attr:"required",reflectToAttr:!0},requiredMessage:{type:String,attr:"required-message",reflectToAttr:!0},reset:{method:!0},status:{state:!0},value:{type:String,attr:"value",reflectToAttr:!0,mutable:!0,watchCallbacks:["valueWatch"]}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"valueChange",method:"valueChange",bubbles:!0,cancelable:!0,composed:!0},{name:"statusChange",method:"statusChange",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"listeners",{get:function(){return[{name:"delete",method:"deleteItemHandler"},{name:"add",method:"addItemHandler"}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return""},enumerable:!0,configurable:!0}),e}(),DEFAULT_VALUE={key:"",value:""},DotKeyValueComponent$1=function(){function e(){this.disabled=!1,this.addButtonLabel="Add",this.keyPlaceholder="",this.valuePlaceholder="",this.keyLabel="Key",this.valueLabel="Value",this.inputs=Object.assign({},DEFAULT_VALUE)}return e.prototype.render=function(){var e=this,t=this.isButtonDisabled();return h("form",{onSubmit:this.addKey.bind(this)},h("label",null,this.keyLabel,h("input",{disabled:this.disabled,name:"key",onBlur:function(t){return e.lostFocus.emit(t)},onInput:function(t){return e.setValue(t)},placeholder:this.keyPlaceholder,type:"text",value:this.inputs.key})),h("label",null,this.valueLabel,h("input",{disabled:this.disabled,name:"value",onBlur:function(t){return e.lostFocus.emit(t)},onInput:function(t){return e.setValue(t)},placeholder:this.valuePlaceholder,type:"text",value:this.inputs.value})),h("button",{class:"key-value-form__save__button",type:"submit",disabled:t},this.addButtonLabel))},e.prototype.isButtonDisabled=function(){return!this.isFormValid()||this.disabled||null},e.prototype.isFormValid=function(){return!(!this.inputs.key.length||!this.inputs.value.length)},e.prototype.setValue=function(e){var t;e.stopImmediatePropagation();var a=e.target;this.inputs=Object.assign({},this.inputs,((t={})[a.name]=a.value.toString(),t))},e.prototype.addKey=function(e){e.preventDefault(),e.stopImmediatePropagation(),this.inputs.key&&this.inputs.value&&(this.add.emit(this.inputs),this.clearForm(),this.focusKeyInputField())},e.prototype.clearForm=function(){this.inputs=Object.assign({},DEFAULT_VALUE)},e.prototype.focusKeyInputField=function(){this.el.querySelector('input[name="key"]').focus()},Object.defineProperty(e,"is",{get:function(){return"key-value-form"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{addButtonLabel:{type:String,attr:"add-button-label",reflectToAttr:!0},disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},el:{elementRef:!0},inputs:{state:!0},keyLabel:{type:String,attr:"key-label",reflectToAttr:!0},keyPlaceholder:{type:String,attr:"key-placeholder",reflectToAttr:!0},valueLabel:{type:String,attr:"value-label",reflectToAttr:!0},valuePlaceholder:{type:String,attr:"value-placeholder",reflectToAttr:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"add",method:"add",bubbles:!0,cancelable:!0,composed:!0},{name:"lostFocus",method:"lostFocus",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return"key-value-form form{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}key-value-form form button{margin:0}key-value-form form input{margin:0 1rem 0 .5rem}key-value-form form label{-ms-flex-align:center;align-items:center;display:-ms-flexbox;display:flex}key-value-form form label,key-value-form form label input{-ms-flex-positive:1;flex-grow:1}"},enumerable:!0,configurable:!0}),e}(),KeyValueTableComponent=function(){function e(){this.items=[],this.disabled=!1,this.buttonLabel="Delete",this.emptyMessage="No values"}return e.prototype.render=function(){return h("table",null,h("tbody",null,this.renderRows(this.items)))},e.prototype.onDelete=function(e){this.delete.emit(e)},e.prototype.getRow=function(e,t){var a=this;return h("tr",null,h("td",null,h("button",{"aria-label":this.buttonLabel+" "+e.key+", "+e.value,disabled:this.disabled||null,onClick:function(){return a.onDelete(t)},class:"dot-key-value__delete-button"},this.buttonLabel)),h("td",null,e.key),h("td",null,e.value))},e.prototype.renderRows=function(e){return this.isValidItems(e)?e.map(this.getRow.bind(this)):this.getEmptyRow()},e.prototype.getEmptyRow=function(){return h("tr",null,h("td",null,this.emptyMessage))},e.prototype.isValidItems=function(e){return Array.isArray(e)&&!!e.length},Object.defineProperty(e,"is",{get:function(){return"key-value-table"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{buttonLabel:{type:String,attr:"button-label",reflectToAttr:!0},disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},emptyMessage:{type:String,attr:"empty-message",reflectToAttr:!0},items:{type:"Any",attr:"items"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"delete",method:"delete",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),e}();export{DotKeyValueComponent as DotKeyValue,DotKeyValueComponent$1 as KeyValueForm,KeyValueTableComponent as KeyValueTable};