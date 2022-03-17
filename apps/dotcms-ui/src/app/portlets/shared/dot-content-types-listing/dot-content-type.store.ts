import { ComponentStore } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    DotCloneContentTypeDialogFormFields,
    DotCMSAssetDialogFields
} from '@dotcms/dotcms-models';
import { DotContentTypeService } from '@services/dot-content-type';
import { catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { DotHttpErrorManagerService } from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { Router } from '@angular/router';

export type DotCMSAssetDialogCloneFields = DotCMSAssetDialogFields & {
    data: {
        icon: string;
        host: string;
    };
};

export interface ContentTypeState {
    isVisibleCloneDialog: boolean;
    assetSelected: DotCMSAssetDialogCloneFields | null;
    isSaving: boolean;
}

const initialState: ContentTypeState = {
    isVisibleCloneDialog: false,
    assetSelected: null,
    isSaving: false
};

@Injectable()
export class DotContentTypeStore extends ComponentStore<ContentTypeState> {
    readonly assetSelected$: Observable<DotCMSAssetDialogCloneFields> = this.select(
        ({ assetSelected }) => assetSelected
    );
    readonly isVisibleCloneDialog$: Observable<boolean> = this.select(
        ({ isVisibleCloneDialog }) => isVisibleCloneDialog
    );
    readonly isSaving$: Observable<boolean> = this.select(({ isSaving }) => isSaving);

    // UPDATERS
    readonly showCloneDialog = this.updater(
        (state, assetSelected: DotCMSAssetDialogCloneFields) => ({
            ...state,
            assetSelected,
            isVisibleCloneDialog: true,
            isSaving: false
        })
    );
    readonly hideCloneDialog = this.updater((state) => ({
        ...state,
        assetSelected: null,
        isVisibleCloneDialog: false
    }));

    readonly isSaving = this.updater((state, isSaving: boolean) => ({
        ...state,
        isSaving
    }));

    // EFFECTS
    readonly saveCloneDialog = this.effect(
        (cloneDialogFormFields$: Observable<DotCloneContentTypeDialogFormFields>) => {
            return cloneDialogFormFields$.pipe(
                withLatestFrom(this.assetSelected$),
                tap(() => this.isSaving(true)),
                switchMap(([formFields, asset]) =>
                    this.dotContentTypeService
                        .saveCloneContentType(asset.assetIdentifier, formFields)
                        .pipe(
                            tap({
                                next: (clonedAsset) => {
                                    this.router.navigate([
                                        '/content-types-angular/edit',
                                        clonedAsset.id
                                    ]);
                                }
                            }),
                            catchError((error) => {
                                this.isSaving(false);
                                return this.httpErrorManagerService.handle(error);
                            })
                        )
                )
            );
        }
    );

    constructor(
        private readonly dotContentTypeService: DotContentTypeService,
        private readonly httpErrorManagerService: DotHttpErrorManagerService,
        private readonly router: Router
    ) {
        super(initialState);
    }
}
