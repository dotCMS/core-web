import {Component, Inject, ViewChild} from '@angular/core';
import {Router} from '@ngrx/router';
import {DropdownComponent} from '../dropdown-component/dropdown-component';
import {LoginAsComponent} from '../login-as/login-as';
import {LoginService} from '../../../../api/services/login-service';

@Component({
    directives: [DropdownComponent, LoginAsComponent],
    moduleId: __moduleName,
    selector: 'toolbar-user',
    styleUrls: ['toolbar-user.css'],
    templateUrl: ['toolbar-user.html'],

})
export class ToolbarUserComponent {
    @ViewChild(DropdownComponent) dropdown: DropdownComponent;
    private showLoginAs: boolean = false;
    constructor(@Inject('user') private user: any, private router: Router, private loginService: LoginService) {}

    /**
     * Call the logout service
     */
    logout(): void {
        this.loginService.logOutUser().subscribe(data => {
            this.router.go('/public/login');
        }, (error) => {
            console.log(error);
        });

    }

    tooggleLoginAs(): boolean {
        this.dropdown.closeIt();
        this.showLoginAs = !this.showLoginAs;
        return false;
    }
}