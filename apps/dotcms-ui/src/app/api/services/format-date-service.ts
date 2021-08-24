import { Injectable } from '@angular/core';
import { formatDistanceToNowStrict } from 'date-fns';

interface DotLocaleOptions {
    addSuffix: boolean;
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

    // async setLang(lang: string, messages: any) {
    async setLang(lang: string) {
        const localeLang = await import(`date-fns/locale/${lang}/index.js`);
        this.localeOptions = { addSuffix: true, locale: localeLang.default };

        // const localeOptions = { locale: localeLang.default };
        // console.log(
        //     '**** localeLang',
        //     format(parseISO('2020-07-02 12:26:20.187'), 'd.MMM yyyy, E HH:mm, ', localeOptions)
        // );

        // Only "creating" the language once
        // if (moment.locale(lang) !== lang) {
        //     moment.defineLocale(lang, {});
        // }
        // moment.locale(lang);
    }

    getRelative(time): string {
        // console.log(
        //     '===formatDistance',
        //     formatDistanceToNowStrict(new Date(parseInt(time, 10)), {
        //         ...this.localeOptions,
        //         addSuffix: true
        //     })
        // );
        // console.log('***fromNOW ', moment(parseInt(time, 10)).fromNow());
        // return moment(parseInt(time, 10)).fromNow();
        console.log('**from', formatDistanceToNowStrict(new Date(parseInt(time, 10)), this.localeOptions))
        return formatDistanceToNowStrict(new Date(parseInt(time, 10)), this.localeOptions);
    }
}
