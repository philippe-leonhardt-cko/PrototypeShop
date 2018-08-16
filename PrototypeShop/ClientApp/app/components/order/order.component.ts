import { Component, Inject, OnInit, OnDestroy, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

@Component({
    selector: 'order',
    templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {
    private http: Http;
    private baseUrl: string;
    private paymentToken: string;


    constructor(http: Http, @Inject('BASE_URL') baseUrl: string, private componentFactoryResolver: ComponentFactoryResolver) {
        this.http = http;
        this.baseUrl = baseUrl;
    }

    ngOnInit() {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;
        this.http.post(this.baseUrl + 'api/Checkout/GetPaymentToken', '{"value": "300"}', requestOptions).subscribe(
            result => {
                this.paymentToken = result.text() as string;
                console.log(this.paymentToken);
            },
            error => console.error(error)
        )
    }
}
