/**
 * Interface for Push Publish Post response.
 *
 * @interface
 */
export interface PushPublishResponse {
    errorMessages: string[];
    total: number;
    bundleId: string;
    errors: number;
}
