import { Component, OnInit } from '@angular/core';

// Services
import { StoreImageService } from './store-image.service';

// Models
import { Params } from './model/image-editor.model';

@Component({
  selector: 'dot-image-editor',
  templateUrl: './dot-image-editor.component.html',
  styleUrls: ['./dot-image-editor.component.scss']
})
export class DotImageEditorComponent implements OnInit {


  public editorState = this.storeImage.state;

  public params: Params = {
    brightness: '0',
    cropFlipRotate: '',
    crop    : '',
    cropX   : '',
    cropY   : '',
    format  : 'auto',
    fpX     : '500',
    fpY     : '500',
    hue     : '0', 
    quality : '100',
    resize  : '',
    rotate  : '0',
    flip    : '',
    cropped : false,
    saturation: '0',
  };

  constructor(
    private storeImage: StoreImageService
  ) { }

  ngOnInit(): void {
    this.storeImage.updateParams(this.params);
  }

}
