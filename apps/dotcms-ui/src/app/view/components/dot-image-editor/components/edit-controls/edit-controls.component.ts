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
  
  // Do not change url
  public noChangeUrl = ['cropX', 'cropY', 'fpX', 'fpY'];

  constructor(
    private storeImage: StoreImageService
  ) { }

  ngOnInit(): void {}

  changeURL(e: Event) {
    if (this.noChangeUrl.includes(e.target['id'])) {return;}
    this.storeImage.changeURL(this.params);
  }

  toggleFlip() {
    this.params.flip = (this.params.flip) ? '' : '1';
  }

  toggleCrop() {
    this.params.cropped = !this.params.cropped
  }
  
  restoreCrop() {
    this.params.cropped = true;
  }
}
