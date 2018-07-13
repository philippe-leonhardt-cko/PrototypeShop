import { Component } from '@angular/core';
import { Customer } from './customer';

@Component({
    selector: 'customer',
    templateUrl: './customer.component.html'
})
export class CustomerComponent {
    public customer: Customer = new Customer();
}
