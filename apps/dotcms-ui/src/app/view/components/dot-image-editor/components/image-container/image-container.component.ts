import { Component } from '@angular/core';

import { StoreImageService } from '../../store-image.service';

@Component({
  selector: 'dot-image-container',
  templateUrl: './image-container.component.html',
  styleUrls: ['./image-container.component.scss']
})
export class ImageContainerComponent {
  
  public editorState = this.storeImage.state;

  BASEURL = 'https://demo.dotcms.com/contentAsset/image/f67e0a14-b16b-47fc-ae5c-f711333b04c1/image'

  constructor(
    private storeImage: StoreImageService
  ) { }
  
}
