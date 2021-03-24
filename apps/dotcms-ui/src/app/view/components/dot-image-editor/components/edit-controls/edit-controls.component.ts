import { Component, OnInit, Input } from '@angular/core';

// Services
import { StoreImageService } from '../../store-image.service';

// Models
import { Params } from '../../model/image-editor.model';

@Component({
  selector: 'dot-edit-controls',
  templateUrl: './edit-controls.component.html',
  styleUrls: ['./edit-controls.component.scss']
})
export class EditControlsComponent implements OnInit {

  @Input() params: Params;

  constructor(
    private storeImage: StoreImageService
  ) { }

  ngOnInit(): void {
    console.log('Init - Component')
  }

  changeURL() {
    this.storeImage.changeURL(this.params);
  }

  setFocalPoint() {
    console.log('Here');
    this.params.fp = '50|50'
  }


}
