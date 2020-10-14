// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule, Table } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

export default {
  title: 'PrimeNG/Data/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: 'A listing data table: https://primefaces.org/primeng/showcase/#/table',
      },
    },
  }
} as Meta;

const cars = [
  {
    vin: '123',
    year: '2020',
    brand: 'Hyundai',
    color: 'Red',
  },
  {
    vin: '456',
    year: '2010',
    brand: 'Kia',
    color: 'Blue',
  },
  {
    vin: '789',
    year: '2008',
    brand: 'Ford',
    color: 'Gray',
  },
  {
    vin: '987',
    year: '2018',
    brand: 'Fiat',
    color: 'Green',
  },
  {
    vin: '123',
    year: '2020',
    brand: 'Hyundai',
    color: 'Red',
  },
  {
    vin: '456',
    year: '2010',
    brand: 'Kia',
    color: 'Blue',
  },
  {
    vin: '789',
    year: '2008',
    brand: 'Ford',
    color: 'Gray',
  },
  {
    vin: '987',
    year: '2018',
    brand: 'Fiat',
    color: 'Green',
  },
  {
    vin: '123',
    year: '2020',
    brand: 'Hyundai',
    color: 'Red',
  },
  {
    vin: '456',
    year: '2010',
    brand: 'Kia',
    color: 'Blue',
  },
  {
    vin: '789',
    year: '2008',
    brand: 'Ford',
    color: 'Gray',
  },
  {
    vin: '987',
    year: '2018',
    brand: 'Fiat',
    color: 'Green',
  },
];

const BasicTemplate = `
<p-table [value]="cars" rowHover="true">
    <ng-template pTemplate="header">
        <tr>
            <th>Vin</th>
            <th>Year</th>
            <th>Brand</th>
            <th>Color</th>
        </tr>
    </ng-template>
    <ng-template pTemplate="body" let-car>
        <tr>
            <td>{{car.vin}}</td>
            <td>{{car.year}}</td>
            <td>{{car.brand}}</td>
            <td>{{car.color}}</td>
        </tr>
    </ng-template>
</p-table>
`;
export const Basic = (_args: Table) => {
  return {
    props: {
      cars,
    },
    moduleMetadata: {
      imports: [TableModule],
    },
    template: BasicTemplate,
  };
};

Basic.parameters = {
  docs: {
    source: {
      code: BasicTemplate,
    },
    iframeHeight: 500,
  },
};

const FilterTemplate = `
<p-table
  #dt
  [filterDelay]="0"
  [globalFilterFields]="['color', 'brand', 'year']"
  [loading]="loading"
  [paginator]="true"
  [rowsPerPageOptions]="[10,25,50]"
  [rows]="5"
  [showCurrentPageReport]="true"
  [value]="cars"
  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
  dataKey="id"
  styleClass="p-datatable-customers"
>
  <ng-template pTemplate="caption">
    <div class="table-header">
      List of Cars
      <span class="p-input-icon-left">
        <i class="pi pi-search"></i>
        <input
          pInputText
          type="text"
          (input)="dt.filterGlobal($event.target.value, 'contains')"
          placeholder="Global Search"
        />
      </span>
    </div>
  </ng-template>
  <ng-template pTemplate="header">
    <tr>
      <th>Vin</th>
      <th>Year</th>
      <th>Brand</th>
      <th>Color</th>
    </tr>
  </ng-template>
  <ng-template pTemplate="body" let-car>
    <tr>
      <td>{{car.vin}}</td>
      <td>{{car.year}}</td>
      <td>{{car.brand}}</td>
      <td>{{car.color}}</td>
    </tr>
  </ng-template>
</p-table>
`;
export const Filter = (_args: Table) => {
  return {
    props: {
      cars,
    },
    moduleMetadata: {
      imports: [TableModule, BrowserAnimationsModule, InputTextModule],
    },
    template: FilterTemplate,
  };
};

Filter.parameters = {
  docs: {
    source: {
      code: FilterTemplate,
    },
    iframeHeight: 500,
  },
};
