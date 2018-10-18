import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, RequestOptions, Headers, Response } from '@angular/http';

@Component({
    selector: 'order',
    templateUrl: './order.component.html'
})
export class OrderComponent {
    private payment: Payment;
    private orderIdExists: boolean = true;
    private orderId: string;

    private paymentStatuses: { [statusCode: number]: string } = {
        0: 'Authorized',
        1: 'Unknown',
        2: 'Captured',
        3: 'Unknown',
        4: 'Unknown',
        5: 'Unknown',
        6: 'Unknown',
        7: 'Unknown',
        8: 'Unknown',
        9: 'Unknown'
    };

    constructor(private activatedRoute: ActivatedRoute, private http: Http, @Inject('BASE_URL') private baseUrl: string) {
        this.activatedRoute.params.subscribe(
            (params: any) => {
                /*let paymentToken = localStorage.getItem(params['id']);
                if (paymentToken) {
                    this.getPaymentDetails(paymentToken);
                } else {
                    this.orderIdExists = false;
                    console.log(this.orderId, this.orderIdExists)
                }*/
                this.getPaymentDetails(params['id']);
            }
        );
    }

    private getVerbosePaymentStatus(statusCode: number): string {
        return this.paymentStatuses[statusCode];
    }

    private paymentIsSuccessful(): boolean {
        if (['Authorized', 'Captured'].indexOf(<string>this.payment.status) > -1) {
            return true;
        } else {
            return false;
        }
    }

    private async getPaymentDetails(paymentToken: string): Promise<any> {
        let headers: Headers = new Headers({ 'Content-Type': 'application/json' });
        let requestOptions: RequestOptions = new RequestOptions();
        requestOptions.headers = headers;

        return new Promise(resolve => {
            this.http.get(`${this.baseUrl}api/Checkout/GetPaymentDetails/${paymentToken}`, requestOptions)
                .take(1)
                .subscribe(
                (response: Response) => {
                    this.payment = <Payment>response.json();
                    this.payment.status = this.getVerbosePaymentStatus(<number>this.payment.status);
                    console.log(this.payment);
                },
                (error: any) => console.error(error))
        })
    }
}

class Payment {
    amount: number;
    currency: string;
    requestedOn: string;
    status: number | string;
    source: Source;
}

class Source {
    billingAddress: GetBillingAddress;
    scheme: string;
    last4: string;
}

class GetBillingAddress {
    addressLine1: string;
    addressLine2: string;
    city: string;
    country: string;
    state: string;
    zip: string;
}
