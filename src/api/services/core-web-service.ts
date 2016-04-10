import {Http, Response, Request, Headers} from 'angular2/http'
import {Observable} from 'rxjs/Rx'

import {
    hasContent, CwError, NETWORK_CONNECTION_ERROR, UNKNOWN_RESPONSE_ERROR,
    CLIENTS_ONLY_MESSAGES, SERVER_RESPONSE_ERROR
} from "../system/http-response-util";
import {ApiRoot} from "../persistence/ApiRoot";


export const RULE_CREATE = 'RULE_CREATE'
export const RULE_DELETE = 'RULE_DELETE'
export const RULE_UPDATE_NAME = 'RULE_UPDATE_NAME'
export const RULE_UPDATE_ENABLED_STATE = 'RULE_UPDATE_ENABLED_STATE'

export const V_RULE_UPDATE_EXPANDED_STATE = 'V_RULE_UPDATE_EXPANDED_STATE'

export const RULE_UPDATE_FIRE_ON = 'RULE_UPDATE_FIRE_ON'

export const RULE_RULE_ACTION_CREATE = 'RULE_RULE_ACTION_CREATE'
export const RULE_RULE_ACTION_DELETE = 'RULE_RULE_ACTION_DELETE'
export const RULE_RULE_ACTION_UPDATE_TYPE = 'RULE_RULE_ACTION_UPDATE_TYPE'
export const RULE_RULE_ACTION_UPDATE_PARAMETER = 'RULE_RULE_ACTION_UPDATE_PARAMETER'

export const RULE_CONDITION_GROUP_UPDATE_OPERATOR = 'RULE_CONDITION_GROUP_UPDATE_OPERATOR'
export const RULE_CONDITION_GROUP_DELETE = 'RULE_CONDITION_GROUP_DELETE'
export const RULE_CONDITION_GROUP_CREATE = 'RULE_CONDITION_GROUP_CREATE'

export const RULE_CONDITION_CREATE = 'RULE_CONDITION_CREATE'
export const RULE_CONDITION_DELETE = 'RULE_CONDITION_DELETE'
export const RULE_CONDITION_UPDATE_TYPE = 'RULE_CONDITION_UPDATE_TYPE'
export const RULE_CONDITION_UPDATE_PARAMETER = 'RULE_CONDITION_UPDATE_PARAMETER'
export const RULE_CONDITION_UPDATE_OPERATOR = 'RULE_CONDITION_UPDATE_OPERATOR'


export class CoreWebService {

  _apiRoot:ApiRoot
  _http:Http
  constructor( _apiRoot:ApiRoot, _http:Http){
    this._apiRoot = _apiRoot
    this._http = _http

  }

  request(options:any):Observable<any> {
    let headers:Headers = this._apiRoot.getDefaultRequestHeaders()
    let tempHeaders = options.headers ? options.headers : {"Content-Type": "application/json"}
    Object.keys(tempHeaders).forEach((key)=>{
      headers.set(key, tempHeaders[key])
    })
    var source = options.body
    if (options.body) {
      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }
    }
    options.headers = headers

    var request = new Request(options)
    return this._http.request(request)
        .map((resp:Response) => {
          return hasContent(resp) ? resp.json() : resp
        })
        .catch((response:Response, original:Observable<any>):Observable<any> => {
          if (response) {
            if (response.status === 500) {
              if (response.text() && response.text().indexOf("ECONNREFUSED") >= 0) {
                throw new CwError(NETWORK_CONNECTION_ERROR, CLIENTS_ONLY_MESSAGES[NETWORK_CONNECTION_ERROR], request, response, source)
              } else {
                throw new CwError(SERVER_RESPONSE_ERROR, response.headers.get('error-message'), request, response, source)
              }
            }
            else if (response.status === 403) {
              console.error("Could not execute request: 403 user not authorized", options.url)
              throw new CwError(UNKNOWN_RESPONSE_ERROR, response.headers.get('error-message'), request, response, source)
            }
            else if (response.status === 404) {
              console.error("Could not execute request: 404 path not valid.", options.url)
              throw new CwError(UNKNOWN_RESPONSE_ERROR, response.headers.get('error-message'), request, response, source)
            } else {
              console.log("Could not execute request: Response status code: ", response.status, 'error:', response, options.url)
              throw new CwError(UNKNOWN_RESPONSE_ERROR, response.headers.get('error-message'), request, response, source)
            }
          }
          return null
        })
  }
}

