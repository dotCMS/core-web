import { ResponseView } from 'dotcms-js';
import { HttpResponse, HttpHeaders } from '@angular/common/http';

export const mockResponseView = (status: number, url?: string, headers?: HttpHeaders, body?: any) =>
    new ResponseView(
        new HttpResponse({
            body: body || {},
            status: status,
            headers: headers || null,
            url: url || '/test/test'
        })
    );
