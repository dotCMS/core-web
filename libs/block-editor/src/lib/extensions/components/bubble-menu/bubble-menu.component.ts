import { Component, Input } from '@angular/core';

export interface BubbleMenuItem {
  icon: string;
  markAction: string;
  active: boolean;
}

@Component({
  selector: 'dotcms-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.scss']
})
export class BubbleMenuComponent {

  @Input() execMark: (item: BubbleMenuItem) => void;
  @Input() activeMarks: string[] = [];

  public items: BubbleMenuItem[] = [
    {
      icon: 'format_bold',
      markAction: 'bold',
      active: false
    },
    {
      icon: 'format_underlined',
      markAction: 'underline',
      active: false
    },
    {
      icon: 'format_italic',
      markAction: 'italic',
      active: false
    },
    {
      icon: 'strikethrough_s',
      markAction: 'strike',
      active: false
    },
    {
      icon: 'format_clear',
      markAction: 'clearAll',
      active: false
    },
    {
      icon: 'format_align_left',
      markAction: 'left',
      active: false
    },
    {
      icon: 'format_align_center',
      markAction: 'center',
      active: false
    },
    {
      icon: 'format_align_right',
      markAction: 'right',
      active: false
    },
    {
      icon: 'format_list_bulleted',
      markAction: 'bulletList',
      active: false
    },
    {
      icon: 'format_list_numbered',
      markAction: 'orderedList',
      active: false
    }
  ];

  /**
   *
   *
   * @param {BubbleMenuItem} item
   * @memberof BubbleMenuComponent
   */
  command(item: BubbleMenuItem): void {
    this.execMark(item);
  }

  /**
   *
   * Prevent De-Selection text when click on the bubble menu
   * @param {MouseEvent} event
   * @memberof BubbleMenuComponent
   */
  preventDeSelection(event: MouseEvent): void {
    event.preventDefault();
  }

  updateActiveItems(): void {
    this.items.forEach((item) => {
      if(this.activeMarks.includes(item.markAction)) {
        item.active = true;
      } else {
        item.active = false;
      }
    })
  }
}
