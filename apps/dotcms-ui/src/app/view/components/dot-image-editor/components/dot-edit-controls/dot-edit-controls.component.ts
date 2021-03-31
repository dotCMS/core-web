import { Component, Input } from '@angular/core';

// Services
import { DotStoreImageService } from '../../dot-store-image.service';

// Models
import { Params } from '../../model/image-editor.model';

@Component({
  selector: 'dot-edit-controls',
  templateUrl: './dot-edit-controls.component.html',
  styleUrls: ['./dot-edit-controls.component.scss']
})
export class DotEditControlsComponent {

  @Input() params: Params;
  
  public formatOption = [
    { label: 'Auto', value: 'auto' },
    { label: 'png', value: 'Png' },
    { label: 'jpeg', value: 'jpeg' },
    { label: 'jpegp', value: 'jpegp' },
    { label: 'webp', value: 'webp' },
  ];
  public val = 0;
  // Do not change url
  public noChangeUrl = ['cropX', 'cropY', 'fpX', 'fpY'];

  constructor(
    private storeImage: DotStoreImageService
  ) { }

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
