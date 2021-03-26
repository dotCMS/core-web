

export interface EditorState{
  params : Params,
  url    : string,
  loading: boolean,
}

export interface Params{
  brightness    : string,
  cropFlipRotate: string,
  cropped : boolean,
  crop    : string,
  cropX   : string,
  cropY   : string,
  flip    : string,
  format  : string,
  fpX     : string,
  fpY     : string,
  hue     : string,
  quality : string,
  resize  : string,
  rotate  : string,
  saturation: string,
}