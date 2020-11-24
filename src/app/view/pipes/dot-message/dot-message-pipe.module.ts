import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotMessagePipe } from './dot-message.pipe';
import { DotMessageService } from '@services/dot-message/dot-messages.service';

@NgModule({
    imports: [CommonModule],
    declarations: [DotMessagePipe],
    exports: [DotMessagePipe],
    providers: [DotMessageService]
})
export class DotMessagePipeModule {}
