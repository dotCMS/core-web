import { Injectable } from '@angular/core';
import { CoreWebService } from '../services/core-web-service';
import { Http, RequestMethod, Jsonp } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

let md5 = require('md5');

@Injectable()
export class GravatarService {

    constructor(private jsonp: Jsonp) {
    }

    // loadGravatarProfile(email): Observable<any> {
    //     return this.coreWebService.request({
    //         method: RequestMethod.Get,
    //         url: `https://www.gravatar.com/${md5(email)}.json`
    //     });
    // }

    loadGravatarProfile(email): Observable<any[]> {
        // const _email = md5('woon.tsou@dotcms.com');
        console.log('-----------------+++++++++++++++++==================');
        console.log(email);
        return this.jsonp.get(`http://www.gravatar.com/${email}.json?callback=JSONP_CALLBACK`).map(data => data.json());
    }

}
