import { Directive, ViewContainerRef, Input, ComponentFactoryResolver, ComponentRef, SimpleChanges } from '@angular/core';
import { Field } from '../../../index';
import { FormGroup } from '@angular/forms';
import { FieldPropertyService } from '../../../service';

@Directive({
  selector: '[dynamicFieldProperty]',
})
export class DynamicFieldPropertyDirective {
  @Input() propertyName: string;
  @Input() field: Field;
  @Input() group: FormGroup;

  constructor(private viewContainerRef: ViewContainerRef, private resolver: ComponentFactoryResolver,
                private fieldPropertyService: FieldPropertyService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.field.currentValue) {
            this.createComponent(this.propertyName);
        }
    }

    private createComponent(property): void {
        let component = this.fieldPropertyService.getComponent(property);
        let componentFactory = this.resolver.resolveComponentFactory(component);
        let componentRef: ComponentRef<any> = this.viewContainerRef.createComponent(componentFactory);

        componentRef.instance.propertyName = this.propertyName;
        componentRef.instance.propertyValue = this.field[this.propertyName];
        componentRef.instance.field = this.field;
        componentRef.instance.group = this.group;
    }
}