import { Injectable } from '@angular/core';
import { DotRenderedPageState } from '../../models/dot-rendered-page-state.model';

let count = 0;
@Injectable()
export class DotEditPageDataService {
    public id;
    private dotRenderedPageState: DotRenderedPageState;

    constructor() {
        this.id = count++;
        console.log('id', this.id);
    }

    set (dotRenderedPageState: DotRenderedPageState) {
        console.log('set', this.id, dotRenderedPageState)
        this.dotRenderedPageState = dotRenderedPageState;
    }

    getAndClean (): DotRenderedPageState {
        const data =  this.dotRenderedPageState;
        this.dotRenderedPageState = null;
        return data;
    }
}
