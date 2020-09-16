const t=window.dotcmsFields.h;import{a as e}from"./chunk-1d89c98b.js";import{a as s,b as a,c as i,h as r,i as h,k as l,d as u,e as d,f as n}from"./chunk-62cd3eff.js";import{a as o,b as c}from"./chunk-4205a04e.js";class g{constructor(){this.value="",this.name="",this.label="",this.placeholder="",this.hint="",this.required=!1,this.requiredMessage="This field is required",this.validationMessage="The field doesn't comply with the specified format",this.disabled=!1,this.regexCheck="",this.type="text"}reset(){this.value="",this.status=s(this.isValid()),this.emitStatusChange(),this.emitValueChange()}componentWillLoad(){this.validateProps(),this.status=s(this.isValid()),this.emitStatusChange()}componentDidLoad(){const t=this.el.querySelector("input");setTimeout(()=>{const e=o(Array.from(this.el.attributes),[]);c(t,e)},0)}regexCheckWatch(){this.regexCheck=a(this,"regexCheck")}typeWatch(){this.type=a(this,"type")}hostData(){return{class:i(this.status,this.isValid(),this.required)}}render(){return t(e,null,t("dot-label",{label:this.label,required:this.required,name:this.name},t("input",{"aria-describedby":r(this.hint),class:h(this.status.dotValid),disabled:this.disabled||null,id:l(this.name),onBlur:()=>this.blurHandler(),onInput:t=>this.setValue(t),placeholder:this.placeholder,required:this.required||null,type:this.type,value:this.value})),u(this.hint),d(this.shouldShowErrorMessage(),this.getErrorMessage()))}validateProps(){this.regexCheckWatch(),this.typeWatch()}isValid(){return!this.isValueRequired()&&this.isRegexValid()}isValueRequired(){return this.required&&!this.value}isRegexValid(){return!this.regexCheck||!this.value||new RegExp(this.regexCheck).test(this.value)}shouldShowErrorMessage(){return this.getErrorMessage()&&!this.status.dotPristine}getErrorMessage(){return this.isRegexValid()?this.isValid()?"":this.requiredMessage:this.validationMessage}blurHandler(){this.status.dotTouched||(this.status=n(this.status,{dotTouched:!0}),this.emitStatusChange())}setValue(t){this.value=t.target.value.toString(),this.status=n(this.status,{dotTouched:!0,dotPristine:!1,dotValid:this.isValid()}),this.emitValueChange(),this.emitStatusChange()}emitStatusChange(){this.statusChange.emit({name:this.name,status:this.status})}emitValueChange(){this.valueChange.emit({name:this.name,value:this.value})}static get is(){return"dot-textfield"}static get properties(){return{disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0,mutable:!0},el:{elementRef:!0},hint:{type:String,attr:"hint",reflectToAttr:!0},label:{type:String,attr:"label",reflectToAttr:!0},name:{type:String,attr:"name"},placeholder:{type:String,attr:"placeholder",reflectToAttr:!0,mutable:!0},regexCheck:{type:String,attr:"regex-check",reflectToAttr:!0,mutable:!0,watchCallbacks:["regexCheckWatch"]},required:{type:Boolean,attr:"required",reflectToAttr:!0,mutable:!0},requiredMessage:{type:String,attr:"required-message"},reset:{method:!0},status:{state:!0},type:{type:String,attr:"type",reflectToAttr:!0,mutable:!0,watchCallbacks:["typeWatch"]},validationMessage:{type:String,attr:"validation-message"},value:{type:String,attr:"value",mutable:!0}}}static get events(){return[{name:"valueChange",method:"valueChange",bubbles:!0,cancelable:!0,composed:!0},{name:"statusChange",method:"statusChange",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return"input{outline:none}"}}export{g as DotTextfield};