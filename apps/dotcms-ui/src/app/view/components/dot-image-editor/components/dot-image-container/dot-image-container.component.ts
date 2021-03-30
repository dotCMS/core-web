import { Component } from '@angular/core';

import { DotStoreImageService } from '../../dot-store-image.service';

@Component({
  selector: 'dot-image-container',
  templateUrl: './dot-image-container.component.html',
  styleUrls: ['./dot-image-container.component.scss']
})
export class DotImageContainerComponent {
  
  public editorState = this.storeImage.state;

  BASEURL = 'https://demo.dotcms.com/contentAsset/image/f67e0a14-b16b-47fc-ae5c-f711333b04c1/image'

  constructor(
    private storeImage: DotStoreImageService
  ) { }
  
}
