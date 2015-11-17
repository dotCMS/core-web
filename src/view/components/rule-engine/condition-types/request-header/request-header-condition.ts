

/**
 * Check for the presence and value of a header on the user's request.
 *
 * Express a condition based on two fields: a Header, and a Header Comparison
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_header_fields#Request_fields
 * @see https://tools.ietf.org/html/rfc7231#section-5
 * @see http://www.iana.org/assignments/message-headers/message-headers.xml#perm-headers
 *
 *
 * ## POSIX Utility Argument Syntax (http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)
 * ```
 * cw-request-header [-n][-h header_key] [-c comparator] [comparison_values...]
 *   -n                      Negate the match.
 *   -h                      The exact key to search for. Case sensitive.
 *   -e                      Exists. Only verify that the header exists on the Request. The value may be empty or nonsensical.
 *   -c                      The comparator id. One of [ exists, is, startsWith, endsWith, contains, regex]
 *   comparison_values       One or more values compare against the header value.
 * ```
 *
 * ## UI Layout
 *
 * Conceptually the conditionlet is made up of three fields:
 * ```
 * <div>
 *   <input-select-one name="header_key" required="true"/>
 *   <select-one name="comparator" />
 *   <input-select-many name="comparison_values" required="true" />
 * </div>
 * ```
 * ### Fields
 *
 * #### `header_key`
 * The `header_key` is a `select`, pre-populated with common Request header keys. See the Wikipedia.org or iana.org
 * links for more details. There is also an associated text input box that allows custom header keys to be specified.
 *
 * #### `comparator`
 * A standard `select` element containing the allowed comparator ids. One of [ exists, is, startsWith, endsWith, contains, regex].
 * When the selected value is 'exists' the `comparison_values` UI field will be hidden and its model value cleared.
 *
 * #### `comparison_values`
 * Multiple comparison values may be set. Each value shall be specified as per rfc7231#section-5. The UI will
 * **temporarily** add manually keyed inputs into the list of `select` options, negating the need to concern the
 * end user with character escape syntax etc.
 *
 *
 * ------------------------ Discussion ------------------------
 *
 * --------------------------
 */

import {Component, View, Attribute, EventEmitter, NgFor, NgIf, Inject} from 'angular2/angular2';
import {Dropdown, DropdownModel, DropdownOption} from '../../../../../view/components/semantic/modules/dropdown/dropdown'
import {InputText, InputTextModel} from "../../../semantic/elements/input-text/input-text";
import {RequestHeaderConditionletProvider} from '../../../../../api/system/ruleengine/conditionlets/RequestHeaderConditionletProvider'

export class RequestHeaderConditionModel {
  parameterKeys:Array<string> = ['headerKeyValue', 'compareTo']
  headerKeyValue:string
  comparatorValue:string
  compareTo:string

  constructor(headerKeyValue:string = null, comparatorValue:string = null, compareTo:string = '') {
    this.headerKeyValue = headerKeyValue
    this.comparatorValue = comparatorValue
    this.compareTo = compareTo
  }

  clone():RequestHeaderConditionModel {
    return new RequestHeaderConditionModel(this.headerKeyValue, this.comparatorValue, this.compareTo)
  }
}

@Component({
  selector: 'cw-request-header-condition',
  properties: [
    "headerKeyValue", "comparatorValue", "parameterValues"
  ],
  events: [
    "change"
  ]
})
@View({
  directives: [NgFor, Dropdown, InputText],
  template: `<div flex layout="row" layout-align="start-center" class="cw-condition-component-body">
  <cw-input-dropdown flex="40"
                     class="cw-input"
                     [model]="headerKeyDropdown"
                     (change)="handleHeaderKeyChange($event)"></cw-input-dropdown>
  <cw-input-dropdown flex="initial"
                     class="cw-input cw-comparator-selector"
                     [model]="comparatorDropdown"
                     (change)="handleComparatorChange($event)"></cw-input-dropdown>
  <cw-input-text flex="grow"
                 layout-fill
                 class="cw-input"
                 (change)="handleCompareToChange($event)"
                 [model]="requestHeaderInputTextModel">
  </cw-input-text>
</div>`
})
export class RequestHeaderCondition {
  // @todo populate the comparisons options from the server.
  comparisonOptions:Array<DropdownOption> = [
    new DropdownOption("exists", "exists", "Exists"),
    new DropdownOption("is", "is", "Is"),
    new DropdownOption("is not", "is not", "Is Not"),
    new DropdownOption("startsWith", "startsWith", "Starts With"),
    new DropdownOption("endsWith", "endsWith", "Ends With"),
    new DropdownOption("contains", "contains", "Contains"),
    new DropdownOption("regex", "regex", "Regex")];

  value:RequestHeaderConditionModel;

  change:EventEmitter;
  private headerKeyDropdown:DropdownModel
  private comparatorDropdown:DropdownModel

  private requestHeaderInputTextModel: InputTextModel

  constructor(@Attribute('header-key-value') headerKeyValue:string,
              @Attribute('comparatorValue') comparatorValue:string,
              @Attribute('parameterValues') parameterValues:Array<string>,
              @Inject(RequestHeaderConditionletProvider) conditionletProvider:RequestHeaderConditionletProvider) {

    this.value = new RequestHeaderConditionModel(headerKeyValue, comparatorValue)
    this.change = new EventEmitter();
    this.comparatorDropdown = new DropdownModel("comparator", "Comparison", ["is"], [])

    this.headerKeyDropdown = new DropdownModel("headerKey", "Header Key", [], [])

    this.requestHeaderInputTextModel = new InputTextModel()
    this.requestHeaderInputTextModel.placeholder = "Enter a value"

    conditionletProvider.promise.then(()=> {
      var inputs = conditionletProvider.inputs
      var comparisons = conditionletProvider.comparisons

      let headerKeyOptions = []
      inputs.forEach((input)=> {
        headerKeyOptions.push(new DropdownOption(input.id, input.id, input.label))
      })
      this.headerKeyDropdown.addOptions(headerKeyOptions)

      let comparisonsOptions = []
      comparisons.forEach((comparison)=> {
        comparisonsOptions.push(new DropdownOption(comparison.id, comparison.id, comparison.label))
      })
      this.comparatorDropdown.addOptions(comparisonsOptions)
    })
  }

  set headerKeyValue(value:string) {
    this.value.headerKeyValue = value
    this.headerKeyDropdown.selected = [value]
  }

  set compareTo(value:string) {
    this.value.compareTo = value
    this.requestHeaderInputTextModel.value = value
  }

  set comparatorValue(value:string) {
    this.value.comparatorValue = value
    this.comparatorDropdown.selected = [value]
  }

  set parameterValues(value:any) {
    this.value.parameterKeys.forEach((paramKey)=> {
      let v = value[paramKey]
      v = v ? v.value : ''
      this[paramKey] = v
    })
  }

  private getEventValue():Array<any>{
    let eventValue = []
    this.value.parameterKeys.forEach((key)=>{
      eventValue.push({key: key, value:this.value[key]})
    })
    return eventValue
  }

  handleComparatorChange(event:any) {
    let value = event.value
    this.value.comparatorValue = value
    this.change.next({type:'comparisonChange', target:this, value:value})
  }

  handleHeaderKeyChange(event:any) {
    this.value.headerKeyValue = event.value
    this.change.next({type:'parameterValueChange', target: this, value: this.getEventValue()})
  }

  handleCompareToChange(event:any) {
    this.value.compareTo = event.target.value
    this.requestHeaderInputTextModel.value = event.target.value
    this.change.next({type:'parameterValueChange', target:this, value:this.getEventValue()})
  }

}
