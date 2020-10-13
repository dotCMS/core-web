import { Component } from '@angular/core';
import { FilterUtils } from 'primeng/utils';

export interface Car {
  vin?;
  year?;
  brand?;
  color?;
  price?;
  saleDate?;
}

@Component({
  selector: 'app-p-defer',
  template: `
    <p-table #dt [columns]="cols" [value]="cars" [paginator]="true" [rows]="10">
      <ng-template pTemplate="header" let-columns>
        <tr>
          <th *ngFor="let col of columns">
            {{ col.header }}
          </th>
        </tr>
        <tr>
          <th *ngFor="let col of columns" [ngSwitch]="col.field">
            <input
              *ngSwitchCase="'vin'"
              pInputText
              type="text"
              (input)="
                dt.filter($event.target.value, col.field, col.filterMatchMode)
              "
            />
            <input
              *ngSwitchCase="'year'"
              pInputText
              type="text"
              (input)="
                dt.filter($event.target.value, col.field, col.filterMatchMode)
              "
            />
            <input
              *ngSwitchCase="'brand'"
              pInputText
              type="text"
              (input)="
                dt.filter($event.target.value, col.field, col.filterMatchMode)
              "
            />
            <input
              *ngSwitchCase="'color'"
              pInputText
              type="text"
              (input)="
                dt.filter($event.target.value, col.field, col.filterMatchMode)
              "
            />
          </th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-rowData let-columns="columns">
        <tr [pSelectableRow]="rowData">
          <td *ngFor="let col of columns">
            {{ rowData[col.field] }}
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
})
export class FilterUtilsComponent {
  cars: Car[];

  cols: any[];

  constructor() {
    FilterUtils['custom-equals'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      }

      return value.toString() === filter.toString();
    };

    this.cols = [
      { field: 'year', header: 'Year', filterMatchMode: 'custom-equals' },
      { field: 'brand', header: 'Brand', filterMatchMode: 'custom-equals' },
      { field: 'color', header: 'Color', filterMatchMode: 'custom-equals' },
      { field: 'vin', header: 'Vin', filterMatchMode: 'custom-equals' },
    ];
  }
}
