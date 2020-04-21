import nodeFetch from 'node-fetch';
import { DotCMSAuthorizationLoginParams, DotCMSError, DotCMSConfigurationParams } from '../models';

function getErrorMessage(data: { [key: string]: any }) {
    if (data.errors) {
        return data.errors[0].message;
    }

    if (data.error) {
        return data.error;
    }
}

/**
 * DotCMS Authentication handler to intereact with  {@link https://dotcms.com/docs/latest/rest-api-authentication | Authentication API}
 *
 */
export class DotApiAuthorization {
    private _config: DotCMSConfigurationParams;

    constructor(config: DotCMSConfigurationParams) {
        this._config = config;
    }

    /**
     * Given user, password and expiration date to get a DotCMS Autorization Token
     */
    getToken(params: DotCMSAuthorizationLoginParams) {
        const { user, password, expirationDays, host } = params;

        const fetch = this._config.fetch || nodeFetch;
        return fetch(`${host || ''}/api/v1/authentication/api-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: user,
                password: password,
                expirationDays: expirationDays || 10
            })
        }).then(async (res) => {
            const data = await res.json();

            if (res.status === 200) {
                return data.entity.token;
            }

            throw <DotCMSError>{
                message: getErrorMessage(data),
                statusCode: res.status
            };
        });
    }
}
