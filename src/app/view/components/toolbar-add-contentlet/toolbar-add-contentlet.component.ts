import { BaseComponent } from '../_common/_base/base-component';
import {
    Component,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation,
    OnInit
} from '@angular/core';
import { DotDropdownComponent } from '../_common/dropdown-component/dot-dropdown.component';
import { IframeOverlayService } from '../../../api/services/iframe-overlay-service';
import { MessageService } from '../../../api/services/messages-service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MenuItem } from 'primeng/primeng';
import { StructureTypeView } from '../../../shared/models/contentlet';
import { ToolbarAddContenletService } from './toolbar-add-contentlet.service';
import { ContentTypesInfoService } from '../../../api/services/content-types-info';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'dot-toolbar-add-contentlet',
    styleUrls: ['./toolbar-add-contentlet.component.scss'],
    templateUrl: 'toolbar-add-contentlet.component.html'
})
export class ToolbarAddContenletComponent extends BaseComponent implements OnInit {
    @ViewChild(DotDropdownComponent) dropdown: DotDropdownComponent;
    @Input() command?: ($event) => void;

    mainTypes: Observable<StructureTypeView[]>;
    moreTypes: Observable<MenuItem[]>;
    recent: StructureTypeView[];
    selectedName = '';
    showMore = false;
    structureTypeViewSelected: StructureTypeView[];
    types: StructureTypeView[];

    private NUMBER_BY_PAGE = 4;
    private currentPage: number = -1;

    constructor(
        messageService: MessageService,
        private toolbarAddContenletService: ToolbarAddContenletService,
        public iframeOverlayService: IframeOverlayService,
        private contentTypesInfoService: ContentTypesInfoService
    ) {
        super(['more'], messageService);
    }

    ngOnInit(): void {
        this.mainTypes = this.toolbarAddContenletService.main$;

        this.moreTypes = this.toolbarAddContenletService.more$.map((types: StructureTypeView[]) =>
            this.formatMenuItems(types)
        );

        this.toolbarAddContenletService.recent$.subscribe((types: StructureTypeView[]) => {
            this.recent = types;
            this.nextRecent();
        });
    }

    select(structure: StructureTypeView): void {
        if (
            this.structureTypeViewSelected !== this.recent &&
            this.structureTypeViewSelected[0] === structure
        ) {
            this.currentPage = -1;
            this.nextRecent();
            this.selectedName = '';
        } else {
            this.structureTypeViewSelected = [structure];
            this.showMore = false;
            this.selectedName = structure.name;
        }
    }

    close(): void {
        this.dropdown.closeIt();
    }

    nextRecent(): void {
        this.currentPage++;
        this.showMore = false;

        this.structureTypeViewSelected = this.recent.map(structureTypeView => {
            const currentPage =
                this.currentPage % (structureTypeView.types.length / this.NUMBER_BY_PAGE);
            this.showMore = this.showMore || structureTypeView.types.length > this.NUMBER_BY_PAGE;

            const startIndex = currentPage * this.NUMBER_BY_PAGE;
            const endIndex = startIndex + this.NUMBER_BY_PAGE;

            return {
                label: structureTypeView.label,
                name: structureTypeView.name,
                types: structureTypeView.types.slice(startIndex, endIndex)
            };
        });
    }

    private formatMenuItems(types: StructureTypeView[]): MenuItem[] {
        return types.map(type => {
            return {
                label: type.label,
                icon: this.contentTypesInfoService.getIcon(type.name),
                command: () => {
                    this.select(type);
                }
            };
        });
    }
}
