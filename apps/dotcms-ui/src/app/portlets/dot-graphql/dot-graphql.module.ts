import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotGraphqlComponent } from './dot-graphql.component';
import { DotGraphqlRoutingModule } from './dot-graphql-routing.module';

@NgModule({
    declarations: [DotGraphqlComponent],
    imports: [CommonModule, DotGraphqlRoutingModule],
    providers: []
})
export class DotGraphqlModule {}
