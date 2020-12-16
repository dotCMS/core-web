// import { EventEmitter, Input, Output } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { DotMessagePipeModule } from '@pipes/dot-message/dot-message-pipe.module';
// import { MockDotMessageService } from '@tests/dot-message-service.mock';
// import { DotMessageService } from '@services/dot-message/dot-messages.service';
// import { DotEmptyStateComponent } from './dot-empty-state.component';
// import { ButtonModule } from 'primeng/button';
// import { CommonModule } from '@angular/common';

// @Component({
//     selector: 'dot-empty-state',
//     template: `
//         <dot-empty-state
//             [rows]="10"
//             [colsTextWidth]="[60, 50, 60, 80]"
//             icon="web"
//             [title]="'message.template.empty.title' | dm"
//             [content]="'message.template.empty.content' | dm"
//             [buttonLabel]="'message.template.empty.button.label' | dm"
//         >
//         </dot-empty-state>
//     `
// })
// class MockDotEmptyStateComponent implements OnInit {
//     @Input() rows: number;
//     @Input() colsTextWidth: number[] = [];
//     @Input() icon: string;
//     @Input() title: string;
//     @Input() content: string;
//     @Input() buttonLabel: string;
//     @Output() buttonClick = new EventEmitter<string>();

//     columnWidth: string;
//     checkBoxWidth: number = 3.5;

//     numberOfRows(): number[] {
//         return Array(this.rows).fill(0);
//     }

//     ngOnInit() {
//         this.columnWidth = `${(100 - this.checkBoxWidth) / this.colsTextWidth.length}%`;
//     }
// }

// fdescribe('DotEmptyStateComponent', () => {
//     let component: DotEmptyStateComponent;
//     let fixture: ComponentFixture<DotEmptyStateComponent>;
//     const messageServiceMock = new MockDotMessageService({
//         'message.template.empty.title': 'Your template list is empty',
//         'message.template.empty.content':
//             "You haven't added anything yet, start by clicking the button below",
//         'message.template.empty.button.label': 'Add New Template'
//     });

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [CommonModule, ButtonModule, DotMessagePipeModule],
//             declarations: [DotEmptyStateComponent, MockDotEmptyStateComponent],
//             providers: [
//                 {
//                     provide: DotMessageService,
//                     useValue: messageServiceMock
//                 }
//             ]
//         }).compileComponents();
//     });

//     describe('attributes', () => {
//         fixture = TestBed.createComponent(DotEmptyStateComponent);
//         fixture.detectChanges();
//         it('should pass all attributes correctly', () => {
//             const searchable = fixture.debugElement.query(By.css('dot-empty-state'))
//                 .componentInstance;
//             console.log(component, fixture, searchable);
//             expect(true).toBe(true);
//         });
//     });
// });
