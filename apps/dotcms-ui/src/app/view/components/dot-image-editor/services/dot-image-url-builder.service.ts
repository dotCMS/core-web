import { Injectable } from '@angular/core';

// MODELS
import { Params } from '../model/image-editor.model';

@Injectable({
  providedIn: 'root'
})
export class DotImageUrlBuilder {

  public rotateControler = '';
  public flipControler = '0';
  public crop = '';
  
  // constructor() { }

  buildULR(params: Params) {  
    params.crop   = (params.crop.length > 0)?'': this.buildCrop({ ...params });
    params.cropFlipRotate =  this.buildCropFlipRotate({...params});
    const HBS    = this.buildHBS({ ...params });
    const format = this.buildFormatQuality({ ...params });
    const resize = this.buildResize({ ...params });

    params.cropped = false;

    return resize + params.cropFlipRotate + HBS + format;
  }

  buildHBS({hue, saturation, brightness}) {
    return (hue != 0 || saturation != 0 || brightness != 0) ? `/hsb_h/${hue}/hsb_s/${saturation}/hsb_b/${brightness}`:'';
  }

  buildResize({ resize }) {
    return (resize)?`/resize_w/${resize}`:'';
  }

  buildFormatQuality({format, quality}) {
    return (format != 'filter/Png') ? `/${format}_q/${quality}` : `/${format}`;
  }
  
  buildCrop({ cropX, cropY, fpX, fpY}) {
    const x = this.scale(fpX, 0, 1000, 0, 1).toFixed(2),
    y       = this.scale(fpY, 0, 1000, 0, 1).toFixed(2);
    return (cropX && cropY)?`/crop_w/${cropX}/crop_h/${cropY}/fp/${x},${y}`: '';
  }

  buildCropFlipRotate({cropped, crop, rotate, flip, cropFlipRotate}) {
    if (cropped) {
      cropFlipRotate = cropFlipRotate.replace(`${this.crop}`, '');
      cropFlipRotate += crop;
      this.crop = crop;
    }

    if (rotate != this.rotateControler) {
      cropFlipRotate = cropFlipRotate.replace(`/rotate_a/${this.rotateControler}`, '');
      cropFlipRotate += (+rotate == 0) ? '' : `/rotate_a/${rotate}`;
      this.rotateControler = rotate;
    }

    if (flip != this.flipControler) { 
      cropFlipRotate = cropFlipRotate.replace('/flip_flip/1', '');
      cropFlipRotate += (+flip != 0)? '/flip_flip/1': '';
      this.flipControler = flip;
    }

    return cropFlipRotate;
  }

  // scale params
  scale = (num, in_min, in_max, out_min, out_max)=>{
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  

}
