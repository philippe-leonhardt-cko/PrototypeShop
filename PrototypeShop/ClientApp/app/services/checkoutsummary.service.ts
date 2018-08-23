import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { Cart } from '../components/cart/cart';

@Injectable()
export class CheckoutSummaryService {
    // Subjects
    private cartSource = new ReplaySubject<Cart>();

    private cartCurrencySource = new Subject<string>();

    private customerEmailSource = new Subject<string>();

    private paymentTokenSource = new ReplaySubject<string>();

    // Observables
    cart$ = this.cartSource.asObservable();

    cartCurrency$ = this.cartCurrencySource.asObservable();

    customerEmail$ = this.customerEmailSource.asObservable();

    paymentToken$ = this.paymentTokenSource.asObservable();

    // Methods
    setCart(cart: Cart) {
        this.cartSource.next(cart);
        console.log('New Cart created\n', cart);
    }

    updateCartCurrency(cartCurrency: string) {
        this.cartCurrencySource.next(cartCurrency);
    }

    updateCustomerEmail(customerEmail: string) {
        this.customerEmailSource.next(customerEmail);
    }

    updatePaymentToken(paymentToken: string) {
        this.paymentTokenSource.next(paymentToken);
    }
}