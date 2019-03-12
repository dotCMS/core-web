import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DotKeyvalueModule } from './dot-keyvalue/dot-keyvalue.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(DotKeyvalueModule)
  .catch(err => console.error(err));
