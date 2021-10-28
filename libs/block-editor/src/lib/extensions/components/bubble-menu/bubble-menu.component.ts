import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dotcms-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.scss']
})
export class BubbleMenuComponent implements OnInit {

  @Input() execMark: (item: any) => void;

  public items = [];

  ngOnInit(): void {
    this.items = [{
      icon: 'format_bold',
      mark: 'bold'
    },{
      icon: 'format_underlined',
      mark: 'underline'
    },{
      icon: 'format_italic',
      mark: 'italic'
    },{
      icon: 'strikethrough_s',
      mark: 'strike'
    },{
      icon: 'format_clear',
      mark: 'clearAll'
    }];
  }

  command(item: any): void {
    this.execMark(item);
  }
}
