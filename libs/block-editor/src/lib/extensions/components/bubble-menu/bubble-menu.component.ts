import { Component, Input } from '@angular/core';

export interface BubbleMenuItem {
  icon: string;
  markAction: string;
}

@Component({
  selector: 'dotcms-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.scss']
})
export class BubbleMenuComponent {

  @Input() execMark: (item: BubbleMenuItem) => void;
  @Input() activeMarks: string[] = [];

  public items = [
    {
      icon: 'format_bold',
      markAction: 'bold'
    },
    {
      icon: 'format_underlined',
      markAction: 'underline'
    },
    {
      icon: 'format_italic',
      markAction: 'italic'
    },
    {
      icon: 'strikethrough_s',
      markAction: 'strike'
    },
    {
      icon: 'format_clear',
      markAction: 'clearAll'
    },
    {
      icon: 'format_align_left',
      markAction: 'left'
    },
    {
      icon: 'format_align_center',
      markAction: 'center'
    },
    {
      icon: 'format_align_right',
      markAction: 'right'
    },
    {
      icon: 'format_list_bulleted',
      markAction: 'bulletList'
    },
    {
      icon: 'format_list_numbered',
      markAction: 'orderedList'
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
}
