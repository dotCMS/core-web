import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { NotLicensedComponent } from './not-licensed.component';
import { ButtonModule } from 'primeng/button';
import { DotIconModule } from '@components/_common/dot-icon/dot-icon.module';

const routes: Routes = [
    {
        component: NotLicensedComponent,
        path: ''
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), ButtonModule, DotIconModule],
    declarations: [NotLicensedComponent]
})
export class NotLicensedModule {}
