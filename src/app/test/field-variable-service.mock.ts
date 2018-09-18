import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { FieldVariable } from '../portlets/content-types/fields';

export const mockFieldVariables: FieldVariable[] = [
    {
        clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
        fieldId: 'f965a51b-130a-435f-b646-41e07d685363',
        id: '9671d2c3-793b-41af-a485-e2c5fcba5fb',
        key: 'Key1',
        value: 'Value1'
    },
    {
        clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
        fieldId: 'f965a51b-130a-435f-b646-41e07d685363',
        id: '9671d2c3-793b-41af-a485-e2c5fcba5fa',
        key: 'Key1',
        value: 'Value1'
    },
    {
        clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
        fieldId: 'f965a51b-130a-435f-b646-41e07d685363',
        id: '9671d2c3-793b-41af-a485-e2c5fcba5fc',
        key: 'Key1',
        value: 'Value1'
    },
];

export class FieldVariablesServiceMock {
    load(): Observable<FieldVariable[]> {
        return Observable.of(_.cloneDeep(mockFieldVariables));
    }

    save(): Observable<FieldVariable> {
        return Observable.of(_.cloneDeep(mockFieldVariables[0]));
    }

    delete(): Observable<string> {
        return Observable.of('');
    }

}
