/**
 * Data required for push publish
 * @export
 * @interface DotPushPublishData
 */
export interface DotPushPublishData {
    pushActionSelected: string;
    publishDate: string;
    expireDate: string;
    environment: string[];
    filterKey: string;
}

export interface DotPushPublish {
    whereToSend: string;
    iWantTo: string;
    publishTime: string;
    publishDate: string;
    expireTime: string;
    expireDate: string;
}


/* data['whereToSend'] = data.environment.join();
        data['iWantTo'] = data.pushActionSelected;
        data['publishTime'] = moment(data.publishDate).format('HH-mm');
        data['publishDate'] = moment(data.publishDate).format('YYYY-MM-DD');
        data['expireTime'] = moment(data.expireDate).format('HH-mm');
        data['expireDate'] = moment(data.expireDate).format('YYYY-MM-DD');*/
