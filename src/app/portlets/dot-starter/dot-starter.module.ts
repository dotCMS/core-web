import { NgModule } from '@angular/core';
import { DotPipesModule } from '@pipes/dot-pipes.module';
import { DotStarterResolver } from './dot-starter-resolver.service';
import { DotStarterRoutingModule } from './dot-starter-routing.module';
import { DotStarterComponent } from './dot-starter.component';

@NgModule({
    declarations: [DotStarterComponent],
    imports: [DotStarterRoutingModule, DotPipesModule],
    providers: [DotStarterResolver]
})
export class DotStarterModule {}
