/**
 * Interface for Push Publish Post response.
 *
 * @interface
 */
export interface AjaxActionResponseView {
    _body: any;
    errorMessages: string[];
    total: number;
    bundleId: string;
    errors: number;
}
