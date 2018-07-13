import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CheckoutSummaryService {
    private cartTotalSource = new Subject<number>();
    private customerFullNameSource = new Subject<string>();

    cartTotal$ = this.cartTotalSource.asObservable();
    customerFullName$ = this.customerFullNameSource.asObservable();

    updateCartTotal(cartTotal: number) {
        this.cartTotalSource.next(cartTotal);
    }

    updateCustomerFullName(customerFullName: string) {
        this.customerFullNameSource.next(customerFullName);
    }
}