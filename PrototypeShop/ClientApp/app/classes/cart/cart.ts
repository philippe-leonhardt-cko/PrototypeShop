import { Product } from '../product/product';
import { Http, RequestOptions, Headers } from '@angular/http';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { PaymentToken } from '../payment-token/PaymentToken';
import { Subscription } from 'rxjs';
import { Customer } from '../customer/customer';

export class Cart {
    public id: string;
    public products: Product[] = [];
    public currency: string = 'GBP';
    public subTotal: number = 0;
    public grandTotal: number = 0;
    public shipping: number = 295;
    private paymentToken: PaymentToken;

    constructor(private http: Http, private baseUrl: string, private checkoutSummaryService: CheckoutSummaryService, private customer: Customer) {
        this.id = '12345';
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
        if (this.subTotal > 0) {
            this.generatePaymentToken();
        }
    }

    public addProduct(requestProduct: Product): Subscription {
        return this.http.get(this.baseUrl + 'api/SampleData/GetProduct/' + requestProduct.id)
            .take(1)
            .subscribe(
            (result: any) => {
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
        let matchedProduct = this.products.filter((product: Product) => product.id == productToIncrease.id).pop() as Product;
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
        let matchedProduct = this.products.filter((product: Product) => product.id == productToUpdate.id).pop() as Product;
        if (quantity > 0 && matchedProduct.quantity != quantity) {
            matchedProduct.quantity = quantity;
            this.calculateTotals();
        }
    }

    public generatePaymentToken() {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;
        let payload = {
            "value": this.subTotal,
            "currency": this.currency
        };
        this.http.post(this.baseUrl + 'api/Checkout/GetPaymentToken', payload, requestOptions)
            .take(1)
            .subscribe(
                (result: any) => {
                    let paymentTokenId = result.text() as string;
                    if (this.paymentToken != undefined) {
                        this.paymentToken.countdown.unsubscribe();
                    }
                    this.paymentToken = new PaymentToken(paymentTokenId, this.checkoutSummaryService, 15*60);
                    this.checkoutSummaryService.updatePaymentToken(this.paymentToken);
                },
                (error: any) => console.error(error)
            );
    }

    public chargeWithCardToken(cardToken: string) {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;
        let payload = {
            "cardToken": cardToken,
            "customer": {
                "email": this.customer.email,
                "billingDetails": {
                    "addressLine1": `${this.customer.billingAddress.streetName} ${this.customer.billingAddress.houseNumber}`,
                    "addressLine2": `${this.customer.billingAddress.additionalAddressLine}`,
                    "postcode": this.customer.billingAddress.postcode,
                    "city": this.customer.billingAddress.city,
                    "state": this.customer.billingAddress.municipality,
                    "country": this.customer.billingAddress.country
                },
                "shippingDetails": {
                    "addressLine1": `${this.customer.shippingAddress.streetName} ${this.customer.shippingAddress.houseNumber}`,
                    "addressLine2": `${this.customer.shippingAddress.additionalAddressLine}`,
                    "postcode": this.customer.shippingAddress.postcode,
                    "city": this.customer.shippingAddress.city,
                    "state": this.customer.shippingAddress.municipality,
                    "country": this.customer.shippingAddress.country
                }
            },
            "cart": {
                "value": this.grandTotal,
                "currency": this.currency
            }
        };
        this.http.post(this.baseUrl + 'api/Checkout/ChargeWithCardToken', payload, requestOptions)
            .take(1)
            .subscribe(
                (result: any) => {
                    console.log(result.text() as string);
                },
                (error: any) => console.error(error.text() as string)
            );
    }
}