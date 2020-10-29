import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DotTemplatesService } from '@services/dot-templates/dot-templates.service';

@Component({
    selector: 'dot-template-test',
    templateUrl: './dot-template.component.html',
    styleUrls: ['./dot-template.scss']
})
export class DotTemplateComponent implements OnInit {
    templateForm: FormGroup;
    constructor(private fb: FormBuilder, private dotTemplateService: DotTemplatesService) {}

    ngOnInit(): void {
        this.templateForm = this.fb.group({
            title: '',
            description: '',
            editorContent: ''
        });
    }

    onSubmit(event) {
        event.preventDefault();
        this.dotTemplateService.create(this.templateForm.value).subscribe((template) => {
            // do something with the template
            console.log(template);
        });
    }
}
