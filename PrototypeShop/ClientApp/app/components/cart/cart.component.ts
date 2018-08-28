import { Component, Input, Inject, OnDestroy, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Cart } from '../cart/cart';
import { Subscription } from 'rxjs';


@Component({
    selector: 'cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public cart: Cart | undefined;
    @Input() isSummary: boolean = true;

    constructor(private http: Http, @Inject('BASE_URL') private baseUrl: string, private checkoutSummaryService: CheckoutSummaryService) { }

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        if (this.isSummary) {
            this.getPaymentToken();
        }
        
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private makeSubscriptions() {
        let cartSubscription: Subscription = this.checkoutSummaryService.cart$.subscribe(
            cart => {
                this.cart = cart;
            }
        )
        this.subscriptions.push(cartSubscription);
    }

    private getPaymentToken() {
        let cart = this.cart as Cart;
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;
        let payload = {
            "value": cart.total,
            "currency": cart.currency
        };
        this.http.post(this.baseUrl + 'api/Checkout/GetPaymentToken', payload, requestOptions)
            .subscribe(
                result => {
                    let paymentToken = result.text() as string;
                    console.log(paymentToken);
                    this.checkoutSummaryService.updatePaymentToken(paymentToken);
                },
                error => console.error(error)
        );
    }
}