import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DotLogoutComponent } from '@components/login/dot-logout/dot-logout.component';
import { ButtonModule } from 'primeng/primeng';

const routes: Routes = [
    {
        component: DotLogoutComponent,
        path: ''
    }
];

@NgModule({
    declarations: [DotLogoutComponent],
    imports: [CommonModule, RouterModule.forChild(routes), ButtonModule]
})
export class DotLogoutModule {}
