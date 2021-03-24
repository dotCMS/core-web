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
    cropFlipRotate: '',
    format: 'auto',
    fp: '',
    HBS: '',
    brightness: '',
    hue: '', 
    saturation: '',
    quality: '',
    resize: '',
  };

  constructor(
    private storeImage: StoreImageService
  ) { 
    console.log('Constructor');
    // this.storeImage.changeParams(this.params);
  }

  ngOnInit(): void {
    console.log('Init');
    this.storeImage.updateParams(this.params);
  }

}
