import { Pipe, PipeTransform } from '@angular/core';
import { DotMessageService } from '@services/dot-messages-service';

@Pipe({
    name: 'dotMessage'
})
export class DotMessagePipe implements PipeTransform {
    constructor(private dotMessageService: DotMessageService) {}

    transform(value: string): string {
        return value === undefined || value === '' ? '' : this.dotMessageService.get(value);
    }
}
