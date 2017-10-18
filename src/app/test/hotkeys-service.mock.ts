import { Observable } from 'rxjs/Observable';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

/**
 * Mock of HotkeysService.
 * How to use:
 *      testHotKeysMock = new TestHotkeysMock();
 *      Call callback method that returns the callback of the keyboard event
 *      testHotKeysMock.callback('key');
 *
 * @export
 * @class TestHotkeysMock
 */

export class TestHotkeysMock {
    private hotkeys = [];

    add(hotkey: Hotkey | Hotkey[], specificEvent?: string | string[]): Observable<Hotkey[]> {
        this.hotkeys.push(hotkey);
        return Observable.of([]);
    }

    get(combo: string[]): Hotkey | Hotkey[] {
        const hotKeyCombo: Hotkey[] = [];
        this.hotkeys.forEach(hotkey => {
            hotkey.combo.forEach(hotkeyCombo => {
                if (combo.includes(hotkeyCombo)) {
                    hotKeyCombo.push(hotkey);
                }
            });
        });

        return hotKeyCombo.length === 1 ? hotKeyCombo[0] : hotKeyCombo;
    }

    remove(combo: string[]): Hotkey | Hotkey[] {
        return null;
    }

    callback(combo: string[]): any|void {
        const hotkey: any = this.get(combo);
        if (hotkey) {
          return hotkey.callback(null, combo);
        }
    }
}
