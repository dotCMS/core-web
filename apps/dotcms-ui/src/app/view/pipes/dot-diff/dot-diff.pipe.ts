import { Pipe, PipeTransform } from '@angular/core';
import HtmlDiff from 'htmldiff-js';

@Pipe({
    name: 'dotDiff'
})
export class DotDiffPipe implements PipeTransform {
    transform(value: string, newValue: string): string {
        return HtmlDiff.execute(value, newValue);
    }
}
