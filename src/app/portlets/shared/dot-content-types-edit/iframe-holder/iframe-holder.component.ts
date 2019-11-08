import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';

@Component({
    selector: 'dot-iframe-holder',
    templateUrl: './iframe-holder.component.html',
    styleUrls: ['./iframe-holder.component.scss']
})
export class IframeHolderComponent implements OnInit {
    @Input() content: string;
    @Output() valueChange: EventEmitter<any> = new EventEmitter();
    @ViewChild('iframeDojo') iframeElement: HTMLIFrameElement;
    encodedContent;
    constructor() {}

    ngOnInit() {


    }

    loadContet(event: Event): void {
        const iframe: HTMLIFrameElement = event.currentTarget as HTMLIFrameElement;
                iframe.contentDocument.open();
        iframe.contentDocument
            .write(`<script type="text/javascript" src="/html/js/dojo/custom-build/dojo/dojo.js?b=5.0.0"></script><link rel="stylesheet" type="text/css" href="/html/js/dojo/custom-build/dijit/themes/dijit.css"><link rel="stylesheet" type="text/css" href="/html/css/dijit-dotcms/dotcms.css?b=5.0.0"> <script>require(["dojo/parser"], function(parser){
  });  dojo.require("dijit.form.Button");</script>
<select name="select1" data-dojo-type="dijit/form/Select" onChange="emitEvent(this)">
    <option value="TN">Tennessee</option>
    <option value="VA" selected="selected">Virginia</option>
    <option value="WA">Washington</option>
    <option value="FL">Florida</option>
    <option value="CA">California</option>
</select>
<script>
    dojo.parser.parse(document)
    
    function emitEvent(select) {
                var event = new CustomEvent('valueChange', { 'detail': { 'name': 'state', 'value': select.value}});
                document.dispatchEvent(event);
            }
            
            
            document.addEventListener("valueChange", proceess);

            function proceess(event){
                console.log('value from IFRAME', event.detail);
            }
    
    </script>`);
        iframe.contentDocument.close();

        iframe.contentDocument.addEventListener('valueChange', (event: CustomEvent) => {
            this.valueChange.emit(event.detail);
            //document.dispatchEvent(event);
        });

    }


    //his.valueChange.emit($event);
}
