import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    providers: [
        {provide: LOCALE_ID, useValue: 'en-US'}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
