import { DotLayoutColumn } from './../../shared/models/dot-layout-column.model';
import { DotLayoutRow } from './../../shared/models/dot-layout-row.model';
import { Subject } from 'rxjs';
import { DotEditLayoutService } from '@portlets/dot-edit-page/shared/services/dot-edit-layout.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Input,
    OnDestroy,
    Output,
    EventEmitter,
    ChangeDetectionStrategy
} from '@angular/core';
import { DotEventsService } from '@services/dot-events/dot-events.service';
import * as _ from 'lodash';

import { DotLayoutSideBar } from '../../shared/models/dot-layout-sidebar.model';
import { DotRouterService } from '@services/dot-router/dot-router.service';
import { DotTheme } from '../../shared/models/dot-theme.model';
import { DotThemesService } from '@services/dot-themes/dot-themes.service';
import { Observable } from 'rxjs';
import {
    DotHttpErrorManagerService,
    DotHttpErrorHandled
} from '@services/dot-http-error-manager/dot-http-error-manager.service';
import { tap, take, takeUntil } from 'rxjs/operators';
import { DotLayoutBody } from '@portlets/dot-edit-page/shared/models/dot-layout-body.model';
import { HttpErrorResponse } from '@angular/common/http';
import { DotLayout } from '@portlets/dot-edit-page/shared/models';

@Component({
    selector: 'dot-edit-layout-designer',
    templateUrl: './dot-edit-layout-designer.component.html',
    styleUrls: ['./dot-edit-layout-designer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotEditLayoutDesignerComponent implements OnInit, OnDestroy {
    @ViewChild('templateName')
    templateName: ElementRef;

    @Input()
    layout: DotLayout;

    @Input()
    title: string;

    @Input()
    theme: string;

    @Output()
    cancel: EventEmitter<MouseEvent> = new EventEmitter();

    @Output()
    save: EventEmitter<Event> = new EventEmitter();

    form: FormGroup;
    initialFormValue: any;
    isModelUpdated = false;
    themeDialogVisibility = false;
    currentTheme: DotTheme;

    saveAsTemplate: boolean;
    showTemplateLayoutSelectionDialog = false;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        private dotEditLayoutService: DotEditLayoutService,
        private dotEventsService: DotEventsService,
        private dotHttpErrorManagerService: DotHttpErrorManagerService,
        private dotRouterService: DotRouterService,
        private dotThemesService: DotThemesService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.setupLayout();
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    /**
     * Calling the service to add a new box
     *
     * @memberof DotEditLayoutDesignerComponent
     */
    addGridBox() {
        this.dotEditLayoutService.addBox();
    }

    /**
     * Emit cancel event
     *
     * @memberof DotEditLayoutDesignerComponent
     */
    onCancel(): void {
        this.cancel.emit();
    }

    /**
     * Emit save event
     *
     * @memberof DotEditLayoutDesignerComponent
     */
    onSave(): void {
        this.save.emit(this.form.value);
    }

    /**
     * Handle the changes in the Theme Selector component.
     * @param DotTheme theme
     *
     * @memberof DotEditLayoutDesignerComponent
     */
    changeThemeHandler(theme: DotTheme): void {
        this.currentTheme = theme;
        this.form.get('themeId').setValue(theme.inode);
        this.themeDialogVisibility = false;
    }

    /**
     * Close the Theme Dialog.
     *
     *  @memberof DotEditLayoutDesignerComponent
     */
    closeThemeDialog(): void {
        this.themeDialogVisibility = false;
    }

    private setupLayout(): void {
        this.initForm();
        this.dotThemesService
            .get(this.form.get('themeId').value)
            .pipe(take(1))
            .subscribe(
                (theme: DotTheme) => {
                    this.currentTheme = theme;
                },
                (error) => this.errorHandler(error)
            );
        // Emit event to redraw the grid when the sidebar change
        this.form
            .get('layout.sidebar')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.dotEventsService.notify('layout-sidebar-change');
            });
    }

    // The POST request returns a 400 if we send the same properties we get
    // ISSUE: https://github.com/dotCMS/core/issues/16344
    private cleanUpBody(body: DotLayoutBody): DotLayoutBody {
        return body
            ? {
                  rows: body.rows.map((row: DotLayoutRow) => {
                      return {
                          ...row,
                          columns: row.columns.map((column: DotLayoutColumn) => {
                              return {
                                  containers: column.containers,
                                  leftOffset: column.leftOffset,
                                  width: column.width,
                                  styleClass: column.styleClass
                              };
                          })
                      };
                  })
              }
            : null;
    }

    private initForm(): void {
        this.form = this.fb.group({
            title: this.title,
            themeId: this.theme,
            layout: this.fb.group({
                body: this.cleanUpBody(this.layout.body) || {},
                header: this.layout.header,
                footer: this.layout.footer,
                sidebar: this.createSidebarForm()
            })
        });

        this.initialFormValue = _.cloneDeep(this.form.value);
        this.isModelUpdated = false;
        this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isModelUpdated = !_.isEqual(this.form.value, this.initialFormValue);
            // TODO: Set sidebar to null if sidebar location is empty, we're expecting a change in the backend to accept null value
        });
    }

    // tslint:disable-next-line:cyclomatic-complexity
    private createSidebarForm(): DotLayoutSideBar {
        return {
            location: this.layout.sidebar ? this.layout.sidebar.location : '',
            containers: this.layout.sidebar ? this.layout.sidebar.containers : [],
            width: this.layout.sidebar ? this.layout.sidebar.width : 'small'
        };
    }

    private errorHandler(err: HttpErrorResponse): Observable<any> {
        return this.dotHttpErrorManagerService.handle(err).pipe(
            tap((res: DotHttpErrorHandled) => {
                if (!res.redirected) {
                    this.dotRouterService.goToSiteBrowser();
                }
                this.currentTheme = err.status === 403 ? null : this.currentTheme;
            })
        );
    }
}
