﻿import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { PaymentToken } from '../payment-token/PaymentToken';
import { Customer } from '../customer/customer';
import { LogEntry } from '../log-entry/log-entry';
import { Cart } from '../cart/cart';
import { BaseAddress } from '../address/BaseAddress';

export class Order {
    private cardToken: PaymentToken | undefined;
    private paymentToken: any | undefined;

    public id: string;
    public cart: Cart = new Cart(this.http, this.baseUrl, this);
    public currency: string = 'GBP';
    public subTotal: number = 0;
    public shippingFee: number = 295;
    public grandTotal: number = 0;
    public billingAddress: BaseAddress = new BaseAddress();
    public shippingAddress: BaseAddress = this.billingAddress;
    public shippingToBillingAddress: boolean = true;

    constructor(private http: Http, private baseUrl: string, private checkoutSummaryService: CheckoutSummaryService, private customer: Customer) {
        this.calculateTotals();
    }

    public calculateTotals() {
        let subTotal: number;
        let grandTotal: number;
        if (this.cart.products.length < 1) {
            subTotal = 0;
            grandTotal = subTotal + this.shippingFee;
        } else {
            let prices = this.cart.products.map(product => product.pricing.gross);
            let quantities = this.cart.products.map(product => product.quantity);
            let totals = prices.map((price, index) => price * quantities[index]);
            subTotal = totals.reduce((a, b) => a + b);
            grandTotal = subTotal + this.shippingFee;
        }
        this.subTotal = subTotal;
        this.grandTotal = grandTotal;
    }

    public requestCardToken(): Promise<PaymentToken> {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;
        let payload = {
            "customer": {
                "email": this.customer.email,
                "name": this.customer.fullName
            },
            "cart": {
                "value": this.grandTotal,
                "currency": this.currency,
                "billingDetails": this.billingAddress,
                "shippingDetails": {
                    "address": this.shippingAddress
                }
            }
        };

        return new Promise(resolve => {
            this.http.post(this.baseUrl + 'api/Checkout/CardTokenRequest', payload, requestOptions)
                .take(1)
                .subscribe(
                    (result: Response) => {
                        let cardTokenId = <string>result.text();
                        new LogEntry(this.checkoutSummaryService!, `New API returned Card Token ${cardTokenId}`);
                        if (this.cardToken != undefined) {
                            this.cardToken.countdown.unsubscribe();
                        }
                        this.cardToken = new PaymentToken(cardTokenId, this.checkoutSummaryService, 15 * 60);
                        this.checkoutSummaryService.updatePaymentToken(this.cardToken);
                        resolve(this.cardToken);
                    },
                    (error: any) => console.error(error)
                );
        })
    }

    public chargeWithCardToken(cardToken: string): Promise<string> {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;
        let payload = { 
            "cardToken": cardToken,
            "customer": {
                "email": this.customer.email,
                "name": this.customer.fullName
            },
            "cart": {
                "value": this.grandTotal,
                "currency": this.currency,
                "billingDetails": this.billingAddress,
                "shippingDetails": {
                    "address": this.shippingAddress
                }
            }
        };
        
        return new Promise(resolve => {
            this.http.post(this.baseUrl + 'api/Checkout/ChargeWithCardToken', payload, requestOptions)
                .take(1)
                .subscribe(
                (result: Response) => {
                    let id: string = result.json().item1;
                    let paymentToken: string = result.json().item2;
                    this.id = id;
                    this.paymentToken = paymentToken;

                    localStorage.setItem(this.id, this.paymentToken);
                    new LogEntry(this.checkoutSummaryService, `Order saved with ID ${id}`);
                    //resolve(this.id);
                    resolve(this.paymentToken);
                },
                (error: any) => console.error(error)
            );
        })
    }

    public setBillingAddress(address: BaseAddress | null) {
        if (address) {
            this.billingAddress = address;
        } else {
            this.billingAddress = new BaseAddress();
        }
    }

    public setShippingAddress(address: BaseAddress | null) {
        if (address) {
            this.shippingAddress = address;
        } else {
            this.shippingAddress = new BaseAddress();
        }        
    }

    public setShippingToBillingAddress(isDesired: boolean) {
        this.checkoutSummaryService.updateShippingToBillingAddress(isDesired);
        if (isDesired) {
            this.shippingAddress = this.billingAddress;
            this.shippingToBillingAddress = true;
        } else {
            this.shippingAddress = new BaseAddress();
            this.shippingToBillingAddress = false;
        }
    }
}