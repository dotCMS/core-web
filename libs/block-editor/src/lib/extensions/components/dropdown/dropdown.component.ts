import { Component, EventEmitter, Output, ViewChild, Input, ElementRef } from '@angular/core';

// Interfaces
import { SuggestionsCommandProps, SuggestionsComponent } from '../suggestions/suggestions.component';
import { MenuActionProps } from '../bubble-menu/bubble-menu.component';

@Component({
  selector: 'dotcms-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

  @Input() editorParent: Element;
  @Output() changeTo = new EventEmitter<MenuActionProps>();
  @ViewChild('suggestionsComponent') suggestionsComponent: SuggestionsComponent;
  @ViewChild('div') div: ElementRef<HTMLElement>;

  public optionsTitle = 'Change to';
  public title = 'Paragraph'
  public show = false;
  
  toggleShow() {
    this.show = !this.show;
    if( this.show ) {
      setTimeout(() => this.initSuggestionsComponent());
    }
  }

  hide() {
    this.show = false;
    console.log('HEY?');
  }

  onSelection(item: SuggestionsCommandProps) {
    this.show = false;
    this.optionsTitle = item.type.name;
    this.changeTo.emit({
      payload: item.payload,
      type: item.type.name,
      level: item.type.level
    });
  }

  initSuggestionsComponent(){ 
    this.suggestionsComponent.setFirstItemActive();
    this.setListPostion();
  }


  setListPostion() {
    const { bottom: parentBotton } = this.editorParent.getBoundingClientRect();
    const { bottom: listBotton } = this.div.nativeElement.getBoundingClientRect();
    if ( parentBotton < listBotton ) {
      this.div.nativeElement.classList.add('options-up');
    } else {
      this.div.nativeElement.classList.remove('options-up');
    } 
  }

  onKeyDown(event: KeyboardEvent) {
    const { key } = event;

    if(!this.show) {
      return false;
    }

    if (key === 'Escape') {
      this.show = false;
      return true;
    }
    if (key === 'Enter') {
      this.suggestionsComponent.execCommand();
      return true;
    }
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      this.suggestionsComponent.updateSelection(event);
      return true;
    }

    return false;
  }

}
