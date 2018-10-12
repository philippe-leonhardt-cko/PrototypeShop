import { Component, Input } from '@angular/core';
import { Customer } from '../../classes/customer/customer';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html'
})
export class NavMenuComponent {
    @Input() customer: Customer;
    @Input() customerDetailsComplete: boolean;
}
