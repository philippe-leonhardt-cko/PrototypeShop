import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { CheckoutSummaryService } from '../../services/checkoutsummary.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Product } from '../../classes/product/product';
import { Subscription } from 'rxjs';
import { Customer } from '../../classes/customer/customer';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'product',
    templateUrl: './product.component.html'
})

export class ProductComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    private product: Product;
    private customer: Customer;

    constructor(private checkoutSummaryService: CheckoutSummaryService, private http: Http, @Inject('BASE_URL') private baseUrl: string, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(
            (params: any) => {
                let productId = params['id'];
                console.log(productId);
                this.getProduct(productId);
            }
        );
    }

    ngOnInit() {
        this.makeSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private makeSubscriptions() {
        let customerSubscription: Subscription = this.checkoutSummaryService.customer$.subscribe(
            (customer: Customer) => {
                this.customer = customer;
            });
        this.subscriptions.push(customerSubscription);
    }

    private async getProduct(productId: string): Promise<any> {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return new Promise(resolve => {
            this.http.get(`${this.baseUrl}api/SampleData/GetProduct/${productId}`, requestOptions)
                .take(1)
                .subscribe(
                    (response: any) => {
                        this.product = <Product>response.json();
                        console.log(this.product);
                    },
                    (error: any) => console.error(error))
        })
    }
}