import { HttpResponse, HttpHeaders } from '@angular/common/http';

/**
 *
 *
 * <code>
 * {
 *   "errors":[],
 *   "entity":{},
 *   "messages":[],
 *   "i18nMessagesMap":{}
 * }
 * </code>
 */
export class ResponseView {
    private bodyJsonObject: any;
    private headers: HttpHeaders;

    public constructor(private resp: HttpResponse<any>) {
        try {
            this.bodyJsonObject = resp.body;
            this.headers = resp.headers;
        } catch (e) {
            this.bodyJsonObject = {};
        }
    }

    public header(headerName: string): string {
        return this.headers.get(headerName);
    }

    get i18nMessagesMap(): any {
        return this.bodyJsonObject.i18nMessagesMap;
    }

    get contentlets(): any {
        return this.bodyJsonObject.contentlets;
    }

    get entity(): any {
        return this.bodyJsonObject.entity;
    }

    get errorsMessages(): string {
        let errorMessages = '';

        if (this.bodyJsonObject.errors) {
            this.bodyJsonObject.errors.forEach((e) => {
                errorMessages += e.message;
            });
        } else {
            errorMessages = this.bodyJsonObject.message;
        }

        return errorMessages;
    }

    get status(): number {
        return this.resp.status;
    }

    get response(): HttpResponse<any> {
        return this.resp;
    }

    public existError(errorCode: string): boolean {
        return (
            this.bodyJsonObject.errors &&
            this.bodyJsonObject.errors.filter((e) => e.errorCode === errorCode).length > 0
        );
    }
}
