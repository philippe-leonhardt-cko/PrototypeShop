import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { Cart } from '../components/cart/cart';
import { PaymentToken } from '../components/payment-token/PaymentToken';

@Injectable()
export class CheckoutSummaryService {
    // Subjects
    private cartSource = new ReplaySubject<Cart>();
    private paymentTokenSource = new ReplaySubject<PaymentToken>();
    private paymentTokenCountdownSource = new Subject<number>();
    private customerDetailsCompleteSource = new ReplaySubject<boolean>();

    // Observables
    public cart$ = this.cartSource.asObservable();
    public paymentToken$ = this.paymentTokenSource.asObservable();
    public paymentTokenCountdown$ = this.paymentTokenCountdownSource.asObservable();
    public customerDetailsComplete$ = this.customerDetailsCompleteSource.asObservable();

    // Methods
    public setCart(cart: Cart) {
        this.cartSource.next(cart);
    }
    public updatePaymentToken(paymentToken: PaymentToken) {
        this.paymentTokenSource.next(paymentToken);
    }
    public updatePaymentTokenCountdown(paymentTokenCountdown: number) {
        this.paymentTokenCountdownSource.next(paymentTokenCountdown);
    }
    public updateCustomerDetailsComplete(areComplete: boolean) {
        this.customerDetailsCompleteSource.next(areComplete);
    }
}