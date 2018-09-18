import { Response, ResponseOptions, ConnectionBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FieldVariablesService, FieldVariableParams } from './';
import { DOTTestBed } from '../../../../test/dot-test-bed';
import { FieldVariable } from '../content-type-fields-variables';

describe('FieldVariablesService', () => {
    beforeEach(() => {
        this.injector = DOTTestBed.resolveAndCreate([FieldVariablesService]);
        this.fieldVariableService = this.injector.get(FieldVariablesService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;
        this.backend.connections.subscribe((connection: any) => (this.lastConnection = connection));
    });

    it('should load field variables', () => {
        const mockResponse = {
            entity: [
                {
                    clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
                    fieldId: '1',
                    id: '1b',
                    key: 'test1',
                    value: 'value1'
                },
                {
                    clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
                    fieldId: '2',
                    id: '2b',
                    key: 'test2',
                    value: 'value2'
                }
            ]
        };

        const params: FieldVariableParams = {
            contentTypeId: '1b',
            fieldId: '1'
        };

        this.fieldVariableService.load(params).subscribe((variables: FieldVariable[]) => {
            expect(variables).toEqual(mockResponse.entity);
            expect(0).toBe(this.lastConnection.request.method); // 2 is GET method
            expect(this.lastConnection.request.url)
                .toContain(`v1/contenttype/${params.contentTypeId}/fields/id/${params.fieldId}/variables`);
        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })
            )
        );
    });

    it('should save field variables', () => {
        const mockResponse = {
            entity: {
                    clazz: 'com.dotcms.contenttype.model.field.ImmutableFieldVariable',
                    fieldId: '1',
                    id: '1b',
                    key: 'test3',
                    value: 'value3'
                }
        };

        const params: FieldVariableParams = {
            contentTypeId: '1b',
            fieldId: '1',
            variable: {
                key: 'test3',
                value: 'value3'
            }
        };

        this.fieldVariableService.save(params).subscribe((variables: FieldVariable) => {
            expect(variables).toEqual(mockResponse.entity);
            expect(1).toBe(this.lastConnection.request.method); // 1 is POST method
            expect(this.lastConnection.request.url)
                .toContain(`v1/contenttype/${params.contentTypeId}/fields/id/${params.fieldId}/variables`);

        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })
            )
        );
    });

    it('should delete field variables', () => {
        const mockResponse = {
            entity: []
        };

        const params: FieldVariableParams = {
            contentTypeId: '1b',
            fieldId: '1',
            variable: {
                id: 'code1',
                key: 'test3',
                value: 'value3'
            }
        };

        this.fieldVariableService.delete(params).subscribe((variables: FieldVariable) => {
            expect(3).toBe(this.lastConnection.request.method); // 3 is DELETE method
            expect(this.lastConnection.request.url)
                .toContain(`v1/contenttype/${params.contentTypeId}/fields/id/${params.fieldId}/variables/id/${params.variable.id}`);

        });

        this.lastConnection.mockRespond(
            new Response(
                new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })
            )
        );
    });
});
