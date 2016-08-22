import {Component, Output, EventEmitter} from '@angular/core';
import {DotSelect, DotOption} from '../dot-select/dot-select';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input/input';
import {MdButton} from '@angular2-material/button';
import {UserService} from '../../../../api/services/user-service';

@Component({
    directives: [DotSelect, DotOption, MD_INPUT_DIRECTIVES, MdButton,],
    moduleId: __moduleName,
    providers: [UserService],
    selector: 'dot-login-as',
    styleUrls: ['login-as.css'],
    templateUrl: ['login-as.html']
})
export class LoginAsComponent {
    private users: Array<any>;
    private needPassword:boolean = false;
    private userService: UserService;
    @Output() cancel = new EventEmitter<>();

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.userService.getAll().subscribe(res => {
            this.users = res.entity.data;
        });
    }

    userSelectedHandler($event): void {
        this.needPassword = $event.value === '1';
    }

    close(): void {
        this.cancel.emit(true);
    }
}