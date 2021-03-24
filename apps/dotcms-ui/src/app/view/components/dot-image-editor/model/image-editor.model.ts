

export interface EditorState{
  params : Params,
  url    : string,
  loading: boolean,
}

export interface Params{
  brightness    : string,
  cropFlipRotate: string,
  format  : string,
  fp      : string,
  HBS     : string,
  hue     : string,
  quality : string,
  resize  : string,
  saturation    : string,
}