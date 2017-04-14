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

    loadGravatarProfile(hash): Observable<any> {

        return this.jsonp.get(`http://www.gravatar.com/${hash}.json?callback=JSONP_CALLBACK`)
                            .map(data => data.json());
    }
}
