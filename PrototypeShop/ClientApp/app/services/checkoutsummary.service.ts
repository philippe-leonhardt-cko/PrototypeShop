import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { Cart } from '../components/cart/cart';

@Injectable()
export class CheckoutSummaryService {
    // Subjects
    private cartSource = new ReplaySubject<Cart>();
    private paymentTokenSource = new ReplaySubject<string>();
    private customerPageUnlockedSource = new Subject<boolean>();
    private orderPageUnlockedSource = new Subject<boolean>();

    // Observables
    cart$ = this.cartSource.asObservable();
    paymentToken$ = this.paymentTokenSource.asObservable();
    customerPageUnlocked$ = this.customerPageUnlockedSource.asObservable();
    orderPageUnlocked$ = this.orderPageUnlockedSource.asObservable();

    // Methods
    setCart(cart: Cart) {
        this.cartSource.next(cart);
        console.log('New Cart created\n', cart);
    }
    updatePaymentToken(paymentToken: string) {
        this.paymentTokenSource.next(paymentToken);
    }
    updateCustomerPageUnlocked(isUnlocked: boolean) {
        this.customerPageUnlockedSource.next(isUnlocked);
    }
    updateOrderPageUnlocked(isUnlocked: boolean) {
        this.orderPageUnlockedSource.next(isUnlocked);
    }
}