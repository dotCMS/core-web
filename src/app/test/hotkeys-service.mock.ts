import { Observable } from 'rxjs/Observable';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

export class TestHotkeysMock {
    private hotkeys = [];
    public add(hotkey: Hotkey | Hotkey[], specificEvent?: string | string[]): Observable<Hotkey[]> {
        this.hotkeys.push(hotkey);
        return Observable.of([]);
    }

    public get(combo: string): Hotkey {
        let hotKeyCombo: Hotkey;
        this.hotkeys.forEach(hotkey => {
            if (hotkey.combo.includes(combo)) {
                hotKeyCombo = hotkey;
            }
        });
        return hotKeyCombo;
    }

    public callback(combo: string): any|void {
        const hotkey: any = this.get(combo);
        if (hotkey) {
          return hotkey.callback(null, combo);
        }
    }
}
