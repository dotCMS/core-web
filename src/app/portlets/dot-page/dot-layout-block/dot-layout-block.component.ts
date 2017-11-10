import { Component, OnInit } from '@angular/core';
import {DotConfirmationService} from '../../../api/services/dot-confirmation/dot-confirmation.service';

@Component({
  selector: 'dot-layout-block',
  templateUrl: './dot-layout-block.component.html',
  styleUrls: ['./dot-layout-block.component.scss']
})
export class DotLayoutBlockComponent implements OnInit {

  constructor(private dotConfirmationService: DotConfirmationService) { }

  ngOnInit() {
  }

  removeBlock($event) : void{
      console.log('Block removed')  ;
      $event.stopPropagation();
      this.dotConfirmationService.confirm({
          accept: () => {
          },
          header: `${'Delete MOCK'} ${'MOCK 2'}`,
          message: `${'Mock Message'} ${'Mock Message 2'}`,
          footerLabel: {
              acceptLabel: 'Delete Mock',
              rejectLabel: 'Cancel Mock'
          }
      });
  }

}
