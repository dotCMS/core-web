import { Injectable } from '@angular/core';
import { formatDistanceToNowStrict } from 'date-fns';

interface DotLocaleOptions {
    locale: Locale;
}

@Injectable()
export class FormatDateService {
    private _localeOptions: DotLocaleOptions;

    constructor() {}

    get localeOptions(): DotLocaleOptions {
        return this._localeOptions;
    }

    set localeOptions(locale: DotLocaleOptions) {
        this._localeOptions = locale;
    }

    async setLang(lang: string) {
        const localeLang = await import(`date-fns/locale/${lang}/index.js`);
        this.localeOptions = { locale: localeLang.default };
    }

    getRelative(time): string {
        return formatDistanceToNowStrict(new Date(parseInt(time, 10)), {
            ...this.localeOptions,
            addSuffix: true
        });
    }
}
