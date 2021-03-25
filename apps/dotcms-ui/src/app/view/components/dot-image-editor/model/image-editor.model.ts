

export interface EditorState{
  params : Params,
  url    : string,
  loading: boolean,
}

export interface Params{
  brightness    : string,
  cropFlipRotate: string,
  format  : string,
  hue     : string,
  quality : string,
  resize  : string,
  cropX   : string,
  cropY   : string,
  fpX     : string,
  fpY     : string,
  rotate  : string,
  saturation    : string,
}