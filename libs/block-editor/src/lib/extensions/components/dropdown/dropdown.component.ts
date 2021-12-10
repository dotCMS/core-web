import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// Interfaces
import { SuggestionsCommandProps } from '../suggestions/suggestions.component';
import { MenuActionProps } from '../bubble-menu/bubble-menu.component';

@Component({
  selector: 'dotcms-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  public optionsTitle = 'Change to';
  public title = 'Paragraph'
  public show = false;

  @Output() changeTo = new EventEmitter<MenuActionProps>();

  constructor() { 
    console.log('Constructor');
  }

  ngOnInit(): void {
    console.log('Init');
  }

  onSelection(item: SuggestionsCommandProps) {
    this.optionsTitle = item.type.name;
    this.show = false;
    this.changeTo.emit({
      payload: item.payload,
      type: item.type.name,
      level: item.type.level
    });
  }

}
