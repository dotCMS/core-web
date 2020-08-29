import*as tslib_1 from"../polyfills/tslib.js";import{h}from"../dotcmsfields.core.js";import{a as Fragment}from"./chunk-1d89c98b.js";import{a as getOriginalStatus,b as checkProp,c as getClassNames,h as getHintId,i as getErrorClass,d as getTagHint,e as getTagError,f as updateStatus,m as isStringType}from"./chunk-62cd3eff.js";import{a as createCommonjsModule,b as commonjsGlobal}from"./chunk-0e32e502.js";var autoComplete=createCommonjsModule(function(t,e){t.exports=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}var e={resultsList:"autoComplete_results_list",result:"autoComplete_result",highlight:"autoComplete_highlighted"},i=function(t){return"string"==typeof t?document.querySelector(t):t()},s=function(t){return t.innerHTML=""},n={getInput:i,createResultsList:function(t){var i=document.createElement("ul");return t.container&&(e.resultsList=t.container(i)||e.resultsList),i.setAttribute("id",e.resultsList),t.destination.insertAdjacentElement(t.position,i),i},highlight:function(t){return"<span class=".concat(e.highlight,">").concat(t,"</span>")},addResultsToList:function(t,i,s,n){i.forEach(function(s,r){var o=document.createElement("li");o.setAttribute("data-result",i[r].value[s.key]||i[r].value),o.setAttribute("class",e.result),o.setAttribute("tabindex","1"),o.innerHTML=n?n(s,o):s.match||s,t.appendChild(o)})},navigation:function(t,e){var s=i(t),n=e.firstChild;document.onkeydown=function(t){var i=document.activeElement;switch(t.keyCode){case 38:i!==n&&i!==s?i.previousSibling.focus():i===n&&s.focus();break;case 40:i===s&&e.childNodes.length>0?n.focus():i!==e.lastChild&&i.nextSibling.focus()}}},clearResults:s,getSelection:function(t,n,r,o){var a=n.querySelectorAll(".".concat(e.result));Object.keys(a).forEach(function(l){["mousedown","keydown"].forEach(function(u){a[l].addEventListener(u,function(a){"mousedown"!==u&&13!==a.keyCode&&39!==a.keyCode||(r({event:a,query:i(t).value,matches:o.matches,results:o.list.map(function(t){return t.value}),selection:o.list.find(function(t){return(t.value[t.key]||t.value)===a.target.closest(".".concat(e.result)).getAttribute("data-result")})}),s(n))})})})}};return function(){function e(t){!function(t,i){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this),this.selector=t.selector||"#autoComplete",this.data={src:function(){return"function"==typeof t.data.src?t.data.src():t.data.src},key:t.data.key},this.searchEngine="loose"===t.searchEngine?"loose":"strict",this.threshold=t.threshold||0,this.resultsList=n.createResultsList({container:!(!t.resultsList||!t.resultsList.container)&&t.resultsList.container,destination:t.resultsList&&t.resultsList.destination?t.resultsList.destination:n.getInput(this.selector),position:t.resultsList&&t.resultsList.position?t.resultsList.position:"afterend"}),this.sort=t.sort||!1,this.placeHolder=t.placeHolder,this.maxResults=t.maxResults||5,this.resultItem=t.resultItem,this.highlight=t.highlight||!1,this.onSelection=t.onSelection,this.init()}return i=e,(s=[{key:"search",value:function(t,e){var i=this.highlight,s=e.toLowerCase();if("loose"===this.searchEngine){t=t.replace(/ /g,"");for(var r=[],o=0,a=0;a<s.length;a++){var l=e[a];o<t.length&&s[a]===t[o]&&(l=i?n.highlight(l):l,o++),r.push(l)}return o===t.length&&r.join("")}if(s.includes(t))return t=new RegExp("".concat(t),"i").exec(e),i?e.replace(t,n.highlight(t)):e}},{key:"listMatchedResults",value:function(t){var e=this,i=[],s=n.getInput(this.selector).value.toLowerCase();t.filter(function(t,n){var r=function(r){var o=e.search(s,t[r]||t);o&&r?i.push({key:r,index:n,match:o,value:t}):o&&!r&&i.push({index:n,match:o,value:t})};if(e.data.key){var o=!0,a=!1,l=void 0;try{for(var u,c=e.data.key[Symbol.iterator]();!(o=(u=c.next()).done);o=!0){r(u.value)}}catch(t){a=!0,l=t}finally{try{o||null==c.return||c.return()}finally{if(a)throw l}}}else r()});var r=this.sort?i.sort(this.sort).slice(0,this.maxResults):i.slice(0,this.maxResults);return n.addResultsToList(this.resultsList,r,this.data.key,this.resultItem),n.navigation(this.selector,this.resultsList),{matches:i.length,list:r}}},{key:"ignite",value:function(t){var e=this,i=this.selector,s=n.getInput(i),r=this.placeHolder,o=this.onSelection;r&&s.setAttribute("placeholder",r),s.onkeyup=function(r){var a=e.resultsList;if(n.clearResults(a),s.value.length>e.threshold&&s.value.replace(/ /g,"").length){var l=e.listMatchedResults(t);s.dispatchEvent(new CustomEvent("type",{bubbles:!0,detail:{event:r,query:s.value,matches:l.matches,results:l.list},cancelable:!0})),o&&n.getSelection(i,a,o,l)}}}},{key:"init",value:function(){var t=this,e=this.data.src();e instanceof Promise?e.then(function(e){return t.ignite(e)}):this.ignite(e)}}])&&t(i.prototype,s),e;var i,s}()}()}),DotAutocompleteComponent=function(){function t(){this.disabled=!1,this.placeholder="",this.threshold=0,this.maxResults=0,this.debounce=300,this.data=null,this.id="autoComplete"+(new Date).getTime(),this.keyEvent={Enter:this.emitEnter.bind(this),Escape:this.clean.bind(this)}}return t.prototype.componentDidLoad=function(){this.data&&this.initAutocomplete()},t.prototype.render=function(){var t=this;return h("input",{autoComplete:"off",disabled:this.disabled||null,id:this.id,onBlur:function(e){return t.handleBlur(e)},onKeyDown:function(e){return t.handleKeyDown(e)},placeholder:this.placeholder||null})},t.prototype.watchThreshold=function(){this.initAutocomplete()},t.prototype.watchData=function(){this.initAutocomplete()},t.prototype.watchMaxResults=function(){this.initAutocomplete()},t.prototype.handleKeyDown=function(t){var e=this.getInputElement().value;e&&this.keyEvent[t.key]&&(t.preventDefault(),this.keyEvent[t.key](e))},t.prototype.handleBlur=function(t){var e=this;t.preventDefault(),setTimeout(function(){document.activeElement.parentElement!==e.getResultList()&&(e.clean(),e.lostFocus.emit(t))},0)},t.prototype.clean=function(){this.getInputElement().value="",this.cleanOptions()},t.prototype.cleanOptions=function(){this.getResultList().innerHTML=""},t.prototype.emitselect=function(t){this.clean(),this.selection.emit(t)},t.prototype.emitEnter=function(t){t&&(this.clean(),this.enter.emit(t))},t.prototype.getInputElement=function(){return this.el.querySelector("#"+this.id)},t.prototype.initAutocomplete=function(){var t=this;this.clearList(),new autoComplete({data:{src:function(){return tslib_1.__awaiter(t,void 0,void 0,function(){return tslib_1.__generator(this,function(t){return[2,this.getData()]})})}},sort:function(t,e){return t.match<e.match?-1:t.match>e.match?1:0},placeHolder:this.placeholder,selector:"#"+this.id,threshold:this.threshold,searchEngine:"strict",highlight:!0,maxResults:this.maxResults,debounce:this.debounce,resultsList:{container:function(){return t.getResultListId()},destination:this.getInputElement(),position:"afterend"},resultItem:function(t){return t.match},onSelection:function(e){var i=e.selection;e.event.preventDefault(),t.focusOnInput(),t.emitselect(i.value)}})},t.prototype.clearList=function(){var t=this.getResultList();t&&t.remove()},t.prototype.focusOnInput=function(){this.getInputElement().focus()},t.prototype.getResultList=function(){return this.el.querySelector("#"+this.getResultListId())},t.prototype.getResultListId=function(){return this.id+"_results_list"},t.prototype.getData=function(){return tslib_1.__awaiter(this,void 0,void 0,function(){var t,e,i;return tslib_1.__generator(this,function(s){switch(s.label){case 0:return(t=this.getInputElement()).setAttribute("placeholder","Loading..."),"function"!=typeof this.data?[3,2]:[4,this.data()];case 1:return i=s.sent(),[3,3];case 2:i=[],s.label=3;case 3:return e=i,t.setAttribute("placeholder",this.placeholder||""),[2,e]}})})},Object.defineProperty(t,"is",{get:function(){return"dot-autocomplete"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data",watchCallbacks:["watchData"]},debounce:{type:Number,attr:"debounce",reflectToAttr:!0},disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},el:{elementRef:!0},maxResults:{type:Number,attr:"max-results",reflectToAttr:!0,watchCallbacks:["watchMaxResults"]},placeholder:{type:String,attr:"placeholder",reflectToAttr:!0},threshold:{type:Number,attr:"threshold",reflectToAttr:!0,watchCallbacks:["watchThreshold"]}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"selection",method:"selection",bubbles:!0,cancelable:!0,composed:!0},{name:"enter",method:"enter",bubbles:!0,cancelable:!0,composed:!0},{name:"lostFocus",method:"lostFocus",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"dot-autocomplete input{-webkit-box-sizing:border-box;box-sizing:border-box;width:200px}dot-autocomplete ul{background-color:#fff;list-style:none;margin:0;max-height:300px;overflow:auto;padding:0;position:absolute;width:200px}dot-autocomplete ul li{background-color:#fff;border:1px solid #ccc;-webkit-box-sizing:border-box;box-sizing:border-box;cursor:pointer;padding:.25rem}dot-autocomplete ul li:first-child{border-top:1px solid #ccc}dot-autocomplete ul li:focus{background-color:#ffffe0;outline:0}dot-autocomplete ul li .autoComplete_highlighted{font-weight:700}"},enumerable:!0,configurable:!0}),t}(),DotChipComponent=function(){function t(){this.label="",this.deleteLabel="Delete",this.disabled=!1}return t.prototype.render=function(){var t=this,e=this.label?this.deleteLabel+" "+this.label:null;return h(Fragment,null,h("span",null,this.label),h("button",{type:"button","aria-label":e,disabled:this.disabled,onClick:function(){return t.remove.emit(t.label)}},this.deleteLabel))},Object.defineProperty(t,"is",{get:function(){return"dot-chip"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{deleteLabel:{type:String,attr:"delete-label",reflectToAttr:!0},disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},el:{elementRef:!0},label:{type:String,attr:"label",reflectToAttr:!0}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"remove",method:"remove",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"dot-chip span{margin-right:.25rem}dot-chip button{cursor:pointer}"},enumerable:!0,configurable:!0}),t}(),DotTagsComponent=function(){function t(){this.value="",this.data=null,this.name="",this.label="",this.hint="",this.placeholder="",this.required=!1,this.requiredMessage="This field is required",this.disabled=!1,this.threshold=0,this.debounce=300}return t.prototype.reset=function(){this.value="",this.status=getOriginalStatus(this.isValid()),this.emitChanges()},t.prototype.valueWatch=function(){this.value=checkProp(this,"value","string")},t.prototype.componentWillLoad=function(){this.status=getOriginalStatus(this.isValid()),this.validateProps(),this.emitStatusChange()},t.prototype.hostData=function(){return{class:getClassNames(this.status,this.isValid(),this.required)}},t.prototype.render=function(){var t=this;return h(Fragment,null,h("dot-label",{label:this.label,required:this.required,name:this.name},h("div",{"aria-describedby":getHintId(this.hint),tabIndex:this.hint?0:null,class:"dot-tags__container"},h("dot-autocomplete",{class:getErrorClass(this.status.dotValid),data:this.data,debounce:this.debounce,disabled:this.isDisabled(),onEnter:this.onEnterHandler.bind(this),onLostFocus:this.blurHandler.bind(this),onSelection:this.onSelectHandler.bind(this),placeholder:this.placeholder||null,threshold:this.threshold}),h("div",{class:"dot-tags__chips"},this.getValues().map(function(e){return h("dot-chip",{disabled:t.isDisabled(),label:e,onRemove:t.removeTag.bind(t)})})))),getTagHint(this.hint),getTagError(this.showErrorMessage(),this.getErrorMessage()))},t.prototype.addTag=function(t){var e=this.getValues();e.includes(t)||(e.push(t),this.value=e.join(","),this.updateStatus(),this.emitChanges())},t.prototype.blurHandler=function(){this.status.dotTouched||(this.status=updateStatus(this.status,{dotTouched:!0}),this.emitStatusChange())},t.prototype.emitChanges=function(){this.emitStatusChange(),this.emitValueChange()},t.prototype.emitStatusChange=function(){this.statusChange.emit({name:this.name,status:this.status})},t.prototype.emitValueChange=function(){this.valueChange.emit({name:this.name,value:this.value})},t.prototype.getErrorMessage=function(){return this.isValid()?"":this.requiredMessage},t.prototype.getValues=function(){return isStringType(this.value)?this.value.split(","):[]},t.prototype.isDisabled=function(){return this.disabled||null},t.prototype.isValid=function(){return!this.required||this.required&&!!this.value},t.prototype.onEnterHandler=function(t){var e=this,i=t.detail;(void 0===i?"":i).split(",").forEach(function(t){e.addTag(t.trim())})},t.prototype.onSelectHandler=function(t){var e=t.detail,i=(void 0===e?"":e).replace(","," ").replace(/\s+/g," ");this.addTag(i)},t.prototype.removeTag=function(t){var e=this.getValues().filter(function(e){return e!==t.detail});this.value=e.join(","),this.updateStatus(),this.emitChanges()},t.prototype.showErrorMessage=function(){return this.getErrorMessage()&&!this.status.dotPristine},t.prototype.updateStatus=function(){this.status=updateStatus(this.status,{dotTouched:!0,dotPristine:!1,dotValid:this.isValid()})},t.prototype.validateProps=function(){this.valueWatch()},Object.defineProperty(t,"is",{get:function(){return"dot-tags"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{data:{type:"Any",attr:"data"},debounce:{type:Number,attr:"debounce",reflectToAttr:!0},disabled:{type:Boolean,attr:"disabled",reflectToAttr:!0},el:{elementRef:!0},hint:{type:String,attr:"hint",reflectToAttr:!0},label:{type:String,attr:"label",reflectToAttr:!0},name:{type:String,attr:"name",reflectToAttr:!0},placeholder:{type:String,attr:"placeholder",reflectToAttr:!0},required:{type:Boolean,attr:"required",reflectToAttr:!0},requiredMessage:{type:String,attr:"required-message",reflectToAttr:!0},reset:{method:!0},status:{state:!0},threshold:{type:Number,attr:"threshold",reflectToAttr:!0},value:{type:String,attr:"value",reflectToAttr:!0,mutable:!0,watchCallbacks:["valueWatch"]}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"events",{get:function(){return[{name:"valueChange",method:"valueChange",bubbles:!0,cancelable:!0,composed:!0},{name:"statusChange",method:"statusChange",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return"dot-tags .dot-tags__container{display:-ms-flexbox;display:flex;-ms-flex-align:start;align-items:flex-start;border:1px solid #d3d3d3}dot-tags .dot-tags__container dot-autocomplete{margin:.5rem 1rem .5rem .5rem}dot-tags .dot-tags__container .dot-tags__chips{margin:.5rem 1rem 0 0}dot-tags .dot-tags__container dot-chip{border:1px solid #ccc;display:inline-block;margin:0 .5rem .5rem 0;padding:.2rem}dot-tags button{border:0}"},enumerable:!0,configurable:!0}),t}();export{DotAutocompleteComponent as DotAutocomplete,DotChipComponent as DotChip,DotTagsComponent as DotTags};