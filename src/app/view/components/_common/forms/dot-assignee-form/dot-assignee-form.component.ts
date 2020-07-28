import {Component, EventEmitter, OnInit, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'dot-assignee-form',
  templateUrl: './dot-assignee-form.component.html',
  styleUrls: ['./dot-assignee-form.component.scss']
})
export class DotAssigneeFormComponent implements OnInit {


    @Output() value = new EventEmitter<{ [key: string]: string }>();


  constructor() { }

  ngOnInit() {
  }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
    }

}
