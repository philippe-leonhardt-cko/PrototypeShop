import { Product } from '../product/product';
import { Customer } from '../customer/customer';
import { Http, RequestOptions, Headers } from '@angular/http';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { PaymentToken } from '../payment-token/PaymentToken';
import { Subscription } from 'rxjs';

export class Cart {
    public id: string;
    public products: Product[] = [];
    public customer: Customer;
    public currency: string = 'GBP';
    public total: number = 0;
    private paymentToken: PaymentToken | undefined = undefined;

    constructor(private http: Http, private baseUrl: string, private checkoutSummaryService: CheckoutSummaryService) {
        this.id = '12345';
        this.customer = new Customer(this.checkoutSummaryService);
        this.calculateCartTotal();
    }

    private calculateCartTotal() {
        let cartTotal: number;
        if (this.products.length < 1) {
            cartTotal = 0;
        } else {
            let prices = this.products.map(product => product.price);
            let quantities = this.products.map(product => product.quantity);
            let totals = prices.map((price, index) => price * quantities[index]);
            cartTotal = totals.reduce((a, b) => a + b);
        }
        this.total = cartTotal;
        if (this.total > 0) {
            this.generatePaymentToken();
        }
    }

    public addProduct(requestProduct: Product): Subscription {
        return this.http.get(this.baseUrl + 'api/SampleData/GetProduct/' + requestProduct.id)
            .take(1)
            .subscribe(
            (result: any) => {
                let newProduct = result.json() as Product;
                newProduct.quantity = requestProduct.quantity;
                this.products.push(newProduct);
                this.calculateCartTotal();
            },
            (error: any) => {
                console.error(error);
            }
        )
    }

    private discardProduct(product: Product) {
        if (window.confirm(`Do you really want to discard ${product.name} (${product.id}) from your cart?`)) {
            let index: number = this.products.indexOf(product, 0);
            if (index > -1) {
                this.products.splice(index, 1);
            }
            this.calculateCartTotal();
        };
    }

    public increaseProductQuantity(productToIncrease: Product, increaseBy?: number) {
        let matchedProduct = this.products.filter((product: Product) => product.id == productToIncrease.id).pop() as Product;
        if (increaseBy == undefined) {
            matchedProduct.quantity++;
        } else {
            matchedProduct.quantity += increaseBy;
        }
        this.calculateCartTotal();
    }

    public decreaseProductQuantity(product: Product) {
        if (product.quantity == 1) {
            this.discardProduct(product);
        } else {
            product.quantity--;
        }
        this.calculateCartTotal();
    }

    public generatePaymentToken() {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;
        let payload = {
            "value": this.total,
            "currency": this.currency
        };
        this.http.post(this.baseUrl + 'api/Checkout/GetPaymentToken', payload, requestOptions)
            .take(1)
            .subscribe(
                (result: any) => {
                    let paymentTokenId = result.text() as string;
                    console.info(`Payment Token ${paymentTokenId} created.`);
                    if (this.paymentToken != undefined) {
                        this.paymentToken.countdown.unsubscribe();
                    }
                    this.paymentToken = new PaymentToken(paymentTokenId, this.checkoutSummaryService, 15*60);
                    this.checkoutSummaryService.updatePaymentToken(this.paymentToken);
                },
                (error: any) => console.error(error)
            );
    }
}