import { formatDistanceToNowStrict } from 'date-fns';

export class DotFormatDateServiceMock {
    private _localeOptions: any;

    constructor() {}

    get localeOptions(): any {
        return this._localeOptions;
    }

    set localeOptions(locale: any) {
        this._localeOptions = locale;
    }

    setLang(lang: string) {}

    getRelative(time): string {
        return '1 hour ago'
    }
}
