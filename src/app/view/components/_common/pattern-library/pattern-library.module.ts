import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { PatternLibraryComponent } from './pattern-library.component';

const routes: Routes = [
  {
    component: PatternLibraryComponent,
    path: ''
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PatternLibraryComponent
  ]
})

export class PatternLibraryModule { }
