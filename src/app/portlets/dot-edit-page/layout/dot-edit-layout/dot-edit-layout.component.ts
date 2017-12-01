import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DotPageView } from '../../shared/models/dot-page-view.model';
import { DotEditLayoutGridComponent } from '../dot-edit-layout-grid/dot-edit-layout-grid.component';
import { DotLayoutBody } from '../../shared/models/dot-layout-body.model';
import { PageViewService } from '../../../../api/services/page-view/page-view.service';
import { Observable } from 'rxjs/Observable';
import { DotLayoutGridBox } from '../../shared/models/dot-layout-grid-box.model';
import { MessageService } from '../../../../api/services/messages-service';
import { TemplateContainersCacheService } from '../../dot-template-containers-cache.service';
import { DotLayout } from '../../shared/models/dot-layout.model';

@Component({
    selector: 'dot-edit-layout',
    templateUrl: './dot-edit-layout.component.html',
    styleUrls: ['./dot-edit-layout.component.scss']
})
export class DotEditLayoutComponent implements OnInit {
    @ViewChild('editLayoutGrid') editLayoutGrid: DotEditLayoutGridComponent;
    @ViewChild('templateName') templateName: ElementRef;

    form: FormGroup;

    pageView: DotPageView;
    saveAsTemplate: boolean;

    constructor(
        private pageViewService: PageViewService,
        private route: ActivatedRoute,
        public messageService: MessageService,
        public router: Router,
        private fb: FormBuilder,
        private templateContainersCacheService: TemplateContainersCacheService
    ) {
        this.form = this.fb.group({
            title: '',
            layout: this.fb.group({
                body: {},
                header: false,
                footer: false,
                sidebar: this.fb.group({
                    location: ''
                })
            })
        });
    }

    ngOnInit(): void {
        this.messageService
            .getMessages([
                'editpage.layout.toolbar.action.save',
                'editpage.layout.toolbar.action.cancel',
                'editpage.layout.toolbar.template.name',
                'editpage.layout.toolbar.save.template'
            ])
            .subscribe();

        this.route.data.pluck('pageView').subscribe((pageView: DotPageView) => {
            this.pageView = pageView;
            console.log('pageView', pageView);
            this.form.setValue({
                title: this.isLayout() ? null : this.pageView.template.title,
                layout: {
                    body: this.pageView.layout.body || {},
                    header: this.pageView.layout.header,
                    footer: this.pageView.layout.footer,
                    sidebar: {
                        location: this.pageView.layout.sidebar ? this.pageView.layout.sidebar.location : ''
                    }
                }
            });

            this.templateContainersCacheService.setContainers(this.pageView.containers);
        });
    }

    /**
     * Add a grid box to the ng grid layout component
     *
     * @returns {() => void}
     * @memberof DotEditLayoutComponent
     */
    addGridBox(): () => void {
        return () => {
            this.editLayoutGrid.addBox();
        };
    }

    /**
     * Check if the template is a template or a layout by comparing the name of the template.
     * Templates with the name "anonymous_layout_TIMESTAMP" are layout assigned to an specific page.
     *
     * @returns {boolean}
     * @memberof DotEditLayoutComponent
     */
    isLayout(): boolean {
       return this.pageView.template.anonymous;
    }

    /**
     * Handle the change when user update save as template checkbox value
     *
     * @memberof DotEditLayoutComponent
     */
    saveAsTemplateHandleChange(value: boolean): void {
        this.saveAsTemplate = value;

        if (this.saveAsTemplate) {
            /*
                Need the timeout so the textfield it's loaded in the DOM before focus, wasn't able to find a better solution
            */
            setTimeout(() => {
                this.templateName.nativeElement.focus();
            }, 0);
        }
    }

    /**
     * Get the LayoutBody and call the service to save the layout
     *
     * @memberof DotEditLayoutComponent
     */
    saveLayout(event): void {
        const dotLayout: DotLayout = this.form.value;
        this.pageViewService.save(this.pageView.page.identifier, dotLayout).subscribe();
    }
}
