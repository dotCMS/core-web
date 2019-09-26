import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dotStringFormat'
})
export class DotStringFormatPipe implements PipeTransform {
    transform(value: string, args?: string[]): any {
        args.forEach((token: string, index) => {
            value = value.replace(`{${index}}`, token);
        });
        return value;
    }
}
