import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { DotDeviceSelectorComponent } from './dot-device-selector.component';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';
import { DotDevicesService } from '@services/dot-devices/dot-devices.service';
import { DotDirectivesModule } from '@shared/dot-directives.module';

@NgModule({
    imports: [CommonModule, DropdownModule, FormsModule, DotIconModule, DotDirectivesModule],
    declarations: [DotDeviceSelectorComponent],
    exports: [DotDeviceSelectorComponent],
    providers: [DotDevicesService]
})
export class DotDeviceSelectorModule {}
