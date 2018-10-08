import { Product } from '../product/product';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { PaymentToken } from '../payment-token/PaymentToken';
import { Subscription } from 'rxjs';
import { Customer } from '../customer/customer';
import { LogEntry } from '../log-entry/log-entry';

export class Cart {
    public id: string;
    public products: Product[] = [];
    public currency: string = 'GBP';
    public subTotal: number = 0;
    public grandTotal: number = 0;
    public shipping: number = 295;
    private cardToken: PaymentToken | undefined;
    private paymentToken: any | undefined;

    constructor(private http: Http, private baseUrl: string, private checkoutSummaryService: CheckoutSummaryService, private customer: Customer) {
        this.calculateTotals();
    }

    private calculateTotals() {
        let subTotal: number;
        let grandTotal: number;
        if (this.products.length < 1) {
            subTotal = 0;
            grandTotal = subTotal + this.shipping;
        } else {
            let prices = this.products.map(product => product.pricing.gross);
            let quantities = this.products.map(product => product.quantity);
            let totals = prices.map((price, index) => price * quantities[index]);
            subTotal = totals.reduce((a, b) => a + b);
            grandTotal = subTotal + this.shipping;
        }
        this.subTotal = subTotal;
        this.grandTotal = grandTotal;
    }

    public addProduct(requestProduct: Product): Subscription {
        return this.http.get(this.baseUrl + 'api/SampleData/GetProduct/' + requestProduct.id)
            .take(1)
            .subscribe(
                (result: Response) => {
                    let newProduct = <Product>result.json();
                    newProduct.quantity = requestProduct.quantity;
                    this.products.push(newProduct);
                    this.calculateTotals();
                },
                (error: any) => {
                    console.error(error);
                }
            )
    }

    private discardProduct(product: Product) {
        let index: number = this.products.indexOf(product, 0);
        if (index > -1) {
            this.products.splice(index, 1);
        }
        this.calculateTotals();
    }

    public increaseProductQuantity(productToIncrease: Product, increaseBy?: number) {
        let matchedProduct = <Product>this.products.filter((product: Product) => product.id == productToIncrease.id).pop();
        if (increaseBy == undefined) {
            matchedProduct.quantity++;
        } else {
            matchedProduct.quantity += increaseBy;
        }
        this.calculateTotals();
    }

    public decreaseProductQuantity(productToDecrease: Product) {
        if (productToDecrease.quantity == 1) {
            this.discardProduct(productToDecrease);
        } else {
            productToDecrease.quantity--;
        }
        this.calculateTotals();
    }

    public updateProductCount(productToUpdate: Product, quantity: string | number) {
        if (typeof quantity == 'string') {
            quantity = parseInt(quantity);
        }
        let matchedProduct = <Product>this.products.filter((product: Product) => product.id == productToUpdate.id).pop();
        if (quantity > 0 && matchedProduct.quantity != quantity) {
            matchedProduct.quantity = quantity;
            this.calculateTotals();
        }
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
                "billingDetails": {
                    "addressLine1": `${this.customer.billingAddress.streetName} ${this.customer.billingAddress.houseNumber}`,
                    "addressLine2": `${this.customer.billingAddress.additionalAddressLine}`,
                    "city": this.customer.billingAddress.city,
                    "state": this.customer.billingAddress.municipality,
                    "zip": this.customer.billingAddress.postcode,
                    "country": this.customer.billingAddress.country
                },
                "shippingDetails": {
                    "address": {
                        "addressLine1": `${this.customer.shippingAddress.streetName} ${this.customer.shippingAddress.houseNumber}`,
                        "addressLine2": `${this.customer.shippingAddress.additionalAddressLine}`,
                        "city": this.customer.shippingAddress.city,
                        "state": this.customer.shippingAddress.municipality,
                        "zip": this.customer.shippingAddress.postcode,
                        "country": this.customer.shippingAddress.country
                    }
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
                "billingDetails": {
                    "addressLine1": `${this.customer.billingAddress.streetName} ${this.customer.billingAddress.houseNumber}`,
                    "addressLine2": `${this.customer.billingAddress.additionalAddressLine}`,
                    "city": this.customer.billingAddress.city,
                    "state": this.customer.billingAddress.municipality,
                    "zip": this.customer.billingAddress.postcode,
                    "country": this.customer.billingAddress.country
                },
                "shippingDetails": {
                    "address": {
                        "addressLine1": `${this.customer.shippingAddress.streetName} ${this.customer.shippingAddress.houseNumber}`,
                        "addressLine2": `${this.customer.shippingAddress.additionalAddressLine}`,
                        "city": this.customer.shippingAddress.city,
                        "state": this.customer.shippingAddress.municipality,
                        "zip": this.customer.shippingAddress.postcode,
                        "country": this.customer.shippingAddress.country
                    }
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
                    new LogEntry(this.checkoutSummaryService, `Cart saved with ID ${id}`);
                    resolve(this.id);
                    },
                    (error: any) => console.error(error)
                );
        })
    }
}