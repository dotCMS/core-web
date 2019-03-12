import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'dot-keyvalue-row',
  templateUrl: './dot-keyvalue-row.component.html',
  styleUrls: ['./dot-keyvalue-row.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DotKeyvalueRowComponent implements OnInit {
    @Input()
    rowData;
    @Input()
    variableIndex: number;
    @Input()
    labels;
  constructor() { }

  ngOnInit() {
  }

}
