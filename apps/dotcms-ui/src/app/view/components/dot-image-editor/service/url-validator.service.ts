import { Injectable } from '@angular/core';

// MODELS
import { Params } from '../model/image-editor.model';

@Injectable({
  providedIn: 'root'
})
export class UrlValidatorService {

  // constructor() { }

  buildULR(params: Params) {  
    const cropFlipRotate = this.buildCropFlipRotate({ ...params });
    const HBS    = this.buildHBS({ ...params });
    const format = this.buildFormatQuality({ ...params });
    const crop   = this.buildCrop({ ...params });
    const resize = this.buildResize({ ...params });

    return resize + crop + cropFlipRotate + HBS + format;
  }

  buildHBS({hue, saturation, brightness}) {
    return `/hsb_h/${hue}/hsb_s/${saturation}/hsb_b/${brightness}`;
  }

  buildResize({ resize }) {
    return (resize)?`/resize_w/${resize}`:'';
  }

  buildFormatQuality({format, quality}) {
    return (format != 'filter/Png') ? `/${format}_q/${quality}` : `/${format}`;
  }
  
  buildCrop({ cropX, cropY, fpX, fpY}) {
    const x = this.scale(fpX, 0, 1000, 0, 1).toFixed(2);
    const y = this.scale(fpY, 0, 1000, 0, 1).toFixed(2);
    return (cropX && cropY)?`/crop_w/${cropX}/crop_h/${cropY}/fp/${x},${y}`: '';
  }
  buildCropFlipRotate({rotate}) {
    
    return `/rotate_a/${rotate}/flip_flip/1`;
  }


  // scale params
  scale = (num, in_min, in_max, out_min, out_max)=>{
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  

}
